"use client"

import { useEffect, useRef } from "react"

import { useDevice } from "@/hooks/use-device"
import { createTickPlayer } from "@/lib/sounds"
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

export { AudioProvider }
