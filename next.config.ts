import { type NextConfig } from "next"
import {
    PHASE_DEVELOPMENT_SERVER,
    PHASE_PRODUCTION_BUILD
} from "next/constants"

const tailwindModuleNotFoundRegex = /^Module not found/i

const nextConfig = (phase: string): NextConfig => {
    const isDev = phase === PHASE_DEVELOPMENT_SERVER
    const isBuild = phase === PHASE_PRODUCTION_BUILD

    if (!process.env.VELITE_STARTED && (isDev || isBuild)) {
        process.env.VELITE_STARTED = "1"
        void import("velite").then((m) =>
            m.build({ watch: isDev, clean: !isDev })
        )
    }

    return {
        output: "export",
        compress: true,
        reactCompiler: true,
        poweredByHeader: false,
        typedRoutes: true,
        devIndicators: {
            position: "bottom-right"
        },
        turbopack: {
            ignoreIssue: [
                /** @see {@link https://github.com/vercel/next.js/issues/87898} */
                {
                    path: "tailwind.config.ts",
                    title: tailwindModuleNotFoundRegex
                }
            ]
        },
        images: { unoptimized: true }
    }
}

export default nextConfig
