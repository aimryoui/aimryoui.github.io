"use client"

import { useLayoutEffect } from "react"

import { create } from "zustand"

import {
    DEFAULT_PORTFOLIO_ROLE,
    PORTFOLIO_ROLES,
    type PortfolioRole
} from "@/configs/role.config"
import { useClientSearchParams } from "@/hooks/use-client-search-params"

// Why this file exist: https://github.com/vercel/next.js/issues/74494

interface QueryStore {
    isFeatureSelected: boolean
    setFeatureSelected: (val: boolean) => void
    role: PortfolioRole
    setRole: (role: PortfolioRole) => void
}

const useQueryStore = create<QueryStore>((set) => ({
    isFeatureSelected: false,
    setFeatureSelected: (val) => {
        set({ isFeatureSelected: val })
    },
    role: DEFAULT_PORTFOLIO_ROLE,
    setRole: (role) => {
        set({ role })
    }
}))

function QueryListener() {
    const params = useClientSearchParams()
    const setFeatureSelected = useQueryStore((s) => s.setFeatureSelected)
    const setRole = useQueryStore((s) => s.setRole)

    useLayoutEffect(() => {
        setFeatureSelected(params.get("feature") === "selected")

        const role = params.get("r") as PortfolioRole | null
        if (role && PORTFOLIO_ROLES.includes(role)) {
            setRole(role)
        } else {
            setRole(DEFAULT_PORTFOLIO_ROLE)
        }
    }, [params, setFeatureSelected, setRole])

    return null
}

export { QueryListener, useQueryStore }
