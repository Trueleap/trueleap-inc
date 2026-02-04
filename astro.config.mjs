// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  site: 'https://trueleapinc.com',
  integrations: [react()],
  output: 'static',
  vite: {
    plugins: [tailwindcss()],
  },
  adapter: cloudflare(),
});