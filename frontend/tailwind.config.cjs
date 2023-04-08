/** @type {import('tailwindcss').Config} */
const config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}", "./node_modules/flowbite/**/*.js"],
  theme: {
    extend: {
      fontFamily : {
        spacegrostesk: ['Space Grotesk'],
        metropolis: ['Metropolis']
      },
    },
  },
  plugins: [require("flowbite/plugin")],
};

module.exports = config;
