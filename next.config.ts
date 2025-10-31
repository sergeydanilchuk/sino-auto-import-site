import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Turbopack отключать не нужно — Next сам выберет Webpack,
  // если нет ключа "turbo" или других экспериментальных опций.
  webpack: (config) => {
    return config;
  },
};

export default nextConfig;
