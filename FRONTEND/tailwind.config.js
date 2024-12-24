/** @type {import('tailwindcss').Config} */

//const colors = require("tailwindcss/colors");
import colors from "tailwindcss/colors";

module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        EDEEEE: "#EDEEEE",
        gray585151: "#585151",
        gray818181: "#818181",
        gray9E9E9E: "#9E9E9E",
        grayEBEBEB: "#EBEBEB",
        blue7580DB: "#7580DB",
        blueD0DDF2: "#D0DDF2",
      },
      height: {
        50: "50px", // 예를 들어, 7.5rem은 실제로는 120px에 해당할 수 있습니다.
        60: "60px",
        150: "150px", // 'h-150'로 150px 높이 사용 가능
        120: "120px", // 'h-120'로 120px 높이 사용 가능
        180: "180px", // 'h-120'로 120px 높이 사용 가능
      },
      fontSize: {
        xxs: "0.5rem", // 예시로 0.5rem을 xxs로 추가
      },
      width: {
        50: "50px", // 예를 들어, 7.5rem은 실제로는 120px에 해당할 수 있습니다.
        30: "7.5rem", // 예를 들어, 7.5rem은 실제로는 120px에 해당할 수 있습니다.
      },
    },
  },
  plugins: [],
};
