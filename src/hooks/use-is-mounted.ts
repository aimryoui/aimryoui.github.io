"use client"

import { useSyncExternalStore } from "react"

const subscribe = () => () => {}
const getSnapshot = () => true
const getServerSnapshot = () => false

function useIsMounted(): boolean {
    return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}

export { useIsMounted }
