"use client"

import { useEffect, useMemo, useRef, useSyncExternalStore } from "react"

import { DEFAULT_AUDIO_PREFERENCES } from "@/configs/audio.config"
import { DEFAULT_DIRECTION_PREFERENCE } from "@/configs/direction.config"
import { DEFAULT_EFFECTS_PREFERENCES } from "@/configs/effects.config"
import {
    DEFAULT_GIF_AUTOPLAY_PREFERENCE,
    DEFAULT_MEDIA_PREFERENCES,
    DEFAULT_VIDEO_AUTOPLAY_PREFERENCE
} from "@/configs/media.config"
import { DEFAULT_MOTION_PREFERENCES } from "@/configs/motion.config"
import {
    DEFAULT_SIDEBAR_PREFERENCES,
    DEFAULT_TOOLBAR_PREFERENCES
} from "@/configs/navigation.config"
import { PREFERENCE_STORES } from "@/stores"
import { useAudioStore } from "@/stores/audio-store"
import { useDirectionStore } from "@/stores/direction-store"
import { useEffectsStore } from "@/stores/effects-store"
import { useHapticsStore } from "@/stores/haptics-store"
import { useMediaStore } from "@/stores/media-store"
import { useMotionStore } from "@/stores/motion-store"
import {
    useSidebarPositionStore,
    useToolbarPositionStore
} from "@/stores/navigation-bar-position-store"

let isSystemReduced = false
if (typeof window !== "undefined") {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    isSystemReduced = mq.matches
    mq.addEventListener("change", (e) => {
        isSystemReduced = e.matches
        updateGlobalState()
    })
}

function computeSnapshot(isServer: boolean) {
    const audioMode = isServer
        ? DEFAULT_AUDIO_PREFERENCES.audioMode
        : useAudioStore.getState().audioMode
    const isAudioEnabled = isServer
        ? DEFAULT_AUDIO_PREFERENCES.isAudioEnabled
        : useAudioStore.getState().isAudioEnabled
    const haptics = isServer ? true : useHapticsStore.getState().isHapticEnabled
    const effects = isServer
        ? DEFAULT_EFFECTS_PREFERENCES
        : useEffectsStore.getState().effects
    const mediaPrefs = isServer
        ? DEFAULT_MEDIA_PREFERENCES
        : useMediaStore.getState().preferences
    const videoAutoplay = isServer
        ? DEFAULT_VIDEO_AUTOPLAY_PREFERENCE
        : useMediaStore.getState().videoAutoplay
    const gifAutoplay = isServer
        ? DEFAULT_GIF_AUTOPLAY_PREFERENCE
        : useMediaStore.getState().gifAutoplay
    const motionPref = isServer
        ? DEFAULT_MOTION_PREFERENCES
        : useMotionStore.getState().preference
    const directionPref = isServer
        ? DEFAULT_DIRECTION_PREFERENCE
        : useDirectionStore.getState().preference
    const sidebarPos = isServer
        ? DEFAULT_SIDEBAR_PREFERENCES
        : useSidebarPositionStore.getState().position
    const toolbarPos = isServer
        ? DEFAULT_TOOLBAR_PREFERENCES
        : useToolbarPositionStore.getState().position
    const systemReduced = isServer ? false : isSystemReduced

    return {
        audioMode,
        isAudioEnabled,
        isHapticEnabled: haptics,
        mediaDim: mediaPrefs.includes("dim"),
        mediaVideoAutoplay: videoAutoplay,
        mediaGifAutoplay: gifAutoplay,
        effectTargetCursor: effects.includes("target-cursor"),
        effectLineSidebar: effects.includes("line-sidebar"),
        effectPageTransition: effects.includes("page-transition"),
        effectAmbientColors: effects.includes("ambient-colors"),
        motionReduced:
            motionPref === "reduced"
            || (motionPref === "system" && systemReduced),
        motionPreferred:
            motionPref === "preferred"
            || (motionPref === "system" && !systemReduced),
        directionPref,
        sidebarPosition: sidebarPos,
        toolbarPosition: toolbarPos
    }
}

type PreferencesState = ReturnType<typeof computeSnapshot>

const serverSnapshot = computeSnapshot(true)

function computeState(): PreferencesState {
    if (typeof window === "undefined") return serverSnapshot
    return computeSnapshot(false)
}

let globalState: PreferencesState = computeState()

const listeners = new Set<() => void>()

function updateGlobalState() {
    globalState = computeState()
    listeners.forEach((listener) => {
        listener()
    })
}

if (typeof window !== "undefined") {
    PREFERENCE_STORES.forEach((store) => {
        store.subscribe(updateGlobalState)
    })
}

function subscribe(listener: () => void) {
    listeners.add(listener)
    return () => {
        listeners.delete(listener)
    }
}

const accessTracker = new WeakMap<object, Set<keyof PreferencesState>>()

function getServerSnapshot() {
    return serverSnapshot
}

function usePreference() {
    const snapshotRef = useRef(globalState)
    const proxyRef = useRef<PreferencesState | null>(null)

    const getSnapshot = () => {
        let changed = false
        if (proxyRef.current) {
            const accessed = accessTracker.get(proxyRef.current)
            if (accessed) {
                for (const key of accessed) {
                    if (snapshotRef.current[key] !== globalState[key]) {
                        changed = true
                        break
                    }
                }
            }
        } else if (snapshotRef.current !== globalState) {
            changed = true
        }

        if (changed) {
            snapshotRef.current = globalState
        }

        return snapshotRef.current
    }

    const snapshot = useSyncExternalStore(
        subscribe,
        getSnapshot,
        getServerSnapshot
    )

    const proxy = useMemo(() => {
        const p = new Proxy(snapshot, {
            get(target, prop: keyof PreferencesState) {
                let accessed = accessTracker.get(p)
                if (!accessed) {
                    accessed = new Set()
                    accessTracker.set(p, accessed)
                }
                accessed.add(prop)
                return target[prop]
            }
        })
        return p
    }, [snapshot])

    useEffect(() => {
        proxyRef.current = proxy
    }, [proxy])

    return proxy
}

export type { PreferencesState }
export { usePreference }
