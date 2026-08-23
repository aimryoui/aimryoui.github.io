"use client"

import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"

import { getPreferences } from "@/hooks/use-preference"

/** @see {@link https://github.com/vercel/next.js/issues/88986} */

const LAYOUT_SETTLE_DELAY_MS = 300

function scrollToElement(id: string) {
    const element = document.getElementById(id)
    if (!element) return

    const { motionReduced } = getPreferences()
    element.scrollIntoView({
        behavior: motionReduced ? "instant" : "smooth",
        block: "start"
    })
}

export default function HashScroller() {
    const pathname = usePathname()
    const lastPathname = useRef(pathname)

    useEffect(() => {
        if (pathname === lastPathname.current) return
        lastPathname.current = pathname

        const hash = window.location.hash
        if (!hash) return

        const id = hash.slice(1)
        let timer: NodeJS.Timeout
        let rafId: number

        rafId = requestAnimationFrame(() => {
            timer = setTimeout(() => {
                scrollToElement(id)
            }, LAYOUT_SETTLE_DELAY_MS)
        })

        return () => {
            cancelAnimationFrame(rafId)
            clearTimeout(timer)
        }
    }, [pathname])

    return null
}
