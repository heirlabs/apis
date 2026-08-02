import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'HEIR API',
  description: 'Documentation for the HEIR Protocol Headless API',
  
  // Ignore external and planned links
  ignoreDeadLinks: [
    /^https?:\/\//, // All external links
    /^mailto:/, // Email links
  ],
  
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    ['meta', { name: 'theme-color', content: '#6366f1' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: 'HEIR API Documentation' }],
    ['meta', { property: 'og:description', content: 'Build on the HEIR Protocol - Digital inheritance infrastructure' }],
    ['meta', { property: 'og:url', content: 'https://docs.heir.es' }],
    [
      'script',
      { type: 'application/ld+json' },
      JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'HEIR',
        applicationCategory: 'FinanceApplication',
        operatingSystem: 'Web',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD', description: 'Free developer tier; paid packs and plans available' },
        featureList: [
          'Smart Contract Generation',
          'Legal Documents',
          'Multi-Chain Support',
          '11 Legal Frameworks',
          'Dead Man\'s Switch',
          'API Access',
          'Heirlooms metering',
          'Weekly Protection credits'
        ],
        url: 'https://docs.heir.es'
      })
    ],
  ],

  themeConfig: {
    logo: '/logo.png',
    siteTitle: 'HEIR API',
    
    nav: [
      { text: 'Guide', link: '/guide/introduction' },
      { text: 'Elements', link: '/elements/' },
      { text: 'API Reference', link: '/api/' },
      { text: 'Legal Frameworks', link: '/legal-frameworks/' },
      { text: 'Tutorials', link: '/tutorials/' },
      { text: 'Pricing', link: '/pricing/' },
      { text: 'SDKs', link: '/sdks/' },
      { text: 'MCP', link: '/mcp/' },
      { text: 'Examples', link: '/examples/' },
      {
        text: 'v1.0',
        items: [
          { text: 'Changelog', link: '/changelog' },
          { text: 'API Status', link: 'https://status.heir.es' }
        ]
      }
    ],

    sidebar: {
      '/guide/': [
        {
          text: 'Getting Started',
          items: [
            { text: 'Introduction', link: '/guide/introduction' },
            { text: 'Quick Start', link: '/guide/quickstart' },
            { text: 'Authentication', link: '/guide/authentication' },
            { text: 'Rate Limits', link: '/guide/rate-limits' },
            { text: 'Error Handling', link: '/guide/errors' }
          ]
        },
        {
          text: 'Core Concepts',
          items: [
            { text: 'API Keys', link: '/guide/api-keys' },
            { text: 'Contracts', link: '/guide/contracts' },
            { text: 'Memoir', link: '/guide/memoir' },
            { text: 'Webhooks', link: '/guide/webhooks' },
            { text: 'Embedding', link: '/guide/embedding' }
          ]
        },
        {
          text: 'Advanced',
          items: [
            { text: 'Pagination', link: '/guide/pagination' },
            { text: 'Versioning', link: '/guide/versioning' },
            { text: 'Security Best Practices', link: '/guide/security' }
          ]
        }
      ],
      '/api/': [
        {
          text: 'API Reference',
          items: [
            { text: 'Overview', link: '/api/' },
            { text: 'Authentication', link: '/api/authentication' },
          ]
        },
        {
          text: 'Endpoints',
          items: [
            { text: 'API Keys', link: '/api/api-keys' },
            { text: 'Contracts', link: '/api/contracts' },
            { text: 'Webhooks', link: '/api/webhooks' },
            { text: 'Legal Documents', link: '/api/legal' },
            { text: 'Memoir', link: '/api/memoir' },
            { text: 'Memoir Credits', link: '/api/memoir-credits' },
            { text: 'Heirlooms', link: '/api/heirlooms' },
            { text: 'Embed', link: '/api/embed' }
          ]
        },
        {
          text: 'Models',
          items: [
            { text: 'ApiKey', link: '/api/models/api-key' },
            { text: 'Contract', link: '/api/models/contract' },
            { text: 'Webhook', link: '/api/models/webhook' },
            { text: 'WebhookEvent', link: '/api/models/webhook-event' }
          ]
        }
      ],
      '/elements/': [
        {
          text: 'Desk Elements',
          items: [
            { text: 'Overview', link: '/elements/' },
            { text: 'Getting started', link: '/elements/getting-started' },
            { text: 'Bridge API', link: '/elements/api' },
            { text: 'Manifest', link: '/elements/manifest' },
            { text: 'CLI', link: '/elements/cli' }
          ]
        }
      ],
      '/sdks/': [
        {
          text: 'SDKs & Libraries',
          items: [
            { text: 'Overview', link: '/sdks/' },
            { text: 'Element SDK & CLI', link: '/elements/' },
            { text: 'JavaScript/TypeScript', link: '/sdks/javascript' },
            { text: 'Python', link: '/sdks/python' },
            { text: 'Go', link: '/sdks/go' },
            { text: 'cURL', link: '/sdks/curl' }
          ]
        }
      ],
      '/legal-frameworks/': [
        {
          text: 'Legal Frameworks',
          items: [
            { text: 'Overview', link: '/legal-frameworks/' },
            { text: 'Common Law', link: '/legal-frameworks/common-law' },
            { text: 'Civil Law', link: '/legal-frameworks/civil-law' },
            { text: 'Islamic Law', link: '/legal-frameworks/islamic/' },
            { text: 'Jewish Law', link: '/legal-frameworks/jewish' },
            { text: 'Hindu Law', link: '/legal-frameworks/hindu' },
            { text: 'Chinese Law', link: '/legal-frameworks/chinese' },
            { text: 'Japanese Law', link: '/legal-frameworks/japanese' },
            { text: 'Christian Law', link: '/legal-frameworks/christian' },
            { text: 'African Customary', link: '/legal-frameworks/african-customary' },
            { text: 'Indigenous', link: '/legal-frameworks/indigenous' },
            { text: 'Secular/Custom', link: '/legal-frameworks/custom' }
          ]
        }
      ],
      '/jurisdictions/': [
        {
          text: 'Jurisdictions',
          items: [
            { text: 'Overview', link: '/jurisdictions/' },
            { text: 'North America', link: '/jurisdictions/by-region/north-america' },
            { text: 'Europe', link: '/jurisdictions/by-region/europe' },
            { text: 'Middle East', link: '/jurisdictions/by-region/middle-east' },
            { text: 'Asia Pacific', link: '/jurisdictions/by-region/asia-pacific' },
            { text: 'Latin America', link: '/jurisdictions/by-region/latin-america' },
            { text: 'Africa', link: '/jurisdictions/by-region/africa' }
          ]
        }
      ],
      '/tutorials/': [
        {
          text: 'Tutorials',
          items: [
            { text: 'Overview', link: '/tutorials/' },
            { text: 'Quickstart: Individual', link: '/tutorials/quickstart/individual' },
            { text: 'Quickstart: Professional', link: '/tutorials/quickstart/professional' },
            { text: 'Quickstart: Developer', link: '/tutorials/quickstart/developer' },
            { text: 'Crypto-Only Estate', link: '/tutorials/use-cases/crypto-only-estate' },
            { text: 'Mixed Estate', link: '/tutorials/use-cases/mixed-estate' },
            { text: 'Islamic-Compliant', link: '/tutorials/use-cases/islamic-compliant' },
            { text: 'Business Succession', link: '/tutorials/use-cases/business-succession' },
            { text: 'International Estate', link: '/tutorials/use-cases/international-estate' },
            { text: 'Family with Minors', link: '/tutorials/use-cases/family-with-minors' }
          ]
        }
      ],
      '/pricing/': [
        {
          text: 'Billing & credits',
          items: [
            { text: 'Overview', link: '/pricing/' },
            { text: 'Product packs', link: '/pricing/plans' },
            { text: 'API tiers', link: '/pricing/api-tiers' },
            { text: 'Comparison', link: '/pricing/comparison' }
          ]
        }
      ],
      '/security/': [
        {
          text: 'Security',
          items: [
            { text: 'Overview', link: '/security/' },
            { text: 'Architecture', link: '/security/architecture' },
            { text: 'Encryption', link: '/security/encryption' },
            { text: 'Smart Contract Security', link: '/security/smart-contract-security' },
            { text: 'GDPR', link: '/security/compliance/gdpr' },
            { text: 'CCPA', link: '/security/compliance/ccpa' },
            { text: 'Financial Regulations', link: '/security/compliance/financial-regs' },
            { text: 'Best Practices', link: '/security/best-practices' }
          ]
        }
      ],
      '/professionals/': [
        {
          text: 'Professionals',
          items: [
            { text: 'Overview', link: '/professionals/' },
            { text: 'Certification', link: '/professionals/certification' },
            { text: 'VIP Copilot', link: '/professionals/copilot' },
            { text: 'Advisor Dashboard', link: '/professionals/dashboard' },
            { text: 'Lead Management', link: '/professionals/leads' },
            { text: 'Credential Verification', link: '/professionals/credential-verification' }
          ]
        }
      ],
      '/resources/': [
        {
          text: 'Resources',
          items: [
            { text: 'Glossary', link: '/resources/glossary' },
            { text: 'FAQ', link: '/resources/faq' },
            { text: 'Changelog', link: '/resources/changelog' }
          ]
        }
      ],
      '/mcp/': [
        {
          text: 'Model Context Protocol',
          items: [
            { text: 'Overview', link: '/mcp/' },
            { text: 'Available Tools', link: '/mcp/tools' },
            { text: 'Authentication', link: '/mcp/authentication' }
          ]
        },
        {
          text: 'IDE Setup',
          items: [
            { text: 'Cursor', link: '/mcp/cursor' },
            { text: 'VS Code', link: '/mcp/vscode' },
            { text: 'Claude Desktop', link: '/mcp/claude' }
          ]
        }
      ],
      '/examples/': [
        {
          text: 'Examples',
          items: [
            { text: 'Overview', link: '/examples/' },
            { text: 'Generate Contract', link: '/examples/generate-contract' },
            { text: 'Embed Wizard', link: '/examples/embed-wizard' },
            { text: 'Webhook Integration', link: '/examples/webhook-integration' },
            { text: 'Full Application', link: '/examples/full-application' }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/heirlabs/apis' },
      { icon: 'x', link: 'https://x.com/heir_es' },
      { 
        icon: {
          svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/></svg>'
        },
        link: 'https://t.me/heir_es',
        ariaLabel: 'Telegram'
      }
    ],

    editLink: {
      pattern: 'https://github.com/heirlabs/apis/edit/main/docs/:path',
      text: 'Edit this page on GitHub'
    },

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024-present HEIR Labs'
    },

    search: {
      provider: 'local'
    },

    carbonAds: undefined
  },

  markdown: {
    lineNumbers: true,
    theme: {
      light: 'github-light',
      dark: 'github-dark'
    }
  },

  vite: {
    define: {
      __VUE_OPTIONS_API__: false
    }
  }
})

