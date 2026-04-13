import daisyui from 'daisyui';

export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/typography'),
    daisyui,
  ],
  daisyui: {
    themes: 'all',
    logs: false,
  },
}
