/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#fff",
        secondary: "#4D6A6D",
        tertiary: "#000041",
      },
    },
  },
  plugins: [],
};
