export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f1f8ff",
          100: "#dceeff",
          200: "#b5dcff",
          300: "#7fc3ff",
          400: "#3ea0ff",
          500: "#1179f4",
          600: "#0a5fd0",
          700: "#0b4ca8",
          800: "#103f87",
          900: "#143870"
        }
      },
      fontFamily: {
        display: ["Poppins", "sans-serif"],
        body: ["Manrope", "sans-serif"]
      },
      boxShadow: {
        glow: "0 20px 60px rgba(17, 121, 244, 0.25)"
      },
      backgroundImage: {
        mesh:
          "radial-gradient(circle at 20% 20%, rgba(17,121,244,0.35), transparent 30%), radial-gradient(circle at 80% 0%, rgba(34,197,94,0.28), transparent 25%), radial-gradient(circle at 50% 80%, rgba(251,191,36,0.18), transparent 30%)"
      }
    }
  },
  plugins: []
};
