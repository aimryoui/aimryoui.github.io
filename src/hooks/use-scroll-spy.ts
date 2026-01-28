"use client"

import { useEffect, useRef, useState } from "react"

/**
 * @param ids - List of IDs to be tracked
 * @param offsetPercent - Active point from top of viewport by % (Default: 40%)
 */
export function useScrollSpy(ids: string[], offsetPercent = 40) {
    const [activeId, setActiveId] = useState<string>("")
    const isScrollPending = useRef(false)

    useEffect(() => {
        const handleScroll = () => {
            if (isScrollPending.current) return
            isScrollPending.current = true

            requestAnimationFrame(() => {
                const scrollY = window.scrollY
                const innerHeight = window.innerHeight

                if (scrollY < 10 && ids.length > 0) {
                    setActiveId(ids[0])
                    isScrollPending.current = false
                    return
                }

                const isBottom =
                    innerHeight + scrollY >=
                    document.documentElement.scrollHeight - 10

                if (isBottom && ids.length > 0) {
                    setActiveId(ids[ids.length - 1])
                    isScrollPending.current = false
                    return
                }

                const activePoint = innerHeight * (offsetPercent / 100)

                let newActiveId = ""

                for (let i = ids.length - 1; i >= 0; i--) {
                    const id = ids[i]
                    const element = document.getElementById(id)

                    if (!element) continue

                    const rect = element.getBoundingClientRect()

                    if (rect.top <= activePoint) {
                        newActiveId = id
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
    }, [ids, offsetPercent])

    return activeId
}
