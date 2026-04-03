/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: "#0f172a",
          accent: "#0ea5e9",
          soft: "#e0f2fe",
        },
      },
    },
  },
  plugins: [],
};
