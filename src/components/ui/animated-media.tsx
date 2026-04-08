"use client"

import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import NextImage from "next/image"

import Hls from "hls.js"

import { useIsomorphicLayoutEffect } from "@/hooks/use-isomorphic-layout-effect"
import { cn } from "@/lib/utils"
import videoManifestRaw from "@/lib/video-manifest.json"
import { type VideoManifest } from "@/scripts/process-videos"

let sharedStyleSheet: CSSStyleSheet | null = null

// Keep a stable reference for closed shadow roots so effects can safely re-run.
const shadowRootRegistry = new WeakMap<HTMLElement, ShadowRoot>()

function getSharedStyleSheet() {
    if (typeof window === "undefined" || !("CSSStyleSheet" in window)) {
        return null
    }

    // #adopted-style-sheet
    if (!sharedStyleSheet) {
        sharedStyleSheet = new CSSStyleSheet()
        sharedStyleSheet.replaceSync(/*css*/ `
            video {
                width: 100%;
                height: 100%;
                object-fit: cover
            }
        `)
    }
    return sharedStyleSheet
}

const videoManifest = videoManifestRaw as VideoManifest

export interface AnimatedMediaProps extends React.ComponentProps<"video"> {
    src: string
    alt: string
    posterPath?: string
    rounded?: boolean
    autoplay?: boolean
    mute?: boolean
}

export function AnimatedMedia({
    src,
    alt,
    posterPath,
    rounded = false,
    className,
    autoPlay,
    autoplay,
    muted,
    mute,
    controls,
    loop = true,
    ...props
}: AnimatedMediaProps) {
    const hostRef = useRef<HTMLDivElement>(null)
    const videoRef = useRef<HTMLVideoElement>(null)
    const [shadowRoot, setShadowRoot] = useState<ShadowRoot | null>(null)
    const [shouldLoad, setShouldLoad] = useState(false)

    const shouldAutoPlay = autoPlay ?? autoplay ?? true
    const shouldMute = muted ?? mute ?? true

    const normalizedSrc = src.startsWith("/") ? src.slice(1) : src
    const pathWithoutExt = normalizedSrc.replace(/\.[^/.]+$/, "")

    const basePath = `/assets/media/${pathWithoutExt}`
    const defaultPoster = `${basePath}/poster.webp`

    const metadata = videoManifest[pathWithoutExt]

    if (!metadata) {
        console.error(`[Video]: No metadata for "${src}" in manifest.`)
    }

    // #shadow-root (closed) with #adopted-style-sheets
    useIsomorphicLayoutEffect(() => {
        const hostEl = hostRef.current
        if (!hostEl) return

        const existingRoot = shadowRootRegistry.get(hostEl)
        if (existingRoot) {
            setShadowRoot(existingRoot)
            return
        }

        try {
            const root = hostEl.attachShadow({ mode: "closed" })

            const sheet = getSharedStyleSheet()
            if (sheet) {
                root.adoptedStyleSheets = [sheet]
            }

            shadowRootRegistry.set(hostEl, root)
            setShadowRoot(root)
        } catch (error: unknown) {
            if (
                error instanceof DOMException &&
                error.name === "NotSupportedError"
            ) {
                return
            }

            throw error
        }
    }, [])

    // Lazy load
    useEffect(() => {
        const hostEl = hostRef.current
        if (!hostEl) return

        const lazyObserver = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setShouldLoad(true)
                    lazyObserver.disconnect()
                }
            },
            { rootMargin: "100% 0px" }
        )

        lazyObserver.observe(hostEl)

        return () => {
            lazyObserver.disconnect()
        }
    }, [])

    // HLS
    useEffect(() => {
        const video = videoRef.current
        if (!shouldLoad || !video) return

        let hls: Hls | null = null
        const playlistUrl = `${basePath}/index.txt`

        if (Hls.isSupported()) {
            hls = new Hls({ maxMaxBufferLength: 30 })
            hls.loadSource(playlistUrl)
            hls.attachMedia(video)
        } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = playlistUrl
        }

        return () => {
            if (hls) hls.destroy()
        }
    }, [basePath, shouldLoad])

    // Auto-play
    useEffect(() => {
        const video = videoRef.current
        const hostEl = hostRef.current
        if (!video || !hostEl) return

        let isIntersecting = false

        const tryPlay = () => {
            if (video.paused && !document.hidden && shouldAutoPlay) {
                video.play().catch((error: unknown) => {
                    if (error instanceof Error) {
                        if (error.name === "NotAllowedError") {
                            video.muted = true
                            video.play().catch(() => {})
                        } else if (error.name !== "AbortError") {
                            console.warn(
                                "Video play interrupted:",
                                error.message
                            )
                        }
                    }
                })
            }
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                isIntersecting = entry.isIntersecting
                if (entry.isIntersecting) {
                    tryPlay()
                } else if (!video.paused) {
                    video.pause()
                }
            },
            { threshold: 0.5 }
        )

        observer.observe(hostEl)

        const handleVisibilityChange = () => {
            if (document.hidden) {
                if (!video.paused) video.pause()
            } else if (isIntersecting) {
                tryPlay()
            }
        }

        document.addEventListener("visibilitychange", handleVisibilityChange)

        return () => {
            observer.disconnect()
            document.removeEventListener(
                "visibilitychange",
                handleVisibilityChange
            )
        }
    }, [shouldAutoPlay, shadowRoot])

    const exactW = metadata.width
    const exactH = metadata.height

    return (
        <div
            ref={hostRef}
            className={cn(
                "relative w-full overflow-hidden",
                rounded && "rounded-2xl",
                {
                    after: "pointer-events-none absolute inset-0 z-2 rounded-inherit border border-default/15"
                },
                className
            )}
            style={{
                aspectRatio: `${exactW.toString()}/${exactH.toString()}`
            }}
        >
            {shadowRoot &&
                createPortal(
                    // oxlint-disable-next-line jsx_a11y/media-has-caption
                    <video
                        ref={videoRef}
                        poster={posterPath ?? defaultPoster}
                        controls={controls}
                        disablePictureInPicture
                        playsInline
                        loop={loop}
                        muted={shouldMute}
                        preload="none"
                        {...props}
                    />,
                    shadowRoot
                )}
            {/* Placeholder thumbnail, useful when reloading right at the position of video tag */}
            <NextImage
                src={posterPath ?? defaultPoster}
                alt={alt}
                width={exactW}
                height={exactH}
                className={cn("size-full object-cover")}
                fetchPriority="high"
                loading="lazy"
                style={{
                    background: `url("${metadata.blurDataURL}") center / cover no-repeat`
                }}
                onLoad={(e) => {
                    e.currentTarget.style.background = ""
                }}
            />
            <noscript>
                <img src={posterPath ?? defaultPoster} alt={alt} />
            </noscript>
        </div>
    )
}
