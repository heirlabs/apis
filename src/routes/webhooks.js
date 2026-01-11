/**
 * Webhook Handlers
 * Handles webhooks from external services (OpenSign, Stripe, etc.)
 * AND webhook subscription management for the headless API
 */
import express from 'express';
import { createLogger } from '../utils/logger.js';
import LegalDocument from '../models/LegalDocument.js';
import opensignService from '../services/opensignService.js';
import whatsappService from '../utils/whatsappService.js';
import telegramService from '../utils/telegramService.js';
import Webhook from '../models/Webhook.js';
import { verifyAuth } from '../middleware/auth.js';
import { apiKeyAuth, requireTier } from '../middleware/apiKeyAuth.js';

const router = express.Router();
const logger = createLogger('Webhooks');

/**
 * POST /api/webhooks/opensign
 * Handle OpenSign signature events
 */
router.post('/opensign', express.raw({ type: 'application/json' }), async (req, res) => {
  const signature = req.headers['x-opensign-signature'];
  const rawBody = req.body.toString();
  
  try {
    // Verify webhook signature if configured
    if (process.env.OPENSIGN_WEBHOOK_SECRET) {
      const isValid = opensignService.verifyWebhookSignature(rawBody, signature);
      if (!isValid) {
        // Throttle - could be triggered by attackers
        logger.warnThrottled('Invalid webhook signature');
        return res.status(401).json({ error: 'Invalid signature' });
      }
    }
    
    const event = JSON.parse(rawBody);
    
    logger.info('OpenSign webhook received', { 
      event: event.event,
      documentId: event.documentId 
    });

    switch (event.event) {
      case 'document.signed':
        await handleDocumentSigned(event);
        break;
        
      case 'document.completed':
        await handleDocumentCompleted(event);
        break;
        
      case 'document.declined':
        await handleDocumentDeclined(event);
        break;
        
      case 'document.viewed':
        logger.info('Document viewed', { documentId: event.documentId });
        break;
        
      case 'signer.signed':
        await handleSignerSigned(event);
        break;
        
      default:
        logger.info('Unhandled webhook event', { event: event.event });
    }

    res.json({ received: true });
  } catch (error) {
    logger.error('Webhook processing error', { error: error.message });
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

/**
 * Handle individual signer completion
 */
async function handleSignerSigned(event) {
  const { documentId, signer } = event;
  
  try {
    // Find document by OpenSign ID
    const document = await LegalDocument.findOne({ opensignDocumentId: documentId });
    
    if (!document) {
      logger.warn('Document not found for webhook', { documentId });
      return;
    }
    
    // Update signer status
    const signerIndex = document.signers.findIndex(s => s.email === signer.email);
    
    if (signerIndex >= 0) {
      document.signers[signerIndex].status = 'signed';
      document.signers[signerIndex].signedAt = new Date(signer.signedAt || Date.now());
      await document.save();
      
      logger.info('Signer status updated', { 
        documentId: document._id,
        signerEmail: signer.email
      });
    }
  } catch (error) {
    logger.error('Failed to handle signer signed event', { error: error.message });
  }
}

/**
 * Handle document signed by all parties
 */
async function handleDocumentSigned(event) {
  await handleDocumentCompleted(event);
}

/**
 * Handle document completion
 */
async function handleDocumentCompleted(event) {
  const { documentId, signedDocumentUrl } = event;
  
  try {
    // Find document by OpenSign ID
    const document = await LegalDocument.findOne({ opensignDocumentId: documentId });
    
    if (!document) {
      logger.warn('Document not found for completion webhook', { documentId });
      return;
    }
    
    // Download signed PDF
    let signedPdfUrl = signedDocumentUrl;
    
    // If we need to store it ourselves (e.g., in IPFS)
    if (process.env.STORE_SIGNED_DOCS === 'true') {
      try {
        const pdfBuffer = await opensignService.downloadSignedDocument(documentId);
        // TODO: Upload to IPFS and get URL
        // signedPdfUrl = await uploadToIPFS(pdfBuffer);
      } catch (downloadError) {
        logger.error('Failed to download signed document', { error: downloadError.message });
      }
    }
    
    // Update document status
    document.status = 'signed';
    document.signedAt = new Date();
    document.signedPdfUrl = signedPdfUrl;
    
    // Mark all signers as signed
    document.signers.forEach(signer => {
      if (signer.status !== 'rejected') {
        signer.status = 'signed';
        signer.signedAt = signer.signedAt || new Date();
      }
    });
    
    await document.save();
    
    logger.info('Document marked as signed', { 
      documentId: document._id,
      opensignId: documentId
    });
    
    // TODO: Send notification to user
    // await notifyUserDocumentSigned(document);
    
  } catch (error) {
    logger.error('Failed to handle document completed event', { error: error.message });
  }
}

/**
 * Handle document declined/rejected
 */
async function handleDocumentDeclined(event) {
  const { documentId, signer, reason } = event;
  
  try {
    const document = await LegalDocument.findOne({ opensignDocumentId: documentId });
    
    if (!document) {
      logger.warn('Document not found for decline webhook', { documentId });
      return;
    }
    
    // Update signer status
    if (signer) {
      const signerIndex = document.signers.findIndex(s => s.email === signer.email);
      
      if (signerIndex >= 0) {
        document.signers[signerIndex].status = 'rejected';
        document.signers[signerIndex].rejectReason = reason;
      }
    }
    
    // Check if all signers have responded
    const allResponded = document.signers.every(s => 
      s.status === 'signed' || s.status === 'rejected'
    );
    
    if (allResponded) {
      const anyRejected = document.signers.some(s => s.status === 'rejected');
      // Keep as pending if some rejected but document not voided
      if (anyRejected) {
        logger.info('Document has rejections', { documentId: document._id });
      }
    }
    
    await document.save();
    
    logger.info('Document decline recorded', { 
      documentId: document._id,
      signerEmail: signer?.email,
      reason
    });
    
  } catch (error) {
    logger.error('Failed to handle document declined event', { error: error.message });
  }
}

/**
 * GET /api/webhooks/whatsapp
 * WhatsApp webhook verification
 */
router.get('/whatsapp', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  // Check if verification token matches
  // SECURITY: In production, require the token to be set explicitly
  const verifyToken = process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN;
  if (!verifyToken && process.env.NODE_ENV === 'production') {
    logger.error('WHATSAPP_WEBHOOK_VERIFY_TOKEN not set in production');
    return res.sendStatus(503);
  }
  const expectedToken = verifyToken || 'heir-protocol-verify-dev';
  
  if (mode === 'subscribe' && token === expectedToken) {
    logger.info('WhatsApp webhook verified');
    res.status(200).send(challenge);
  } else {
    // Throttle - could be triggered by bots/scanners
    logger.warnThrottled('WhatsApp webhook verification failed', { mode, token });
    res.sendStatus(403);
  }
});

/**
 * POST /api/webhooks/whatsapp
 * WhatsApp webhook handler
 */
router.post('/whatsapp', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    // Verify signature
    const signature = req.headers['x-hub-signature-256'];
    const rawBody = req.body.toString();
    
    if (process.env.WHATSAPP_ACCESS_TOKEN && !whatsappService.verifyWebhookSignature(signature, rawBody)) {
      // Throttle - could be triggered by attackers
      logger.warnThrottled('Invalid WhatsApp webhook signature');
      return res.sendStatus(401);
    }

    // Parse and process webhook
    const body = JSON.parse(rawBody);
    await whatsappService.handleWebhook(body);
    
    // Always respond quickly to WhatsApp
    res.sendStatus(200);
  } catch (error) {
    logger.error('WhatsApp webhook error', { error: error.message });
    res.sendStatus(500);
  }
});

/**
 * POST /api/webhooks/telegram
 * Telegram webhook handler
 */
router.post('/telegram', async (req, res) => {
  try {
    const update = req.body;
    const secretToken = req.headers['x-telegram-bot-api-secret-token'];
    
    // Verify webhook secret if configured
    if (telegramService && telegramService.verifyWebhookSignature) {
      const isValid = telegramService.verifyWebhookSignature(secretToken);
      if (!isValid && process.env.TELEGRAM_WEBHOOK_SECRET) {
        // Throttle - could be triggered by bots
        logger.warnThrottled('Invalid Telegram webhook secret token');
        return res.sendStatus(401);
      }
    }
    
    // Process telegram update
    if (telegramService && telegramService.handleWebhook) {
      await telegramService.handleWebhook(update);
    }
    
    res.sendStatus(200);
  } catch (error) {
    logger.error('Telegram webhook error', { error: error.message });
    res.sendStatus(500);
  }
});

/**
 * POST /api/webhooks/stripe
 * Stripe webhook handler (placeholder - likely handled in stripe-webhooks.js)
 */
router.post('/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
  // Stripe webhooks are handled in routes/stripe-webhooks.js
  res.status(200).json({ message: 'Use /api/stripe-webhooks instead' });
});

// ============================================
// Webhook Subscription Management (API)
// ============================================

/**
 * @openapi
 * /webhooks/subscriptions:
 *   get:
 *     summary: List webhook subscriptions
 *     description: Returns all webhook subscriptions for the authenticated user
 *     tags: [Webhooks]
 *     security:
 *       - apiKey: []
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of webhook subscriptions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Webhook'
 */
router.get('/subscriptions', verifyAuth, async (req, res) => {
  try {
    const webhooks = await Webhook.find({ 
      owner: req.user._id,
      status: { $ne: 'disabled' }
    }).select('-secret').sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: webhooks
    });
  } catch (error) {
    logger.error('Error listing webhooks', { error: error.message });
    res.status(500).json({
      success: false,
      error: { code: 'LIST_ERROR', message: 'Failed to list webhooks' }
    });
  }
});

/**
 * @openapi
 * /webhooks/subscriptions:
 *   post:
 *     summary: Create a webhook subscription
 *     description: Subscribe to events with a webhook endpoint (Partner and Internal tiers only)
 *     tags: [Webhooks]
 *     security:
 *       - apiKey: []
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [url, events]
 *             properties:
 *               url:
 *                 type: string
 *                 format: uri
 *                 description: HTTPS endpoint to receive webhook events
 *               name:
 *                 type: string
 *               events:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["contract.deployed", "vault.updated"]
 *               config:
 *                 type: object
 *                 properties:
 *                   maxRetries:
 *                     type: integer
 *                     default: 5
 *                   filters:
 *                     type: object
 *     responses:
 *       201:
 *         description: Webhook created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Webhook'
 *                 meta:
 *                   type: object
 *                   properties:
 *                     secret:
 *                       type: string
 *                       description: Webhook signing secret (only shown once)
 *       403:
 *         description: Webhooks require Partner or Internal tier
 */
router.post('/subscriptions', verifyAuth, async (req, res) => {
  try {
    // Check if user has webhook access (partner or internal tier via API key, or premium subscription)
    const hasAccess = req.apiKey?.tier !== 'public' || 
                      ['premium', 'professional', 'enterprise'].includes(req.user.subscription?.plan);
    
    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'TIER_REQUIRED',
          message: 'Webhook subscriptions require Partner tier API key or Premium subscription.'
        }
      });
    }
    
    const { url, name, events, config = {} } = req.body;
    
    // Validate URL
    if (!url) {
      return res.status(400).json({
        success: false,
        error: { code: 'URL_REQUIRED', message: 'Webhook URL is required' }
      });
    }
    
    // Validate events
    if (!events || !Array.isArray(events) || events.length === 0) {
      return res.status(400).json({
        success: false,
        error: { code: 'EVENTS_REQUIRED', message: 'At least one event subscription is required' }
      });
    }
    
    // Check webhook limit
    const existingCount = await Webhook.countDocuments({ 
      owner: req.user._id, 
      status: { $ne: 'disabled' } 
    });
    
    const maxWebhooks = req.apiKey?.tier === 'internal' ? 50 : 10;
    if (existingCount >= maxWebhooks) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'LIMIT_REACHED',
          message: `Maximum ${maxWebhooks} webhooks allowed. Delete unused webhooks first.`
        }
      });
    }
    
    // Create webhook
    const webhook = new Webhook({
      owner: req.user._id,
      apiKey: req.apiKey?._id,
      url,
      name: name || 'Webhook Subscription',
      events,
      config: {
        maxRetries: config.maxRetries || 5,
        retryDelayMs: config.retryDelayMs || 1000,
        retryBackoff: config.retryBackoff || 'exponential',
        timeoutMs: config.timeoutMs || 30000,
        filters: config.filters || {}
      }
    });
    
    await webhook.save();
    
    logger.info('Webhook subscription created', { 
      webhookId: webhook._id,
      events: webhook.events 
    });
    
    res.status(201).json({
      success: true,
      data: {
        id: webhook._id,
        url: webhook.url,
        name: webhook.name,
        events: webhook.events,
        status: webhook.status,
        createdAt: webhook.createdAt
      },
      meta: {
        secret: webhook.secret,
        warning: 'Save this secret securely. It will not be shown again.'
      }
    });
  } catch (error) {
    logger.error('Error creating webhook', { error: error.message });
    res.status(500).json({
      success: false,
      error: { code: 'CREATE_ERROR', message: 'Failed to create webhook' }
    });
  }
});

/**
 * @openapi
 * /webhooks/subscriptions/{id}:
 *   get:
 *     summary: Get webhook subscription details
 *     tags: [Webhooks]
 *     security:
 *       - apiKey: []
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Webhook details
 */
router.get('/subscriptions/:id', verifyAuth, async (req, res) => {
  try {
    const webhook = await Webhook.findOne({ 
      _id: req.params.id, 
      owner: req.user._id 
    }).select('-secret');
    
    if (!webhook) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Webhook not found' }
      });
    }
    
    res.json({
      success: true,
      data: webhook
    });
  } catch (error) {
    logger.error('Error fetching webhook', { error: error.message });
    res.status(500).json({
      success: false,
      error: { code: 'FETCH_ERROR', message: 'Failed to fetch webhook' }
    });
  }
});

/**
 * @openapi
 * /webhooks/subscriptions/{id}:
 *   patch:
 *     summary: Update a webhook subscription
 *     tags: [Webhooks]
 *     security:
 *       - apiKey: []
 *       - bearerAuth: []
 */
router.patch('/subscriptions/:id', verifyAuth, async (req, res) => {
  try {
    const webhook = await Webhook.findOne({ 
      _id: req.params.id, 
      owner: req.user._id 
    });
    
    if (!webhook) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Webhook not found' }
      });
    }
    
    const { url, name, events, config, status } = req.body;
    
    if (url) webhook.url = url;
    if (name) webhook.name = name;
    if (events) webhook.events = events;
    if (config) {
      webhook.config = { ...webhook.config.toObject(), ...config };
    }
    if (status && ['active', 'paused'].includes(status)) {
      webhook.status = status;
    }
    
    await webhook.save();
    
    logger.info('Webhook updated', { webhookId: webhook._id });
    
    res.json({
      success: true,
      data: {
        id: webhook._id,
        url: webhook.url,
        name: webhook.name,
        events: webhook.events,
        status: webhook.status,
        updatedAt: webhook.updatedAt
      }
    });
  } catch (error) {
    logger.error('Error updating webhook', { error: error.message });
    res.status(500).json({
      success: false,
      error: { code: 'UPDATE_ERROR', message: 'Failed to update webhook' }
    });
  }
});

/**
 * @openapi
 * /webhooks/subscriptions/{id}:
 *   delete:
 *     summary: Delete a webhook subscription
 *     tags: [Webhooks]
 *     security:
 *       - apiKey: []
 *       - bearerAuth: []
 */
router.delete('/subscriptions/:id', verifyAuth, async (req, res) => {
  try {
    const webhook = await Webhook.findOne({ 
      _id: req.params.id, 
      owner: req.user._id 
    });
    
    if (!webhook) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Webhook not found' }
      });
    }
    
    webhook.status = 'disabled';
    await webhook.save();
    
    logger.info('Webhook deleted', { webhookId: webhook._id });
    
    res.json({
      success: true,
      data: {
        id: webhook._id,
        status: 'disabled',
        deletedAt: new Date()
      }
    });
  } catch (error) {
    logger.error('Error deleting webhook', { error: error.message });
    res.status(500).json({
      success: false,
      error: { code: 'DELETE_ERROR', message: 'Failed to delete webhook' }
    });
  }
});

/**
 * @openapi
 * /webhooks/subscriptions/{id}/regenerate-secret:
 *   post:
 *     summary: Regenerate webhook signing secret
 *     tags: [Webhooks]
 *     security:
 *       - apiKey: []
 *       - bearerAuth: []
 */
router.post('/subscriptions/:id/regenerate-secret', verifyAuth, async (req, res) => {
  try {
    const webhook = await Webhook.findOne({ 
      _id: req.params.id, 
      owner: req.user._id,
      status: 'active'
    });
    
    if (!webhook) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Webhook not found' }
      });
    }
    
    webhook.secret = Webhook.generateSecret();
    await webhook.save();
    
    logger.info('Webhook secret regenerated', { webhookId: webhook._id });
    
    res.json({
      success: true,
      data: {
        secret: webhook.secret
      },
      meta: {
        warning: 'Update your webhook handler with the new secret immediately.'
      }
    });
  } catch (error) {
    logger.error('Error regenerating webhook secret', { error: error.message });
    res.status(500).json({
      success: false,
      error: { code: 'REGENERATE_ERROR', message: 'Failed to regenerate secret' }
    });
  }
});

/**
 * @openapi
 * /webhooks/subscriptions/{id}/test:
 *   post:
 *     summary: Send a test event to a webhook
 *     tags: [Webhooks]
 *     security:
 *       - apiKey: []
 *       - bearerAuth: []
 */
router.post('/subscriptions/:id/test', verifyAuth, async (req, res) => {
  try {
    const webhook = await Webhook.findOne({ 
      _id: req.params.id, 
      owner: req.user._id,
      status: 'active'
    });
    
    if (!webhook) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Webhook not found' }
      });
    }
    
    // Send test event
    const testPayload = {
      id: 'evt_test_' + Date.now(),
      type: 'test.webhook',
      created: Math.floor(Date.now() / 1000),
      data: {
        message: 'This is a test webhook event',
        timestamp: new Date().toISOString()
      },
      apiVersion: 'v1'
    };
    
    const timestamp = Math.floor(Date.now() / 1000);
    const signature = webhook.signPayload(testPayload, timestamp);
    
    try {
      const response = await fetch(webhook.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'HEIR-Webhooks/1.0',
          'X-Webhook-Signature': signature,
          'X-Webhook-Timestamp': timestamp.toString(),
          'X-Webhook-Event': 'test.webhook',
          'X-Webhook-Delivery': testPayload.id
        },
        body: JSON.stringify(testPayload),
        signal: AbortSignal.timeout(10000)
      });
      
      const success = response.ok;
      
      res.json({
        success: true,
        data: {
          delivered: success,
          statusCode: response.status,
          payload: testPayload
        }
      });
    } catch (fetchError) {
      res.json({
        success: true,
        data: {
          delivered: false,
          error: fetchError.message,
          payload: testPayload
        }
      });
    }
  } catch (error) {
    logger.error('Error testing webhook', { error: error.message });
    res.status(500).json({
      success: false,
      error: { code: 'TEST_ERROR', message: 'Failed to test webhook' }
    });
  }
});

/**
 * @openapi
 * /webhooks/events:
 *   get:
 *     summary: List available webhook events
 *     description: Returns all events that can be subscribed to
 *     tags: [Webhooks]
 *     responses:
 *       200:
 *         description: List of available events
 */
router.get('/events', (req, res) => {
  const events = [
    { event: 'contract.generated', description: 'Smart contract code generated' },
    { event: 'contract.compiled', description: 'Smart contract compiled' },
    { event: 'contract.deployed', description: 'Smart contract deployed to blockchain' },
    { event: 'contract.verified', description: 'Smart contract verified on block explorer' },
    { event: 'vault.created', description: 'New vault created' },
    { event: 'vault.updated', description: 'Vault data updated' },
    { event: 'vault.deleted', description: 'Vault deleted' },
    { event: 'verification.complete', description: 'User verification completed' },
    { event: 'verification.failed', description: 'User verification failed' },
    { event: 'payment.completed', description: 'Payment successfully processed' },
    { event: 'payment.failed', description: 'Payment failed' },
    { event: 'subscription.created', description: 'New subscription created' },
    { event: 'subscription.updated', description: 'Subscription plan changed' },
    { event: 'subscription.cancelled', description: 'Subscription cancelled' },
    { event: 'deadman.warning', description: 'Dead man\'s switch warning triggered' },
    { event: 'deadman.triggered', description: 'Dead man\'s switch activated' },
    { event: 'deadman.reset', description: 'Dead man\'s switch reset by owner' },
    { event: '*', description: 'All events (Partner/Internal tier only)' }
  ];
  
  res.json({
    success: true,
    data: events
  });
});

export default router;

