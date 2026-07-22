// oxlint-disable no-console
import crypto from "node:crypto"
import fs from "node:fs"
import path from "node:path"
import readline from "node:readline"

import chokidar from "chokidar"
import chroma from "chroma-js"
import { glob } from "glob"
import matter from "gray-matter"
import { Vibrant } from "node-vibrant/node"
import sharp from "sharp"

const MDX_DIR = "src/content/projects"
const IMAGE_DIR = "private/media"
const MANIFEST_PATH = "src/lib/color-manifest.json"

const SCRIPT_VERSION = "1"

const BRAND_COLOR = "\x1B[38;2;168;85;247m"
const RESET = "\x1B[0m"
const PREFIX = `${BRAND_COLOR}[COLORS]${RESET}`

const BATCH_SIZE = 10

const COLOR_CONFIG = {
    highlighted: { lLight: 0.6, cLight: 0.15, lDark: 0.76, cDark: 0.15 },
    background: { lLight: 0.945, cLight: 0.0015, lDark: 0.13, cDark: 0.028 },
    foreground: {
        lLight: 0.3516,
        cLight: 0.0187,
        lDark: 0.9543,
        cDark: 0.0115
    },
    mutedForeground: {
        lLight: 0.5655,
        cLight: 0.0147,
        lDark: 0.8012,
        cDark: 0.0174
    },
    ring: { lLight: 0.707, cLight: 0.022, lDark: 0.551, cDark: 0.027 },
    pattern: { lLight: 0.8759, cLight: 0.005, lDark: 0.235, cDark: 0.0162 },
    stroke: { lLight: 0.85, cLight: 0.005, lDark: 0.275, cDark: 0.0162 }
}

type Theme = Record<keyof typeof COLOR_CONFIG, { hex: string; oklch: string }>

type ColorManifest = Record<
    string,
    | {
          hash: string
          version: string
          theme: Theme
      }
    | undefined
>

const chunkArray = <T>(arr: T[], size: number): T[][] =>
    Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
        arr.slice(i * size, i * size + size)
    )

function getFileHash(filePath: string) {
    return crypto
        .createHash("md5")
        .update(fs.readFileSync(filePath))
        .digest("hex")
}

function getProgressBar(current: number, total: number, width = 30) {
    const percent = total === 0 ? 100 : Math.round((current / total) * 100)
    const filledWidth =
        total === 0 ? width : Math.round((current / total) * width)
    const filled = "█".repeat(filledWidth)
    const empty = "░".repeat(width - filledWidth)
    return `[${filled}${empty}] ${percent.toString()}% (${current.toString()}/${total.toString()})`
}

const ZERO_TO_DOT_REGEX = /\b0\./gu

async function processColorForFile(
    file: string,
    oldManifest: ColorManifest,
    newManifest: ColorManifest
): Promise<boolean> {
    const fileContent = fs.readFileSync(file, "utf-8")
    const { data } = matter(fileContent)

    const relativePath = path.relative(MDX_DIR, file).replaceAll("\\", "/")
    const parsedPath = path.parse(relativePath)
    const slug = path
        .join(parsedPath.dir, parsedPath.name)
        .replaceAll("\\", "/")

    let coverImagePath = (data as { override?: { coverImage?: string } })
        .override?.coverImage

    if (coverImagePath) {
        if (
            coverImagePath.endsWith(".mp4") ||
            coverImagePath.endsWith(".gif")
        ) {
            coverImagePath = coverImagePath.replace(
                /\.(mp4|gif)$/u,
                "-poster.webp"
            )
        }
    } else {
        const possibleExtensions = [
            ".jpg",
            ".png",
            ".jpeg",
            ".webp",
            "-poster.webp"
        ]
        for (const ext of possibleExtensions) {
            const tempPath = `/${slug}/1${ext}`
            if (fs.existsSync(path.join(process.cwd(), IMAGE_DIR, tempPath))) {
                coverImagePath = tempPath
                break
            }
        }
        coverImagePath ??= `/${slug}/1.jpg`
    }

    const absoluteCoverImagePath = path.join(
        process.cwd(),
        IMAGE_DIR,
        coverImagePath
    )

    const imageHash = fs.existsSync(absoluteCoverImagePath)
        ? getFileHash(absoluteCoverImagePath)
        : ""

    const colorOverride = (data as { override?: { colorOverrideHex?: string } })
        .override?.colorOverrideHex
    const currentInputHash = crypto
        .createHash("md5")
        .update(imageHash + colorOverride)
        .digest("hex")

    if (Object.hasOwn(oldManifest, slug)) {
        const cachedData = oldManifest[slug]
        if (
            cachedData?.version === SCRIPT_VERSION &&
            cachedData.hash === currentInputHash
        ) {
            newManifest[slug] = cachedData
            return false
        }
    }

    try {
        if (fs.existsSync(absoluteCoverImagePath)) {
            let imageSource: string | Buffer = absoluteCoverImagePath
            let imageBuffer: Buffer | null = null

            if (absoluteCoverImagePath.toLowerCase().endsWith(".webp")) {
                imageBuffer = await sharp(absoluteCoverImagePath)
                    .toFormat("png")
                    .toBuffer()
                imageSource = imageBuffer
            }

            const palette = await Vibrant.from(imageSource).getPalette()
            imageBuffer = null

            const dominantHex =
                colorOverride ??
                palette.Vibrant?.hex ??
                palette.Muted?.hex ??
                "#01a6f4"

            const theme = {} as Theme

            for (const [key, config] of Object.entries(COLOR_CONFIG)) {
                const [_, __, h] = chroma(dominantHex).oklch()
                const finalHue = Number.isNaN(h) ? 0 : h

                const lightOklchStr =
                    `oklch(${config.lLight} ${config.cLight} ${finalHue.toFixed(4)})`.replace(
                        ZERO_TO_DOT_REGEX,
                        "."
                    )
                const darkOklchStr =
                    `oklch(${config.lDark} ${config.cDark} ${finalHue.toFixed(4)})`.replace(
                        ZERO_TO_DOT_REGEX,
                        "."
                    )

                const lightHex = chroma(
                    config.lLight,
                    config.cLight,
                    finalHue,
                    "oklch"
                ).hex()
                const darkHex = chroma(
                    config.lDark,
                    config.cDark,
                    finalHue,
                    "oklch"
                ).hex()

                theme[key as keyof typeof COLOR_CONFIG] = {
                    hex: `light-dark(${lightHex}, ${darkHex})`,
                    oklch: `light-dark(${lightOklchStr}, ${darkOklchStr})`
                }
            }

            newManifest[slug] = {
                hash: currentInputHash,
                version: SCRIPT_VERSION,
                theme
            }
            return true
        }
        console.warn(
            `\n${PREFIX} Warning: Source image not found for "${slug}". Looked at: ${absoluteCoverImagePath}`
        )
        return false
    } catch (error) {
        console.error(`\n${PREFIX} Error processing ${file}:`, error)
        return false
    }
}

async function buildColors(showProgress = false) {
    const startTime = performance.now()
    const mdxFiles = await glob(`${MDX_DIR}/**/*.mdx`)

    let oldManifest: ColorManifest = {}
    if (fs.existsSync(MANIFEST_PATH)) {
        try {
            oldManifest = JSON.parse(
                fs.readFileSync(MANIFEST_PATH, "utf-8")
            ) as ColorManifest
        } catch {}
    }

    const newManifest: ColorManifest = {}
    let actuallyProcessed = 0
    let processedCount = 0

    if (showProgress && mdxFiles.length > 0) {
        console.log(`${PREFIX} building...`)
        if (process.stdout.isTTY) {
            process.stdout.write(
                `${PREFIX} processing: ${getProgressBar(0, mdxFiles.length)}`
            )
        } else {
            console.log(
                `${PREFIX} processing: ${getProgressBar(0, mdxFiles.length)}`
            )
        }
    }

    const fileChunks = chunkArray(mdxFiles, BATCH_SIZE)

    await fileChunks.reduce(async (promise, chunk) => {
        await promise
        const results = await Promise.all(
            chunk.map((file) =>
                processColorForFile(file, oldManifest, newManifest)
            )
        )

        processedCount += chunk.length
        actuallyProcessed += results.filter(Boolean).length

        if (showProgress) {
            if (process.stdout.isTTY) {
                readline.clearLine(process.stdout, 0)
                readline.cursorTo(process.stdout, 0)
                process.stdout.write(
                    `${PREFIX} processing: ${getProgressBar(processedCount, mdxFiles.length)}`
                )
            } else {
                console.log(
                    `${PREFIX} processing: ${getProgressBar(processedCount, mdxFiles.length)}`
                )
            }
        }
    }, Promise.resolve())

    if (showProgress && mdxFiles.length > 0 && process.stdout.isTTY) {
        console.log()
    }

    if (!fs.existsSync(path.dirname(MANIFEST_PATH))) {
        fs.mkdirSync(path.dirname(MANIFEST_PATH), { recursive: true })
    }
    fs.writeFileSync(MANIFEST_PATH, JSON.stringify(newManifest, null, 2))

    const endTime = performance.now()
    const timeTook = (endTime - startTime).toFixed(2)

    if (actuallyProcessed > 0) {
        console.log(
            `${PREFIX} build finished in ${timeTook}ms. Processed ${actuallyProcessed.toString()} files.`
        )
    } else {
        console.log(`${PREFIX} build finished in ${timeTook}ms. All cached.`)
    }
}

const IGNORE_REGEX = /(^|[/\\])\../iu

async function build({ watch = false, skipInitial = false } = {}) {
    if (!skipInitial) {
        if (watch) {
            console.log(`${PREFIX} building...`)
            await buildColors(false)
        } else {
            await buildColors(true)
        }
    }

    if (watch) {
        console.log(
            `${PREFIX} watching for changes in '${MDX_DIR}' and '${IMAGE_DIR}'`
        )

        const watcher = chokidar.watch([MDX_DIR, IMAGE_DIR], {
            ignored: IGNORE_REGEX,
            ignoreInitial: true
        })

        let debounceTimer: NodeJS.Timeout
        const handleChange = () => {
            clearTimeout(debounceTimer)
            debounceTimer = setTimeout(() => {
                console.log(`${PREFIX} building...`)
                void buildColors(false)
            }, 300)
        }

        watcher.on("add", handleChange)
        watcher.on("change", handleChange)
        watcher.on("unlink", handleChange)
    }
}

const WINDOWS_PATH_SEP_REGEX = /\\/gu

void (async () => {
    const isMain = process.argv[1]
        ?.replace(WINDOWS_PATH_SEP_REGEX, "/")
        .endsWith("process-colors.ts")
    if (isMain) {
        const isWatch =
            process.argv.includes("--watch") || process.argv.includes("-w")
        const skipInitial =
            process.argv.includes("--skip-initial") ||
            process.argv.includes("--skipInitial")
        await build({ watch: isWatch, skipInitial })
    }
})()

export type { ColorManifest }
export { build }
