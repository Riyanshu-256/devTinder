/* eslint-disable no-undef */
/** @type {import('tailwindcss/types').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },

  plugins: [require("daisyui")],
  daisyui: {
    themes: ["light", "dark"],
  },
};
