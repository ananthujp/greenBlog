module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
      extend: {
        fontFamily: {
            'pop': 'Poppins, Arial',
            'popxs': 'Poppins-Thin, Arial',
            'popxl': 'Poppins-Bold, Arial',
            
          },
        backgroundImage: {
            'logo':"url('./images/blogLogo.svg')",
            'bg':"url('./images/bg.svg')"
        }
      },
    },
    plugins: [],
  }