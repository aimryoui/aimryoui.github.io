"use client"

import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"

/** @see {@link https://github.com/vercel/next.js/issues/88986} */

const LAYOUT_SETTLE_DELAY_MS = 300

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
                const element = document.getElementById(id)
                if (element) {
                    element.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    })
                }
            }, LAYOUT_SETTLE_DELAY_MS)
        })

        return () => {
            cancelAnimationFrame(rafId)
            clearTimeout(timer)
        }
    }, [pathname])

    return null
}
