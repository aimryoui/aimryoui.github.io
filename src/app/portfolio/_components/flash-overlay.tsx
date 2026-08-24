"use client"

import { create } from "zustand"

import { cn } from "@/lib/utils"

const useFlashStore = create<{
    flashKey: number
    isFlashing: boolean
    triggerFlash: () => void
}>((set) => {
    let timeout: ReturnType<typeof setTimeout> | null = null

    return {
        flashKey: 0,
        isFlashing: false,
        triggerFlash: () => {
            if (timeout) clearTimeout(timeout)

            set((state) => ({
                flashKey: state.flashKey + 1,
                isFlashing: true
            }))

            timeout = setTimeout(() => {
                set({ isFlashing: false })
            }, 850)
        }
    }
})

function FlashOverlay() {
    const flashKey = useFlashStore((s) => s.flashKey)
    const isFlashing = useFlashStore((s) => s.isFlashing)

    if (!isFlashing) return null

    return (
        <div
            key={flashKey}
            role="alert"
            aria-hidden
            className={cn(
                "pointer-events-none absolute inset-x-0 top-0 z-60 h-full animate-pulse bg-highlighted/40 opacity-0 animation-duration-400 animation-ease-in repeat-2"
            )}
        />
    )
}

export { FlashOverlay, useFlashStore }
