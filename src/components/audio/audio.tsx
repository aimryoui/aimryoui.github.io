"use client"

import { useEffect, useRef, useState } from "react"

import { Volume1, Volume2, VolumeX } from "lucide-react"

import { Button, type ButtonProps } from "@/components/ui/button"
import { TooltipTrigger } from "@/components/ui/tooltip"
import { Highlight } from "@/components/ui/typography"
import { usePreference } from "@/hooks/use-preference"
import {
    createSoundEngine,
    HOVER_SOUNDS,
    type HoverSoundType
} from "@/lib/sounds"
import { cn } from "@/lib/utils"
import { useAudioStore } from "@/stores/audio-store"

const TARGET_SELECTORS = HOVER_SOUNDS.map(
    (sound) => `[data-sound='${sound}']`
).join(", ")

function AudioProvider({ children }: { children: React.ReactNode }) {
    const playerRef = useRef<ReturnType<typeof createSoundEngine> | null>(null)
    const lastTargetRef = useRef<Element | null>(null)

    const { audioMode, isAudioEnabled } = usePreference()
    const setIsAudioEnabled = useAudioStore((state) => state.setIsAudioEnabled)

    const hasManuallyToggled = useAudioStore(
        (state) => state.hasManuallyToggled
    )

    useEffect(() => {
        if (audioMode !== "auto" || isAudioEnabled || hasManuallyToggled) return

        const handleFirstInteraction = () => {
            setIsAudioEnabled(true)
            playerRef.current?.prepare()
        }

        const options = { once: true, passive: true, capture: true }
        const interactionEvents = ["pointerup", "touchend", "click", "keydown"]

        interactionEvents.forEach((event) => {
            window.addEventListener(event, handleFirstInteraction, options)
        })

        return () => {
            interactionEvents.forEach((event) => {
                window.removeEventListener(
                    event,
                    handleFirstInteraction,
                    options
                )
            })
        }
    }, [audioMode, isAudioEnabled, hasManuallyToggled, setIsAudioEnabled])

    useEffect(() => {
        playerRef.current = createSoundEngine()

        let isScrolling = false
        let scrollTimeout: NodeJS.Timeout

        const handleScroll = () => {
            isScrolling = true
            clearTimeout(scrollTimeout)
            scrollTimeout = setTimeout(() => {
                isScrolling = false
            }, 150)
        }

        const handleInteraction = (e: Event) => {
            if (isScrolling) return
            if (!useAudioStore.getState().isAudioEnabled) return

            const target = (e.target as Element).closest(TARGET_SELECTORS)

            if (
                e.type === "focusin"
                && target
                && !target.matches(":focus-visible")
            ) {
                return
            }

            if (target && target !== lastTargetRef.current) {
                const soundType = target.getAttribute(
                    "data-sound"
                ) as HoverSoundType

                if (
                    soundType
                    && soundType !== ("false" as unknown as HoverSoundType)
                ) {
                    playerRef.current?.playHover(soundType)
                }
            }

            lastTargetRef.current = target
        }

        window.addEventListener("scroll", handleScroll, {
            passive: true,
            capture: true
        })
        document.addEventListener("pointerover", handleInteraction, {
            passive: true
        })
        document.addEventListener("focusin", handleInteraction, {
            passive: true
        })

        return () => {
            window.removeEventListener("scroll", handleScroll, {
                capture: true
            })
            clearTimeout(scrollTimeout)
            document.removeEventListener("pointerover", handleInteraction)
            document.removeEventListener("focusin", handleInteraction)
            playerRef.current?.dispose()
        }
    }, [])

    useEffect(() => {
        if (playerRef.current) {
            playerRef.current.setKeepAwake(isAudioEnabled)
        }
    }, [isAudioEnabled])

    return children
}

function AudioToggle({ className, onPress, tracking, ...props }: ButtonProps) {
    const { isAudioEnabled, audioMode } = usePreference()
    const toggleAudio = useAudioStore((state) => state.toggleAudio)

    const hasManuallyToggled = useAudioStore(
        (state) => state.hasManuallyToggled
    )

    const playerRef = useRef<ReturnType<typeof createSoundEngine> | null>(null)

    const [isActive, setIsActive] = useState(false)

    useEffect(() => {
        const player = createSoundEngine()
        playerRef.current = player

        const ctx = player.getContext()

        if (ctx) {
            const handleStateChange = () => {
                setIsActive(ctx.state === "running")
            }

            handleStateChange()
            ctx.addEventListener("statechange", handleStateChange)

            return () => {
                ctx.removeEventListener("statechange", handleStateChange)
                player.dispose()
            }
        }

        return () => {
            player.dispose()
        }
    }, [])

    const handleToggle = () => {
        if (!isAudioEnabled) {
            playerRef.current?.prepare()
            playerRef.current?.playPress("button")
        }
        toggleAudio()
    }

    return (
        <TooltipTrigger
            delay={500}
            payload={{
                content: (
                    <span>
                        Press to{" "}
                        <Highlight className="capitalize">
                            {isAudioEnabled ? "Mute" : "Unmute"}
                        </Highlight>
                    </span>
                )
            }}
            render={
                <Button
                    variant="outline"
                    size="icon"
                    onPress={(e) => {
                        handleToggle()

                        onPress?.(e)
                    }}
                    tracking={{
                        eventName: tracking?.eventName ?? "toggle_audio",
                        eventParams: {
                            audio_enabled: !isAudioEnabled,
                            ...tracking?.eventParams
                        }
                    }}
                    className={cn(
                        {
                            dark: "bg-input/25",
                            disabled: "cursor-wait opacity-100"
                        },
                        className
                    )}
                    {...props}
                >
                    {isAudioEnabled && isActive ? (
                        <Volume2 className="size-5.5" />
                    ) : !isAudioEnabled
                      && (audioMode === "manual" || hasManuallyToggled) ? (
                        <VolumeX className="size-5.5" />
                    ) : (
                        <Volume1 className="size-5.5" />
                    )}
                </Button>
            }
        />
    )
}

export { AudioProvider, AudioToggle }
