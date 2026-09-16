import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { createLogger } from '../utils/logger.js';

const logger = createLogger('OpenAPI');

/**
 * OpenAPI/Swagger configuration for HEIR API
 */
const swaggerDefinition = {
  openapi: '3.0.3',
  info: {
    title: 'HEIR API',
    version: '1.0.0',
    description: `
# HEIR Headless API

The HEIR API provides programmatic access to the HEIR digital inheritance platform.
Build integrations, automate contract management, and access estate planning tools.

## Authentication

All API requests require authentication using an API key:

\`\`\`bash
# Via Authorization header (recommended)
curl -H "Authorization: Bearer heir_pk_xxx..." https://api.heir.es/api/v1/contracts/templates

# Via X-API-Key header
curl -H "X-API-Key: heir_pk_xxx..." https://api.heir.es/api/v1/contracts/templates

# Via query parameter (not recommended for production)
curl https://api.heir.es/api/v1/contracts/templates?api_key=heir_pk_xxx...
\`\`\`

## Rate Limiting

API requests are rate limited based on your tier:

| Tier | Requests/15min | Contract Gen | AI Chat |
|------|----------------|--------------|---------|
| Public | 100 | 10 | 5 |
| Partner | 1,000 | 100 | 50 |
| Internal | 10,000 | 1,000 | 200 |

Rate limit headers are included in all responses:
- \`X-RateLimit-Limit\`: Maximum requests allowed
- \`X-RateLimit-Remaining\`: Requests remaining in window
- \`X-RateLimit-Reset\`: When the window resets (ISO 8601)

## Webhooks

Subscribe to events for async notifications. Partner and Internal tiers support webhooks.

Events are signed using HMAC-SHA256. Verify signatures using your webhook secret.

## API Versioning

The current partner API version is \`v1\`. Partner/integrator HTTP is prefixed with \`/api/v1/\`.

Session-authenticated product mounts live under \`/api/*\` (estate home, interview, memoir, desk). Those are not a deprecated alias of v1 and are not being removed.
    `,
    contact: {
      name: 'HEIR Support',
      email: 'api@heir.es',
      url: 'https://heir.es/docs'
    },
    license: {
      name: 'Proprietary',
      url: 'https://heir.es/terms'
    },
    'x-logo': {
      url: 'https://heir.es/logo.png',
      altText: 'HEIR Logo'
    }
  },
  servers: [
    {
      url: 'https://api.heir.es/api/v1',
      description: 'Production API'
    },
    {
      url: 'https://staging-api.heir.es/api/v1',
      description: 'Staging API'
    },
    {
      url: 'http://localhost:3001/api/v1',
      description: 'Local development'
    }
  ],
  tags: [
    { name: 'API Keys', description: 'Manage API keys for programmatic access' },
    { name: 'Authentication', description: 'User authentication and session management' },
    { name: 'Contracts', description: 'Smart contract generation, compilation, and deployment' },
    { name: 'Vaults', description: 'Secure vault management for inheritance data' },
    { name: 'Legal', description: 'Legal document generation (wills, trusts, POA)' },
    { name: 'Payments', description: 'Subscription and payment management' },
    { name: 'Webhooks', description: 'Webhook subscription management' },
    { name: 'Advisors', description: 'Professional advisor network' },
    { name: 'Verification', description: 'Identity and ownership verification' },
    { name: 'Jurisdictions', description: 'Legal jurisdiction information' },
    { name: 'Chat', description: 'AI-powered estate planning assistant' }
  ],
  components: {
    securitySchemes: {
      apiKey: {
        type: 'apiKey',
        in: 'header',
        name: 'X-API-Key',
        description: 'API key for authentication (heir_pk_*, heir_pt_*, heir_sk_*)'
      },
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'JWT token for user session authentication'
      }
    },
    schemas: {
      // Standard response schemas
      SuccessResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          data: { type: 'object' },
          meta: {
            type: 'object',
            properties: {
              requestId: { type: 'string', example: 'req_abc123xyz' },
              timestamp: { type: 'string', format: 'date-time' }
            }
          }
        }
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          error: {
            type: 'object',
            properties: {
              code: { type: 'string', example: 'VALIDATION_ERROR' },
              message: { type: 'string' },
              details: { type: 'array', items: { type: 'object' } }
            }
          },
          meta: {
            type: 'object',
            properties: {
              requestId: { type: 'string' },
              timestamp: { type: 'string', format: 'date-time' }
            }
          }
        }
      },
      PaginatedResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          data: { type: 'array', items: { type: 'object' } },
          meta: {
            type: 'object',
            properties: {
              requestId: { type: 'string' },
              timestamp: { type: 'string', format: 'date-time' },
              pagination: {
                type: 'object',
                properties: {
                  page: { type: 'integer', example: 1 },
                  limit: { type: 'integer', example: 20 },
                  total: { type: 'integer', example: 150 },
                  pages: { type: 'integer', example: 8 },
                  hasNext: { type: 'boolean' },
                  hasPrev: { type: 'boolean' }
                }
              }
            }
          }
        }
      },
      
      // API Key schemas
      ApiKey: {
        type: 'object',
        properties: {
          id: { type: 'string', example: '507f1f77bcf86cd799439011' },
          keyPrefix: { type: 'string', example: 'heir_pk_abc123...' },
          name: { type: 'string', example: 'Production Key' },
          tier: { type: 'string', enum: ['public', 'partner', 'internal'] },
          scopes: { 
            type: 'array', 
            items: { type: 'string' },
            example: ['contracts', 'vaults:read']
          },
          status: { type: 'string', enum: ['active', 'revoked', 'expired', 'suspended'] },
          expiresAt: { type: 'string', format: 'date-time', nullable: true },
          createdAt: { type: 'string', format: 'date-time' }
        }
      },
      CreateApiKeyRequest: {
        type: 'object',
        required: ['name'],
        properties: {
          name: { type: 'string', maxLength: 100, example: 'My API Key' },
          scopes: { 
            type: 'array', 
            items: { type: 'string' },
            example: ['contracts:read', 'vaults:read']
          },
          expiresIn: { 
            type: 'integer', 
            description: 'Expiration in days (null for never)',
            example: 365
          },
          ipWhitelist: {
            type: 'array',
            items: { type: 'string' },
            example: ['192.168.1.1', '10.0.0.0/8']
          },
          webhookUrl: { type: 'string', format: 'uri' }
        }
      },
      
      // Contract schemas
      Contract: {
        type: 'object',
        properties: {
          address: { type: 'string', example: '0x1234...' },
          network: { type: 'string', example: 'ethereum' },
          type: { type: 'string', example: 'inheritance-vault' },
          status: { type: 'string', enum: ['pending', 'deployed', 'verified'] },
          txHash: { type: 'string' },
          blockNumber: { type: 'integer' },
          createdAt: { type: 'string', format: 'date-time' }
        }
      },
      GenerateContractRequest: {
        type: 'object',
        required: ['blockchain', 'ownerAddress', 'beneficiaries'],
        properties: {
          blockchain: { 
            type: 'string', 
            enum: ['evm', 'solana', 'ton'],
            example: 'evm'
          },
          ownerAddress: { type: 'string', example: '0x...' },
          beneficiaries: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                address: { type: 'string' },
                percentage: { type: 'number', minimum: 0, maximum: 100 }
              }
            }
          },
          inheritanceTemplate: { 
            type: 'string',
            enum: ['common-law', 'civil-law', 'islamic-mirth', 'custom']
          },
          deadMansSwitch: {
            type: 'object',
            properties: {
              enabled: { type: 'boolean' },
              intervalDays: { type: 'integer', minimum: 1 }
            }
          }
        }
      },
      
      // Webhook schemas
      Webhook: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          url: { type: 'string', format: 'uri' },
          events: { type: 'array', items: { type: 'string' } },
          status: { type: 'string', enum: ['active', 'paused', 'disabled', 'failed'] },
          stats: {
            type: 'object',
            properties: {
              totalDeliveries: { type: 'integer' },
              successfulDeliveries: { type: 'integer' },
              failedDeliveries: { type: 'integer' }
            }
          }
        }
      },
      WebhookEvent: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'evt_abc123' },
          type: { type: 'string', example: 'contract.deployed' },
          created: { type: 'integer', description: 'Unix timestamp' },
          data: { type: 'object' },
          apiVersion: { type: 'string', example: 'v1' }
        }
      }
    },
    responses: {
      BadRequest: {
        description: 'Invalid request parameters',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ErrorResponse' }
          }
        }
      },
      Unauthorized: {
        description: 'Missing or invalid authentication',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ErrorResponse' }
          }
        }
      },
      Forbidden: {
        description: 'Insufficient permissions',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ErrorResponse' }
          }
        }
      },
      NotFound: {
        description: 'Resource not found',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ErrorResponse' }
          }
        }
      },
      RateLimitExceeded: {
        description: 'Rate limit exceeded',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ErrorResponse' }
          }
        }
      }
    },
    parameters: {
      PageParam: {
        name: 'page',
        in: 'query',
        schema: { type: 'integer', minimum: 1, default: 1 },
        description: 'Page number for pagination'
      },
      LimitParam: {
        name: 'limit',
        in: 'query',
        schema: { type: 'integer', minimum: 1, maximum: 100, default: 20 },
        description: 'Number of items per page'
      }
    }
  },
  security: [
    { apiKey: [] }
  ]
};

// Swagger options
const swaggerOptions = {
  definition: swaggerDefinition,
  apis: [
    './server/routes/*.js',
    './server/docs/schemas/*.js'
  ]
};

// Generate OpenAPI specification
let openapiSpec = null;

export const getOpenApiSpec = () => {
  if (!openapiSpec) {
    try {
      openapiSpec = swaggerJsdoc(swaggerOptions);
      logger.info('OpenAPI specification generated');
    } catch (error) {
      logger.error('Failed to generate OpenAPI spec', { error: error.message });
      throw error;
    }
  }
  return openapiSpec;
};

// Swagger UI options
const swaggerUiOptions = {
  customCss: `
    .swagger-ui .topbar { display: none; }
    .swagger-ui .info { margin-top: 20px; }
    .swagger-ui .scheme-container { display: none; }
  `,
  customSiteTitle: 'HEIR API Documentation',
  customfavIcon: '/favicon.ico',
  swaggerOptions: {
    persistAuthorization: true,
    displayRequestDuration: true,
    filter: true,
    showExtensions: true,
    showCommonExtensions: true,
    docExpansion: 'list',
    defaultModelsExpandDepth: 2
  }
};

/**
 * Setup OpenAPI documentation routes
 */
export const setupOpenApiDocs = (app) => {
  try {
    const spec = getOpenApiSpec();
    
    // Serve OpenAPI JSON
    app.get('/api/docs/openapi.json', (req, res) => {
      res.json(spec);
    });
    
    // Serve Swagger UI
    app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(spec, swaggerUiOptions));
    
    // Redirect /docs to /api/docs
    app.get('/docs', (req, res) => res.redirect('/api/docs'));
    
    logger.startup('OpenAPI documentation available at /api/docs');
  } catch (error) {
    logger.error('Failed to setup OpenAPI docs', { error: error.message });
  }
};

export default { getOpenApiSpec, setupOpenApiDocs };

