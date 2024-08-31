/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html, ts}",
    "./node_modules/flowbite/**/*.js"
  ],
  theme: {
    extend: {},
    fontFamily:{
      manrope: ['Gilmer Regular', 'sans-serif'],
      inter: ['Inter', 'sans-serif'],
      gilmer: ['Gilmer Regular', 'sans-serif']

    },
    colors:{
      darkGrey: "#1f2630",
      grey: "#363d4a",
      lightGrey: "#c5d7fc",
      white: "#F5F6FA",
      yellow: "#FBC531",
      deepYellow: "#d1a42a",
      lightYellow: "#FBC531",
      deepGreen: "#44BD32",
      lightGreen: "#4CD137",
      deepRed: "#C23616",
      lightRed: "#E84118",
      deepBlue: "#192A56",
      lightBlue: "#273C75",
    },
    screens: {
      xs: "480px",
      ss: "620px",
      sm: "768px",
      md: "1060px",
      lg: "1200px",
      xl: "1700px",
    }
  },
  plugins: [
    require('flowbite/plugin') 
  ],
}

