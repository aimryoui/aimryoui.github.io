"use client"

import { useEffect, useRef } from "react"

import { createTickPlayer } from "@/lib/sounds"
import { useAudioStore } from "@/stores/audio-store"

function AudioProvider({ children }: { children: React.ReactNode }) {
    const playerRef = useRef<ReturnType<typeof createTickPlayer> | null>(null)
    const lastTargetRef = useRef<Element | null>(null)

    useEffect(() => {
        playerRef.current = createTickPlayer()

        const handlePointerOver = (e: PointerEvent) => {
            if (!useAudioStore.getState().isAudioEnabled) return

            const target = (e.target as Element).closest('[data-sound="tick"]')

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
    }, [])

    return children
}

export { AudioProvider }
