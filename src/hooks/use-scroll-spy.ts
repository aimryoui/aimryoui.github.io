"use client"

import { useEffect, useRef, useState } from "react"
import { usePathname } from "next/navigation"

/**
 * Hook to track the ID of the element that is currently in the viewport
 *
 * @param {string[]} ids - List of IDs to be tracked
 * @param {string} offsetPercent - Active point from top of viewport by %
 *   (Default: 40%)
 * @returns {string} The ID of the element that is currently in the viewport
 */
export function useScrollSpy(ids: string[], offsetPercent = 40) {
    const [activeId, setActiveId] = useState("")
    const isScrollPending = useRef(false)

    const pathname = usePathname()

    useEffect(() => {
        const handleScroll = () => {
            if (isScrollPending.current) return
            isScrollPending.current = true

            requestAnimationFrame(() => {
                const scrollY = window.scrollY
                const innerHeight = window.innerHeight

                const existingElements = ids
                    .map((id) => {
                        const el = document.getElementById(id)
                        if (!el) return null
                        const rect = el.getBoundingClientRect()
                        return { el, rect }
                    })
                    .filter(
                        (item) =>
                            item !== null &&
                            (item.rect.width > 0 || item.rect.height > 0)
                    )

                if (existingElements.length === 0) {
                    isScrollPending.current = false
                    return
                }

                if (pathname === "/portfolio" && scrollY < 10) {
                    setActiveId(existingElements[0].el.id)
                    isScrollPending.current = false
                    return
                }

                const isBottom =
                    innerHeight + scrollY >=
                    document.documentElement.scrollHeight - 10

                if (pathname === "/portfolio" && isBottom) {
                    setActiveId(
                        existingElements[existingElements.length - 1].el.id
                    )
                    isScrollPending.current = false
                    return
                }

                const activePoint = innerHeight * (offsetPercent / 100)

                let newActiveId = ""

                for (let i = existingElements.length - 1; i >= 0; i--) {
                    const { el, rect } = existingElements[i]

                    if (rect.top <= activePoint) {
                        newActiveId = el.id
                        break
                    }
                }

                if (newActiveId) {
                    setActiveId(newActiveId)
                }

                isScrollPending.current = false
            })
        }

        handleScroll()
        window.addEventListener("scroll", handleScroll, { passive: true })
        window.addEventListener("resize", handleScroll, { passive: true })

        return () => {
            window.removeEventListener("scroll", handleScroll)
            window.removeEventListener("resize", handleScroll)
        }
    }, [ids, offsetPercent, pathname])

    return activeId
}
