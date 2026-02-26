// oxlint-disable nextjs/no-img-element
"use client"

import { EDGE_PAD, GRID_COLS, GRID_ROWS } from "@/configs/image.config"
import imageManifestRaw from "@/lib/image-manifest.json"
import { cn } from "@/lib/utils"

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
    objectFit = "cover",
    ...props
}: ImageProps) {
    const normalizedSrc = src.startsWith("/") ? src.slice(1) : src
    const metadata = imageManifest[normalizedSrc.replace(/\.[^/.]+$/, "")]

    const lastDotIndex = src.lastIndexOf(".")
    const pathWithoutExt = src.slice(0, lastDotIndex)
    const fileName = src.slice(src.lastIndexOf("/") + 1, lastDotIndex)
    const basePath = `/assets/images${pathWithoutExt}`

    const ROWS = GRID_ROWS
    const COLS = GRID_COLS

    const exactW = metadata.width
    const exactH = metadata.height

    const spriteW = exactW + COLS * 2 * EDGE_PAD
    const spriteH = exactH + ROWS * 2 * EDGE_PAD

    const imgWidthPercent = (spriteW / exactW) * 100
    const imgHeightPercent = (spriteH / exactH) * 100

    const padX = (EDGE_PAD / spriteW) * 100
    const padY = (EDGE_PAD / spriteH) * 100

    const colPct = 100 / COLS
    const rowPct = 100 / ROWS

    const targetColPct = (exactW / spriteW / COLS) * 100
    const targetRowPct = (exactH / spriteH / ROWS) * 100

    const cssVars: Record<string, string> = {
        "--w": `${imgWidthPercent.toString()}%`,
        "--h": `${imgHeightPercent.toString()}%`
    }

    for (let i = 0; i < COLS; i++) {
        cssVars[`--x${i.toString()}`] = `${(i * colPct + padX).toString()}%`
    }
    for (let i = 0; i < ROWS; i++) {
        cssVars[`--y${i.toString()}`] = `${(i * rowPct + padY).toString()}%`
    }

    return (
        <div
            className={cn(
                "relative grid w-full place-items-center overflow-hidden",
                asBackgroundImage ? "h-full" : "h-fit",
                !noBorder && {
                    after: "pointer-events-none absolute inset-0 z-2 rounded-inherit border border-white/15 mix-blend-difference"
                },
                limitHeight && "h-200",
                className
            )}
            style={{
                flex: imageRow
                    ? `${imageRow === "justified" ? `calc(${exactW.toString()}/${exactH.toString()})` : exactW.toString()} 1 0%`
                    : undefined,
                ...cssVars
            }}
            {...props}
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
                    "z-1 max-h-inherit max-w-inherit",
                    asBackgroundImage && "absolute",
                    objectFit === "fill" && "size-full",
                    objectFit === "contain" &&
                        "size-auto max-h-full max-w-full",
                    objectFit === "cover" && "size-auto min-h-full min-w-full"
                )}
                style={{
                    aspectRatio: `${exactW.toString()}/${exactH.toString()}`
                }}
                aria-hidden={true}
            >
                {Array.from({ length: ROWS * COLS }).map((_, index) => {
                    const targetC = index % COLS
                    const targetR = Math.floor(index / COLS)

                    const scrambledIndex = metadata.mapping[index]
                    const sourceC = scrambledIndex % COLS
                    const sourceR = Math.floor(scrambledIndex / COLS)

                    const translateX =
                        targetC * targetColPct - sourceC * colPct - padX
                    const translateY =
                        targetR * targetRowPct - sourceR * rowPct - padY

                    return (
                        <img
                            key={index}
                            src={`${basePath}/${fileName}_scrambled.webp`}
                            alt=""
                            className="absolute h-[--h] w-[--w] max-w-none"
                            style={{
                                clipPath: `inset(var(--y${sourceR.toString()}) var(--x${(COLS - 1 - sourceC).toString()}) var(--y${(ROWS - 1 - sourceR).toString()}) var(--x${sourceC.toString()}))`,
                                transform: `translate(${translateX.toString()}%, ${translateY.toString()}%)`
                            }}
                            decoding="async"
                            loading="lazy"
                            draggable={false}
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
