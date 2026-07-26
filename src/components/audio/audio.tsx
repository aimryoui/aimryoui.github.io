"use client"

import { useEffect, useRef, useState } from "react"

import { Volume1, Volume2, VolumeX } from "lucide-react"

import { Button } from "@/components/ui/button"
import { TooltipTrigger } from "@/components/ui/tooltip"
import { Highlight } from "@/components/ui/typography"
import { useDevice } from "@/hooks/use-device"
import { createTickPlayer } from "@/lib/sounds"
import { cn } from "@/lib/utils"
import { useAudioStore } from "@/stores/audio-store"

const TARGET_SELECTORS = [
    "[data-sound='tick']",
    "[data-cursor='target']",
    "[data-cursor='input']"
].join(", ")

function AudioProvider({ children }: { children: React.ReactNode }) {
    const playerRef = useRef<ReturnType<typeof createTickPlayer> | null>(null)
    const lastTargetRef = useRef<Element | null>(null)
    const { isTouchDevice } = useDevice()

    useEffect(() => {
        if (isTouchDevice) return

        playerRef.current = createTickPlayer()

        const handlePointerOver = (e: PointerEvent) => {
            if (!useAudioStore.getState().isAudioEnabled) return

            const target = (e.target as Element).closest(TARGET_SELECTORS)

            if (target && target !== lastTargetRef.current) {
                playerRef.current?.play()
            }

            lastTargetRef.current = target
        }

        document.addEventListener("pointerover", handlePointerOver, {
            passive: true
        })

        return () => {
            document.removeEventListener("pointerover", handlePointerOver)
            playerRef.current?.dispose()
        }
    }, [isTouchDevice])

    return children
}

function AudioToggle({
    className,
    ...props
}: React.ComponentProps<typeof Button>) {
    const isAudioEnabled = useAudioStore((state) => state.isAudioEnabled)
    const toggleAudio = useAudioStore((state) => state.toggleAudio)

    const playerRef = useRef<ReturnType<typeof createTickPlayer> | null>(null)

    const [isActive, setIsActive] = useState(false)

    useEffect(() => {
        const player = createTickPlayer()
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
                    onPress={handleToggle}
                    className={cn(
                        {
                            dark: "bg-input/25",
                            disabled: "cursor-wait opacity-100"
                        },
                        className
                    )}
                    {...props}
                >
                    {isAudioEnabled ? (
                        isActive ? (
                            <Volume2 className="size-5.5 transition-colors" />
                        ) : (
                            <Volume1 className="size-5.5 text-muted-foreground transition-colors" />
                        )
                    ) : (
                        <VolumeX className="size-5.5" />
                    )}
                    <span className="sr-only">
                        {isAudioEnabled ? "Mute" : "Unmute"}
                    </span>
                </Button>
            }
        />
    )
}

export { AudioProvider, AudioToggle }
