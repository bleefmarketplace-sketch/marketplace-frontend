import type { NextConfig } from "next";

const nextConfig: NextConfig = {
 images: {
   remotePatterns: [
     {
       protocol: "https",
       hostname: "images.unsplash.com",
     },
     {
       protocol: "https",
       hostname: "picsum.photos",
     },
     {
       protocol: "https",
       hostname: "api.dicebear.com",
     },
      {
       protocol: "http",
       hostname: "127.0.0.1",
       port: "4001",
        pathname: "/uploads/**",
     },
     {
        protocol: "https",
        hostname: "api.bleefyagri.com",
        pathname: "/uploads/**",
     },
     {
        protocol: "http",
        hostname: "api.bleefyagri.com",
        pathname: "/uploads/**",
     }
     
      
     
   ],
 },
};

export default nextConfig;
