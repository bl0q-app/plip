import type { DefaultTheme } from 'vitepress'
import { defineConfig } from 'vitepress'
import { version } from '../../packages/npm/package.json'

const GETTING_STARTED: DefaultTheme.NavItemWithLink[] = [
  { text: 'Introduction', link: '/introduction' },
  { text: 'Installation', link: '/guide/install' },
  { text: 'Getting Started', link: '/guide/' },
  { text: 'Basic Usage', link: '/guide/basic-usage' }
]

const CORE_GUIDES: DefaultTheme.NavItemWithLink[] = [
  { text: 'Configuration', link: '/guide/configuration' },
  { text: 'Log Levels', link: '/guide/log-levels' },
  { text: 'SSR vs CSR', link: '/guide/ssr-csr' },
  { text: 'Best Practices', link: '/guide/best-practices' }
]

const ADVANCED_GUIDES: DefaultTheme.NavItemWithLink[] = [
  { text: 'Customization Guide', link: '/guide/customization-guide' },
  { text: 'Compatibility', link: '/guide/compatibility' }
]

const EXAMPLES: DefaultTheme.NavItemWithLink[] = [
  { text: 'Basic Examples', link: '/examples/' },
  { text: 'Custom Loggers', link: '/examples/custom-loggers' },
  { text: 'Integration Examples', link: '/examples/integration' },
  { text: 'Production Setup', link: '/examples/production' },
  { text: 'SSR/CSR Quickstart', link: '/examples/ssr-csr-quickstart' }
]

const API: DefaultTheme.NavItemWithLink[] = [
  { text: 'Logger API', link: '/api/logger' },
  { text: 'Configuration API', link: '/api/configuration' },
  { text: 'TypeScript Types', link: '/api/types' }
]

const INTEGRATIONS: DefaultTheme.NavItemWithLink[] = [
  { text: 'Express.js', link: '/integration/express' },
  { text: 'Fastify', link: '/integration/fastify' },
  { text: 'Next.js', link: '/integration/nextjs' },
  { text: 'NestJS', link: '/integration/nestjs' },
  { text: 'Database Integration', link: '/integration/database' },
  { text: 'Testing', link: '/integration/testing' },
  { text: 'Docker & CI/CD', link: '/integration/docker' }
]

const REFERENCES: DefaultTheme.NavItemWithLink[] = [
  
  { text: 'Environment Variables', link: '/references/environment' },
  { text: 'Error Codes', link: '/references/errors' }
]

const REQUEST: DefaultTheme.NavItemWithLink[] = [
  { text: 'Roadmap & Features', link: '/request/roadmap' },
  { text: 'Feature Requests', link: '/request/features' },
  { text: 'Bug Reports', link: '/request/bugs' },
  { text: 'Contributing', link: '/request/contributing' },
  { text: 'Support', link: '/request/support' }
]

export default defineConfig({
  title: 'Plip Logger',
  description: 'A beautiful yet powerful logging experience for modern applications.',
  base: '/',
  cleanUrls: true,
  lastUpdated: true,
  sitemap: {
    hostname: 'https://plip-logger.vercel.app'
  },
    themeConfig: {    nav: [
      {
        text: 'Guide',
        items: [
          {
            text: 'Getting Started',
            items: GETTING_STARTED
          },
          {
            text: 'Core Features',
            items: CORE_GUIDES
          },
          {
            text: 'Advanced',
            items: ADVANCED_GUIDES
          }
        ]
      },
      {
        text: 'Examples',
        items: EXAMPLES
      },
      {
        text: 'API',
        items: API
      },
      {
        text: 'Integrations',
        items: INTEGRATIONS
      },
      {
        text: 'Env & Errors',
        items: REFERENCES
      },
      {
        text: 'Community',
        items: REQUEST
      },
      {
        text: `v${version}`,
        items: [
          { text: `v${version} (current)`, link: '/' },
          { text: 'Release Notes', link: 'https://github.com/ru-dr/plip/releases' },
          { text: 'Contributing', link: '/request/contributing' }
        ]
      }
    ],sidebar: Object.assign(
      {},
      {        '/': [
          {
            text: 'Getting Started',
            items: GETTING_STARTED
          },
          {
            text: 'Core Features',
            items: CORE_GUIDES
          },
          {
            text: 'Advanced',
            items: ADVANCED_GUIDES
          },
          {
            text: 'Examples',
            items: EXAMPLES
          },
          {
            text: 'API Reference',
            items: API
          },
          {
            text: 'Integrations',
            items: INTEGRATIONS
          },
          {
            text: 'Environment & Errors',
            items: REFERENCES
          },
          {
            text: 'Community',
            items: REQUEST
          }
        ]
      }
    ),

    socialLinks: [
      { icon: 'github', link: 'https://github.com/ru-dr/plip' },
      { icon: 'npm', link: 'https://www.npmjs.com/package/@ru-dr/plip' }
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2025 ru-dr'
    },

    search: {
      provider: 'local'
    },

    editLink: {
      pattern: 'https://github.com/ru-dr/plip/edit/main/docs/:path',
      text: 'Suggest changes to this page'
    }
  },  head: [
    ['meta', { name: 'theme-color', content: '#646cff' }],
    ['link', { rel: 'icon', href: '/logo.svg', type: 'image/svg+xml' }],
    ['meta', { name: 'author', content: 'ru-dr' }],
    ['meta', { property: 'og:title', content: 'Plip - Beautiful Logging Experience' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:locale', content: 'en' }],
    ['meta', { property: 'og:site_name', content: 'Plip Logger' }],
    ['meta', { property: 'og:description', content: 'A beautiful yet powerful logging experience for modern applications.' }],
    ['meta', { property: 'og:image', content: 'https://plip-logger.vercel.app/og-image.png' }],
    ['meta', { property: 'og:url', content: 'https://plip-logger.vercel.app' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:title', content: 'Plip - Beautiful Logging Experience' }],
    ['meta', { name: 'twitter:description', content: 'A beautiful yet powerful logging experience for modern applications.' }],
    ['meta', { name: 'twitter:image', content: 'https://plip-logger.vercel.app/og-image.png' }],
    ['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1.0, viewport-fit=cover' }]
  ]
})
