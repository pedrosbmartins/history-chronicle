/** @type {import('tailwindcss').Config} */

const randomLastTextLineEndWidth = [...new Array(81 - 30)].map((_, i) => `w-[${30 + i}%]`)

module.exports = {
  content: ['./src/**/*.{html,js,ts}', './public/**/*.{html,js,ts}'],
  theme: {
    extend: {}
  },
  safelist: [...randomLastTextLineEndWidth],
  plugins: []
}
