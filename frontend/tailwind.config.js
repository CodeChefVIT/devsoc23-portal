/** @type {import('tailwindcss').Config} */
const config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily : {
        spacegrostesk: ['Space Grotesk'],
        metropolis: ['Metropolis']
      },
    },
    screens: {
      'xl': {'max': '1400px'},
    }
  },
  plugins: [require('@tailwindcss/forms')],
};

module.exports = config;
