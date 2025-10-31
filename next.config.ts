import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  experimental: {
    // @ts-expect-error — отключаем turbopack, это допустимо
    turbo: false,
  },
}

export default nextConfig
