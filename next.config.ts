import { type NextConfig } from "next"

const nextConfig: NextConfig = {
    output: "export",
    basePath: process.env.PAGES_BASE_PATH,
    compress: true,
    reactCompiler: true,
    poweredByHeader: false,
    typedRoutes: true,
    experimental: {
        optimizePackageImports: ["lenis"]
    }
}

export default nextConfig
