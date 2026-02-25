/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,ts,tsx}', './src/components/**/*.{js,ts,tsx}', './src/screens/**/*.{js,ts,tsx}'],

  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: { 
        primary: '#50b13e',
        accent: '#a42615',
        background: '#F5F5F5',
        textPrimary: '#212121',
        textSecondary: '#757575',
      },
    },
  },
  plugins: [],
};
