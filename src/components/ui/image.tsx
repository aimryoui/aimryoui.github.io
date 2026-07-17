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
    objectFit?: "fill" | "contain" | "cover" | "none" | "scale-down"
    isInCarousel?: boolean
    lightbox?: boolean
    isInLightbox?: boolean
}

type RoundedImageProps =
    | { rounded?: boolean; percentageRounded?: never }
    | { percentageRounded?: number; rounded?: never }

interface PngProps {
    trimEdges?: boolean
}

type ExclusiveBorderAndPngProps =
    | {
          pngBorder?: boolean
          pngAntiBleed?: never
          noBorder?: never
          gradientBorder?: never
      }
    | {
          noBorder?: boolean
          gradientBorder?: never
          pngBorder?: never
          pngAntiBleed?: boolean
      }
    | {
          gradientBorder?: { width?: number | string; color: string }
          noBorder?: never
          pngBorder?: never
          pngAntiBleed?: boolean
      }
    | {
          pngAntiBleed?: boolean
          noBorder?: never
          gradientBorder?: never
          pngBorder?: never
      }

type ImageCoreProps = ImageProps &
    RoundedImageProps &
    PngProps &
    ExclusiveBorderAndPngProps

const imageManifest = imageManifestRaw as ImageManifest

const FILE_EXTENSION_REGEX = /\.[^/.]+$/u

function getParsedImageData(src: string) {
    const normalizedSrc = src.startsWith("/") ? src.slice(1) : src
    const metadata =
        imageManifest[normalizedSrc.replace(FILE_EXTENSION_REGEX, "")]

    if (!metadata) {
        console.error(`[Image]: No metadata for "${src}" in manifest.`)
        return null
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

type ParsedImageData = NonNullable<ReturnType<typeof getParsedImageData>>

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
    gradientBorder,
    pngAntiBleed = false,
    pngBorder = false,
    trimEdges = false,
    objectFit = "cover",
    isInCarousel = false,
    lightbox = true,
    isInLightbox = false,
    ref,
    ...props
}: ImageCoreProps & { parsedData: ParsedImageData }) {
    const containerRef = useRef<HTMLDivElement>(null)

    const [isNearViewport, setIsNearViewport] = useState(
        isInLightbox || placeholderPriority
    )

    useEffect(() => {
        if (isInLightbox) return

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
    }, [isInLightbox, isInCarousel])

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
            data-slot="image"
            className={cn(
                limitHeight ? "min-w-0 max-w-full" : "w-full",
                asBackgroundImage ? "h-full" : "h-fit",
                "relative grid place-items-center",
                !pngBorder && "overflow-hidden",
                rounded && !percentageRounded && "rounded-media",
                lightbox && !isInLightbox && "cursor-zoom-in",
                !noBorder &&
                    !pngBorder &&
                    !gradientBorder && {
                        after: [
                            "pointer-events-none absolute inset-0 z-2 rounded-inherit transition-[border-color] duration-250",
                            isInLightbox
                                ? "border-media border-white/15"
                                : "border border-default/15"
                        ]
                    },
                gradientBorder && {
                    after: [
                        "pointer-events-none absolute inset-0 z-2 rounded-inherit",
                        typeof gradientBorder.width === "number" &&
                            "p-[var(--nhn-gradient-border-width)]",
                        typeof gradientBorder.width === "string" &&
                            gradientBorder.width,
                        "bg-[image:var(--nhn-gradient-border-color)]",
                        "mask-clip-[content-box,border-box] mask-exclude webkit-mask-xor mask-origin-[content-box,border-box]",
                        "[mask-image:linear-gradient(#fff_0_0),linear-gradient(#fff_0_0)]"
                    ]
                },
                className
            )}
            style={{
                "--nhn-aspect-ratio": aspectRatio,
                ...(limitHeight &&
                    !isInLightbox && {
                        width: "calc(max(80vh, calc(var(--spacing) * 125)) * calc(var(--nhn-aspect-ratio)))"
                    }),
                ...(percentageRounded &&
                    !rounded && {
                        borderRadius: `calc(${percentageRounded}% * var(--nhn-radius-offset-factor)) / calc(${percentageRounded}% * var(--nhn-aspect-ratio) * var(--nhn-radius-offset-factor))`
                    }),
                ...(gradientBorder && {
                    ...(typeof gradientBorder.width === "number" && {
                        "--nhn-gradient-border-width": `${gradientBorder.width}%`
                    }),
                    "--nhn-gradient-border-color": gradientBorder.color
                }),
                ...(isInLightbox &&
                    rounded && {
                        borderRadius:
                            "calc(var(--radius-media) / var(--nhn-wrap-scale))"
                    }),
                ...(imageRow &&
                    !isInLightbox && {
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
            {!isInLightbox && (
                <NextImage
                    src={`${basePath}/${fileName}_preview.webp`}
                    alt={props.alt}
                    width={exactW}
                    height={exactH}
                    className={cn(
                        "absolute size-full select-none object-cover",
                        (pngAntiBleed || pngBorder) &&
                            "blink:[filter:url(#png-anti-bleed)]",
                        trimEdges && "blink:[clip-path:inset(.375rem)]"
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
                        pngBorder && "blink:[filter:url(#png-border)]"
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
                                    isInLightbox && "pswp__img"
                                )}
                                style={{
                                    clipPath: `inset(var(--y${sourceR.toString()}) var(--x${(Cols - 1 - sourceC).toString()}) var(--y${(Rows - 1 - sourceR).toString()}) var(--x${sourceC.toString()}))`,
                                    transform: `translate(${translateX.toString()}%, ${translateY.toString()}%)`
                                }}
                                decoding="async"
                                loading={isInLightbox ? "eager" : "lazy"}
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

    if (!parsedData) return null

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
                    className={cn(className)}
                    {...props}
                    data-slot="lightbox-image"
                    isInLightbox={true}
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

export type {
    ExclusiveBorderAndPngProps,
    ImageProps,
    PngProps,
    RoundedImageProps
}
export { Image }
