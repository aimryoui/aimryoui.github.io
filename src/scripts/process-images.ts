import fs from "node:fs"
import path from "node:path"

import { glob } from "glob"
import sharp from "sharp"

// eslint-disable-next-line @limegrass/import-alias/import-alias
import { EDGE_PAD, GRID_COLS, GRID_ROWS } from "../configs/image.config.ts"

const INPUT_DIR = "private/images"
const OUTPUT_BASE = "public/assets/images"
const MANIFEST_PATH = "src/lib/image-manifest.json"

const isCI = process.env.CI === "true"

const BATCH_SIZE = isCI ? 2 : 10
console.log(
    `🚀 Running with Concurrency: ${BATCH_SIZE.toString()} images per batch`
)

type ImageManifest = Record<
    string,
    { width: number; height: number; mapping: number[] }
>
interface ImageMeta {
    mtime: number
}

const chunkArray = <T>(arr: T[], size: number): T[][] =>
    Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
        arr.slice(i * size, i * size + size)
    )

async function processImage(
    filePath: string,
    oldManifest: ImageManifest,
    newManifest: ImageManifest
) {
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

    const stat = fs.statSync(filePath)
    const metaFile = path.join(outputFolder, `${parsedPath.name}_meta.json`)

    let isCached = false
    if (fs.existsSync(metaFile)) {
        try {
            const meta = JSON.parse(
                fs.readFileSync(metaFile, "utf-8")
            ) as ImageMeta
            if (meta.mtime === stat.mtimeMs) isCached = true
        } catch {
            /* Empty */
        }
    }

    if (isCached) {
        newManifest[manifestKey] = oldManifest[manifestKey]
        return
    }

    console.log(`Processing: ${relativePath}...`)

    const originalImage = sharp(filePath)
    const originalMetadata = await originalImage.metadata()

    if (!originalMetadata.width || !originalMetadata.height) return

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

    if (exactW <= 0 || exactH <= 0) return

    const baseBuffer = await originalImage
        .extract({
            left: borderCrop + trimLeft,
            top: borderCrop + trimTop,
            width: exactW,
            height: exactH
        })
        .toBuffer()

    const image = sharp(baseBuffer)
    const totalTiles = GRID_ROWS * GRID_COLS

    const mapping = Array.from({ length: totalTiles }, (_, i) => i)
    for (let i = mapping.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        const temp = mapping[i]
        mapping[i] = mapping[j]
        mapping[j] = temp
    }

    newManifest[manifestKey] = {
        width: exactW,
        height: exactH,
        mapping: mapping
    }

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

    fs.writeFileSync(metaFile, JSON.stringify({ mtime: stat.mtimeMs }))
}

async function main() {
    const files = await glob(`${INPUT_DIR}/**/*.{png,jpg,jpeg,webp}`)

    let oldManifest: ImageManifest = {}
    if (fs.existsSync(MANIFEST_PATH)) {
        try {
            oldManifest = JSON.parse(
                fs.readFileSync(MANIFEST_PATH, "utf-8")
            ) as ImageManifest
        } catch {
            /* Empty */
        }
    }

    const newManifest: ImageManifest = {}
    console.log(`Found ${files.length.toString()} images. Processing...`)

    const fileChunks = chunkArray(files, BATCH_SIZE)
    let processedCount = 0

    await fileChunks.reduce(async (promise, chunk) => {
        await promise
        await Promise.all(
            chunk.map((filePath) =>
                processImage(filePath, oldManifest, newManifest)
            )
        )
        processedCount += chunk.length
        console.log(
            `Progress: ${processedCount.toString()}/${files.length.toString()} images`
        )
    }, Promise.resolve())

    if (!fs.existsSync(path.dirname(MANIFEST_PATH)))
        fs.mkdirSync(path.dirname(MANIFEST_PATH), { recursive: true })

    fs.writeFileSync(MANIFEST_PATH, JSON.stringify(newManifest, null, 2))
    console.log(`✅ Clean Manifest generated at ${MANIFEST_PATH}`)
}

await main()
