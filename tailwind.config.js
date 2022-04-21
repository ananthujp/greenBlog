module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        pop: "Poppins, Arial",
        popxs: "Poppins-Thin, Arial",
        popxl: "Poppins-Bold, Arial",
        poplg: "Poppins-SemiBold, Arial",
      },
      fontSize: {
        xxs: "0.6rem",
      },
      backgroundImage: {
        logo: "url('./images/blogLogo.svg')",
        bg: "url('./images/bg.svg')",
      },
    },
  },
  plugins: [],
};
