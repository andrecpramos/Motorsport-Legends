/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Use rgb() + <alpha-value> so opacity modifiers work:
        // e.g. bg-background/75 → background-color: rgb(240 237 230 / 0.75)
        background: 'rgb(var(--color-background) / <alpha-value>)',
        surface:    'rgb(var(--color-surface) / <alpha-value>)',
        accent:     'rgb(var(--color-accent) / <alpha-value>)',
        ink:        'rgb(var(--color-text) / <alpha-value>)',
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        body:    ['"EB Garamond"', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}
