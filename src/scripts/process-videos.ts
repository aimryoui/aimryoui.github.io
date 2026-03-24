import { execSync } from "node:child_process"
import crypto from "node:crypto"
import fs from "node:fs"
import path from "node:path"
import readline from "node:readline"

import chokidar from "chokidar"
import { glob } from "glob"

const INPUT_DIR = "private/media"
const OUTPUT_BASE = "public/assets/media"
const MANIFEST_PATH = "src/lib/video-manifest.json"

const SCRIPT_VERSION = "1"

const BRAND_COLOR = "\x1B[38;2;249;115;22m"
const RESET = "\x1B[0m"
const PREFIX = `${BRAND_COLOR}[VIDEOS]${RESET}`

const SHORT_VIDEO_THRESHOLD = 30 * 1024 * 1024

type VideoManifest = Record<
    string,
    { hash: string; version: string; type: "short" | "long"; duration: number }
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

function processVideo(
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

    const currentHash = getFileHash(filePath)

    if (Object.hasOwn(oldManifest, manifestKey)) {
        const cachedData = oldManifest[manifestKey]
        if (
            cachedData.hash === currentHash &&
            cachedData.version === SCRIPT_VERSION
        ) {
            newManifest[manifestKey] = cachedData
            return false // Cache hit
        }
    }

    if (!fs.existsSync(outputFolder)) {
        fs.mkdirSync(outputFolder, { recursive: true })
    }

    const posterSrc = path.join(
        INPUT_DIR,
        parsedPath.dir,
        `${parsedPath.name}-poster.webp`
    )
    if (fs.existsSync(posterSrc)) {
        fs.copyFileSync(posterSrc, path.join(outputFolder, "poster.webp"))
    }

    const stats = fs.statSync(filePath)
    const isShort = stats.size <= SHORT_VIDEO_THRESHOLD

    const absoluteInputPath = path.resolve(filePath)
    const m3u8Filename = "index.m3u8"
    const segmentPattern = "chunk_%03d.m4s"
    const initFilename = "init.mp4"
    const hlsTime = isShort ? 9999 : 6

    const originalFps = getOriginalFps(absoluteInputPath)
    const targetFps = originalFps < 24 ? 24 : Math.round(originalFps)
    const fpsFilter = `-vf "fps=${targetFps}"`
    const keyframeInterval = targetFps * 2

    const duration = getVideoDuration(absoluteInputPath)

    const ffmpegCmd = `ffmpeg -y -i "${absoluteInputPath}" -c:v libx264 -preset veryslow -crf 28 ${fpsFilter} -g ${keyframeInterval} -sc_threshold 0 -c:a aac -hls_time ${hlsTime} -hls_playlist_type vod -hls_segment_type fmp4 -hls_fmp4_init_filename "${initFilename}" -hls_segment_filename "${segmentPattern}" "${m3u8Filename}"`

    try {
        execSync(ffmpegCmd, { cwd: outputFolder, stdio: "ignore" })

        newManifest[manifestKey] = {
            hash: currentHash,
            version: SCRIPT_VERSION,
            type: isShort ? "short" : "long",
            duration: duration
        }
    } catch (error) {
        console.error(
            `\n${PREFIX} Error processing HLS for ${filePath}:`,
            error
        )
        return false
    }

    return true
}

async function buildVideos(showProgress = false) {
    const startTime = performance.now()
    const files = await glob(`${INPUT_DIR}/**/*.{mp4,mov,webm}`)

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

    for (const file of files) {
        const didProcess = processVideo(file, oldManifest, newManifest)
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
    }

    if (showProgress && files.length > 0 && process.stdout.isTTY) {
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
        const watcher = chokidar.watch(`${INPUT_DIR}/**/*.{mp4,mov,webm}`, {
            ignored: IGNORE_REGEX,
            ignoreInitial: true
        })

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

export { build }
