import imageManifestRaw from "@/lib/image-manifest.json"
import { cn } from "@/lib/utils"

// Type assertion để TS hiểu cấu trúc JSON
const imageManifest = imageManifestRaw as Record<
    string,
    { width: number; height: number }
>

interface ProtectedImageProps {
    src: string // Vd: "projects/project-a/render.jpg" (trùng với path trong private)
    alt: string
    className?: string | undefined
    priority?: boolean // Tùy chọn load ưu tiên cho LCP
}

function Image({ src, alt, className, priority = false }: ProtectedImageProps) {
    // 1. Lấy thông tin từ Manifest (Tự động Aspect Ratio)
    const tiledSrc = src.replace(/\.[^/.]+$/, ".webp")
    const meta = imageManifest[tiledSrc]

    // if (!meta) {
    //     console.warn(`Image metadata for "${tiledSrc}" not found in manifest`)
    //     return null
    // }

    // Parse path
    const lastDotIndex = src.lastIndexOf(".")
    const pathWithoutExt = src.substring(0, lastDotIndex)
    const fileName = src.substring(src.lastIndexOf("/") + 1, lastDotIndex)
    const basePath = `/assets/images/${pathWithoutExt}`

    const ROWS = 3
    const COLS = 3

    return (
        <div
            className={cn(
                "group relative w-full overflow-hidden select-none",
                className
            )}
            style={{
                aspectRatio: `${meta.width.toString()}/${meta.height.toString()}`
            }}
        >
            {/* Tiles Grid */}
            <div
                className="grid h-full w-full grid-cols-3 grid-rows-3 overflow-hidden rounded-2xl"
                role="presentation"
            >
                {/* SEO & Preview Layer */}
                {/*! FIX */}
                <img
                    src={`${basePath}/${fileName}_preview.webp`}
                    alt={alt}
                    className="absolute inset-0 -z-10 h-full w-full object-contain"
                    loading={priority ? "eager" : "lazy"}
                />
                <noscript>
                    <img
                        src={`${basePath}/${fileName}_preview.webp`}
                        alt={alt}
                    />
                </noscript>
                {Array.from({ length: ROWS * COLS }).map((_, index) => {
                    const r = Math.floor(index / COLS)
                    const c = index % COLS
                    const position = `${(r + 1).toString()}-${(c + 1).toString()}`

                    return (
                        <img
                            key={position}
                            src={`${basePath}/${fileName}_${position}.webp`}
                            alt=""
                            draggable={false}
                            loading="lazy"
                            className="size-full"
                        />
                    )
                })}
            </div>
        </div>
    )
}

export { Image }
