import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

import photostream from 'astro-photostream';

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), photostream()],
  base: '/redesign/july2025',
});