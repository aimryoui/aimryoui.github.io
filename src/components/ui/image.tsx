"use client"

import { useEffect, useRef, useState } from "react"

import { EDGE_PAD, GRID_COLS, GRID_ROWS } from "@/configs/image.config"
import imageManifestRaw from "@/lib/image-manifest.json"
import { cn } from "@/lib/utils"

const imageManifest = imageManifestRaw as Record<
    string,
    { width: number; height: number; mapping: number[] }
>

let sharedObserver: IntersectionObserver | null = null
const callbacks = new Map<Element, () => void>()

function getObserver() {
    if (typeof window === "undefined") return null

    sharedObserver ??= new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const callback = callbacks.get(entry.target)
                    if (callback) {
                        callback()
                        sharedObserver?.unobserve(entry.target)
                        callbacks.delete(entry.target)
                    }
                }
            })
        },
        { rootMargin: "50% 0px 50% 0px" }
    )
    return sharedObserver
}

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
    const [isVisible, setIsVisible] = useState(placeholderPriority)
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (isVisible) return

        const element = containerRef.current
        if (!element) return

        const observer = getObserver()
        if (!observer) return

        callbacks.set(element, () => {
            setIsVisible(true)
        })
        observer.observe(element)

        return () => {
            observer.unobserve(element)
            callbacks.delete(element)
        }
    }, [isVisible])

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
            ref={containerRef}
            className={cn(
                "relative grid w-full place-items-center overflow-clip",
                asBackgroundImage ? "h-full" : "h-fit",
                !noBorder && {
                    after: "pointer-events-none absolute inset-0 z-2 rounded-inherit -outline-offset-px outline-base/8 outline"
                },
                limitHeight && "h-200",
                className
            )}
            style={{
                flex: imageRow
                    ? `${imageRow === "justified" ? `calc(${exactW.toString()}/${exactH.toString()})` : exactW.toString()} 1 0%`
                    : undefined,
                maxWidth: imageRow
                    ? `${(exactW / 16).toString()}rem`
                    : undefined
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
                                backgroundImage: isVisible
                                    ? `url('${basePath}/${fileName}_scrambled.webp')`
                                    : undefined,
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
