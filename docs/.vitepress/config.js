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
    logo: '/logo.png',
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

