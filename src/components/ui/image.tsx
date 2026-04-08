"use client"

import { useEffect, useRef, useState } from "react"
import NextImage from "next/image"

import { EDGE_PAD, GRID_COLS, GRID_ROWS } from "@/configs/image.config"
import imageManifestRaw from "@/lib/image-manifest.json"
import { cn } from "@/lib/utils"
import { type ImageManifest } from "@/scripts/process-images"

const imageManifest = imageManifestRaw as ImageManifest

const FILE_EXTENSION_REGEX = /\.[^/.]+$/

interface ImageProps extends React.ComponentProps<"div"> {
    src: string
    alt: string
    placeholderPriority?: boolean
    asBackgroundImage?: boolean
    imageRow?: "justified" | "proportional"
    limitHeight?: boolean
    noBorder?: boolean
    pngBorder?: boolean
    rounded?: boolean
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
    pngBorder = false,
    rounded = false,
    objectFit = "cover",
    ...props
}: ImageProps) {
    const containerRef = useRef<HTMLDivElement>(null)

    const [isNearViewport, setIsNearViewport] = useState(true)

    useEffect(() => {
        const element = containerRef.current
        if (!element) return

        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsNearViewport(entry.isIntersecting)
            },
            {
                rootMargin: "200% 0px 200% 0px",
                threshold: 0
            }
        )

        observer.observe(element)

        return () => {
            observer.unobserve(element)
        }
    }, [])

    const normalizedSrc = src.startsWith("/") ? src.slice(1) : src
    const metadata =
        imageManifest[normalizedSrc.replace(FILE_EXTENSION_REGEX, "")]

    if (!metadata) {
        console.error(`[Image]: No metadata for "${src}" in manifest.`)
    }

    const lastDotIndex = src.lastIndexOf(".")
    const pathWithoutExt = src.slice(0, lastDotIndex)
    const fileName = src.slice(src.lastIndexOf("/") + 1, lastDotIndex)
    const basePath = `/assets/media${pathWithoutExt}`

    const Rows = GRID_ROWS
    const Cols = GRID_COLS

    const exactW = metadata.width
    const exactH = metadata.height

    const spriteW = exactW + Cols * 2 * EDGE_PAD
    const spriteH = exactH + Rows * 2 * EDGE_PAD

    const imgWidthPercent = (spriteW / exactW) * 100
    const imgHeightPercent = (spriteH / exactH) * 100

    const padX = (EDGE_PAD / spriteW) * 100
    const padY = (EDGE_PAD / spriteH) * 100

    const colPct = 100 / Cols
    const rowPct = 100 / Rows

    const targetColPct = (exactW / spriteW / Cols) * 100
    const targetRowPct = (exactH / spriteH / Rows) * 100

    const cssVars: Record<string, string> = {
        "--w": `${imgWidthPercent.toString()}%`,
        "--h": `${imgHeightPercent.toString()}%`
    }

    for (let i = 0; i < Cols; i++) {
        cssVars[`--x${i.toString()}`] = `${(i * colPct + padX).toString()}%`
    }
    for (let i = 0; i < Rows; i++) {
        cssVars[`--y${i.toString()}`] = `${(i * rowPct + padY).toString()}%`
    }

    const aspect = `${exactW.toString()}/${exactH.toString()}`

    return (
        <div
            ref={containerRef}
            className={cn(
                limitHeight ? "min-w-0 max-w-full" : "w-full",
                asBackgroundImage ? "h-full" : "h-fit",
                "relative grid place-items-center",
                !pngBorder && "overflow-hidden",
                rounded && "rounded-2xl",
                !noBorder && {
                    after: "pointer-events-none absolute inset-0 z-2 rounded-inherit border border-default/15"
                },
                className
            )}
            style={{
                flex: imageRow
                    ? `${imageRow === "justified" ? `calc(${aspect})` : exactW.toString()} 1 0%`
                    : undefined,
                aspectRatio: asBackgroundImage ? undefined : aspect,
                ...(limitHeight && {
                    width: `calc(max(80vh, calc(var(--spacing) * 125)) * calc(${aspect}))`
                }),
                ...cssVars
            }}
            {...props}
        >
            {/* SEO & Preview Layer */}
            <NextImage
                src={`${basePath}/${fileName}_preview.webp`}
                alt={alt}
                width={exactW}
                height={exactH}
                className={cn(
                    "absolute size-full select-none object-cover",
                    pngBorder &&
                        "drop-shadow-[0_0_2px_color-mix(in_oklab,var(--white)_calc(0.50*100%),transparent)]"
                )}
                style={{
                    background: `url("${metadata.blurDataURL}") center / cover no-repeat`
                }}
                draggable={false}
                fetchPriority="high"
                loading={placeholderPriority ? "eager" : "lazy"}
                onLoad={(e) => {
                    e.currentTarget.style.background = ""
                }}
            />

            {isNearViewport && (
                // Represent image from `src` attribute or url() function
                <div
                    className={cn(
                        "z-1 max-h-inherit max-w-inherit",
                        asBackgroundImage && "absolute",
                        objectFit === "fill" && "size-full",
                        objectFit === "contain" &&
                            "size-auto max-h-full max-w-full",
                        objectFit === "cover" &&
                            "size-auto min-h-full min-w-full"
                    )}
                    style={{
                        aspectRatio: `${exactW.toString()}/${exactH.toString()}`
                    }}
                    aria-hidden={true}
                >
                    {Array.from({ length: Rows * Cols }).map((_, index) => {
                        const targetC = index % Cols
                        const targetR = Math.floor(index / Cols)

                        const scrambledIndex = metadata.mapping[index]
                        const sourceC = scrambledIndex % Cols
                        const sourceR = Math.floor(scrambledIndex / Cols)

                        const translateX =
                            targetC * targetColPct - sourceC * colPct - padX
                        const translateY =
                            targetR * targetRowPct - sourceR * rowPct - padY

                        return (
                            <img
                                key={index}
                                src={`${basePath}/${fileName}_scrambled.webp`}
                                alt=""
                                className="absolute h-[--h] w-[--w] max-w-none select-none"
                                style={{
                                    clipPath: `inset(var(--y${sourceR.toString()}) var(--x${(Cols - 1 - sourceC).toString()}) var(--y${(Rows - 1 - sourceR).toString()}) var(--x${sourceC.toString()}))`,
                                    transform: `translate(${translateX.toString()}%, ${translateY.toString()}%)`
                                }}
                                decoding="async"
                                loading="lazy"
                                draggable={false}
                            />
                        )
                    })}
                </div>
            )}

            <noscript>
                <img src={`${basePath}/${fileName}_preview.webp`} alt={alt} />
            </noscript>
        </div>
    )
}

export { Image }
