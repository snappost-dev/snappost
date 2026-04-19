import daisyui from 'daisyui';

export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {},
  },
  safelist: [
    { pattern: /data-theme/ },
  ],
  plugins: [
    require('@tailwindcss/typography'),
    daisyui,
  ],
  daisyui: {
    themes: [
      'light', 'dark', 'corporate', 'nord', 'business', 'winter',
      'cupcake', 'emerald', 'lofi', 'dracula', 'night', 'coffee',
      'synthwave', 'cyberpunk', 'retro', 'valentine', 'halloween',
      'garden', 'forest', 'aqua', 'pastel', 'fantasy', 'wireframe',
      'black', 'luxury', 'cmyk', 'autumn', 'acid', 'lemonade', 'sunset',
    ],
    logs: false,
  },
}
