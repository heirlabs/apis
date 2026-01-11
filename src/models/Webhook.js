import mongoose from 'mongoose';
import crypto from 'crypto';

/**
 * Webhook Subscription Model
 * Stores webhook endpoints for async event notifications
 */
const webhookSchema = new mongoose.Schema({
  // Owner of the webhook subscription
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  
  // Associated API key (optional, for filtering events)
  apiKey: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ApiKey',
    index: true
  },
  
  // Webhook endpoint URL
  url: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        try {
          const url = new URL(v);
          return url.protocol === 'https:' || 
                 (process.env.NODE_ENV !== 'production' && url.protocol === 'http:');
        } catch {
          return false;
        }
      },
      message: 'Invalid webhook URL. HTTPS required in production.'
    }
  },
  
  // Friendly name
  name: {
    type: String,
    trim: true,
    maxlength: 100
  },
  
  // Events this webhook subscribes to
  events: [{
    type: String,
    enum: [
      // Contract events
      'contract.generated',
      'contract.compiled',
      'contract.deployed',
      'contract.verified',
      'contract.error',
      
      // Vault events
      'vault.created',
      'vault.updated',
      'vault.deleted',
      'vault.accessed',
      
      // Verification events
      'verification.started',
      'verification.complete',
      'verification.failed',
      'verification.expired',
      
      // Payment events
      'payment.initiated',
      'payment.completed',
      'payment.failed',
      'payment.refunded',
      'subscription.created',
      'subscription.updated',
      'subscription.cancelled',
      
      // User events
      'user.created',
      'user.updated',
      'user.deleted',
      
      // Advisor events
      'advisor.matched',
      'advisor.message',
      
      // Dead man's switch events
      'deadman.warning',
      'deadman.triggered',
      'deadman.reset',
      
      // Wildcard for all events (partner/internal only)
      '*'
    ]
  }],
  
  // Secret for signing webhook payloads
  secret: {
    type: String,
    required: true
  },
  
  // Webhook status
  status: {
    type: String,
    enum: ['active', 'paused', 'disabled', 'failed'],
    default: 'active'
  },
  
  // Delivery configuration
  config: {
    // Retry configuration
    maxRetries: { type: Number, default: 5, min: 0, max: 10 },
    retryDelayMs: { type: Number, default: 1000 }, // Initial delay
    retryBackoff: { type: String, enum: ['linear', 'exponential'], default: 'exponential' },
    
    // Timeout configuration
    timeoutMs: { type: Number, default: 30000, min: 1000, max: 60000 },
    
    // Content type
    contentType: { 
      type: String, 
      enum: ['application/json', 'application/x-www-form-urlencoded'],
      default: 'application/json'
    },
    
    // Custom headers to include
    headers: {
      type: Map,
      of: String
    },
    
    // Filter by specific resources (e.g., specific contract addresses)
    filters: {
      contractAddresses: [String],
      vaultIds: [String],
      networks: [String]
    }
  },
  
  // Delivery statistics
  stats: {
    totalDeliveries: { type: Number, default: 0 },
    successfulDeliveries: { type: Number, default: 0 },
    failedDeliveries: { type: Number, default: 0 },
    lastDeliveryAt: Date,
    lastSuccessAt: Date,
    lastFailureAt: Date,
    lastError: String,
    consecutiveFailures: { type: Number, default: 0 }
  },
  
  // Metadata
  description: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Indexes
webhookSchema.index({ owner: 1, status: 1 });
webhookSchema.index({ events: 1, status: 1 });
webhookSchema.index({ 'stats.consecutiveFailures': 1, status: 1 });

/**
 * Generate webhook secret
 */
webhookSchema.statics.generateSecret = function() {
  return 'whsec_' + crypto.randomBytes(32).toString('hex');
};

/**
 * Sign a webhook payload
 */
webhookSchema.methods.signPayload = function(payload, timestamp) {
  const signedPayload = `${timestamp}.${JSON.stringify(payload)}`;
  const signature = crypto
    .createHmac('sha256', this.secret)
    .update(signedPayload)
    .digest('hex');
  return `t=${timestamp},v1=${signature}`;
};

/**
 * Verify a webhook signature
 */
webhookSchema.statics.verifySignature = function(payload, signature, secret, tolerance = 300) {
  const parts = signature.split(',').reduce((acc, part) => {
    const [key, value] = part.split('=');
    acc[key] = value;
    return acc;
  }, {});
  
  const timestamp = parseInt(parts.t);
  const receivedSignature = parts.v1;
  
  // Check timestamp tolerance (default 5 minutes)
  const now = Math.floor(Date.now() / 1000);
  if (Math.abs(now - timestamp) > tolerance) {
    return { valid: false, reason: 'Timestamp outside tolerance' };
  }
  
  // Compute expected signature
  const signedPayload = `${timestamp}.${JSON.stringify(payload)}`;
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(signedPayload)
    .digest('hex');
  
  // Constant-time comparison
  const isValid = crypto.timingSafeEqual(
    Buffer.from(receivedSignature),
    Buffer.from(expectedSignature)
  );
  
  return { valid: isValid, reason: isValid ? null : 'Invalid signature' };
};

/**
 * Check if webhook subscribes to an event
 */
webhookSchema.methods.subscribesTo = function(event) {
  if (this.events.includes('*')) return true;
  if (this.events.includes(event)) return true;
  
  // Check for category wildcards (e.g., 'contract.*')
  const category = event.split('.')[0];
  if (this.events.includes(`${category}.*`)) return true;
  
  return false;
};

/**
 * Check if webhook should receive event based on filters
 */
webhookSchema.methods.matchesFilters = function(eventData) {
  const filters = this.config.filters;
  if (!filters) return true;
  
  // Check contract address filter
  if (filters.contractAddresses?.length > 0) {
    if (!eventData.contractAddress || 
        !filters.contractAddresses.includes(eventData.contractAddress)) {
      return false;
    }
  }
  
  // Check vault ID filter
  if (filters.vaultIds?.length > 0) {
    if (!eventData.vaultId || 
        !filters.vaultIds.includes(eventData.vaultId)) {
      return false;
    }
  }
  
  // Check network filter
  if (filters.networks?.length > 0) {
    if (!eventData.network || 
        !filters.networks.includes(eventData.network)) {
      return false;
    }
  }
  
  return true;
};

/**
 * Record delivery attempt
 */
webhookSchema.methods.recordDelivery = async function(success, error = null) {
  this.stats.totalDeliveries += 1;
  this.stats.lastDeliveryAt = new Date();
  
  if (success) {
    this.stats.successfulDeliveries += 1;
    this.stats.lastSuccessAt = new Date();
    this.stats.consecutiveFailures = 0;
    this.stats.lastError = null;
    
    // Re-enable if was failed
    if (this.status === 'failed') {
      this.status = 'active';
    }
  } else {
    this.stats.failedDeliveries += 1;
    this.stats.lastFailureAt = new Date();
    this.stats.consecutiveFailures += 1;
    this.stats.lastError = error;
    
    // Auto-disable after too many failures
    if (this.stats.consecutiveFailures >= 50) {
      this.status = 'failed';
    }
  }
  
  this.updatedAt = new Date();
  await this.save();
};

/**
 * Find webhooks subscribed to an event
 */
webhookSchema.statics.findSubscribers = async function(event, eventData = {}) {
  // Find all active webhooks that subscribe to this event or wildcards
  const category = event.split('.')[0];
  const webhooks = await this.find({
    status: 'active',
    $or: [
      { events: event },
      { events: '*' },
      { events: `${category}.*` }
    ]
  }).populate('owner', 'email');
  
  // Filter by event data filters
  return webhooks.filter(webhook => webhook.matchesFilters(eventData));
};

/**
 * Get delivery retry delay
 */
webhookSchema.methods.getRetryDelay = function(attemptNumber) {
  const baseDelay = this.config.retryDelayMs || 1000;
  
  if (this.config.retryBackoff === 'linear') {
    return baseDelay * attemptNumber;
  }
  
  // Exponential backoff with jitter
  const exponentialDelay = baseDelay * Math.pow(2, attemptNumber - 1);
  const jitter = Math.random() * 1000;
  return Math.min(exponentialDelay + jitter, 300000); // Max 5 minutes
};

// Pre-save hook
webhookSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Generate secret on creation if not provided
webhookSchema.pre('save', function(next) {
  if (this.isNew && !this.secret) {
    this.secret = mongoose.model('Webhook').generateSecret();
  }
  next();
});

const Webhook = mongoose.model('Webhook', webhookSchema);

export default Webhook;

