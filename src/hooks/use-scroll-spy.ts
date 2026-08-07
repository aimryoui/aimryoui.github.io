import { useEffect, useRef, useState } from "react"
import { usePathname } from "next/navigation"

const FPS = 60
const FPS_INTERVAL = 1000 / FPS

/**
 * Hook to track the ID of the element that is currently in the viewport
 *
 * @param {string[]} ids - List of IDs to be tracked
 * @param {string} offsetPercent - Active point from top of viewport by %
 *   (Default: 40%)
 * @returns {string} The ID of the element that is currently in the viewport
 */
function useScrollSpy(ids: string[], offsetPercent = 40) {
    const [activeId, setActiveId] = useState("")
    const rafRef = useRef<number | null>(null)
    const timeoutRef = useRef<number | null>(null)
    const lastRunRef = useRef(0)

    const pathname = usePathname()

    useEffect(() => {
        const executeLogic = () => {
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
                    (item): item is { el: HTMLElement; rect: DOMRect } =>
                        item !== null &&
                        (item.rect.width > 0 || item.rect.height > 0)
                )
                .sort((a, b) => a.rect.top - b.rect.top)

            if (existingElements.length === 0) {
                return
            }

            if (pathname === "/portfolio" && scrollY < 10) {
                setActiveId(existingElements[0].el.id)
                return
            }

            const isBottom =
                innerHeight + scrollY >=
                document.documentElement.scrollHeight - 10

            if (pathname === "/portfolio" && isBottom) {
                setActiveId(existingElements[existingElements.length - 1].el.id)
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
        }

        const handleScroll = () => {
            const now = performance.now()

            if (timeoutRef.current !== null) {
                return
            }

            const elapsed = now - lastRunRef.current
            if (elapsed >= FPS_INTERVAL) {
                lastRunRef.current = now
                if (rafRef.current) cancelAnimationFrame(rafRef.current)
                rafRef.current = requestAnimationFrame(() => {
                    executeLogic()
                })
            } else {
                timeoutRef.current = window.setTimeout(() => {
                    lastRunRef.current = performance.now()
                    if (rafRef.current) cancelAnimationFrame(rafRef.current)
                    rafRef.current = requestAnimationFrame(() => {
                        executeLogic()
                    })
                    timeoutRef.current = null
                }, FPS_INTERVAL - elapsed)
            }
        }

        handleScroll()
        window.addEventListener("scroll", handleScroll, { passive: true })
        window.addEventListener("resize", handleScroll, { passive: true })

        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current)
            if (timeoutRef.current) window.clearTimeout(timeoutRef.current)
            window.removeEventListener("scroll", handleScroll)
            window.removeEventListener("resize", handleScroll)
        }
    }, [ids, offsetPercent, pathname])

    return activeId
}

export { useScrollSpy }
