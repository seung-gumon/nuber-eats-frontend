const colors = require('tailwindcss/colors')



module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors : {
        lime : colors.lime,
        'light-blue' : colors.lightBlue
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
