import imageManifestRaw from "@/lib/image-manifest.json"
import { cn } from "@/lib/utils"
import { EDGE_PAD, GRID_COLS, GRID_ROWS } from "@/scripts/process-images"

const imageManifest = imageManifestRaw as Record<
    string,
    { width: number; height: number; mapping: number[] }
>

interface ImageProps extends React.ComponentProps<"div"> {
    src: string
    alt?: string
    placeholderPriority?: boolean
    asBackgroundImage?: boolean
    imageRow?: "justified" | "proportional"
    limitHeight?: boolean
    noBorder?: boolean
    objectFit?: "fill" | "contain" | "cover" | "none" | "scale-down"
}

function Image({
    className,
    src,
    alt,
    placeholderPriority = false,
    asBackgroundImage = false,
    imageRow,
    limitHeight = false,
    noBorder = false,
    objectFit = "cover"
}: ImageProps) {
    const normalizedSrc = src.startsWith("/") ? src.slice(1) : src
    const metadata = imageManifest[normalizedSrc.replace(/\.[^/.]+$/, "")]

    const lastDotIndex = src.lastIndexOf(".")
    const pathWithoutExt = src.substring(0, lastDotIndex)
    const fileName = src.substring(src.lastIndexOf("/") + 1, lastDotIndex)
    const basePath = `/assets/images${pathWithoutExt}`

    const ROWS = GRID_ROWS
    const COLS = GRID_COLS

    const exactW = metadata.width
    const exactH = metadata.height
    const tileW = exactW / COLS
    const tileH = exactH / ROWS

    const spriteW = COLS * (tileW + 2 * EDGE_PAD)
    const spriteH = ROWS * (tileH + 2 * EDGE_PAD)

    const bgSizeX = (spriteW / tileW) * 100
    const bgSizeY = (spriteH / tileH) * 100

    return (
        <div
            className={cn(
                "relative grid w-full place-items-center overflow-clip",
                asBackgroundImage ? "h-full" : "h-fit",
                !noBorder && {
                    after: "z-2 pointer-events-none absolute inset-0 rounded-inherit -outline-offset-px outline-base/8 outline"
                },
                limitHeight && "h-200",
                className
            )}
            style={{
                flex: imageRow
                    ? `${imageRow === "justified" ? `calc(${exactW.toString()}/${exactH.toString()})` : exactW.toString()} 1 0%`
                    : undefined
            }}
        >
            {/* SEO & Preview Layer */}
            <img
                src={`${basePath}/${fileName}_preview.webp`}
                alt={alt}
                className={cn("absolute size-full object-cover")}
                loading={placeholderPriority ? "eager" : "lazy"}
                decoding="async"
            />

            {/* Represent image from `src` attribute or url() function */}
            <div
                className={cn(
                    "z-1 grid max-h-inherit max-w-inherit select-none grid-cols-3 grid-rows-3",
                    asBackgroundImage && "absolute",
                    objectFit === "fill" && "size-full",
                    objectFit === "contain" &&
                        "size-auto max-h-full max-w-full",
                    objectFit === "cover" && "size-auto min-h-full min-w-full"
                )}
                style={{
                    aspectRatio: `${exactW.toString()}/${exactH.toString()}`
                }}
                role="img"
                aria-hidden={true}
            >
                {Array.from({ length: ROWS * COLS }).map((_, index) => {
                    const scrambledIndex = metadata.mapping[index]

                    const c = scrambledIndex % COLS
                    const r = Math.floor(scrambledIndex / COLS)

                    const xPercent =
                        ((c * (tileW + 2 * EDGE_PAD) + EDGE_PAD) /
                            (spriteW - tileW)) *
                        100
                    const yPercent =
                        ((r * (tileH + 2 * EDGE_PAD) + EDGE_PAD) /
                            (spriteH - tileH)) *
                        100

                    return (
                        <div
                            key={index}
                            className="size-full bg-no-repeat"
                            style={{
                                backgroundImage: `url('${basePath}/${fileName}_scrambled.webp')`,
                                backgroundSize: `${bgSizeX.toString()}% ${bgSizeY.toString()}%`,
                                backgroundPosition: `${xPercent.toString()}% ${yPercent.toString()}%`
                            }}
                        />
                    )
                })}
            </div>

            <noscript>
                <img
                    src={`${basePath}/${fileName}_preview.webp`}
                    alt={alt}
                    decoding="async"
                />
            </noscript>
        </div>
    )
}

export { Image }
