import type { DefaultTheme } from 'vitepress'
import { defineConfig } from 'vitepress'
import { version } from '../../package.json'

const GUIDES: DefaultTheme.NavItemWithLink[] = [
  { text: 'Getting Started', link: '/guide/' },
  { text: 'Installation', link: '/guide/install' },
  { text: 'Basic Usage', link: '/guide/basic-usage' },
  { text: 'Configuration', link: '/guide/configuration' },
  { text: 'Log Levels', link: '/guide/log-levels' },
  { text: 'SSR vs CSR', link: '/guide/ssr-csr' },
  { text: 'Customization', link: '/guide/customization' },
  { text: 'Complete Customize Guide', link: '/guide/customize-guide' },
  { text: 'Best Practices', link: '/guide/best-practices' },
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
  { text: 'Feature Requests', link: '/request/features' },
  { text: 'Bug Reports', link: '/request/bugs' },
  { text: 'Contributing', link: '/request/contributing' },
  { text: 'Support', link: '/request/support' }
]

export default defineConfig({
  title: '🫧 Plip Logger',
  description: 'A delightful, colorful logging experience for modern applications',
  base: '/',
  cleanUrls: true,
    themeConfig: {    nav: [
      {
        text: 'Guide',
        items: [
          {
            items: GUIDES
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
      {
        '/': [
          {
            text: 'Guide',
            items: GUIDES
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
  },
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['meta', { name: 'theme-color', content: '#646cff' }],
    ['meta', { name: 'og:type', content: 'website' }],
    ['meta', { name: 'og:locale', content: 'en' }],
    ['meta', { name: 'og:site_name', content: 'Plip Logger' }],
    ['meta', { name: 'og:image', content: '/og-image.png' }]
  ]
})
