/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "../../node_modules/react-tailwindcss-datepicker/dist/index.esm.js",
  ],

  theme: {
    extend: {
      fontFamily: {
        roboto: ["Roboto"],
      },
      boxShadow: {
        allxl:
          "20px 20px 25px -5px rgb(0 0 0 / 0.1), 8px 8px 10px -6px rgb(0 0 0 / 0.1)",
      },
      screens: {
        ipad: "1100px",
      },
    },
  },
  plugins: [
    // ...
    require("@tailwindcss/line-clamp"),
  ],
};
