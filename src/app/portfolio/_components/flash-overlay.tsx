"use client"

import { useEffect, useRef, useState } from "react"

import { cn } from "@/lib/utils"

const FLASH_EVENT = "portfolio:main-flash"

export default function FlashOverlay() {
    const [mounted, setMounted] = useState(false)
    const [flashKey, setFlashKey] = useState(0)
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    useEffect(() => {
        const handleFlash = () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current)
            }

            setFlashKey((prev) => prev + 1)
            setMounted(true)

            timeoutRef.current = setTimeout(() => {
                setMounted(false)
            }, 850)
        }

        window.addEventListener(FLASH_EVENT, handleFlash)

        return () => {
            window.removeEventListener(FLASH_EVENT, handleFlash)
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current)
            }
        }
    }, [])

    if (!mounted) return null

    return (
        <div
            key={flashKey}
            role="alert"
            aria-hidden
            className={cn(
                "pointer-events-none absolute inset-x-0 top-0 z-40 h-full animate-pulse bg-highlighted/40 opacity-0 animation-duration-400 animation-ease-in repeat-2"
            )}
        />
    )
}
