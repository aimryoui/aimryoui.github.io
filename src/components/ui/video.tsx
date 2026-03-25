"use client"

import { useEffect, useRef, useState } from "react"

import Hls from "hls.js"

import { cn } from "@/lib/utils"

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
    const videoRef = useRef<HTMLVideoElement>(null)
    const [shouldLoad, setShouldLoad] = useState(false)

    const shouldAutoPlay = autoPlay ?? autoplay ?? true
    const shouldMute = muted ?? mute ?? true

    const normalizedSrc = src.startsWith("/") ? src.slice(1) : src
    const pathWithoutExt = normalizedSrc.replace(/\.[^/.]+$/, "")

    const basePath = `/assets/media/${pathWithoutExt}`
    const defaultPoster = `${basePath}/poster.webp`

    useEffect(() => {
        const video = videoRef.current
        if (!video) return

        const lazyObserver = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setShouldLoad(true)
                    lazyObserver.disconnect()
                }
            },
            { rootMargin: "100% 0px" }
        )

        lazyObserver.observe(video)

        return () => {
            lazyObserver.disconnect()
        }
    }, [])

    useEffect(() => {
        const video = videoRef.current
        if (!shouldLoad || !video) return

        let hls: Hls | null = null

        const m3u8Url = `${basePath}/index.m3u8`

        if (Hls.isSupported()) {
            hls = new Hls({ maxMaxBufferLength: 30 })
            hls.loadSource(m3u8Url)
            hls.attachMedia(video)
        } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = m3u8Url
        }

        return () => {
            if (hls) hls.destroy()
        }
    }, [basePath, shouldLoad])

    useEffect(() => {
        const video = videoRef.current
        if (!video) return

        let isIntersecting = false

        const tryPlay = () => {
            if (video.paused && !document.hidden && shouldAutoPlay) {
                const playPromise = video.play()

                playPromise.catch((error: unknown) => {
                    if (
                        error instanceof Error &&
                        error.name === "NotAllowedError"
                    ) {
                        video.muted = true
                        video.play().catch(() => {})
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

        observer.observe(video)

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
    }, [shouldAutoPlay])

    return (
        <div
            className={cn(
                "relative w-full overflow-hidden",
                {
                    after: "pointer-events-none absolute inset-0 z-2 rounded-inherit border border-white/15 mix-blend-difference"
                },
                className
            )}
        >
            {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
            <video
                ref={videoRef}
                poster={posterPath ?? defaultPoster}
                className="block h-auto w-full object-cover"
                controls={controls}
                disablePictureInPicture
                playsInline={playsInline}
                loop={loop}
                muted={shouldMute}
                preload="none"
                {...props}
            />
        </div>
    )
}
