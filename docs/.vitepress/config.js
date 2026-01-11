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
  ],

  themeConfig: {
    logo: '/logo.svg',
    siteTitle: 'HEIR API',
    
    nav: [
      { text: 'Guide', link: '/guide/introduction' },
      { text: 'API Reference', link: '/api/' },
      { text: 'SDKs', link: '/sdks/' },
      { text: 'Examples', link: '/examples/' },
      {
        text: 'v1.0.0',
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
      '/sdks/': [
        {
          text: 'SDKs & Libraries',
          items: [
            { text: 'Overview', link: '/sdks/' },
            { text: 'JavaScript/TypeScript', link: '/sdks/javascript' },
            { text: 'Python', link: '/sdks/python' },
            { text: 'Go', link: '/sdks/go' },
            { text: 'cURL', link: '/sdks/curl' }
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
      { icon: 'twitter', link: 'https://twitter.com/heirprotocol' },
      { icon: 'discord', link: 'https://discord.gg/heir' }
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

