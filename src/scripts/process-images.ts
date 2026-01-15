import fs from "fs"
import { glob } from "glob"
import path from "path"
import sharp from "sharp"

// CẤU HÌNH
const INPUT_DIR = "private/images"
const OUTPUT_BASE = "public/assets/images"
const MANIFEST_PATH = "src/lib/image-manifest.json"
const MAX_SIZE = 1602 // Resize ảnh gốc về tối đa 1602px cạnh lớn nhất, chia hết cho 3
export const GRID_ROWS = 3
export const GRID_COLS = 3

// Interface Manifest
type ImageManifest = Record<string, { width: number; height: number }>
interface ImageMeta {
    mtime: number
}

async function main() {
    // 1. Quét toàn bộ file trong private
    const files = await glob(`${INPUT_DIR}/**/*.{png,jpg,jpeg,webp}`)

    // 2. Load manifest cũ (chỉ để check cache, không dùng để ghi)
    let oldManifest: ImageManifest = {}
    if (fs.existsSync(MANIFEST_PATH)) {
        try {
            oldManifest = JSON.parse(
                fs.readFileSync(MANIFEST_PATH, "utf-8")
            ) as ImageManifest
        } catch (e) {
            // Empty
        }
    }

    // 3. Tạo Manifest MỚI TINH (Đây là cơ chế dọn rác tự động)
    const newManifest: ImageManifest = {}

    console.log(`Found ${files.length.toString()} images. Processing...`)

    for (const filePath of files) {
        const relativePath = path
            .relative(INPUT_DIR, filePath)
            .replace(/\\/g, "/")
        const parsedPath = path.parse(relativePath)

        // Output folder
        const outputFolder = path.join(
            OUTPUT_BASE,
            parsedPath.dir,
            parsedPath.name
        )
        if (!fs.existsSync(outputFolder)) {
            fs.mkdirSync(outputFolder, { recursive: true })
        }

        // Check Cache logic
        const stat = fs.statSync(filePath)
        const metaFile = path.join(outputFolder, `${parsedPath.name}_meta.json`)
        let isCached = false

        // Nếu file chưa sửa VÀ key vẫn tồn tại trong manifest cũ
        if (fs.existsSync(metaFile)) {
            const meta = JSON.parse(
                fs.readFileSync(metaFile, "utf-8")
            ) as ImageMeta
            if (meta.mtime === stat.mtimeMs) {
                isCached = true
            }
        }

        // --- QUAN TRỌNG: Xử lý Resize trước ---
        // Chúng ta resize ảnh về RAM (Buffer) để xử lý nhanh
        const originalImage = sharp(filePath)

        // Resize sao cho cạnh lớn nhất <= 1600px, giữ nguyên tỉ lệ
        const resizedBuffer = await originalImage
            .resize({
                width: MAX_SIZE,
                height: MAX_SIZE,
                fit: "inside",
                withoutEnlargement: true
            })
            .toBuffer()

        // Tạo instance sharp mới từ buffer đã resize
        const image = sharp(resizedBuffer)
        const metadata = await image.metadata()

        if (!metadata.width || !metadata.height) continue

        // Cập nhật vào NEW Manifest (Dữ liệu width/height của ảnh ĐÃ resize)
        newManifest[relativePath] = {
            width: metadata.width,
            height: metadata.height
        }

        // Nếu đã cache, chỉ cần copy data từ oldManifest sang newManifest là xong
        // (nhưng ở trên ta đã tính lại metadata từ buffer để đảm bảo chính xác tuyệt đối,
        // đoạn này sharp đọc metadata từ buffer cực nhanh nên ko cần optimize quá mức)
        if (isCached) {
            // console.log(`Skipping (Cached): ${relativePath}`)
            continue
        }

        console.log(
            `Processing: ${relativePath} (${metadata.width.toString()}x${metadata.height.toString()})`
        )

        // 1. Tạo SEO Preview (nhỏ hơn nữa)
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

        // 2. Cắt Grid (Logic đơn giản, chia đều)
        const colWidth = Math.ceil(metadata.width / GRID_COLS)
        const rowHeight = Math.ceil(metadata.height / GRID_ROWS)

        const promises = []

        for (let r = 0; r < GRID_ROWS; r++) {
            for (let c = 0; c < GRID_COLS; c++) {
                const left = c * colWidth
                const top = r * rowHeight

                // Xử lý phần dư ở cạnh cuối cùng để không bị lỗi out of bounds
                const w =
                    left + colWidth > metadata.width
                        ? metadata.width - left
                        : colWidth
                const h =
                    top + rowHeight > metadata.height
                        ? metadata.height - top
                        : rowHeight

                if (w <= 0 || h <= 0) continue // Safety check

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

        // Ghi meta cache
        fs.writeFileSync(metaFile, JSON.stringify({ mtime: stat.mtimeMs }))
    }

    // 4. Ghi đè file Manifest (Sạch sẽ, chỉ chứa file đang tồn tại)
    if (!fs.existsSync(path.dirname(MANIFEST_PATH))) {
        fs.mkdirSync(path.dirname(MANIFEST_PATH), { recursive: true })
    }
    fs.writeFileSync(MANIFEST_PATH, JSON.stringify(newManifest, null, 2))
    console.log(`✅ Clean Manifest generated at ${MANIFEST_PATH}`)
}

void main()
