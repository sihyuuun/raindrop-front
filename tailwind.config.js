/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        /* 애니메이션 키프레임... */
      },
      animation: {
        /* 애니메이션... */
      },
      screens: {
        sm: "431px", // 모바일 기준점: 430px 초과 = 모바일 아님
        // 기타 기존 브레이크포인트들 (md, lg, xl 등)
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
