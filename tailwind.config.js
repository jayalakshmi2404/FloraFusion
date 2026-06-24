/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{svelte,js,ts}',
  ],
  theme: {
    extend: {
      colors: {
        rose: {
          blush: '#fdf0f5',
          mid:   '#d4a0b8',
          deep:  '#7a3d5e',
        },
        flora: {
          dark:  '#2d0f23',
          plum:  '#3d1a2e',
          gold:  '#c2856a',
          lilac: '#b48ea8',
        },
      },
      fontFamily: {
        serif: ['Georgia', 'serif'],
        sans:  ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
