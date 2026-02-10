// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import cloudflare from '@astrojs/cloudflare';

const DRAFT_MODE = process.env.DRAFT_MODE === 'true';

export default defineConfig({
  site: 'https://trueleapinc.com',
  integrations: [react()],
  // Customer site: static (pages prerendered by default, API routes can opt out)
  // Preview site: server (all pages SSR for live draft content)
  output: DRAFT_MODE ? 'server' : 'static',
  vite: {
    plugins: [tailwindcss()],
  },
  adapter: cloudflare({
    platformProxy: { enabled: true },
    imageService: 'compile',
  }),
});
