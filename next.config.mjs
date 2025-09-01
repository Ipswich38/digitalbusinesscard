/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['@prisma/client', 'bcryptjs'],
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['localhost', 'lh3.googleusercontent.com', 'media.licdn.com'],
    unoptimized: process.env.NODE_ENV === 'development',
  },
  // Enable standalone output for Docker
  output: process.env.DOCKER_BUILD === 'true' ? 'standalone' : undefined,
  // Enable PWA features
  headers: async () => [
    {
      source: '/sw.js',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=0, must-revalidate',
        },
      ],
    },
    {
      source: '/manifest.json',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=604800, immutable',
        },
      ],
    },
  ],
}

export default nextConfig
