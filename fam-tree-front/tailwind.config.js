module.exports = {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {
      colors: {
        'green-ftpro': '#4CC425',  // Votre couleur personnalisée originale
        'green-ftpro-h': '#3DA035',  // Une version légèrement plus foncée de green-ftpro
        'customGreen': 'rgba(76,196,37,1)',
      },
      backgroundImage: {
        'custom-gradient': 'linear-gradient(90deg, rgba(76,196,37,1) 0%, rgba(255,255,255,1) 100%)',
      },
    },
  },
  plugins: [],
}
