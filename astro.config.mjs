// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import cloudflare from '@astrojs/cloudflare';
import keystatic from '@keystatic/astro';
import markdoc from '@astrojs/markdoc';

export default defineConfig({
  site: 'https://trueleapinc.com',
  integrations: [react(), keystatic(), markdoc()],
  output: 'server',
  vite: {
    plugins: [tailwindcss()],
  },
  adapter: cloudflare({ platformProxy: { enabled: true } }),
});
