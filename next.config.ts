import { type NextConfig } from "next"

const isDev = process.argv.includes("dev")
const isBuild = process.argv.includes("build")
if (!process.env.VELITE_STARTED && (isDev || isBuild)) {
    process.env.VELITE_STARTED = "1"
    void import("velite").then((m) => m.build({ watch: isDev, clean: !isDev }))
}

const nextConfig: NextConfig = {
    output: "export",
    compress: true,
    reactCompiler: true,
    poweredByHeader: false,
    typedRoutes: true,
    devIndicators: {
        position: "bottom-right"
    },
    experimental: {
        optimizePackageImports: ["lenis"]
    },
    images: { unoptimized: true }
}

export default nextConfig
