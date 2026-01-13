import { type NextConfig } from "next"

const nextConfig: NextConfig = {
    output: "export",
    basePath: process.env.NEXT_PUBLIC_BASE_URL,
    compress: true,
    reactCompiler: true,
    poweredByHeader: false,
    typedRoutes: true,
    experimental: {
        optimizePackageImports: ["lenis"]
    }
}

export default nextConfig
