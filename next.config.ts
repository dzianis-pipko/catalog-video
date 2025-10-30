import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
 reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placeholdit.com',
      },
    ],
    dangerouslyAllowSVG: true,
  },
};

export default nextConfig;
