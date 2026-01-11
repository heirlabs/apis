import Webhook from '../models/Webhook.js';
import { createLogger } from '../utils/logger.js';
import crypto from 'crypto';

const logger = createLogger('WebhookDispatcher');

/**
 * Webhook Dispatcher Service
 * Handles async event delivery to webhook endpoints with retry logic
 */
class WebhookDispatcher {
  constructor() {
    this.retryQueue = new Map(); // In-memory queue for retries
    this.processing = false;
    
    // Start retry processor
    this.startRetryProcessor();
  }
  
  /**
   * Dispatch an event to all subscribed webhooks
   */
  async dispatch(event, payload, options = {}) {
    const { 
      userId = null,
      apiKeyId = null,
      immediate = false 
    } = options;
    
    try {
      // Find all webhooks subscribed to this event
      const webhooks = await Webhook.findSubscribers(event, payload);
      
      if (webhooks.length === 0) {
        logger.debug('No webhooks subscribed to event', { event });
        return { delivered: 0, queued: 0 };
      }
      
      logger.info('Dispatching webhook event', { 
        event, 
        subscribers: webhooks.length 
      });
      
      // Build event payload
      const eventPayload = this.buildEventPayload(event, payload);
      
      // Deliver to each webhook
      const results = await Promise.allSettled(
        webhooks.map(webhook => this.deliverToWebhook(webhook, eventPayload, immediate))
      );
      
      // Count results
      const delivered = results.filter(r => r.status === 'fulfilled' && r.value.success).length;
      const queued = results.filter(r => r.status === 'fulfilled' && r.value.queued).length;
      const failed = results.filter(r => r.status === 'rejected' || (r.status === 'fulfilled' && !r.value.success && !r.value.queued)).length;
      
      logger.info('Webhook dispatch complete', { 
        event, 
        delivered, 
        queued, 
        failed 
      });
      
      return { delivered, queued, failed };
    } catch (error) {
      logger.error('Webhook dispatch error', { event, error: error.message });
      throw error;
    }
  }
  
  /**
   * Build standardized event payload
   */
  buildEventPayload(event, data) {
    return {
      id: `evt_${crypto.randomBytes(16).toString('hex')}`,
      type: event,
      created: Math.floor(Date.now() / 1000),
      data,
      apiVersion: 'v1'
    };
  }
  
  /**
   * Deliver payload to a single webhook
   */
  async deliverToWebhook(webhook, payload, immediate = false) {
    const timestamp = Math.floor(Date.now() / 1000);
    const signature = webhook.signPayload(payload, timestamp);
    
    try {
      const response = await this.sendRequest(webhook, payload, signature, timestamp);
      
      if (response.ok) {
        await webhook.recordDelivery(true);
        logger.debug('Webhook delivered successfully', { 
          webhookId: webhook._id,
          event: payload.type 
        });
        return { success: true, statusCode: response.status };
      } else {
        const errorBody = await response.text().catch(() => 'Unknown error');
        throw new Error(`HTTP ${response.status}: ${errorBody}`);
      }
    } catch (error) {
      logger.warn('Webhook delivery failed', { 
        webhookId: webhook._id,
        event: payload.type,
        error: error.message 
      });
      
      // Queue for retry if not immediate
      if (!immediate && webhook.config.maxRetries > 0) {
        this.queueRetry(webhook, payload, 1);
        return { success: false, queued: true };
      }
      
      await webhook.recordDelivery(false, error.message);
      return { success: false, queued: false, error: error.message };
    }
  }
  
  /**
   * Send HTTP request to webhook URL
   */
  async sendRequest(webhook, payload, signature, timestamp) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), webhook.config.timeoutMs || 30000);
    
    try {
      const headers = {
        'Content-Type': webhook.config.contentType || 'application/json',
        'User-Agent': 'HEIR-Webhooks/1.0',
        'X-Webhook-Signature': signature,
        'X-Webhook-Timestamp': timestamp.toString(),
        'X-Webhook-Event': payload.type,
        'X-Webhook-Delivery': payload.id
      };
      
      // Add custom headers
      if (webhook.config.headers) {
        for (const [key, value] of webhook.config.headers) {
          headers[key] = value;
        }
      }
      
      let body;
      if (webhook.config.contentType === 'application/x-www-form-urlencoded') {
        body = new URLSearchParams({ payload: JSON.stringify(payload) }).toString();
      } else {
        body = JSON.stringify(payload);
      }
      
      const response = await fetch(webhook.url, {
        method: 'POST',
        headers,
        body,
        signal: controller.signal
      });
      
      return response;
    } finally {
      clearTimeout(timeout);
    }
  }
  
  /**
   * Queue a webhook for retry
   */
  queueRetry(webhook, payload, attemptNumber) {
    const retryKey = `${webhook._id}:${payload.id}`;
    const delay = webhook.getRetryDelay(attemptNumber);
    const retryAt = Date.now() + delay;
    
    this.retryQueue.set(retryKey, {
      webhook,
      payload,
      attemptNumber,
      retryAt
    });
    
    logger.debug('Webhook queued for retry', { 
      webhookId: webhook._id,
      event: payload.type,
      attempt: attemptNumber,
      retryIn: delay 
    });
  }
  
  /**
   * Start the retry processor (runs every 5 seconds)
   */
  startRetryProcessor() {
    setInterval(() => this.processRetryQueue(), 5000);
  }
  
  /**
   * Process the retry queue
   */
  async processRetryQueue() {
    if (this.processing) return;
    this.processing = true;
    
    try {
      const now = Date.now();
      const toProcess = [];
      
      // Find items ready for retry
      for (const [key, item] of this.retryQueue) {
        if (item.retryAt <= now) {
          toProcess.push({ key, ...item });
        }
      }
      
      // Process each retry
      for (const item of toProcess) {
        this.retryQueue.delete(item.key);
        
        // Refresh webhook from DB
        const webhook = await Webhook.findById(item.webhook._id);
        if (!webhook || webhook.status !== 'active') {
          logger.debug('Skipping retry - webhook inactive', { 
            webhookId: item.webhook._id 
          });
          continue;
        }
        
        // Attempt delivery
        const timestamp = Math.floor(Date.now() / 1000);
        const signature = webhook.signPayload(item.payload, timestamp);
        
        try {
          const response = await this.sendRequest(webhook, item.payload, signature, timestamp);
          
          if (response.ok) {
            await webhook.recordDelivery(true);
            logger.info('Webhook retry succeeded', { 
              webhookId: webhook._id,
              attempt: item.attemptNumber 
            });
          } else {
            throw new Error(`HTTP ${response.status}`);
          }
        } catch (error) {
          logger.warn('Webhook retry failed', { 
            webhookId: webhook._id,
            attempt: item.attemptNumber,
            error: error.message 
          });
          
          // Queue for another retry if not exhausted
          if (item.attemptNumber < webhook.config.maxRetries) {
            this.queueRetry(webhook, item.payload, item.attemptNumber + 1);
          } else {
            await webhook.recordDelivery(false, `Max retries exceeded: ${error.message}`);
            logger.warn('Webhook max retries exceeded', { 
              webhookId: webhook._id 
            });
          }
        }
      }
    } catch (error) {
      logger.error('Retry queue processing error', { error: error.message });
    } finally {
      this.processing = false;
    }
  }
  
  /**
   * Emit helper - convenience method for common events
   */
  async emit(event, data, options = {}) {
    return this.dispatch(event, data, options);
  }
  
  /**
   * Contract events
   */
  async contractGenerated(contractData, options = {}) {
    return this.emit('contract.generated', {
      contractAddress: contractData.address,
      network: contractData.network,
      type: contractData.type,
      timestamp: new Date().toISOString()
    }, options);
  }
  
  async contractDeployed(contractData, options = {}) {
    return this.emit('contract.deployed', {
      contractAddress: contractData.address,
      transactionHash: contractData.txHash,
      network: contractData.network,
      blockNumber: contractData.blockNumber,
      deployer: contractData.deployer,
      timestamp: new Date().toISOString()
    }, options);
  }
  
  /**
   * Vault events
   */
  async vaultUpdated(vaultData, options = {}) {
    return this.emit('vault.updated', {
      vaultId: vaultData.id,
      userId: vaultData.userId,
      action: vaultData.action,
      timestamp: new Date().toISOString()
    }, options);
  }
  
  /**
   * Verification events
   */
  async verificationComplete(verificationData, options = {}) {
    return this.emit('verification.complete', {
      userId: verificationData.userId,
      method: verificationData.method,
      status: 'verified',
      timestamp: new Date().toISOString()
    }, options);
  }
  
  /**
   * Payment events
   */
  async paymentCompleted(paymentData, options = {}) {
    return this.emit('payment.completed', {
      paymentId: paymentData.id,
      userId: paymentData.userId,
      amount: paymentData.amount,
      currency: paymentData.currency,
      status: 'completed',
      timestamp: new Date().toISOString()
    }, options);
  }
  
  /**
   * Dead man's switch events
   */
  async deadmanWarning(switchData, options = {}) {
    return this.emit('deadman.warning', {
      userId: switchData.userId,
      contractAddress: switchData.contractAddress,
      daysRemaining: switchData.daysRemaining,
      timestamp: new Date().toISOString()
    }, options);
  }
  
  async deadmanTriggered(switchData, options = {}) {
    return this.emit('deadman.triggered', {
      userId: switchData.userId,
      contractAddress: switchData.contractAddress,
      beneficiaries: switchData.beneficiaries,
      timestamp: new Date().toISOString()
    }, options);
  }
}

// Singleton instance
const webhookDispatcher = new WebhookDispatcher();

export default webhookDispatcher;
export { WebhookDispatcher };

