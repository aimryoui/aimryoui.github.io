import { createHash } from "crypto"
import { readFileSync, writeFileSync } from "fs"
import { join } from "path"

import { load } from "cheerio"
import { globSync } from "glob"

// oxlint-disable-next-line @limegrass/import-alias/import-alias
import { cspConfig } from "../configs/csp.config"

function hashScript(content: string): string {
    const hash = createHash("sha256")
    hash.update(content)
    return `'sha256-${hash.digest("base64")}'`
}

export function buildCSP() {
    console.info("[CSP] building...")
    const startTime = performance.now()

    const outDir = join(process.cwd(), "out")
    const htmlFiles = globSync("**/*.html", { cwd: outDir, absolute: true })

    let totalScriptsHashed = 0

    for (const file of htmlFiles) {
        const html = readFileSync(file, "utf8")
        const $ = load(html)

        const hashes: string[] = []

        // Find all inline scripts
        const scripts = $("script").toArray()
        for (const el of scripts) {
            const $el = $(el)
            const src = $el.attr("src")
            // Only process scripts without a src attribute (inline)
            if (!src) {
                const content = $el.html()
                if (content) {
                    hashes.push(hashScript(content))
                    totalScriptsHashed++
                }
            }
        }

        if (hashes.length > 0) {
            const baseCSP = cspConfig.base

            const directives = baseCSP
                .split(";")
                .map((d) => d.trim())
                .filter(Boolean)

            for (let i = 0; i < directives.length; i++) {
                if (directives[i].startsWith("script-src")) {
                    directives[i] =
                        `${directives[i].trim()} ${hashes.join(" ")}`
                }
            }

            const finalCSP = directives.join("; ") + ";"

            // Instead of using a placeholder which React Hydration will overwrite,
            // we inject the CSP meta tag directly at the end of the <head>.
            // React 18's hydration gracefully ignores extra tags at the end of head.
            const newHtml = html.replace(
                "</head>",
                `<meta http-equiv="Content-Security-Policy" content="${finalCSP}"></head>`
            )
            writeFileSync(file, newHtml)
        }
    }

    const endTime = performance.now()
    console.info(
        `[CSP] build finished in ${(endTime - startTime).toFixed(2)}ms. Hashed ${totalScriptsHashed} inline scripts.`
    )
}

buildCSP()
