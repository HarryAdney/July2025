import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// Temporarily disabled due to getImage() compatibility issues
// import photostream from 'astro-photostream';

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind()], // photostream() temporarily disabled
  output: 'static',
  build: {
    assets: 'assets'
  },
  base: '/'
});