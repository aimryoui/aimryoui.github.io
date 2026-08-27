import { minify } from "terser"

const cache = new Map<string, string>()

async function minifyJs(script: string, reserved: string[] = []) {
    if (process.env.NODE_ENV === "development") {
        return script
    }

    const cacheKey = script + reserved.join(",")

    if (cache.has(cacheKey)) {
        return cache.get(cacheKey) ?? ""
    }

    try {
        const result = await minify(script, {
            toplevel: true,
            compress: true,
            mangle: {
                reserved
            }
        })
        const minified = result.code ?? script
        cache.set(cacheKey, minified)
        return minified
    } catch (error) {
        console.error("Failed to minify script:", error)
        return script
    }
}

export { minifyJs }
