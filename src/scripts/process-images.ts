import crypto from "node:crypto"
import fs from "node:fs"
import path from "node:path"
import readline from "node:readline"

import chokidar from "chokidar"
import { glob } from "glob"
import sharp from "sharp"

// oxlint-disable-next-line @limegrass/import-alias/import-alias
import { EDGE_PAD, GRID_COLS, GRID_ROWS } from "../configs/image.config.ts"

const INPUT_DIR = "private/media"
const OUTPUT_BASE = "public/assets/media"
const MANIFEST_PATH = "src/lib/image-manifest.json"

const SCRIPT_VERSION = "1"

const BRAND_COLOR = "\x1B[38;2;0;166;244m"
const RESET = "\x1B[0m"
const PREFIX = `${BRAND_COLOR}[IMAGES]${RESET}`

const BATCH_SIZE = 10

const IGNORE_REGEX = /(^|[/\\])\..|.*-poster\.(png|jpg|jpeg|webp)$/iu

type ImageManifest = Record<
    string,
    | {
          hash: string
          version: string
          width: number
          height: number
          mapping: number[]
          blurDataURL: string
      }
    | undefined
>

const chunkArray = <T>(arr: T[], size: number): T[][] =>
    Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
        arr.slice(i * size, i * size + size)
    )

function getFileHash(filePath: string) {
    const fileBuffer = fs.readFileSync(filePath)
    return crypto.createHash("md5").update(fileBuffer).digest("hex")
}

function getProgressBar(current: number, total: number, width = 30) {
    const percent = total === 0 ? 100 : Math.round((current / total) * 100)
    const filledWidth =
        total === 0 ? width : Math.round((current / total) * width)
    const filled = "█".repeat(filledWidth)
    const empty = "░".repeat(width - filledWidth)
    return `[${filled}${empty}] ${percent.toString()}% (${current.toString()}/${total.toString()})`
}

function cleanImageOutputFolder(folder: string, allowedFiles: string[]) {
    if (!fs.existsSync(folder)) return
    const allowed = new Set(allowedFiles)
    const filesInDir = fs.readdirSync(folder)
    for (const file of filesInDir) {
        if (!allowed.has(file)) {
            fs.rmSync(path.join(folder, file), { recursive: true, force: true })
        }
    }
}

async function processImage(
    filePath: string,
    oldManifest: ImageManifest,
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

    const previewOutput = path.join(
        outputFolder,
        `${parsedPath.name}_preview.webp`
    )
    const scrambledOutput = path.join(
        outputFolder,
        `${parsedPath.name}_scrambled.webp`
    )

    if (!fs.existsSync(outputFolder))
        fs.mkdirSync(outputFolder, { recursive: true })

    const currentHash = getFileHash(filePath)

    if (Object.hasOwn(oldManifest, manifestKey)) {
        const cachedData = oldManifest[manifestKey]
        if (
            cachedData?.hash === currentHash &&
            cachedData.version === SCRIPT_VERSION &&
            fs.existsSync(previewOutput) &&
            fs.existsSync(scrambledOutput)
        ) {
            newManifest[manifestKey] = cachedData
            cleanImageOutputFolder(outputFolder, [
                `${parsedPath.name}_preview.webp`,
                `${parsedPath.name}_scrambled.webp`
            ])
            return false
        }
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
        .webp({ quality: 20, effort: 6 })
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

    newManifest[manifestKey] = {
        hash: currentHash,
        version: SCRIPT_VERSION,
        width: exactW,
        height: exactH,
        mapping,
        blurDataURL
    }

    await image
        .clone()
        .resize({
            width: 300,
            height: 300,
            fit: "inside",
            withoutEnlargement: true
        })
        .webp({ quality: 1, alphaQuality: 100, effort: 6 })
        .toFile(previewOutput)

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
        .composite(composites)
        .webp({ quality: 95, effort: 6 })
        .toFile(scrambledOutput)

    cleanImageOutputFolder(outputFolder, [
        `${parsedPath.name}_preview.webp`,
        `${parsedPath.name}_scrambled.webp`
    ])

    return true
}

async function buildImages(showProgress = false) {
    const startTime = performance.now()
    const allFiles = await glob(`${INPUT_DIR}/**/*.{png,jpg,jpeg,webp}`)

    const files = allFiles.filter((file) => !IGNORE_REGEX.test(file))

    let oldManifest: ImageManifest = {}
    if (fs.existsSync(MANIFEST_PATH)) {
        try {
            oldManifest = JSON.parse(
                fs.readFileSync(MANIFEST_PATH, "utf-8")
            ) as ImageManifest
        } catch {}
    }

    const newManifest: ImageManifest = {}
    let actuallyProcessed = 0
    let processedCount = 0

    const fileChunks = chunkArray(files, BATCH_SIZE)

    if (showProgress && files.length > 0) {
        console.log(`${PREFIX} building...`)
        if (process.stdout.isTTY) {
            process.stdout.write(
                `${PREFIX} processing: ${getProgressBar(0, files.length)}`
            )
        } else {
            console.log(
                `${PREFIX} processing: ${getProgressBar(0, files.length)}`
            )
        }
    }

    await fileChunks.reduce(async (promise, chunk) => {
        await promise
        const results = await Promise.all(
            chunk.map((filePath) =>
                processImage(filePath, oldManifest, newManifest)
            )
        )
        processedCount += chunk.length
        actuallyProcessed += results.filter(Boolean).length

        if (showProgress) {
            if (process.stdout.isTTY) {
                readline.clearLine(process.stdout, 0)
                readline.cursorTo(process.stdout, 0)
                process.stdout.write(
                    `${PREFIX} processing: ${getProgressBar(processedCount, files.length)}`
                )
            } else {
                console.log(
                    `${PREFIX} processing: ${getProgressBar(processedCount, files.length)}`
                )
            }
        }
    }, Promise.resolve())

    if (showProgress && files.length > 0 && process.stdout.isTTY) {
        console.log()
    }

    const validOutputFolders = new Set(
        Object.keys(newManifest).map((key) =>
            path.join(OUTPUT_BASE, key).replaceAll("\\", "/")
        )
    )

    const existingPreviewFiles = await glob(
        `${OUTPUT_BASE}/**/*_scrambled.webp`
    )
    for (const previewPath of existingPreviewFiles) {
        const folderPath = path.dirname(previewPath).replaceAll("\\", "/")
        if (!validOutputFolders.has(folderPath)) {
            fs.rmSync(folderPath, { recursive: true, force: true })
        }
    }

    const removeEmptyDirs = (dir: string) => {
        if (!fs.existsSync(dir)) return
        const items = fs.readdirSync(dir)
        for (const item of items) {
            const fullPath = path.join(dir, item)
            if (fs.statSync(fullPath).isDirectory()) {
                removeEmptyDirs(fullPath)
            }
        }
        if (
            fs.readdirSync(dir).length === 0 &&
            path.resolve(dir) !== path.resolve(OUTPUT_BASE)
        ) {
            fs.rmdirSync(dir)
        }
    }
    removeEmptyDirs(OUTPUT_BASE)

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

async function build({ watch = false, skipInitial = false } = {}) {
    if (!skipInitial) {
        if (watch) {
            console.log(`${PREFIX} building...`)
            await buildImages(false)
        } else {
            await buildImages(true)
        }
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
                void buildImages(false)
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

export type { ImageManifest }
export { build }
