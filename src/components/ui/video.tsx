"use client"

import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"

import Hls from "hls.js"

import { cn } from "@/lib/utils"

let sharedStyleSheet: CSSStyleSheet | null = null

function getSharedStyleSheet() {
    if (typeof window === "undefined" || !("CSSStyleSheet" in window)) {
        return null
    }

    if (!sharedStyleSheet) {
        sharedStyleSheet = new CSSStyleSheet()
        sharedStyleSheet.replaceSync(/*css*/ `
            video {
                display: block;
                width: 100%;
                height: auto;
                object-fit: cover;
                border-radius: inherit;
            }
        `)
    }
    return sharedStyleSheet
}

interface VideoProps extends React.ComponentProps<"video"> {
    src: string
    posterPath?: string
    autoplay?: boolean
    mute?: boolean
}

// TODO: Add global muted state

export function Video({
    src,
    posterPath,
    className,
    autoPlay,
    autoplay,
    muted,
    mute,
    controls,
    loop = true,
    playsInline = true,
    ...props
}: VideoProps) {
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

    useEffect(() => {
        const hostEl = hostRef.current
        if (!hostEl || hostEl.shadowRoot) return

        const root = hostEl.attachShadow({ mode: "closed" })

        const sheet = getSharedStyleSheet()
        if (sheet) {
            root.adoptedStyleSheets = [sheet]
        }

        setShadowRoot(root)
    }, [])

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

        const handleDataLoaded = () => {
            if (isIntersecting) tryPlay()
        }

        document.addEventListener("visibilitychange", handleVisibilityChange)
        video.addEventListener("loadeddata", handleDataLoaded)

        return () => {
            observer.disconnect()
            document.removeEventListener(
                "visibilitychange",
                handleVisibilityChange
            )
            video.removeEventListener("loadeddata", handleDataLoaded)
        }
    }, [shouldAutoPlay, shadowRoot])

    return (
        <div
            ref={hostRef}
            className={cn(
                "relative w-full overflow-hidden",
                {
                    after: "pointer-events-none absolute inset-0 z-2 rounded-inherit border border-white/15 mix-blend-difference"
                },
                className
            )}
        >
            {shadowRoot &&
                createPortal(
                    // oxlint-disable-next-line jsx_a11y/media-has-caption
                    <video
                        ref={videoRef}
                        poster={posterPath ?? defaultPoster}
                        controls={controls}
                        disablePictureInPicture
                        playsInline={playsInline}
                        loop={loop}
                        muted={shouldMute}
                        preload="none"
                        {...props}
                    />,
                    shadowRoot
                )}
        </div>
    )
}
