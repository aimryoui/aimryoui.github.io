"use client"

import { useEffect } from "react"
import { useSearchParams } from "next/navigation"

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
    const searchParams = useSearchParams()
    const setFeatureSelected = useFeatureQuery((s) => s.setFeatureSelected)

    useEffect(() => {
        setFeatureSelected(searchParams.get("feature") === "selected")
    }, [searchParams, setFeatureSelected])

    return null
}

export { FeatureQueryListener, useFeatureQuery }
