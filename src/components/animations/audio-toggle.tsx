"use client"

import { useEffect, useRef } from "react"

import { Volume2, VolumeX } from "lucide-react"

import { Button } from "@/components/ui/button"
import { TooltipTrigger } from "@/components/ui/tooltip"
import { Highlight } from "@/components/ui/typography"
import { createTickPlayer } from "@/lib/sounds"
import { cn } from "@/lib/utils"
import { useAudioStore } from "@/stores/audio-store"

function AudioToggle({
    className,
    ...props
}: React.ComponentProps<typeof Button>) {
    const isAudioEnabled = useAudioStore((state) => state.isAudioEnabled)
    const toggleAudio = useAudioStore((state) => state.toggleAudio)

    const playerRef = useRef<ReturnType<typeof createTickPlayer> | null>(null)

    useEffect(() => {
        playerRef.current = createTickPlayer()
        return () => playerRef.current?.dispose()
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
                        <Volume2 className="size-5.5" />
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

export { AudioToggle }
