import ApiKey from '../models/ApiKey.js';
import { createLogger } from '../utils/logger.js';

const logger = createLogger('ApiKeyAuth');

/**
 * Extract API key from request
 * Supports: Authorization header (Bearer), X-API-Key header, query param
 */
const extractApiKey = (req) => {
  // Check Authorization header (Bearer token)
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer heir_')) {
    return authHeader.substring(7); // Remove 'Bearer '
  }
  
  // Check X-API-Key header
  if (req.headers['x-api-key']) {
    return req.headers['x-api-key'];
  }
  
  // Check query parameter (less secure, for testing)
  if (req.query.api_key) {
    return req.query.api_key;
  }
  
  return null;
};

/**
 * Get client IP from request
 */
const getClientIp = (req) => {
  return req.headers['x-forwarded-for']?.split(',')[0]?.trim() || 
         req.headers['x-real-ip'] || 
         req.connection?.remoteAddress ||
         req.ip;
};

/**
 * API Key Authentication Middleware
 * 
 * Validates API key and attaches apiKey object to request
 * Also tracks usage and checks rate limits
 * 
 * Options:
 * - required: boolean (default: true) - Whether API key is required
 * - scopes: string[] - Required scopes for this endpoint
 */
export const apiKeyAuth = (options = {}) => {
  const { required = true, scopes = [] } = options;
  
  return async (req, res, next) => {
    const key = extractApiKey(req);
    const clientIp = getClientIp(req);
    
    // No key provided
    if (!key) {
      if (required) {
        logger.debug('API key missing', { path: req.path, ip: clientIp });
        return res.status(401).json({
          success: false,
          error: {
            code: 'API_KEY_MISSING',
            message: 'API key is required. Provide via Authorization header (Bearer), X-API-Key header, or api_key query parameter.'
          }
        });
      }
      // Key not required, continue without
      return next();
    }
    
    // Validate key format
    if (!key.startsWith('heir_')) {
      logger.debug('Invalid API key format', { keyPrefix: key.substring(0, 10), ip: clientIp });
      return res.status(401).json({
        success: false,
        error: {
          code: 'API_KEY_INVALID_FORMAT',
          message: 'Invalid API key format. Keys should start with heir_pk_, heir_pt_, or heir_sk_.'
        }
      });
    }
    
    try {
      // Verify and fetch API key
      const apiKey = await ApiKey.verifyKey(key);
      
      if (!apiKey) {
        logger.warn('Invalid or expired API key', { keyPrefix: key.substring(0, 16), ip: clientIp });
        return res.status(401).json({
          success: false,
          error: {
            code: 'API_KEY_INVALID',
            message: 'Invalid or expired API key.'
          }
        });
      }
      
      // Check IP whitelist
      if (!apiKey.isIpAllowed(clientIp)) {
        logger.warn('API key IP not whitelisted', { 
          keyPrefix: apiKey.keyPrefix, 
          ip: clientIp,
          whitelist: apiKey.metadata.ipWhitelist 
        });
        return res.status(403).json({
          success: false,
          error: {
            code: 'IP_NOT_ALLOWED',
            message: 'Your IP address is not authorized for this API key.'
          }
        });
      }
      
      // Check required scopes
      for (const scope of scopes) {
        if (!apiKey.hasScope(scope)) {
          logger.debug('API key missing required scope', { 
            keyPrefix: apiKey.keyPrefix, 
            required: scope,
            available: apiKey.scopes 
          });
          return res.status(403).json({
            success: false,
            error: {
              code: 'INSUFFICIENT_SCOPE',
              message: `This endpoint requires the '${scope}' scope. Your API key has: ${apiKey.scopes.join(', ')}`
            }
          });
        }
      }
      
      // Track usage and check rate limits
      const limits = apiKey.getEffectiveRateLimits();
      const usage = await apiKey.trackUsage(clientIp);
      
      // Add rate limit headers
      res.set('X-RateLimit-Limit', limits.requests.toString());
      res.set('X-RateLimit-Remaining', usage.remaining.toString());
      res.set('X-RateLimit-Reset', usage.reset.toISOString());
      
      // Check if over rate limit
      if (usage.remaining < 0) {
        logger.warn('API key rate limit exceeded', { 
          keyPrefix: apiKey.keyPrefix, 
          limit: limits.requests,
          used: apiKey.usage.currentWindow 
        });
        return res.status(429).json({
          success: false,
          error: {
            code: 'RATE_LIMIT_EXCEEDED',
            message: 'Rate limit exceeded. Please slow down your requests.',
            retryAfter: usage.reset
          }
        });
      }
      
      // Attach API key info to request
      req.apiKey = apiKey;
      req.apiKeyTier = apiKey.tier;
      req.apiKeyScopes = apiKey.scopes;
      req.apiKeyOwner = apiKey.owner;
      
      // Also set user from API key owner for compatibility with existing routes
      if (apiKey.owner) {
        req.user = apiKey.owner;
      }
      
      logger.debug('API key authenticated', { 
        keyPrefix: apiKey.keyPrefix, 
        tier: apiKey.tier,
        path: req.path 
      });
      
      next();
    } catch (error) {
      logger.error('API key authentication error', { error: error.message });
      return res.status(500).json({
        success: false,
        error: {
          code: 'AUTH_ERROR',
          message: 'An error occurred during authentication.'
        }
      });
    }
  };
};

/**
 * Require specific scope(s)
 * Use after apiKeyAuth middleware
 */
export const requireScope = (...requiredScopes) => {
  return (req, res, next) => {
    if (!req.apiKey) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'API_KEY_REQUIRED',
          message: 'API key authentication required for this endpoint.'
        }
      });
    }
    
    for (const scope of requiredScopes) {
      if (!req.apiKey.hasScope(scope)) {
        return res.status(403).json({
          success: false,
          error: {
            code: 'INSUFFICIENT_SCOPE',
            message: `This endpoint requires the '${scope}' scope.`
          }
        });
      }
    }
    
    next();
  };
};

/**
 * Require specific tier
 * Use after apiKeyAuth middleware
 */
export const requireTier = (...allowedTiers) => {
  return (req, res, next) => {
    if (!req.apiKey) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'API_KEY_REQUIRED',
          message: 'API key authentication required for this endpoint.'
        }
      });
    }
    
    if (!allowedTiers.includes(req.apiKey.tier)) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'TIER_NOT_ALLOWED',
          message: `This endpoint requires one of these tiers: ${allowedTiers.join(', ')}. Your tier: ${req.apiKey.tier}`
        }
      });
    }
    
    next();
  };
};

/**
 * Combined auth that accepts either JWT/cookie auth OR API key
 * Useful for routes that need to support both web app and API access
 */
export const hybridAuth = (options = {}) => {
  const { requireAuth = true, scopes = [] } = options;
  
  return async (req, res, next) => {
    // Check if already authenticated via session/JWT
    if (req.user && req.user._id) {
      return next();
    }
    
    // Try API key authentication
    const key = extractApiKey(req);
    if (key) {
      return apiKeyAuth({ required: true, scopes })(req, res, next);
    }
    
    // No auth method found
    if (requireAuth) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'AUTH_REQUIRED',
          message: 'Authentication required. Provide a session cookie or API key.'
        }
      });
    }
    
    next();
  };
};

export default apiKeyAuth;

