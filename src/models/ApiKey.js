import mongoose from 'mongoose';
import crypto from 'crypto';

const apiKeySchema = new mongoose.Schema({
  // The visible prefix (e.g., heir_pk_abc123...)
  keyPrefix: {
    type: String,
    required: true,
    index: true
  },
  
  // SHA-256 hash of the full API key (never store plaintext)
  keyHash: {
    type: String,
    required: true,
    unique: true
  },
  
  // Friendly name for the API key
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  
  // Access tier determines rate limits and feature access
  tier: {
    type: String,
    enum: ['public', 'partner', 'internal'],
    default: 'public',
    required: true
  },
  
  // Scopes limit which API sections this key can access
  scopes: [{
    type: String,
    enum: [
      'contracts',      // Contract generation and deployment
      'contracts:read', // Read-only contract access
      'vaults',         // Vault management
      'vaults:read',    // Read-only vault access
      'users',          // User management
      'users:read',     // Read-only user access
      'payments',       // Payment operations
      'payments:read',  // Read-only payment access
      'webhooks',       // Webhook management
      'legal',          // Legal document generation
      'legal:read',     // Read-only legal access
      'advisors',       // Advisor network access
      'advisors:read',  // Read-only advisor access
      'chat',           // AI chat access
      'all'             // Full access (internal only)
    ]
  }],
  
  // Owner of this API key
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Custom rate limits (overrides tier defaults if set)
  rateLimit: {
    requests: { type: Number, default: null },      // Max requests per window
    windowMs: { type: Number, default: null },      // Window in milliseconds
    contractGen: { type: Number, default: null },   // Contract generation limit
    aiChat: { type: Number, default: null }         // AI chat limit
  },
  
  // Usage tracking
  usage: {
    total: { type: Number, default: 0 },
    lastReset: { type: Date, default: Date.now },
    currentWindow: { type: Number, default: 0 },
    windowStart: { type: Date, default: Date.now }
  },
  
  // Metadata for security and configuration
  metadata: {
    ipWhitelist: [{ type: String }],      // Allowed IPs (empty = all)
    webhookUrl: { type: String },          // Default webhook URL
    webhookSecret: { type: String },       // Webhook signing secret
    description: { type: String },         // Optional description
    environment: {                          // Intended environment
      type: String,
      enum: ['development', 'staging', 'production'],
      default: 'production'
    }
  },
  
  // Key status
  status: {
    type: String,
    enum: ['active', 'revoked', 'expired', 'suspended'],
    default: 'active'
  },
  
  // Expiration (null = never expires)
  expiresAt: {
    type: Date,
    default: null
  },
  
  // Revocation info
  revokedAt: { type: Date },
  revokedReason: { type: String },
  
  // Audit fields
  lastUsedAt: { type: Date },
  lastUsedIp: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Indexes for efficient lookups
apiKeySchema.index({ owner: 1, status: 1 });
apiKeySchema.index({ tier: 1, status: 1 });
apiKeySchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0, partialFilterExpression: { expiresAt: { $ne: null } } });

// Static method to generate a new API key
apiKeySchema.statics.generateKey = function(tier = 'public') {
  const prefixMap = {
    public: 'heir_pk_',
    partner: 'heir_pt_',
    internal: 'heir_sk_'
  };
  
  const prefix = prefixMap[tier] || 'heir_pk_';
  const randomPart = crypto.randomBytes(32).toString('base64url');
  const fullKey = prefix + randomPart;
  
  return {
    fullKey,
    keyPrefix: fullKey.substring(0, 16) + '...',
    keyHash: crypto.createHash('sha256').update(fullKey).digest('hex')
  };
};

// Static method to hash a key for lookup
apiKeySchema.statics.hashKey = function(key) {
  return crypto.createHash('sha256').update(key).digest('hex');
};

// Static method to verify a key
apiKeySchema.statics.verifyKey = async function(key) {
  if (!key || typeof key !== 'string') return null;
  
  const keyHash = this.hashKey(key);
  const apiKey = await this.findOne({ 
    keyHash, 
    status: 'active'
  }).populate('owner', 'email profile.firstName profile.lastName');
  
  if (!apiKey) return null;
  
  // Check expiration
  if (apiKey.expiresAt && apiKey.expiresAt < new Date()) {
    apiKey.status = 'expired';
    await apiKey.save();
    return null;
  }
  
  return apiKey;
};

// Instance method to check if key has scope
apiKeySchema.methods.hasScope = function(requiredScope) {
  if (this.scopes.includes('all')) return true;
  if (this.scopes.includes(requiredScope)) return true;
  
  // Check for parent scope (e.g., 'contracts' includes 'contracts:read')
  const parentScope = requiredScope.split(':')[0];
  if (this.scopes.includes(parentScope)) return true;
  
  return false;
};

// Instance method to get effective rate limits based on tier
apiKeySchema.methods.getEffectiveRateLimits = function() {
  const tierDefaults = {
    public: {
      requests: 100,
      windowMs: 15 * 60 * 1000,  // 15 minutes
      contractGen: 10,
      aiChat: 5
    },
    partner: {
      requests: 1000,
      windowMs: 15 * 60 * 1000,
      contractGen: 100,
      aiChat: 50
    },
    internal: {
      requests: 10000,
      windowMs: 15 * 60 * 1000,
      contractGen: 1000,
      aiChat: 200
    }
  };
  
  const defaults = tierDefaults[this.tier] || tierDefaults.public;
  
  return {
    requests: this.rateLimit.requests ?? defaults.requests,
    windowMs: this.rateLimit.windowMs ?? defaults.windowMs,
    contractGen: this.rateLimit.contractGen ?? defaults.contractGen,
    aiChat: this.rateLimit.aiChat ?? defaults.aiChat
  };
};

// Instance method to track usage
apiKeySchema.methods.trackUsage = async function(ip) {
  const now = new Date();
  const limits = this.getEffectiveRateLimits();
  
  // Reset window if expired
  if (now - this.usage.windowStart > limits.windowMs) {
    this.usage.currentWindow = 0;
    this.usage.windowStart = now;
  }
  
  this.usage.total += 1;
  this.usage.currentWindow += 1;
  this.lastUsedAt = now;
  this.lastUsedIp = ip;
  this.updatedAt = now;
  
  await this.save();
  
  return {
    remaining: Math.max(0, limits.requests - this.usage.currentWindow),
    reset: new Date(this.usage.windowStart.getTime() + limits.windowMs),
    limit: limits.requests
  };
};

// Instance method to check IP whitelist
apiKeySchema.methods.isIpAllowed = function(ip) {
  // Empty whitelist = all IPs allowed
  if (!this.metadata.ipWhitelist || this.metadata.ipWhitelist.length === 0) {
    return true;
  }
  return this.metadata.ipWhitelist.includes(ip);
};

// Instance method to revoke key
apiKeySchema.methods.revoke = async function(reason) {
  this.status = 'revoked';
  this.revokedAt = new Date();
  this.revokedReason = reason;
  this.updatedAt = new Date();
  await this.save();
};

// Pre-save hook to update timestamp
apiKeySchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Generate webhook secret on creation if webhooks scope is included
apiKeySchema.pre('save', function(next) {
  if (this.isNew && this.scopes.includes('webhooks') && !this.metadata.webhookSecret) {
    this.metadata.webhookSecret = crypto.randomBytes(32).toString('hex');
  }
  next();
});

const ApiKey = mongoose.model('ApiKey', apiKeySchema);

export default ApiKey;

