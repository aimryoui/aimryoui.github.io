import { type NextConfig } from "next"

const nextConfig: NextConfig = {
    output: "export",
    basePath: process.env.PAGES_BASE_PATH,
    reactCompiler: true,
    poweredByHeader: false,
    experimental: {
        optimizePackageImports: ["lenis"]
    }
}

export default nextConfig
