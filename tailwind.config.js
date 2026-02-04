/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.{html,js}", "./src/**/*.{html,js}", './index.html', // Ajoutez cette ligne
    './script.js', // Ajoutez cette ligne
    './pages/**/*.html', ],
  theme: {
    extend: {fontFamily: {
        sans: ['Inter', 'sans-serif'], // Remplace la font-sans par défaut
      },
    
  },
  },
  plugins: [],
}

