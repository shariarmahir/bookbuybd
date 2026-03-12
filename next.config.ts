import type { NextConfig } from "next";

const DEFAULT_DEV_BACKEND_ORIGIN = "http://127.0.0.1:8000";
const backendOriginRaw = process.env.BACKEND_ORIGIN?.trim()
  || (process.env.NODE_ENV === "development" ? DEFAULT_DEV_BACKEND_ORIGIN : "");
const backendOrigin = backendOriginRaw
  ? backendOriginRaw.replace(/\/api\/?$/i, "").replace(/\/$/, "")
  : "";
const appRoot = process.cwd();

const nextConfig: NextConfig = {
  output: "standalone",
  poweredByHeader: false,
  turbopack: {
    root: appRoot,
  },
  outputFileTracingRoot: appRoot,
  async rewrites() {
    if (!backendOrigin) {
      return [];
    }

    return [
      {
        source: "/api",
        destination: `${backendOrigin}/api/`,
      },
      {
        source: "/api/:path*",
        destination: `${backendOrigin}/api/:path*/`,
      },
      {
        source: "/media/:path*",
        destination: `${backendOrigin}/media/:path*`,
      },
    ];
  },
};

export default nextConfig;
