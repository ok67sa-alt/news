/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./components_backend/**/*.{js,ts,jsx,tsx}",
    "./components_frontend/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#1E3A8A',     // Deep blue from Sudan News logo
          cyan: '#06D6D6',     // Cyan/turquoise from Sudan map
          red: '#DC2626',      // Red from "TODAY" text
          dark: '#0F172A',     // Dark slate
          border: '#E2E8F0',   // Light border
          muted: '#64748B',    // Muted text
          bgMuted: '#F8FAFC',  // Light background
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
};
