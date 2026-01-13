import { type NextConfig } from "next"

const nextConfig: NextConfig = {
    output: "export",
    compress: true,
    reactCompiler: true,
    poweredByHeader: false,
    typedRoutes: true,
    experimental: {
        optimizePackageImports: ["lenis"]
    },
    images: { unoptimized: true }
}

export default nextConfig
