/** @type {import('tailwindcss').Config} */

const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      backgroundColor: {
        'primary': '#92D36E',
        'secondary': '#f7f6f6',
        'third': "#ebebeb",
      },
      colors: {
        gray: {
          'normal': '#ebebeb',
          'dark': '#cdcdcd',
          'light': '#f7f6f6',
          'darker': '#7a7a7a',
        },
        green: {
          'normal': '#92D36E',
          'light': '#f1f8e9',
        },
        dark: {
          green: {
            "normal": "#547e26",
            "light": '#283411',
          },
          "default": "#181a1b",
          "border": "#35393b",
          "text": "#ffffff",
          "secondary": "#242526",
          "third": "#3a3b3c",
        }
      }
    },
  },
  plugins: [],
});
