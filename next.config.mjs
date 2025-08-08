/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname:"scontent.cdninstagram.com"
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/dashboard',
        permanent: false,
        has: [
          {
            type: 'cookie',
            key: '__session',
          },
        ],
      },
    ]
  },
}

export default nextConfig
