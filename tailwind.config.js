module.exports = {
  content: [
    "./views/**/*.{ejs,js}",
  ],
  theme: {
    extend: {
      colors: {
        moss: {
          DEFAULT: "#3f5f4a",
          dark: "#2f4737",
        },
        ink: "#1d2a24",
        muted: "#64706a",
        line: "#d9dfdb",
        soft: "#f3f6f4",
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
      },
    },
  },
  plugins: [],
}
