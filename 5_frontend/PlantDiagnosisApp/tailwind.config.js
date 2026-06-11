// tailwind.config.js
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2E7D32',
        'primary-light': '#4CAF50',
        'primary-dark': '#1B5E20',
        secondary: '#FF8F00',
        error: '#D32F2F',
        warning: '#FFA000',
        background: '#F5F5F5',
        surface: '#FFFFFF',
        'text-primary': '#212121',
        'text-secondary': '#757575',
        border: '#E0E0E0',
      },
    },
  },
  plugins: [],
};