import { minify } from "terser"

const cache = new Map<string, string>()

async function minifyJs(script: string) {
    if (process.env.NODE_ENV === "development") {
        return script
    }

    if (cache.has(script)) {
        return cache.get(script) ?? ""
    }

    try {
        const result = await minify(script, {
            toplevel: true,
            compress: true,
            mangle: true
        })
        const minified = result.code ?? script
        cache.set(script, minified)
        return minified
    } catch (error) {
        console.error("Failed to minify script:", error)
        return script
    }
}

export { minifyJs }
