import crypto from "node:crypto"
import fs from "node:fs"
import path from "node:path"

import chokidar from "chokidar"
import { glob } from "glob"
import sharp from "sharp"

// eslint-disable-next-line @limegrass/import-alias/import-alias
import { EDGE_PAD, GRID_COLS, GRID_ROWS } from "../configs/image.config.ts"

const INPUT_DIR = "private/images"
const OUTPUT_BASE = "public/assets/images"
const MANIFEST_PATH = "src/lib/image-manifest.json"

const SCRIPT_VERSION = "1"

const BRAND_COLOR = "\x1B[38;2;0;166;244m"
const RESET = "\x1B[0m"
const PREFIX = `${BRAND_COLOR}[IMAGES]${RESET}`

const isCI = process.env.CI === "true"
const BATCH_SIZE = isCI ? 2 : 10

type ImageManifest = Record<
    string,
    { width: number; height: number; mapping: number[]; blurDataURL: string }
>

interface ImageMeta {
    hash: string
    version: string
    manifestData: {
        width: number
        height: number
        mapping: number[]
        blurDataURL: string
    }
}

const chunkArray = <T>(arr: T[], size: number): T[][] =>
    Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
        arr.slice(i * size, i * size + size)
    )

function getFileHash(filePath: string) {
    const fileBuffer = fs.readFileSync(filePath)
    return crypto.createHash("md5").update(fileBuffer).digest("hex")
}

async function processImage(
    filePath: string,
    newManifest: ImageManifest
): Promise<boolean> {
    const relativePath = path
        .relative(INPUT_DIR, filePath)
        .replaceAll("\\", "/")
    const parsedPath = path.parse(relativePath)
    const manifestKey = path
        .join(parsedPath.dir, parsedPath.name)
        .replaceAll("\\", "/")
    const outputFolder = path.join(OUTPUT_BASE, parsedPath.dir, parsedPath.name)

    if (!fs.existsSync(outputFolder))
        fs.mkdirSync(outputFolder, { recursive: true })

    const metaFile = path.join(outputFolder, `${parsedPath.name}_meta.json`)
    const currentHash = getFileHash(filePath)

    if (fs.existsSync(metaFile)) {
        try {
            const meta = JSON.parse(
                fs.readFileSync(metaFile, "utf-8")
            ) as ImageMeta
            if (meta.hash === currentHash && meta.version === SCRIPT_VERSION) {
                newManifest[manifestKey] = meta.manifestData
                return false
            }
        } catch {}
    }

    const originalImage = sharp(filePath)
    const originalMetadata = await originalImage.metadata()

    if (!originalMetadata.width || !originalMetadata.height) return false

    const isPng = parsedPath.ext.toLowerCase() === ".png"
    const borderCrop = isPng ? 0 : 1

    const baseW = originalMetadata.width - borderCrop * 2
    const baseH = originalMetadata.height - borderCrop * 2

    const remW = baseW % GRID_COLS
    const remH = baseH % GRID_ROWS

    const trimLeft = Math.floor(remW / 2)
    const trimTop = Math.floor(remH / 2)

    const exactW = baseW - remW
    const exactH = baseH - remH

    if (exactW <= 0 || exactH <= 0) return false

    const baseBuffer = await originalImage
        .extract({
            left: borderCrop + trimLeft,
            top: borderCrop + trimTop,
            width: exactW,
            height: exactH
        })
        .toBuffer()

    const image = sharp(baseBuffer)

    const blurBuffer = await image
        .clone()
        .resize({ width: 10 })
        .webp({ quality: 20 })
        .toBuffer()

    const blurDataURL = `data:image/webp;base64,${blurBuffer.toString("base64")}`

    const totalTiles = GRID_ROWS * GRID_COLS

    const mapping = Array.from({ length: totalTiles }, (_, i) => i)
    for (let i = mapping.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        const temp = mapping[i]
        mapping[i] = mapping[j]
        mapping[j] = temp
    }

    const manifestData = {
        width: exactW,
        height: exactH,
        mapping: mapping,
        blurDataURL: blurDataURL
    }

    newManifest[manifestKey] = manifestData

    await image
        .clone()
        .resize({
            width: 600,
            height: 600,
            fit: "inside",
            withoutEnlargement: true
        })
        .webp({ quality: 20, smartSubsample: true })
        .toFile(path.join(outputFolder, `${parsedPath.name}_preview.webp`))

    const tileW = exactW / GRID_COLS
    const tileH = exactH / GRID_ROWS

    const paddedTiles = await Promise.all(
        Array.from({ length: totalTiles }).map((_, i) => {
            const r = Math.floor(i / GRID_COLS)
            const c = i % GRID_COLS
            return image
                .clone()
                .extract({
                    left: c * tileW,
                    top: r * tileH,
                    width: tileW,
                    height: tileH
                })
                .extend({
                    top: EDGE_PAD,
                    bottom: EDGE_PAD,
                    left: EDGE_PAD,
                    right: EDGE_PAD,
                    extendWith: "copy"
                })
                .toBuffer()
        })
    )

    const paddedTileW = tileW + EDGE_PAD * 2
    const paddedTileH = tileH + EDGE_PAD * 2
    const compositeW = paddedTileW * GRID_COLS
    const compositeH = paddedTileH * GRID_ROWS

    const composites = mapping.map((scrambledIdx, originalIdx) => {
        const destC = scrambledIdx % GRID_COLS
        const destR = Math.floor(scrambledIdx / GRID_COLS)
        return {
            input: paddedTiles[originalIdx],
            left: destC * paddedTileW,
            top: destR * paddedTileH
        }
    })

    await sharp({
        create: {
            width: compositeW,
            height: compositeH,
            channels: 4,
            background: { r: 0, g: 0, b: 0, alpha: 0 }
        }
    })
        .composite(composites as sharp.OverlayOptions[])
        .webp({ quality: 95 })
        .toFile(path.join(outputFolder, `${parsedPath.name}_scrambled.webp`))

    fs.writeFileSync(
        metaFile,
        JSON.stringify({
            hash: currentHash,
            version: SCRIPT_VERSION,
            manifestData
        })
    )

    return true
}

async function buildImages() {
    const startTime = performance.now()
    const files = await glob(`${INPUT_DIR}/**/*.{png,jpg,jpeg,webp}`)

    const newManifest: ImageManifest = {}
    let actuallyProcessed = 0

    const fileChunks = chunkArray(files, BATCH_SIZE)

    await fileChunks.reduce(async (promise, chunk) => {
        await promise
        const results = await Promise.all(
            chunk.map((filePath) => processImage(filePath, newManifest))
        )
        actuallyProcessed += results.filter(Boolean).length
    }, Promise.resolve())

    if (!fs.existsSync(path.dirname(MANIFEST_PATH)))
        fs.mkdirSync(path.dirname(MANIFEST_PATH), { recursive: true })

    fs.writeFileSync(MANIFEST_PATH, JSON.stringify(newManifest, null, 2))

    const endTime = performance.now()
    const timeTook = (endTime - startTime).toFixed(2)

    if (actuallyProcessed > 0) {
        console.log(
            `${PREFIX} build finished in ${timeTook}ms. Processed ${actuallyProcessed.toString()} images.`
        )
    } else {
        console.log(`${PREFIX} build finished in ${timeTook}ms. All cached.`)
    }
}

const IGNORE_REGEX = /(^|[/\\])\../

export async function build({ watch = false, skipInitial = false } = {}) {
    if (!skipInitial) {
        console.log(`${PREFIX} building...`)
        await buildImages()
    }

    if (watch) {
        console.log(`${PREFIX} watching for changes in '${INPUT_DIR}'`)
        const watcher = chokidar.watch(INPUT_DIR, {
            ignored: IGNORE_REGEX,
            ignoreInitial: true
        })

        let debounceTimer: NodeJS.Timeout
        const handleChange = () => {
            clearTimeout(debounceTimer)
            debounceTimer = setTimeout(() => {
                console.log(`${PREFIX} building...`)
                void buildImages()
            }, 300)
        }

        watcher.on("add", handleChange)
        watcher.on("change", handleChange)
        watcher.on("unlink", handleChange)
    }
}

;(async () => {
    const isMain = process.argv[1]
        ?.replace(/\\/g, "/")
        .endsWith("process-images.ts")
    if (isMain) {
        const isWatch =
            process.argv.includes("--watch") || process.argv.includes("-w")
        const skipInitial =
            process.argv.includes("--skip-initial") ||
            process.argv.includes("--skipInitial")
        await build({ watch: isWatch, skipInitial })
    }
})()

export type { ImageManifest, ImageMeta }
