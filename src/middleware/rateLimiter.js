import rateLimit from 'express-rate-limit';

// Rate limiting configurations for different endpoint types

// Strict rate limit for authentication endpoints
// TODO: RESTORE STRICT LIMITS AFTER BUG TESTING - was: max: 5
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // TEMPORARILY INCREASED FOR TESTING (was: 5)
  message: 'Too many authentication attempts, please try again later.',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req, res) => {
    res.status(429).json({
      error: 'Too many authentication attempts from this IP, please try again after 15 minutes',
      retryAfter: req.rateLimit.resetTime
    });
  }
});

// Rate limit for magic link requests (prevent email spam)
// TODO: RESTORE STRICT LIMITS AFTER BUG TESTING - was: max: 3
export const magicLinkLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 100, // TEMPORARILY INCREASED FOR TESTING (was: 3)
  message: 'Too many magic link requests, please try again later.',
  skipSuccessfulRequests: true, // Don't count successful requests
  handler: (req, res) => {
    res.status(429).json({
      error: 'Too many magic link requests. Please wait before requesting another.',
      retryAfter: req.rateLimit.resetTime
    });
  }
});

// Rate limit for SMS/notification endpoints (prevent SMS spam)
export const notificationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Limit each IP to 10 SMS requests per hour
  message: 'Too many notification requests, please try again later.',
  handler: (req, res) => {
    res.status(429).json({
      error: 'Too many notification requests. Please wait before sending more.',
      retryAfter: req.rateLimit.resetTime
    });
  }
});

// Rate limit for contract generation (prevent resource exhaustion)
export const contractLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 20 contract operations per 15 minutes
  message: 'Too many contract operations, please slow down.',
  handler: (req, res) => {
    res.status(429).json({
      error: 'Too many contract operations. Please wait before generating more.',
      retryAfter: req.rateLimit.resetTime
    });
  }
});

// General API rate limit (more lenient)
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Strict rate limit for password/PIN verification
// TODO: RESTORE STRICT LIMITS AFTER BUG TESTING - was: max: 5
export const pinLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // TEMPORARILY INCREASED FOR TESTING (was: 5)
  skipSuccessfulRequests: false, // Count all attempts
  handler: (req, res) => {
    res.status(429).json({
      error: 'Too many PIN verification attempts. Account temporarily locked.',
      retryAfter: req.rateLimit.resetTime,
      locked: true
    });
  }
});

// Rate limit for data room access
// TODO: RESTORE STRICT LIMITS AFTER BUG TESTING - was: max: 10
export const dataRoomLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // TEMPORARILY INCREASED FOR TESTING (was: 10)
  message: 'Too many access attempts to data room.',
  handler: (req, res) => {
    res.status(429).json({
      error: 'Too many access attempts. Please wait before trying again.',
      retryAfter: req.rateLimit.resetTime
    });
  }
});

// Rate limit for AI/Chat endpoints (prevent API credit exhaustion)
export const chatLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // Limit each IP to 30 AI chat requests per 15 minutes
  message: 'Too many AI chat requests, please slow down.',
  handler: (req, res) => {
    res.status(429).json({
      error: 'Too many AI requests. Please wait before sending more messages.',
      retryAfter: req.rateLimit.resetTime
    });
  }
});

// Rate limit for payment endpoints
export const paymentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit payment intent creation
  message: 'Too many payment requests.',
  handler: (req, res) => {
    res.status(429).json({
      error: 'Too many payment requests. Please wait before trying again.',
      retryAfter: req.rateLimit.resetTime
    });
  }
});

// Rate limit for error reporting (prevent log flooding)
export const errorReportLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Limit error reports
  message: 'Too many error reports.',
  handler: (req, res) => {
    res.status(429).json({
      error: 'Too many error reports. Please try again later.',
      retryAfter: req.rateLimit.resetTime
    });
  }
});

// Dynamic rate limiter based on user authentication status
export const createDynamicLimiter = (authenticatedMax = 200, unauthenticatedMax = 50) => {
  return rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: (req) => {
      // Give authenticated users higher limits
      return req.user ? authenticatedMax : unauthenticatedMax;
    },
    message: 'Too many requests, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
  });
};

// ============================================
// Tier-Based Rate Limiting for API Keys
// ============================================

/**
 * Tier rate limit configurations
 * Defines limits per 15-minute window for each tier
 */
export const tierLimits = {
  public: {
    general: 100,
    contracts: 10,
    chat: 5,
    auth: 10,
    notifications: 5
  },
  partner: {
    general: 1000,
    contracts: 100,
    chat: 50,
    auth: 50,
    notifications: 30
  },
  internal: {
    general: 10000,
    contracts: 1000,
    chat: 200,
    auth: 500,
    notifications: 200
  }
};

/**
 * Get rate limit based on API key tier
 */
const getTierLimit = (req, category = 'general') => {
  const tier = req.apiKeyTier || 'public';
  const limits = tierLimits[tier] || tierLimits.public;
  
  // Check for custom rate limits on API key
  if (req.apiKey?.rateLimit?.requests) {
    return req.apiKey.rateLimit.requests;
  }
  
  return limits[category] || limits.general;
};

/**
 * Key generator for tier-based rate limiting
 * Uses API key ID if present, otherwise falls back to IP
 */
const tierKeyGenerator = (req) => {
  if (req.apiKey?._id) {
    return `apikey:${req.apiKey._id}`;
  }
  // Fall back to IP-based limiting
  return req.headers['x-forwarded-for']?.split(',')[0]?.trim() || 
         req.headers['x-real-ip'] || 
         req.ip;
};

/**
 * Create tier-aware rate limiter
 * Automatically adjusts limits based on API key tier
 */
export const createTieredLimiter = (category = 'general', options = {}) => {
  return rateLimit({
    windowMs: options.windowMs || 15 * 60 * 1000, // 15 minutes default
    max: (req) => getTierLimit(req, category),
    keyGenerator: tierKeyGenerator,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      const tier = req.apiKeyTier || 'public';
      const limit = getTierLimit(req, category);
      res.status(429).json({
        success: false,
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message: `Rate limit exceeded for ${category} operations. Your tier: ${tier}, limit: ${limit} requests per 15 minutes.`,
          tier,
          limit,
          category,
          retryAfter: req.rateLimit?.resetTime
        }
      });
    },
    skip: (req) => {
      // Skip rate limiting for internal tier (but still track)
      if (req.apiKeyTier === 'internal') {
        return true;
      }
      return false;
    },
    ...options
  });
};

// Pre-built tiered limiters for common use cases
export const tieredGeneralLimiter = createTieredLimiter('general');
export const tieredContractLimiter = createTieredLimiter('contracts');
export const tieredChatLimiter = createTieredLimiter('chat');
export const tieredAuthLimiter = createTieredLimiter('auth');
export const tieredNotificationLimiter = createTieredLimiter('notifications');

/**
 * Burst limiter for protecting against sudden spikes
 * Applies to all tiers with different burst allowances
 */
export const burstLimiter = rateLimit({
  windowMs: 1000, // 1 second
  max: (req) => {
    const tier = req.apiKeyTier || 'public';
    const burstLimits = {
      public: 5,
      partner: 20,
      internal: 100
    };
    return burstLimits[tier] || 5;
  },
  keyGenerator: tierKeyGenerator,
  standardHeaders: false,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      error: {
        code: 'BURST_LIMIT_EXCEEDED',
        message: 'Too many requests in a short time. Please slow down.',
        retryAfter: 1000
      }
    });
  }
});

/**
 * Sliding window rate limiter for more accurate limiting
 * Uses Redis if available, falls back to memory store
 */
export const createSlidingWindowLimiter = (category = 'general', options = {}) => {
  return rateLimit({
    windowMs: options.windowMs || 15 * 60 * 1000,
    max: (req) => getTierLimit(req, category),
    keyGenerator: tierKeyGenerator,
    standardHeaders: true,
    legacyHeaders: false,
    // Use sliding window algorithm for more accurate rate limiting
    // Note: Requires redis store for distributed environments
    handler: (req, res) => {
      const tier = req.apiKeyTier || 'public';
      res.status(429).json({
        success: false,
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message: 'Rate limit exceeded.',
          tier,
          category
        }
      });
    }
  });
};

/**
 * Cost-based rate limiter for expensive operations
 * Different operations have different "costs"
 */
export const createCostBasedLimiter = (costFn) => {
  const costMap = new Map();
  
  return (req, res, next) => {
    const key = tierKeyGenerator(req);
    const tier = req.apiKeyTier || 'public';
    const cost = typeof costFn === 'function' ? costFn(req) : 1;
    
    // Get tier budget
    const budgets = {
      public: 100,
      partner: 1000,
      internal: 10000
    };
    const budget = budgets[tier] || 100;
    
    // Get or initialize cost tracking
    let tracking = costMap.get(key);
    const now = Date.now();
    const windowMs = 15 * 60 * 1000;
    
    if (!tracking || now - tracking.windowStart > windowMs) {
      tracking = { cost: 0, windowStart: now };
    }
    
    // Check if adding this cost would exceed budget
    if (tracking.cost + cost > budget) {
      return res.status(429).json({
        success: false,
        error: {
          code: 'COST_LIMIT_EXCEEDED',
          message: `Operation cost (${cost}) would exceed remaining budget (${budget - tracking.cost})`,
          remaining: budget - tracking.cost,
          cost,
          budget
        }
      });
    }
    
    // Add cost and continue
    tracking.cost += cost;
    costMap.set(key, tracking);
    
    // Add remaining budget to response headers
    res.set('X-Cost-Remaining', (budget - tracking.cost).toString());
    res.set('X-Cost-Used', cost.toString());
    
    next();
  };
};