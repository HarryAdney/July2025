import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// import photostream from 'astro-photostream';

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind()], // Temporarily disabled photostream(),
  output: 'static',
  build: {
    assets: 'assets'
  },
  base: '/'
});