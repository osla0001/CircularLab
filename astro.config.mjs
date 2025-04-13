// @ts-check
import { defineConfig } from 'astro/config';

import netlify from '@astrojs/netlify';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  adapter: netlify(),
  integrations: [react()]
});