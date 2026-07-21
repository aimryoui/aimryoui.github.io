"use client"

import { useEffect, useState } from "react"

const subscriberMap = new WeakMap<Element, () => void>()
let sharedObserver: IntersectionObserver | null = null

function getSharedObserver() {
    if (typeof window === "undefined") return null
    sharedObserver ??= new IntersectionObserver(
        (entries) => {
            for (const entry of entries) {
                if (entry.isIntersecting) {
                    const callback = subscriberMap.get(entry.target)
                    if (callback) {
                        callback()

                        subscriberMap.delete(entry.target)
                        sharedObserver?.unobserve(entry.target)
                    }
                }
            }
        },
        {
            rootMargin: "200% 0px 200% 0px",
            threshold: 0
        }
    )

    return sharedObserver
}

function useMediaObserver(
    ref: React.RefObject<HTMLElement | null>,
    skip = false
) {
    const [isNearViewport, setIsNearViewport] = useState(skip)

    useEffect(() => {
        if (skip) return

        const element = ref.current
        if (!element) return

        const observer = getSharedObserver()
        if (!observer) return

        subscriberMap.set(element, () => {
            setIsNearViewport(true)
        })
        observer.observe(element)

        return () => {
            subscriberMap.delete(element)
            observer.unobserve(element)
        }
    }, [ref, skip])

    return isNearViewport
}

export { useMediaObserver }
