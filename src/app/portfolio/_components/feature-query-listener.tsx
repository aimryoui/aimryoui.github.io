"use client"

import { useEffect } from "react"
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

    useEffect(() => {
        setFeatureSelected(window.location.search.includes("feature=selected"))
    }, [pathname, setFeatureSelected])

    return null
}

export { FeatureQueryListener, useFeatureQuery }
