import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  experimental: {
    serverActions: {
      // zdjęcie (maks. 3 MB po zmniejszeniu w przeglądarce) + miniatura + narzut multipart
      bodySizeLimit: "4mb",
    },
  },
  // turniej CS2 został odwołany – stare linki z plakatów i Discorda prowadzą na stronę LoL
  async redirects() {
    return [
      { source: "/cs2/:path*", destination: "/", permanent: false },
      { source: "/lol", destination: "/", permanent: false },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
      {
        source: "/admin/:path*",
        headers: [{ key: "Cache-Control", value: "no-store" }],
      },
    ];
  },
};

export default nextConfig;
