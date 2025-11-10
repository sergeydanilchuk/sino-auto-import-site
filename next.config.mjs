/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingIncludes: {
    '**/*': [
      './node_modules/.prisma/client/**',
      './node_modules/@prisma/engines/**',
    ],
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'blob.vercel-storage.com' },
    ],
  },
  experimental: {},
};

export default nextConfig;