/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        heading: ["Poppins", "sans-serif"],
        body: ["DM Sans", "sans-serif"],
      },
      colors: {
        neongreen: "#0FFF50", // Or '#39FF14'
      },
      screens: {
        xs: "480px",
      },
    },
  },
  plugins: [],
};
