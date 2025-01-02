/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',  // Pour générer une version statique
    basePath: '/scholar-search',  // Pour le bon fonctionnement sur GitHub Pages
    images: {
      unoptimized: true,  // Nécessaire pour le déploiement statique
    },
  }
  
  module.exports = nextConfig