import fs from "fs"
import { glob } from "glob"
import path from "path"
import sharp from "sharp"

const INPUT_DIR = "private/images"
const OUTPUT_BASE = "public/assets/images"
const MANIFEST_PATH = "src/lib/image-manifest.json"
const MAX_SIZE = 1602
export const GRID_ROWS = 3
export const GRID_COLS = 3

type ImageManifest = Record<string, { width: number; height: number }>
interface ImageMeta {
    mtime: number
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
            /* empty */
        }
    }

    const newManifest: ImageManifest = {}

    console.log(`Found ${files.length.toString()} images. Processing...`)

    for (const filePath of files) {
        const relativePath = path
            .relative(INPUT_DIR, filePath)
            .replace(/\\/g, "/")
        const parsedPath = path.parse(relativePath)

        const manifestKey = path
            .join(parsedPath.dir, parsedPath.name)
            .replace(/\\/g, "/")

        const outputFolder = path.join(
            OUTPUT_BASE,
            parsedPath.dir,
            parsedPath.name
        )
        if (!fs.existsSync(outputFolder)) {
            fs.mkdirSync(outputFolder, { recursive: true })
        }

        const stat = fs.statSync(filePath)
        const metaFile = path.join(outputFolder, `${parsedPath.name}_meta.json`)

        let isCached = false
        // Check cache dùng manifestKey mới
        if (fs.existsSync(metaFile)) {
            try {
                const meta = JSON.parse(
                    fs.readFileSync(metaFile, "utf-8")
                ) as ImageMeta
                if (meta.mtime === stat.mtimeMs) {
                    isCached = true
                }
            } catch {
                /* Empty */
            }
        }

        if (isCached) {
            newManifest[manifestKey] = oldManifest[manifestKey]
            continue
        }

        console.log(`Processing: ${relativePath}...`)

        const originalImage = sharp(filePath)
        const originalMetadata = await originalImage.metadata()

        const croppedImage =
            originalMetadata.width && originalMetadata.height
                ? originalImage.extract({
                      left: 1,
                      top: 1,
                      width: originalMetadata.width - 2,
                      height: originalMetadata.height - 2
                  })
                : originalImage

        const resizedBuffer = await croppedImage
            .resize({
                width: MAX_SIZE,
                height: MAX_SIZE,
                fit: "inside",
                withoutEnlargement: true
            })
            .toBuffer()

        const image = sharp(resizedBuffer)
        const metadata = await image.metadata()

        if (!metadata.width || !metadata.height) continue

        newManifest[manifestKey] = {
            width: metadata.width,
            height: metadata.height
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

        const colWidth = Math.ceil(metadata.width / GRID_COLS)
        const rowHeight = Math.ceil(metadata.height / GRID_ROWS)
        const promises = []
        for (let r = 0; r < GRID_ROWS; r++) {
            for (let c = 0; c < GRID_COLS; c++) {
                const left = c * colWidth
                const top = r * rowHeight
                const w =
                    left + colWidth > metadata.width
                        ? metadata.width - left
                        : colWidth
                const h =
                    top + rowHeight > metadata.height
                        ? metadata.height - top
                        : rowHeight
                if (w <= 0 || h <= 0) continue
                promises.push(
                    image
                        .clone()
                        .extract({ left, top, width: w, height: h })
                        .webp({ quality: 90 })
                        .toFile(
                            path.join(
                                outputFolder,
                                `${parsedPath.name}_${(r + 1).toString()}-${(c + 1).toString()}.webp`
                            )
                        )
                )
            }
        }
        await Promise.all(promises)

        fs.writeFileSync(metaFile, JSON.stringify({ mtime: stat.mtimeMs }))
    }

    if (!fs.existsSync(path.dirname(MANIFEST_PATH)))
        fs.mkdirSync(path.dirname(MANIFEST_PATH), { recursive: true })
    fs.writeFileSync(MANIFEST_PATH, JSON.stringify(newManifest, null, 2))
    console.log(`✅ Clean Manifest generated at ${MANIFEST_PATH}`)
}

void main()
