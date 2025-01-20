/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      domains: [
        'instagram.fmaa3-2.fna.fbcdn.net',
        'instagram.com',
        'scontent.cdninstagram.com',
        'cdninstagram.com'
      ],
      remotePatterns: [
        {
          protocol: 'https',
          hostname: '**.fbcdn.net',
          pathname: '/**',
        },
        {
          protocol: 'https',
          hostname: '**.instagram.com',
          pathname: '/**',
        }
      ]
    },
  }
  
  export default nextConfig
