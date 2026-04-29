import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images : {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8001",
        pathname: "/media/**"
      },
      {
        protocol: "https",
        hostname: "*.googleusercontent.com", 
        pathname: "/**"
      },
      {
        protocol: "https",
        hostname: "platform-lookaside.fbsbx.com", 
        pathname: "/**"
      },
      {
        protocol: "https",
        hostname: "my-airbnb-clone2.s3.eu-north-1.amazonaws.com", 
        pathname: "/**"
      },
    ],
    qualities: [75, 95]
  }
};

export default nextConfig;
