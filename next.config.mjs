/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingIncludes: {
    'app/api/**/route': [
      './node_modules/.prisma/client/**',
      './node_modules/@prisma/engines/**',
    ],
  },
};
export default nextConfig;
