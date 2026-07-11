"use client"

import { useEffect, useRef, useState } from "react"
import NextImage from "next/image"

import { mergeRefs } from "react-merge-refs"

import { LightboxItem } from "@/components/ui/lightbox"
import { EDGE_PAD, GRID_COLS, GRID_ROWS } from "@/configs/image.config"
import imageManifestRaw from "@/lib/image-manifest.json"
import { cn } from "@/lib/utils"
import { type ImageManifest } from "@/scripts/process-images"

type ImageProps = React.ComponentProps<"div"> & {
    src: string
    alt: string
    placeholderPriority?: boolean
    asBackgroundImage?: boolean
    imageRow?: "justified" | "proportional"
    limitHeight?: boolean
    noBorder?: boolean
    objectFit?: "fill" | "contain" | "cover" | "none" | "scale-down"
    inLightbox?: boolean
    lightbox?: boolean
}

type RoundedImageProps = XOR<
    { rounded?: boolean },
    { percentageRounded?: number }
>

type PngProps = { trimEdges?: boolean } & XOR<
    { pngAntiBleed?: boolean },
    { pngBorder?: boolean }
>

type ImageCoreProps = ImageProps & RoundedImageProps & PngProps

const imageManifest = imageManifestRaw as ImageManifest

const FILE_EXTENSION_REGEX = /\.[^/.]+$/u

function getParsedImageData(src: string) {
    const normalizedSrc = src.startsWith("/") ? src.slice(1) : src
    const metadata =
        imageManifest[normalizedSrc.replace(FILE_EXTENSION_REGEX, "")]

    if (!metadata) {
        console.error(`[Image]: No metadata for "${src}" in manifest.`)
    }

    const exactW = metadata.width
    const exactH = metadata.height
    const aspectRatio = `${exactW.toString()}/${exactH.toString()}`

    const lastDotIndex = src.lastIndexOf(".")
    const pathWithoutExt = src.slice(0, lastDotIndex)
    const fileName = src.slice(src.lastIndexOf("/") + 1, lastDotIndex)
    const basePath = `/assets/media${pathWithoutExt}`

    return { metadata, exactW, exactH, aspectRatio, basePath, fileName }
}

type ParsedImageData = ReturnType<typeof getParsedImageData>

function ImageCore({
    className,
    parsedData,
    placeholderPriority = false,
    asBackgroundImage = false,
    imageRow,
    limitHeight = false,
    rounded = false,
    percentageRounded,
    noBorder = false,
    pngAntiBleed = false,
    pngBorder = false,
    trimEdges = false,
    objectFit = "cover",
    lightbox = true,
    inLightbox = false,
    ref,
    ...props
}: ImageCoreProps & { parsedData: ParsedImageData }) {
    const containerRef = useRef<HTMLDivElement>(null)

    const [isNearViewport, setIsNearViewport] = useState(true)

    useEffect(() => {
        if (inLightbox) return

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
    }, [inLightbox])

    if (!parsedData.metadata) return null

    const { metadata, exactW, exactH, aspectRatio, basePath, fileName } =
        parsedData

    const Rows = GRID_ROWS
    const Cols = GRID_COLS

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

    return (
        <div
            ref={mergeRefs([containerRef, ref])}
            className={cn(
                limitHeight ? "min-w-0 max-w-full" : "w-full",
                asBackgroundImage ? "h-full" : "h-fit",
                "relative grid place-items-center",
                !pngBorder && "overflow-hidden",
                rounded && !percentageRounded && "rounded-media",
                lightbox && !inLightbox && "cursor-zoom-in",
                !noBorder &&
                    !pngBorder && {
                        after: [
                            "pointer-events-none absolute inset-0 z-2 rounded-inherit border border-default/15 will-change-[border-color] transition-[border-color] duration-250"
                        ]
                    },
                className
            )}
            style={{
                "--nhn-aspect-ratio": aspectRatio,
                ...(limitHeight &&
                    !inLightbox && {
                        width: "calc(max(80vh, calc(var(--spacing) * 125)) * calc(var(--nhn-aspect-ratio)))"
                    }),
                ...(percentageRounded &&
                    !rounded && {
                        borderRadius: `calc(${percentageRounded}% * var(--nhn-offset-factor)) / calc(${percentageRounded}% * var(--nhn-aspect-ratio) * var(--nhn-offset-factor))`
                    }),
                ...(inLightbox &&
                    rounded && {
                        borderRadius:
                            "calc(var(--radius-media) / var(--nhn-wrap-scale))"
                    }),
                ...(imageRow &&
                    !inLightbox && {
                        flex: `${imageRow === "justified" ? "calc(var(--nhn-aspect-ratio))" : exactW} 1 0%`
                    }),
                ...(!asBackgroundImage && {
                    aspectRatio: "var(--nhn-aspect-ratio)"
                }),
                ...cssVars
            }}
            {...props}
        >
            {/* SEO & Preview Layer */}
            {!inLightbox && (
                <NextImage
                    src={`${basePath}/${fileName}_preview.webp`}
                    alt={props.alt}
                    width={exactW}
                    height={exactH}
                    className={cn(
                        "absolute size-full select-none object-cover",
                        (pngAntiBleed || pngBorder) &&
                            "transform-gpu will-change-transform backface-hidden [filter:url(#png-anti-bleed)]",
                        trimEdges && "[clip-path:inset(.375rem)]"
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
            )}

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
                            "size-auto min-h-full min-w-full",

                        pngBorder &&
                            "transform-gpu will-change-transform backface-hidden [filter:url(#png-border)]"
                    )}
                    style={{
                        aspectRatio
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
                                className={cn(
                                    "absolute h-[--h] w-[--w] max-w-none select-none",
                                    inLightbox && "pswp__img"
                                )}
                                style={{
                                    clipPath: `inset(var(--y${sourceR.toString()}) var(--x${(Cols - 1 - sourceC).toString()}) var(--y${(Rows - 1 - sourceR).toString()}) var(--x${sourceC.toString()}))`,
                                    transform: `translate(${translateX.toString()}%, ${translateY.toString()}%)`
                                }}
                                decoding="async"
                                loading={inLightbox ? "eager" : "lazy"}
                                draggable={false}
                            />
                        )
                    })}
                </div>
            )}

            <noscript>
                <img
                    src={`${basePath}/${fileName}_preview.webp`}
                    alt={props.alt}
                />
            </noscript>
        </div>
    )
}

function Image({ className, lightbox = true, ref, ...props }: ImageCoreProps) {
    const parsedData = getParsedImageData(props.src)

    return lightbox ? (
        <LightboxItem
            thumbnail={`${parsedData.basePath}/${parsedData.fileName}_preview.webp`}
            width={parsedData.exactW}
            height={parsedData.exactH}
            placeholderAspectRatio={parsedData.aspectRatio}
            rounded={props.rounded}
            percentageRounded={props.percentageRounded}
            noBorder={props.noBorder}
            pngBorder={props.pngBorder}
            pngAntiBleed={props.pngAntiBleed}
            content={
                <ImageCore
                    parsedData={parsedData}
                    {...props}
                    inLightbox={true}
                />
            }
        >
            {({ ref: lightboxRef, open }) => (
                <ImageCore
                    parsedData={parsedData}
                    ref={mergeRefs([ref, lightboxRef])}
                    onClick={open}
                    className={cn(className)}
                    {...props}
                />
            )}
        </LightboxItem>
    ) : (
        <ImageCore parsedData={parsedData} {...props} lightbox={false} />
    )
}

export type { ImageProps, PngProps, RoundedImageProps }
export { Image }
