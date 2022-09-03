const _ = require("lodash");

const radixColorToTW = (color) => {
  const colors = [];
  for (let i of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]) {
    colors.push([i, `var(--${color}${i})`]);
  }
  return _.fromPairs(colors);
};
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: radixColorToTW("violet"),
        secondary: radixColorToTW("crimson"),
        gray: radixColorToTW("mauve"),
        tomato: radixColorToTW("tomato"),
        red: radixColorToTW("red"),
        crimson: radixColorToTW("crimson"),
        pink: radixColorToTW("pink"),
        plum: radixColorToTW("plum"),
        purple: radixColorToTW("purple"),
        violet: radixColorToTW("violet"),
        indigo: radixColorToTW("indigo"),
        blue: radixColorToTW("blue"),
        cyan: radixColorToTW("cyan"),
        teal: radixColorToTW("teal"),
        green: radixColorToTW("green"),
        grass: radixColorToTW("grass"),
        orange: radixColorToTW("orange"),
        brown: radixColorToTW("brown"),
        sky: radixColorToTW("sky"),
        mint: radixColorToTW("mint"),
        lime: radixColorToTW("lime"),
        yellow: radixColorToTW("yellow"),
        amber: radixColorToTW("amber"),

        correct: radixColorToTW("correct"),
        semicorrect: radixColorToTW("semicorrect"),
      },
    },
  },
  plugins: [],
};
