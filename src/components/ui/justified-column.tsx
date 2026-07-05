"use client"

import { useRef } from "react"

import { useIsomorphicLayoutEffect } from "@/hooks/use-isomorphic-layout-effect"
import { cn } from "@/lib/utils"

export function JustifiedColumn({
    children,
    className,
    style,
    ...props
}: React.ComponentProps<"div">) {
    const ref = useRef<HTMLDivElement>(null)

    useIsomorphicLayoutEffect(() => {
        const el = ref.current
        if (!el) return

        let currentRatio = 0.5

        const updateRatio = () => {
            const firstChild = el.firstElementChild
            const lastChild = el.lastElementChild

            if (firstChild && lastChild) {
                const firstRect = firstChild.getBoundingClientRect()
                const lastRect = lastChild.getBoundingClientRect()
                const intrinsicHeight = lastRect.bottom - firstRect.top
                const width = el.getBoundingClientRect().width

                if (intrinsicHeight > 0) {
                    const x = width / intrinsicHeight

                    if (Math.abs(currentRatio - x) > 0.0001) {
                        currentRatio = x
                        el.style.setProperty("--flex-ratio", x.toFixed(5))
                    }
                }
            }
        }

        updateRatio()

        const observer = new ResizeObserver(() => {
            requestAnimationFrame(updateRatio)
        })

        observer.observe(el)

        const childrenList = Array.from(el.children)
        for (const child of childrenList) {
            observer.observe(child)
        }

        return () => {
            observer.disconnect()
        }
    }, [])

    return (
        <div
            ref={ref}
            className={cn("flex flex-col", className)}
            style={{
                flex: "var(--flex-ratio, 1) 1 0%",
                ...style
            }}
            {...props}
        >
            {children}
        </div>
    )
}
