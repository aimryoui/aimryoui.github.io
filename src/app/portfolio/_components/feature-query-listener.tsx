"use client"

import { useEffect, useLayoutEffect } from "react"
import { usePathname } from "next/navigation"

import { create } from "zustand"

// Why this file exist: https://github.com/vercel/next.js/issues/74494

interface FeatureQueryStore {
    isFeatureSelected: boolean
    setFeatureSelected: (val: boolean) => void
}

const useFeatureQuery = create<FeatureQueryStore>((set) => ({
    isFeatureSelected: false,
    setFeatureSelected: (val) => {
        set({ isFeatureSelected: val })
    }
}))

function FeatureQueryListener() {
    const pathname = usePathname()
    const setFeatureSelected = useFeatureQuery((s) => s.setFeatureSelected)

    useLayoutEffect(() => {
        setFeatureSelected(window.location.search.includes("feature=selected"))
    }, [pathname, setFeatureSelected])

    useEffect(() => {
        const handleLocationChange = () => {
            setFeatureSelected(
                window.location.search.includes("feature=selected")
            )
        }

        window.addEventListener("popstate", handleLocationChange)

        const originalPushState = window.history.pushState
        const originalReplaceState = window.history.replaceState

        window.history.pushState = function (...args) {
            originalPushState.apply(this, args)
            setTimeout(handleLocationChange, 0)
        }

        window.history.replaceState = function (...args) {
            originalReplaceState.apply(this, args)
            setTimeout(handleLocationChange, 0)
        }

        return () => {
            window.removeEventListener("popstate", handleLocationChange)
            window.history.pushState = originalPushState
            window.history.replaceState = originalReplaceState
        }
    }, [setFeatureSelected])

    return null
}

export { FeatureQueryListener, useFeatureQuery }
