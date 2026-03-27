/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#000000",
        "primary-dark": "#111111",
        secondary: "#333333",
        accent: "#666666",
        background: "#FFFFFF",
        surface: "#FFFFFF",
      },
      fontFamily: {
        sans: ["Outfit", "sans-serif"],
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      }
    },
  },
  plugins: [],
};
