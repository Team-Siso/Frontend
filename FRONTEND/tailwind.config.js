/** @type {import('tailwindcss').Config} */

const colors = require("tailwindcss/colors");

module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        EDEEEE: "#EDEEEE",
        585151: "#585151",
        818181: "#818181",
      },
      fontSize: {
        xxs: "0.5rem", // 예시로 0.5rem을 xxs로 추가
      },
    },
  },
  plugins: [],
};
