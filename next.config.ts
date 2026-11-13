import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async redirects() {
    return [
      // Old WordPress date permalinks -> flat slugs
      {
        source: "/:year(\\d{4})/:month(\\d{2})/:day(\\d{2})/:slug",
        destination: "/:slug",
        permanent: true,
      },
      { source: "/category/:slug", destination: "/:slug", permanent: true },
      { source: "/wp-admin/:path*", destination: "/admin", permanent: false },
      { source: "/wp-login.php", destination: "/login", permanent: false },
    ];
  },
};

export default nextConfig;
