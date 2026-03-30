import { execSync } from "node:child_process"
import crypto from "node:crypto"
import fs from "node:fs"
import path from "node:path"
import readline from "node:readline"

import chokidar from "chokidar"
import { glob } from "glob"
import sharp from "sharp"

const INPUT_DIR = "private/media"
const OUTPUT_BASE = "public/assets/media"
const MANIFEST_PATH = "src/lib/video-manifest.json"

const SCRIPT_VERSION = "2"

const BRAND_COLOR = "\x1B[38;2;249;115;22m"
const RESET = "\x1B[0m"
const PREFIX = `${BRAND_COLOR}[VIDEOS]${RESET}`

const SHORT_VIDEO_THRESHOLD = 30 * 1024 * 1024

type VideoManifest = Record<
    string,
    {
        hash: string
        posterHash: string
        version: string
        type: "short" | "long"
        duration: number
        width: number
        height: number
        blurDataURL: string
    }
>

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

function getOriginalFps(filePath: string): number {
    try {
        const output = execSync(
            `ffprobe -v error -select_streams v -of default=noprint_wrappers=1:nokey=1 -show_entries stream=avg_frame_rate "${filePath}"`
        )
            .toString()
            .trim()

        const [num, den] = output.split("/")
        const fps = parseInt(num, 10) / parseInt(den || "1", 10)
        return isNaN(fps) || fps === 0 ? 24 : fps
    } catch {
        return 24
    }
}

function getVideoDuration(filePath: string): number {
    try {
        const output = execSync(
            `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${filePath}"`
        )
            .toString()
            .trim()

        const duration = parseFloat(output)
        return isNaN(duration) ? 0 : parseFloat(duration.toFixed(2))
    } catch {
        return 0
    }
}

function cleanVideoOutputFolder(folder: string) {
    if (!fs.existsSync(folder)) return
    const allowed = new Set(["poster.webp", "index.txt", "init.mp4"])
    const filesInDir = fs.readdirSync(folder)
    for (const file of filesInDir) {
        if (!allowed.has(file) && !/^chunk_\d+\.bin$/.test(file)) {
            fs.rmSync(path.join(folder, file), { recursive: true, force: true })
        }
    }
}

async function processVideo(
    filePath: string,
    oldManifest: VideoManifest,
    newManifest: VideoManifest
) {
    const relativePath = path
        .relative(INPUT_DIR, filePath)
        .replaceAll("\\", "/")
    const parsedPath = path.parse(relativePath)
    const manifestKey = path
        .join(parsedPath.dir, parsedPath.name)
        .replaceAll("\\", "/")
    const outputFolder = path.join(OUTPUT_BASE, parsedPath.dir, parsedPath.name)

    const absoluteInputPath = path.resolve(filePath)
    const posterSrc = path.join(
        INPUT_DIR,
        parsedPath.dir,
        `${parsedPath.name}-poster.webp`
    )

    if (!fs.existsSync(posterSrc)) {
        console.warn(
            `\n${PREFIX} Warning: Video doesn't have a poster or the format is invalid. Required: ${posterSrc}`
        )
        return false
    }

    const currentVideoHash = getFileHash(filePath)
    const currentPosterHash = getFileHash(posterSrc)

    const posterOutput = path.join(outputFolder, "poster.webp")
    const indexOutput = path.join(outputFolder, "index.txt")
    const initOutput = path.join(outputFolder, "init.mp4")

    let requiresVideoProcessing = true
    let requiresPosterProcessing = true

    if (Object.hasOwn(oldManifest, manifestKey)) {
        const cachedData = oldManifest[manifestKey]
        if (cachedData.version === SCRIPT_VERSION) {
            if (
                cachedData.hash === currentVideoHash &&
                fs.existsSync(indexOutput) &&
                fs.existsSync(initOutput)
            ) {
                requiresVideoProcessing = false
            }
            if (
                cachedData.posterHash === currentPosterHash &&
                fs.existsSync(posterOutput) &&
                cachedData.width &&
                cachedData.blurDataURL
            ) {
                requiresPosterProcessing = false
            }
        }
    }

    if (!requiresVideoProcessing && !requiresPosterProcessing) {
        newManifest[manifestKey] = oldManifest[manifestKey]
        cleanVideoOutputFolder(outputFolder)
        return false
    }

    if (!fs.existsSync(outputFolder)) {
        fs.mkdirSync(outputFolder, { recursive: true })
    }

    let width = 0
    let height = 0
    let blurDataURL = ""

    if (requiresPosterProcessing) {
        const image = sharp(posterSrc)

        const resizedBuffer = await image
            .clone()
            .resize({
                width: 1601,
                height: 1601,
                fit: "inside",
                withoutEnlargement: true
            })
            .webp({ quality: 80 })
            .toBuffer()

        const resizedMetadata = await sharp(resizedBuffer).metadata()
        width = resizedMetadata.width
        height = resizedMetadata.height

        const blurBuffer = await sharp(resizedBuffer)
            .clone()
            .resize({ width: 10 })
            .webp({ quality: 20 })
            .toBuffer()

        blurDataURL = `data:image/webp;base64,${blurBuffer.toString("base64")}`

        fs.writeFileSync(posterOutput, resizedBuffer)
    } else {
        width = oldManifest[manifestKey].width
        height = oldManifest[manifestKey].height
        blurDataURL = oldManifest[manifestKey].blurDataURL
    }

    let type: "short" | "long" = "long"
    let duration = 0

    if (requiresVideoProcessing) {
        const stats = fs.statSync(filePath)
        const isShort = stats.size <= SHORT_VIDEO_THRESHOLD

        const isGif = parsedPath.ext.toLowerCase() === ".gif"

        const m3u8Filename = "index.txt"
        const segmentPattern = "chunk_%03d.bin"
        const initFilename = "init.mp4"
        const hlsTime = isShort ? 9999 : 6

        const originalFps = getOriginalFps(absoluteInputPath)
        const targetFps = originalFps < 24 ? 24 : Math.round(originalFps)
        const fpsFilter = `-vf "fps=${targetFps}"`
        const keyframeInterval = targetFps * 2

        const audioFilter = isGif ? "-an" : "-c:a aac"
        const pixelFormat = isGif ? "-pix_fmt yuv420p" : ""

        duration = getVideoDuration(absoluteInputPath)

        const ffmpegCmd = `ffmpeg -y -i "${absoluteInputPath}" -c:v libx264 ${pixelFormat} -preset veryslow -crf 28 ${fpsFilter} -g ${keyframeInterval} -sc_threshold 0 ${audioFilter} -hls_time ${hlsTime} -hls_playlist_type vod -hls_segment_type fmp4 -hls_fmp4_init_filename "${initFilename}" -hls_segment_filename "${segmentPattern}" -f hls "${m3u8Filename}"`

        try {
            execSync(ffmpegCmd, { cwd: outputFolder, stdio: "ignore" })
            type = isShort ? "short" : "long"
        } catch (error) {
            console.error(
                `\n${PREFIX} Error processing HLS for ${filePath}:`,
                error
            )
            return false
        }
    } else {
        type = oldManifest[manifestKey].type
        duration = oldManifest[manifestKey].duration
    }

    newManifest[manifestKey] = {
        hash: currentVideoHash,
        posterHash: currentPosterHash,
        version: SCRIPT_VERSION,
        type,
        duration,
        width,
        height,
        blurDataURL
    }

    cleanVideoOutputFolder(outputFolder)
    return true
}

async function buildVideos(showProgress = false) {
    const startTime = performance.now()
    const files = await glob(`${INPUT_DIR}/**/*.{mp4,mov,webm,gif}`)

    let oldManifest: VideoManifest = {}
    if (fs.existsSync(MANIFEST_PATH)) {
        try {
            oldManifest = JSON.parse(
                fs.readFileSync(MANIFEST_PATH, "utf-8")
            ) as VideoManifest
        } catch {}
    }

    const newManifest: VideoManifest = {}
    let actuallyProcessed = 0
    let processedCount = 0

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

    await Promise.all(
        files.map(async (file) => {
            const didProcess = await processVideo(
                file,
                oldManifest,
                newManifest
            )
            if (didProcess) actuallyProcessed++

            processedCount++

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
        })
    )

    if (showProgress && files.length > 0 && process.stdout.isTTY) {
        console.log()
    }

    const validOutputFolders = new Set(
        Object.keys(newManifest).map((key) =>
            path.join(OUTPUT_BASE, key).replaceAll("\\", "/")
        )
    )

    const existingVideoFiles = await glob(`${OUTPUT_BASE}/**/index.txt`)
    for (const videoFile of existingVideoFiles) {
        const folderPath = path.dirname(videoFile).replaceAll("\\", "/")
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

    if (!fs.existsSync(path.dirname(MANIFEST_PATH))) {
        fs.mkdirSync(path.dirname(MANIFEST_PATH), { recursive: true })
    }
    fs.writeFileSync(MANIFEST_PATH, JSON.stringify(newManifest, null, 2))

    const endTime = performance.now()
    const timeTook = (endTime - startTime).toFixed(2)

    if (actuallyProcessed > 0) {
        console.log(
            `${PREFIX} build finished in ${timeTook}ms. Processed ${actuallyProcessed.toString()} videos.`
        )
    } else {
        console.log(`${PREFIX} build finished in ${timeTook}ms. All cached.`)
    }
}

const IGNORE_REGEX = /(^|[/\\])\../i

async function build({ watch = false, skipInitial = false } = {}) {
    if (!skipInitial) {
        if (watch) {
            console.log(`${PREFIX} building...`)
            await buildVideos(false)
        } else {
            await buildVideos(true)
        }
    }

    if (watch) {
        console.log(`${PREFIX} watching for changes in '${INPUT_DIR}'`)

        const watcher = chokidar.watch(
            [
                `${INPUT_DIR}/**/*.{mp4,mov,webm,gif}`,
                `${INPUT_DIR}/**/*-poster.webp`
            ],
            {
                ignored: IGNORE_REGEX,
                ignoreInitial: true
            }
        )

        let debounceTimer: NodeJS.Timeout
        const handleChange = () => {
            clearTimeout(debounceTimer)
            debounceTimer = setTimeout(() => {
                console.log(`${PREFIX} building...`)
                void buildVideos(false)
            }, 300)
        }

        watcher.on("add", handleChange)
        watcher.on("change", handleChange)
        watcher.on("unlink", handleChange)
    }
}

void (async () => {
    const isMain = process.argv[1]
        ?.replace(/\\/g, "/")
        .endsWith("process-videos.ts")
    if (isMain) {
        const isWatch =
            process.argv.includes("--watch") || process.argv.includes("-w")
        const skipInitial =
            process.argv.includes("--skip-initial") ||
            process.argv.includes("--skipInitial")
        await build({ watch: isWatch, skipInitial })
    }
})()

export type { VideoManifest }
export { build }
