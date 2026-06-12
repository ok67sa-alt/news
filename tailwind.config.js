/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          red: '#9B1C1C',      // Deep crimson news accent
          dark: '#111111',     // Elegant body text
          border: '#e5e5e5',   // Newspaper column lines
          muted: '#555555',    // Bylines and captions
          bgMuted: '#f9f9f9',  // Subtle background highlight
        }
      },
      fontFamily: {
        headline: ['"Playfair Display"', 'serif'],
        body: ['"Source Serif Pro"', '"Source Serif 4"', 'serif'],
        ui: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
