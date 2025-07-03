/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['res.cloudinary.com', 'pbs.twimg.com', 'abs.twimg.com', 'images.unsplash.com', 'unavatar.io'],
  },
  
  // Optimize for Netlify deployment
  experimental: {
    serverComponentsExternalPackages: ['@supabase/supabase-js'],
  },
  
  // Ensure proper static file handling
  trailingSlash: false,
  
  // Optimize build output
  compress: true,
  
  // Enable SWC minification for better performance
  swcMinify: true,
}

module.exports = nextConfig 