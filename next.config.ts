import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  async redirects() {
    return [
      {
        // ISV-CR-002 was mislabelled "Elektra Mesh Bodysuit" — its images, copy
        // and meta title were all Valentina. Renamed; keep the old URL alive.
        source: "/products/elektra-mesh-body",
        destination: "/products/valentina-corset-bodysuit",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
