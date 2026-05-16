/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f5fa',
          100: '#e1ebf6',
          500: '#1b4d82',
          600: '#153b64',
          700: '#0f2946',
        },
        accent: {
          500: '#fbb117',
          600: '#d9940b',
        },
        secondary: '#1e293b'
      }
    },
  },
  plugins: [],
}
