import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  ...(process.env.NODE_ENV === 'development' 
    ? {} 
    : {
        output: 'export',
        basePath: '/llm-cost-estimator',
        assetPrefix: '/llm-cost-estimator',
        distDir: 'docs',
      }
  ),
  webpack(config) {
    config.module.rules.push({
      test: /\.csv$/,
      use: [
        {
          loader: 'raw-loader',
        }
      ],
    });
    return config;
  },
};

export default nextConfig;
