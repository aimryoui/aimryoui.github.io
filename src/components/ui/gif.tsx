"use client"

import { mergeRefs } from "react-merge-refs"

import {
    AnimatedMedia,
    type AnimatedMediaProps
} from "@/components/ui/animated-media"
import { LightboxItem } from "@/components/ui/lightbox"
import { getParsedMediaData } from "@/helpers/get-parsed-media-data"
import { cn } from "@/lib/utils"
import videoManifestRaw from "@/lib/video-manifest.json"
import { type VideoManifest } from "@/scripts/process-videos"

interface GifCoreProps extends AnimatedMediaProps {
    lightbox?: boolean
}

function GifCore({
    className,
    parsedData,
    alt,
    rounded,
    ref,
    ...props
}: GifCoreProps) {
    return (
        <AnimatedMedia
            data-slot="gif"
            parsedData={parsedData}
            ref={ref}
            alt={alt}
            rounded={rounded}
            className={cn("cursor-zoom-in", className)}
            {...props}
            autoplay={true}
            autoPlay={true}
            loop={true}
            muted={true}
            mute={true}
            controls={false}
        />
    )
}

interface GifProps extends Omit<GifCoreProps, "parsedData"> {
    src: string
}

const videoManifest = videoManifestRaw as VideoManifest

function Gif({ className, lightbox = true, ref, ...props }: GifProps) {
    const parsedData = getParsedMediaData(props.src, videoManifest)

    if (!parsedData) return null

    return lightbox ? (
        <LightboxItem
            thumbnail={`${parsedData.basePath}/${parsedData.fileName}_preview.webp`}
            width={parsedData.exactW}
            height={parsedData.exactH}
            placeholderAspectRatio={parsedData.aspectRatio}
            rounded={props.rounded}
            content={
                <GifCore
                    parsedData={parsedData}
                    className={cn(className)}
                    {...props}
                    data-slot="lightbox-gif"
                    isInLightbox={true}
                />
            }
        >
            {({ ref: lightboxRef, open }) => (
                <GifCore
                    parsedData={parsedData}
                    ref={mergeRefs([ref, lightboxRef])}
                    onClick={open}
                    className={cn(className)}
                    {...props}
                />
            )}
        </LightboxItem>
    ) : (
        <GifCore parsedData={parsedData} {...props} lightbox={false} />
    )
}

export { Gif }
