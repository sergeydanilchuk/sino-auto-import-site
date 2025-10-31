import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  // Автоматически отключаем Turbopack на Vercel
  experimental: process.env.VERCEL ? {} : { turbo: {} },
}

export default nextConfig
