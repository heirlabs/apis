import express from 'express';
import ApiKey from '../models/ApiKey.js';
import { verifyAuth } from '../middleware/auth.js';
import { apiKeyAuth, requireTier } from '../middleware/apiKeyAuth.js';
import { createLogger } from '../utils/logger.js';
import rateLimit from 'express-rate-limit';

const logger = createLogger('ApiKeys');
const router = express.Router();

// Rate limit for API key operations
const apiKeyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30,
  message: 'Too many API key operations, please try again later.'
});

/**
 * @openapi
 * /api/v1/api-keys:
 *   get:
 *     summary: List all API keys for the authenticated user
 *     tags: [API Keys]
 *     security: [{ bearerAuth: [] }, { apiKey: [] }]
 *     responses:
 *       200:
 *         description: List of API keys
 */
router.get('/', verifyAuth, async (req, res) => {
  try {
    const keys = await ApiKey.find({ 
      owner: req.user._id,
      status: { $ne: 'revoked' }
    }).select('-keyHash').sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: keys.map(key => ({
        id: key._id,
        keyPrefix: key.keyPrefix,
        name: key.name,
        tier: key.tier,
        scopes: key.scopes,
        status: key.status,
        usage: {
          total: key.usage.total,
          currentWindow: key.usage.currentWindow
        },
        lastUsedAt: key.lastUsedAt,
        expiresAt: key.expiresAt,
        createdAt: key.createdAt
      }))
    });
  } catch (error) {
    logger.error('Error listing API keys', { error: error.message });
    res.status(500).json({
      success: false,
      error: { code: 'LIST_ERROR', message: 'Failed to list API keys' }
    });
  }
});

/**
 * @openapi
 * /api/v1/api-keys:
 *   post:
 *     summary: Create a new API key
 *     tags: [API Keys]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *               scopes:
 *                 type: array
 *                 items:
 *                   type: string
 *               expiresIn:
 *                 type: number
 *                 description: Expiration in days (null for never)
 *               ipWhitelist:
 *                 type: array
 *                 items:
 *                   type: string
 *               webhookUrl:
 *                 type: string
 */
router.post('/', verifyAuth, apiKeyLimiter, async (req, res) => {
  try {
    const { 
      name, 
      scopes = ['contracts:read', 'vaults:read'],
      expiresIn,
      ipWhitelist = [],
      webhookUrl,
      description
    } = req.body;
    
    if (!name || name.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_NAME', message: 'API key name is required' }
      });
    }
    
    // Check existing key count (limit per user)
    const existingCount = await ApiKey.countDocuments({ 
      owner: req.user._id, 
      status: { $in: ['active', 'suspended'] } 
    });
    
    const maxKeys = req.user.subscription?.plan === 'premium' ? 20 : 5;
    if (existingCount >= maxKeys) {
      return res.status(400).json({
        success: false,
        error: { 
          code: 'KEY_LIMIT_REACHED', 
          message: `Maximum ${maxKeys} API keys allowed. Revoke unused keys first.`
        }
      });
    }
    
    // Determine tier based on user subscription
    let tier = 'public';
    if (req.user.role === 'admin' || req.user.subscription?.plan === 'enterprise') {
      tier = 'internal';
    } else if (req.user.subscription?.plan === 'premium' || req.user.subscription?.plan === 'professional') {
      tier = 'partner';
    }
    
    // Filter scopes based on tier
    const allowedScopes = filterScopesByTier(scopes, tier);
    
    // Generate the key
    const { fullKey, keyPrefix, keyHash } = ApiKey.generateKey(tier);
    
    // Calculate expiration
    let expiresAt = null;
    if (expiresIn && typeof expiresIn === 'number' && expiresIn > 0) {
      expiresAt = new Date(Date.now() + expiresIn * 24 * 60 * 60 * 1000);
    }
    
    const apiKey = new ApiKey({
      keyPrefix,
      keyHash,
      name: name.trim(),
      tier,
      scopes: allowedScopes,
      owner: req.user._id,
      expiresAt,
      metadata: {
        ipWhitelist,
        webhookUrl,
        description
      }
    });
    
    await apiKey.save();
    
    logger.info('API key created', { 
      keyPrefix, 
      tier, 
      owner: req.user._id,
      scopes: allowedScopes 
    });
    
    // Return the full key ONLY on creation (never again)
    res.status(201).json({
      success: true,
      data: {
        id: apiKey._id,
        key: fullKey, // IMPORTANT: Only returned on creation!
        keyPrefix,
        name: apiKey.name,
        tier: apiKey.tier,
        scopes: apiKey.scopes,
        expiresAt: apiKey.expiresAt,
        createdAt: apiKey.createdAt
      },
      meta: {
        warning: 'Save this API key securely. It will not be shown again.'
      }
    });
  } catch (error) {
    logger.error('Error creating API key', { error: error.message });
    res.status(500).json({
      success: false,
      error: { code: 'CREATE_ERROR', message: 'Failed to create API key' }
    });
  }
});

/**
 * @openapi
 * /api/v1/api-keys/{id}:
 *   get:
 *     summary: Get details of a specific API key
 *     tags: [API Keys]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 */
router.get('/:id', verifyAuth, async (req, res) => {
  try {
    const key = await ApiKey.findOne({ 
      _id: req.params.id, 
      owner: req.user._id 
    }).select('-keyHash');
    
    if (!key) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'API key not found' }
      });
    }
    
    res.json({
      success: true,
      data: {
        id: key._id,
        keyPrefix: key.keyPrefix,
        name: key.name,
        tier: key.tier,
        scopes: key.scopes,
        status: key.status,
        rateLimit: key.getEffectiveRateLimits(),
        usage: key.usage,
        metadata: {
          ipWhitelist: key.metadata.ipWhitelist,
          webhookUrl: key.metadata.webhookUrl,
          description: key.metadata.description,
          environment: key.metadata.environment
        },
        lastUsedAt: key.lastUsedAt,
        lastUsedIp: key.lastUsedIp,
        expiresAt: key.expiresAt,
        createdAt: key.createdAt,
        updatedAt: key.updatedAt
      }
    });
  } catch (error) {
    logger.error('Error fetching API key', { error: error.message });
    res.status(500).json({
      success: false,
      error: { code: 'FETCH_ERROR', message: 'Failed to fetch API key' }
    });
  }
});

/**
 * @openapi
 * /api/v1/api-keys/{id}:
 *   patch:
 *     summary: Update an API key
 *     tags: [API Keys]
 *     security: [{ bearerAuth: [] }]
 */
router.patch('/:id', verifyAuth, apiKeyLimiter, async (req, res) => {
  try {
    const key = await ApiKey.findOne({ 
      _id: req.params.id, 
      owner: req.user._id,
      status: { $ne: 'revoked' }
    });
    
    if (!key) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'API key not found' }
      });
    }
    
    const { name, scopes, ipWhitelist, webhookUrl, description, status } = req.body;
    
    // Update allowed fields
    if (name) key.name = name.trim();
    if (scopes) key.scopes = filterScopesByTier(scopes, key.tier);
    if (ipWhitelist !== undefined) key.metadata.ipWhitelist = ipWhitelist;
    if (webhookUrl !== undefined) key.metadata.webhookUrl = webhookUrl;
    if (description !== undefined) key.metadata.description = description;
    if (status && ['active', 'suspended'].includes(status)) key.status = status;
    
    await key.save();
    
    logger.info('API key updated', { keyPrefix: key.keyPrefix });
    
    res.json({
      success: true,
      data: {
        id: key._id,
        keyPrefix: key.keyPrefix,
        name: key.name,
        tier: key.tier,
        scopes: key.scopes,
        status: key.status,
        updatedAt: key.updatedAt
      }
    });
  } catch (error) {
    logger.error('Error updating API key', { error: error.message });
    res.status(500).json({
      success: false,
      error: { code: 'UPDATE_ERROR', message: 'Failed to update API key' }
    });
  }
});

/**
 * @openapi
 * /api/v1/api-keys/{id}:
 *   delete:
 *     summary: Revoke an API key
 *     tags: [API Keys]
 *     security: [{ bearerAuth: [] }]
 */
router.delete('/:id', verifyAuth, apiKeyLimiter, async (req, res) => {
  try {
    const key = await ApiKey.findOne({ 
      _id: req.params.id, 
      owner: req.user._id,
      status: { $ne: 'revoked' }
    });
    
    if (!key) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'API key not found' }
      });
    }
    
    await key.revoke(req.body.reason || 'User requested revocation');
    
    logger.info('API key revoked', { keyPrefix: key.keyPrefix });
    
    res.json({
      success: true,
      data: {
        id: key._id,
        keyPrefix: key.keyPrefix,
        status: 'revoked',
        revokedAt: key.revokedAt
      }
    });
  } catch (error) {
    logger.error('Error revoking API key', { error: error.message });
    res.status(500).json({
      success: false,
      error: { code: 'REVOKE_ERROR', message: 'Failed to revoke API key' }
    });
  }
});

/**
 * @openapi
 * /api/v1/api-keys/{id}/regenerate-webhook-secret:
 *   post:
 *     summary: Regenerate the webhook signing secret
 *     tags: [API Keys]
 *     security: [{ bearerAuth: [] }]
 */
router.post('/:id/regenerate-webhook-secret', verifyAuth, apiKeyLimiter, async (req, res) => {
  try {
    const key = await ApiKey.findOne({ 
      _id: req.params.id, 
      owner: req.user._id,
      status: 'active'
    });
    
    if (!key) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'API key not found' }
      });
    }
    
    if (!key.scopes.includes('webhooks') && !key.scopes.includes('all')) {
      return res.status(400).json({
        success: false,
        error: { code: 'NO_WEBHOOK_SCOPE', message: 'API key does not have webhook scope' }
      });
    }
    
    const crypto = await import('crypto');
    key.metadata.webhookSecret = crypto.randomBytes(32).toString('hex');
    await key.save();
    
    logger.info('Webhook secret regenerated', { keyPrefix: key.keyPrefix });
    
    res.json({
      success: true,
      data: {
        webhookSecret: key.metadata.webhookSecret
      },
      meta: {
        warning: 'Update your webhook handlers with the new secret immediately.'
      }
    });
  } catch (error) {
    logger.error('Error regenerating webhook secret', { error: error.message });
    res.status(500).json({
      success: false,
      error: { code: 'REGENERATE_ERROR', message: 'Failed to regenerate webhook secret' }
    });
  }
});

/**
 * @openapi
 * /api/v1/api-keys/{id}/usage:
 *   get:
 *     summary: Get usage statistics for an API key
 *     tags: [API Keys]
 *     security: [{ bearerAuth: [] }]
 */
router.get('/:id/usage', verifyAuth, async (req, res) => {
  try {
    const key = await ApiKey.findOne({ 
      _id: req.params.id, 
      owner: req.user._id 
    });
    
    if (!key) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'API key not found' }
      });
    }
    
    const limits = key.getEffectiveRateLimits();
    
    res.json({
      success: true,
      data: {
        keyPrefix: key.keyPrefix,
        tier: key.tier,
        limits,
        usage: {
          total: key.usage.total,
          currentWindow: key.usage.currentWindow,
          windowStart: key.usage.windowStart,
          windowEnds: new Date(key.usage.windowStart.getTime() + limits.windowMs),
          remaining: Math.max(0, limits.requests - key.usage.currentWindow)
        },
        lastUsedAt: key.lastUsedAt,
        lastUsedIp: key.lastUsedIp
      }
    });
  } catch (error) {
    logger.error('Error fetching API key usage', { error: error.message });
    res.status(500).json({
      success: false,
      error: { code: 'USAGE_ERROR', message: 'Failed to fetch usage data' }
    });
  }
});

/**
 * Admin: List all API keys (internal tier only)
 */
router.get('/admin/all', apiKeyAuth({ scopes: ['all'] }), requireTier('internal'), async (req, res) => {
  try {
    const { tier, status, page = 1, limit = 50 } = req.query;
    
    const filter = {};
    if (tier) filter.tier = tier;
    if (status) filter.status = status;
    
    const keys = await ApiKey.find(filter)
      .select('-keyHash')
      .populate('owner', 'email profile.firstName profile.lastName')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    
    const total = await ApiKey.countDocuments(filter);
    
    res.json({
      success: true,
      data: keys,
      meta: {
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    logger.error('Admin: Error listing all API keys', { error: error.message });
    res.status(500).json({
      success: false,
      error: { code: 'ADMIN_LIST_ERROR', message: 'Failed to list API keys' }
    });
  }
});

/**
 * Helper: Filter scopes based on tier
 */
function filterScopesByTier(requestedScopes, tier) {
  const tierScopeMap = {
    public: [
      'contracts:read',
      'vaults:read',
      'legal:read',
      'advisors:read'
    ],
    partner: [
      'contracts', 'contracts:read',
      'vaults', 'vaults:read',
      'users:read',
      'payments:read',
      'webhooks',
      'legal', 'legal:read',
      'advisors', 'advisors:read',
      'chat'
    ],
    internal: [
      'contracts', 'contracts:read',
      'vaults', 'vaults:read',
      'users', 'users:read',
      'payments', 'payments:read',
      'webhooks',
      'legal', 'legal:read',
      'advisors', 'advisors:read',
      'chat',
      'all'
    ]
  };
  
  const allowed = tierScopeMap[tier] || tierScopeMap.public;
  return requestedScopes.filter(scope => allowed.includes(scope));
}

export default router;

