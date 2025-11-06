/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Кладём бинарники Prisma внутрь serverless-функций App Router (Next 16)
    outputFileTracingIncludes: {
      'app/api/**/route': [
        './node_modules/.prisma/client/**',
        './node_modules/@prisma/engines/**',
      ],
    },
  },
};
export default nextConfig;