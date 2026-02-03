/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.{html,js}", "./src/**/*.{html,js}"],
  theme: {
    extend: {fontFamily: {
        sans: ['Inter', 'sans-serif'], // Remplace la font-sans par défaut
      },
    
  },
  },
  plugins: [],
}

