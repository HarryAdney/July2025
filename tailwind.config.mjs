/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        'gold-accent': '#D4AF37',
      },
      fontFamily: {
        'display': ['Playfair Display', 'serif'],
      },
      screens: {
        'xl-nav': '1200px',
      },
    },
  },
  plugins: [],
}
