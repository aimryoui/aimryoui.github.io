"use client"

import { memo, useMemo, useRef } from "react"
import NextImage from "next/image"

import { mergeRefs } from "react-merge-refs"

import { LightboxItem } from "@/components/ui/lightbox"
import { EDGE_PAD, GRID_COLS, GRID_ROWS } from "@/configs/image.config"
import {
    getParsedMediaData,
    type ParsedMediaData
} from "@/helpers/get-parsed-media-data"
import { useMediaObserver } from "@/hooks/use-media-observer"
import { usePreference } from "@/hooks/use-preference"
import { usePressFeedback } from "@/hooks/use-press-feedback"
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
    dim?: boolean
    row?: "justified" | "proportional"
    col?: "justified"
    limitHeight?: boolean
    objectFit?: "fill" | "contain" | "cover" | "none" | "scale-down"
    lightbox?: boolean
    isInLightbox?: boolean
}

type CornerRound = boolean | "t" | "b" | "r" | "l" | "tl" | "tr" | "bl" | "br"

type ImageRoundProps =
    | { rounded?: CornerRound; percentageRounded?: never }
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

type ImageCoreProps = GeneralImageProps
    & ImageRoundProps
    & PngProps
    & ImageBorderProps

function getBorderRadiusShorthand(rounded: CornerRound, radiusVal: string) {
    if (rounded === true) return radiusVal
    switch (rounded) {
        case "t":
            return `${radiusVal} ${radiusVal} 0 0`
        case "b":
            return `0 0 ${radiusVal} ${radiusVal}`
        case "r":
            return `0 ${radiusVal} ${radiusVal} 0`
        case "l":
            return `${radiusVal} 0 0 ${radiusVal}`
        case "tl":
            return `${radiusVal} 0 0 0`
        case "tr":
            return `0 ${radiusVal} 0 0`
        case "bl":
            return `0 0 0 ${radiusVal}`
        case "br":
            return `0 0 ${radiusVal} 0`
        case false:
        default:
            return "0"
    }
}

function removeBackground(e: React.SyntheticEvent<HTMLImageElement>) {
    e.currentTarget.style.background = ""
}

function calculateImageGridVars(exactW: number, exactH: number) {
    const Rows = GRID_ROWS
    const Cols = GRID_COLS

    const spriteW = exactW + Cols * 2 * EDGE_PAD
    const spriteH = exactH + Rows * 2 * EDGE_PAD

    const imgWidthPercent = (spriteW / exactW) * 100
    const imgHeightPercent = (spriteH / exactH) * 100

    const padX_val = (EDGE_PAD / spriteW) * 100
    const padY_val = (EDGE_PAD / spriteH) * 100

    const colPct_val = 100 / Cols
    const rowPct_val = 100 / Rows

    const targetColPct_val = (exactW / spriteW / Cols) * 100
    const targetRowPct_val = (exactH / spriteH / Rows) * 100

    const vars: Record<string, string> = {
        "--w": `${imgWidthPercent.toString()}%`,
        "--h": `${imgHeightPercent.toString()}%`
    }

    for (let i = 0; i < Cols; i++) {
        vars[`--x${i.toString()}`] =
            `${(i * colPct_val + padX_val).toString()}%`
    }
    for (let i = 0; i < Rows; i++) {
        vars[`--y${i.toString()}`] =
            `${(i * rowPct_val + padY_val).toString()}%`
    }

    return {
        cssVars: vars,
        targetColPct: targetColPct_val,
        targetRowPct: targetRowPct_val,
        colPct: colPct_val,
        rowPct: rowPct_val,
        padX: padX_val,
        padY: padY_val
    }
}

interface ScrambledGridProps {
    mapping: number[]
    targetColPct: number
    targetRowPct: number
    colPct: number
    rowPct: number
    padX: number
    padY: number
    basePath: string
    fileName: string
    isInLightbox: boolean
}

const ScrambledGrid = memo(function ScrambledGrid({
    mapping,
    targetColPct,
    targetRowPct,
    colPct,
    rowPct,
    padX,
    padY,
    basePath,
    fileName,
    isInLightbox
}: ScrambledGridProps) {
    const Rows = GRID_ROWS
    const Cols = GRID_COLS

    return (
        <>
            {Array.from({ length: Rows * Cols }).map((_, index) => {
                const targetC = index % Cols
                const targetR = Math.floor(index / Cols)

                const scrambledIndex = mapping[index]
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
        </>
    )
})

function ImageCore({
    className,
    parsedData,
    placeholderPriority = false,
    asBackgroundImage = false,
    dim = false,
    row,
    col,
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

    const { cssVars, targetColPct, targetRowPct, colPct, rowPct, padX, padY } =
        useMemo(() => calculateImageGridVars(exactW, exactH), [exactW, exactH])

    return (
        <div
            ref={mergeRefs([containerRef, ref])}
            data-slot="image"
            dir="ltr"
            className={cn(
                "content-auto",
                limitHeight
                    ? [
                          "min-w-0 max-w-full md:!w-full",
                          {
                              md: "!w-full min-w-unset max-w-unset"
                          }
                      ]
                    : "w-full",
                asBackgroundImage ? "h-full" : "h-fit",
                "relative grid place-items-center",
                !pngBorder && "overflow-hidden",
                lightbox && !isInLightbox && "cursor-zoom-in",
                !noBorder
                    && !pngBorder
                    && !gradientBorder && {
                        after: [
                            "pointer-events-none absolute inset-0 z-2 rounded-inherit transition-[border-color] duration-250",
                            "border border-default/15",
                            {
                                "data-[lightbox-active=true]":
                                    "border-media border-white/15"
                            }
                        ]
                    },
                gradientBorder && [
                    {
                        after: [
                            "pointer-events-none absolute inset-0 z-2 rounded-inherit",
                            typeof gradientBorder.width === "number"
                                && "p-[--nhn-gradient-border-width]",
                            "bg-[image:--nhn-gradient-border-color]",
                            "mask-clip-[content-box,border-box] mask-exclude mask-origin-[content-box,border-box]",
                            "[mask-image:linear-gradient(#fff_0_0),linear-gradient(#fff_0_0)]"
                        ]
                    },
                    typeof gradientBorder.width === "string"
                        && gradientBorder.width
                ],
                dim && [
                    {
                        "group-data-[media~='dim']/html:dark":
                            "opacity-85 transition-opacity duration-350",
                        "data-[lightbox-active=true]": "!opacity-100"
                    }
                ],
                className
            )}
            style={{
                "--nhn-aspect-ratio": aspectRatio,

                ...(rounded
                    && !percentageRounded && {
                        borderRadius: getBorderRadiusShorthand(
                            rounded,
                            isInLightbox
                                ? "calc(var(--radius-media) / var(--nhn-wrap-scale))"
                                : "var(--radius-media)"
                        )
                    }),

                ...(!isInLightbox && {
                    ...(limitHeight && {
                        width: "calc(max(80vh, calc(var(--spacing) * 125)) * calc(var(--nhn-aspect-ratio)))"
                    }),
                    ...(row && {
                        flex: `${row === "justified" ? "calc((var(--nhn-aspect-ratio)) * 100)" : exactW} 1 0%`
                    }),
                    ...(col && {
                        width: `calc(${exactW} / 1599 * 100%)`
                    })
                }),

                ...(!asBackgroundImage && {
                    aspectRatio: "var(--nhn-aspect-ratio)"
                }),
                ...(percentageRounded
                    && !rounded && {
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
                        (pngAntiBleed || pngBorder)
                            && "blink:[filter:url(#png-anti-bleed)]",
                        trimEdges && "blink:[clip-path:inset(.375rem)]"
                    )}
                    style={{
                        background: `url("${metadata.blurDataURL}") center / cover no-repeat`
                    }}
                    draggable={false}
                    loading={placeholderPriority ? "eager" : "lazy"}
                    onLoad={removeBackground}
                />
            )}

            {isNearViewport && (
                // Represent image from `src` attribute or url() function
                <div
                    className={cn(
                        "z-1 max-h-inherit max-w-inherit",
                        asBackgroundImage && "absolute",
                        objectFit === "fill" && "size-full",
                        objectFit === "contain"
                            && "size-auto max-h-full max-w-full",
                        objectFit === "cover"
                            && "size-auto min-h-full min-w-full",
                        pngBorder && "blink:[filter:url(#png-border)]"
                    )}
                    style={{
                        aspectRatio
                    }}
                    aria-hidden={true}
                >
                    <ScrambledGrid
                        mapping={metadata.mapping}
                        targetColPct={targetColPct}
                        targetRowPct={targetRowPct}
                        colPct={colPct}
                        rowPct={rowPct}
                        padX={padX}
                        padY={padY}
                        basePath={basePath}
                        fileName={fileName}
                        isInLightbox={isInLightbox}
                    />
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

type ImageProps = Omit<GeneralImageProps, "parsedData">
    & ImageRoundProps
    & PngProps
    & ImageBorderProps & {
        src: string
    }

function Image({
    className,
    lightbox = true,
    onClick,
    ref,
    ...props
}: ImageProps) {
    const parsedData = getParsedMediaData(props.src, imageManifest)

    const { motionReduced } = usePreference()
    const playPressFeedback = usePressFeedback()

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
                    onClick={(e) => {
                        playPressFeedback(motionReduced ? "button" : "zoom-in")
                        open(e)

                        onClick?.(e)
                    }}
                    className={cn(className)}
                    {...props}
                />
            )}
        </LightboxItem>
    ) : (
        <ImageCore
            parsedData={parsedData}
            className={cn(className)}
            {...props}
            lightbox={false}
        />
    )
}

export type {
    CornerRound,
    ImageBorderProps,
    ImageProps,
    ImageRoundProps,
    PngProps
}
export { getBorderRadiusShorthand, Image }
