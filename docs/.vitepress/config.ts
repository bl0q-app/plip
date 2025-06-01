import type { DefaultTheme } from 'vitepress'
import { defineConfig } from 'vitepress'
import { version } from '../../package.json'

const GUIDES: DefaultTheme.NavItemWithLink[] = [
  { text: 'Getting Started', link: '/guide/' },
  { text: 'Installation', link: '/guide/install' },
  { text: 'Basic Usage', link: '/guide/basic-usage' },
  { text: 'Configuration', link: '/guide/configuration' },
  { text: 'Log Levels', link: '/guide/log-levels' },
  { text: 'Best Practices', link: '/guide/best-practices' },
  { text: 'Compatibility', link: '/guide/compatibility' },
  { text: 'Customization', link: '/guide/customization' }
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
  { text: 'Logger API', link: '/references/logger' },
  { text: 'Configuration API', link: '/references/configuration' },
  { text: 'TypeScript Types', link: '/references/types' },
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
  base: '/plip/',
  cleanUrls: true,
    themeConfig: {
    nav: [
      {
        text: 'Guide',
        items: [
          {
            items: GUIDES
          }
        ]
      },
      {
        text: 'Integrations',
        items: INTEGRATIONS
      },
      {
        text: 'References',
        items: REFERENCES
      },
      {
        text: 'Request',
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
    ],

    sidebar: Object.assign(
      {},
      {
        '/': [
          {
            text: 'Guide',
            items: GUIDES
          },
          {
            text: 'Integrations',
            items: INTEGRATIONS
          },
          {
            text: 'References',
            items: REFERENCES
          },
          {
            text: 'Request',
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
    ['link', { rel: 'icon', href: '/plip/favicon.ico' }],
    ['meta', { name: 'theme-color', content: '#646cff' }],
    ['meta', { name: 'og:type', content: 'website' }],
    ['meta', { name: 'og:locale', content: 'en' }],
    ['meta', { name: 'og:site_name', content: 'Plip Logger' }],
    ['meta', { name: 'og:image', content: '/plip/og-image.png' }]
  ]
})
