"use client"

import { useRef } from "react"
import NextImage from "next/image"

import { mergeRefs } from "react-merge-refs"

import { LightboxItem } from "@/components/ui/lightbox"
import { EDGE_PAD, GRID_COLS, GRID_ROWS } from "@/configs/image.config"
import {
    getParsedMediaData,
    type ParsedMediaData
} from "@/helpers/get-parsed-media-data"
import { useMediaObserver } from "@/hooks/use-media-observer"
import imageManifestRaw from "@/lib/image-manifest.json"
import { cn } from "@/lib/utils"
import {
    type ImageManifest,
    type ImageMetadata
} from "@/scripts/process-images"

type GeneralImageProps = React.ComponentProps<"div"> & {
    parsedData: ParsedMediaData<ImageMetadata>
    alt: string
    placeholderPriority?: boolean
    asBackgroundImage?: boolean
    imageCol?: "justified"
    imageRow?: "justified" | "proportional"
    limitHeight?: boolean
    objectFit?: "fill" | "contain" | "cover" | "none" | "scale-down"
    lightbox?: boolean
    isInLightbox?: boolean
}

type ImageRoundProps =
    | { rounded?: boolean; percentageRounded?: never }
    | { percentageRounded?: number; rounded?: never }

interface PngProps {
    trimEdges?: boolean
}

type ImageBorderProps =
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

type ImageCoreProps = GeneralImageProps &
    ImageRoundProps &
    PngProps &
    ImageBorderProps

function ImageCore({
    className,
    parsedData,
    placeholderPriority = false,
    asBackgroundImage = false,
    imageCol,
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
    lightbox = true,
    isInLightbox = false,
    ref,
    ...props
}: ImageCoreProps) {
    const containerRef = useRef<HTMLDivElement>(null)

    const isNearViewport = useMediaObserver(containerRef, isInLightbox)

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
                "content-auto",
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
                gradientBorder && [
                    {
                        after: [
                            "pointer-events-none absolute inset-0 z-2 rounded-inherit",
                            typeof gradientBorder.width === "number" &&
                                "p-[--nhn-gradient-border-width]",
                            "bg-[image:--nhn-gradient-border-color]",
                            "mask-clip-[content-box,border-box] mask-exclude mask-origin-[content-box,border-box]",
                            "[mask-image:linear-gradient(#fff_0_0),linear-gradient(#fff_0_0)]"
                        ]
                    },
                    typeof gradientBorder.width === "string" &&
                        gradientBorder.width
                ],
                className
            )}
            style={{
                "--nhn-aspect-ratio": aspectRatio,

                ...(isInLightbox
                    ? {
                          ...(rounded && {
                              borderRadius:
                                  "calc(var(--radius-media) / var(--nhn-wrap-scale))"
                          })
                      }
                    : {
                          ...(limitHeight && {
                              width: "calc(max(80vh, calc(var(--spacing) * 125)) * calc(var(--nhn-aspect-ratio)))"
                          }),
                          ...(imageRow && {
                              flex: `${imageRow === "justified" ? "calc(var(--nhn-aspect-ratio))" : exactW} 1 0%`
                          }),
                          ...(imageCol && {
                              width: `calc(${exactW} / 1599 * 100%)`
                          })
                      }),

                ...(!asBackgroundImage && {
                    aspectRatio: "var(--nhn-aspect-ratio)"
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

const imageManifest = imageManifestRaw as ImageManifest

type ImageProps = Omit<GeneralImageProps, "parsedData"> &
    ImageRoundProps &
    PngProps &
    ImageBorderProps & {
        src: string
    }

function Image({ className, lightbox = true, ref, ...props }: ImageProps) {
    const parsedData = getParsedMediaData(props.src, imageManifest)

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

export type { ImageBorderProps, ImageProps, ImageRoundProps, PngProps }
export { Image }
