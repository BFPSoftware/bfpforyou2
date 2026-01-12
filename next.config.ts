import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    experimental: {
        serverActions: {
            bodySizeLimit: "1000mb",
        },
    },
    output: "standalone",
};

export default nextConfig;
