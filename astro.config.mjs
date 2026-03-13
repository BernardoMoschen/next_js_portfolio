import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

const siteUrl = 'https://bernardomoschen.dev';
const siteDomain = 'bernardomoschen.dev';

export default defineConfig({
  site: siteUrl,
  output: 'server', // Use server mode for Vercel deployment
  adapter: vercel(), // Use Vercel adapter for deployment
  integrations: [
    react(),
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
    })
  ],
  build: {
    inlineStylesheets: 'auto',
  },
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom']
          }
        }
      }
    }
  },
  image: {
    domains: [siteDomain]
  },
  compressHTML: true,
  scopedStyleStrategy: 'where'
});