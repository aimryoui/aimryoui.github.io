"use client"

import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import NextImage from "next/image"

import Hls from "hls.js"
import { mergeRefs } from "react-merge-refs"

import { Spinner } from "@/components/ui/spinner"
import { type ParsedMediaData } from "@/helpers/get-parsed-media-data"
import { useIsomorphicLayoutEffect } from "@/hooks/use-isomorphic-layout-effect"
import { useMediaObserver } from "@/hooks/use-media-observer"
import { cn } from "@/lib/utils"
import { type VideoMetadata } from "@/scripts/process-videos"

let sharedStyleSheet: CSSStyleSheet | null = null

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

type AnimatedMediaProps = {
    parsedData: ParsedMediaData<VideoMetadata>
    alt: string
    posterPath?: string
    rounded?: boolean
    autoplay?: boolean
    mute?: boolean
    isInLightbox?: boolean
} & React.ComponentProps<"div"> &
    Pick<
        React.ComponentProps<"video">,
        "autoPlay" | "muted" | "controls" | "loop"
    >

function AnimatedMedia({
    className,
    parsedData,
    alt,
    posterPath,
    rounded = false,
    autoPlay,
    autoplay,
    muted,
    mute,
    controls,
    loop = true,
    isInLightbox = false,
    ref,
    ...props
}: AnimatedMediaProps) {
    const wrapperRef = useRef<HTMLDivElement>(null)
    const hostRef = useRef<HTMLDivElement>(null)
    const videoRef = useRef<HTMLVideoElement>(null)
    const [shadowRoot, setShadowRoot] = useState<ShadowRoot | null>(null)
    const [isVideoReady, setIsVideoReady] = useState(false)

    const { metadata, exactW, exactH, aspectRatio, basePath, fileName } =
        parsedData

    const shouldLoad = useMediaObserver(wrapperRef)

    const shouldAutoPlay = autoPlay ?? autoplay ?? true
    const shouldMute = muted ?? mute ?? true

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

        let isReady = false
        const handleTimeUpdate = () => {
            if (!isReady) {
                isReady = true
                setIsVideoReady(true)
            }
        }

        // const handleEnded = () => {
        //     if (loop) {
        //         video.currentTime = 0
        //         video.play().catch(() => {})
        //     }
        // }

        video.addEventListener("timeupdate", handleTimeUpdate)
        // video.addEventListener("ended", handleEnded)

        return () => {
            video.removeEventListener("timeupdate", handleTimeUpdate)
            // video.removeEventListener("ended", handleEnded)
            if (hls) hls.destroy()
        }
    }, [basePath, shouldLoad, loop])

    // Auto-play
    useEffect(() => {
        const video = videoRef.current
        const hostEl = wrapperRef.current
        if (!video || !hostEl) return

        let isIntersecting = false
        let userPaused = false
        let pausingByScroll = false
        let pausingByLightbox = false

        const isLightboxOpen = () =>
            !isInLightbox &&
            document.body.querySelector(":scope > div.pswp") !== null

        const tryPlay = () => {
            if (userPaused) return
            if (isLightboxOpen()) return
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

        const handlePause = () => {
            if (!pausingByScroll && !pausingByLightbox) {
                userPaused = true
            }
            pausingByScroll = false
            pausingByLightbox = false
        }

        const handlePlay = () => {
            userPaused = false
        }

        video.addEventListener("pause", handlePause)
        video.addEventListener("play", handlePlay)

        const observer = new IntersectionObserver(
            ([entry]) => {
                isIntersecting = entry.isIntersecting
                if (entry.isIntersecting) {
                    tryPlay()
                } else if (!video.paused) {
                    pausingByScroll = true
                    video.pause()
                }
            },
            { threshold: 0.5 }
        )

        observer.observe(hostEl)

        const handleVisibilityChange = () => {
            if (document.hidden) {
                if (!video.paused) {
                    pausingByScroll = true
                    video.pause()
                }
            } else if (isIntersecting) {
                tryPlay()
            }
        }

        const handleWindowBlur = () => {
            pausingByScroll = true
            video.pause()
        }

        const handleWindowFocus = () => {
            if (isIntersecting) {
                tryPlay()
            }
        }

        document.addEventListener("visibilitychange", handleVisibilityChange)
        window.addEventListener("blur", handleWindowBlur)
        window.addEventListener("focus", handleWindowFocus)

        // Watch for PhotoSwipe (div.pswp) appearing/disappearing as direct child of body
        // Only relevant for videos that are NOT inside the lightbox itself
        const mutationObserver = isInLightbox
            ? null
            : new MutationObserver(() => {
                  if (isLightboxOpen()) {
                      // Lightbox opened — pause video without marking it as user-paused
                      if (!video.paused) {
                          pausingByLightbox = true
                          video.pause()
                      }
                  } else if (isIntersecting) {
                      tryPlay()
                  }
              })

        mutationObserver?.observe(document.body, { childList: true })

        return () => {
            video.removeEventListener("pause", handlePause)
            video.removeEventListener("play", handlePlay)
            observer.disconnect()
            document.removeEventListener(
                "visibilitychange",
                handleVisibilityChange
            )
            window.removeEventListener("blur", handleWindowBlur)
            window.removeEventListener("focus", handleWindowFocus)
            mutationObserver?.disconnect()
        }
    }, [shouldAutoPlay, shadowRoot, isInLightbox])

    // Force muted attribute
    // @see https://github.com/react/react/issues/10389
    // useEffect(() => {
    //     const videoEl = videoRef.current
    //     if (!videoEl) return
    //     videoEl.setAttribute("muted", "")
    // }, [shadowRoot])

    return (
        <div
            ref={mergeRefs([wrapperRef, ref])}
            className={cn(
                "relative w-full overflow-hidden content-auto",
                rounded && "rounded-2xl md:rounded-xl",
                {
                    after: "pointer-events-none absolute inset-0 z-2 rounded-inherit border border-default/15"
                },
                className
            )}
            style={{
                aspectRatio
            }}
            {...props}
        >
            <div ref={hostRef} className="absolute inset-0 size-full" />
            {shadowRoot &&
                createPortal(
                    // oxlint-disable-next-line jsx-a11y/media-has-caption
                    <video
                        ref={videoRef}
                        poster={
                            posterPath ?? `${basePath}/${fileName}_preview.webp`
                        }
                        controls={controls}
                        disablePictureInPicture
                        autoPlay={shouldAutoPlay}
                        playsInline
                        loop={loop}
                        muted={shouldMute}
                        preload="none"
                        className="transform-gpu"
                    />,
                    shadowRoot
                )}

            {!isVideoReady && (
                <>
                    {/* Placeholder thumbnail */}
                    <NextImage
                        src={
                            posterPath ?? `${basePath}/${fileName}_preview.webp`
                        }
                        alt={alt}
                        width={exactW}
                        height={exactH}
                        className={cn(
                            "absolute inset-0 size-full object-cover"
                        )}
                        loading="lazy"
                        style={{
                            background: `url("${metadata.blurDataURL}") center / cover no-repeat`
                        }}
                        onLoad={(e) => {
                            e.currentTarget.style.background = ""
                        }}
                    />
                    {/* Loading overlay with spinner */}
                    <div
                        aria-hidden
                        className={cn(
                            "pointer-events-none absolute inset-0 z-10 grid place-items-center bg-black/30"
                        )}
                    >
                        <div
                            className={cn("rounded-full bg-background/80 p-2")}
                        >
                            <Spinner />
                        </div>
                    </div>
                </>
            )}
            <noscript>Turn on JavaScript to watch this video.</noscript>
        </div>
    )
}

export type { AnimatedMediaProps }
export { AnimatedMedia }
