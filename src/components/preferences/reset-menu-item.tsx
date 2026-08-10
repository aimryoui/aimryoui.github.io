"use client"

import { RotateCcw } from "lucide-react"

import { ArrowRight } from "@/components/icons/icons"
import {
    EFFECTS,
    MENU_CONFIG as EFFECTS_MENU
} from "@/components/preferences/effects-menu"
import {
    AUTOPLAY_OPTIONS,
    MENU_CONFIG as MEDIA_MENU,
    MEDIA_PREFERENCES
} from "@/components/preferences/media-menu"
import {
    MENU_CONFIG as MOTION_MENU,
    MOTION_PREFERENCES
} from "@/components/preferences/motion-menu"
import { MENU_CONFIG as NAVIGATION_MENU } from "@/components/preferences/navigation-bar-position-menu"
import {
    AUDIO_PREFERENCES,
    MENU_CONFIG as SOUNDS_HAPTICS_MENU
} from "@/components/preferences/sounds-haptics-menu"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { DEFAULT_AUDIO_PREFERENCES } from "@/configs/audio.config"
import {
    AVAILABLE_EFFECTS,
    DEFAULT_EFFECTS_PREFERENCES
} from "@/configs/effects.config"
import {
    AVAILABLE_MEDIA_PREFERENCES,
    DEFAULT_AUTOPLAY_PREFERENCE,
    DEFAULT_MEDIA_PREFERENCES
} from "@/configs/media.config"
import { DEFAULT_MOTION_PREFERENCES } from "@/configs/motion.config"
import {
    DEFAULT_SIDEBAR_PREFERENCES,
    DEFAULT_TOOLBAR_PREFERENCES
} from "@/configs/navigation.config"
import { cn } from "@/lib/utils"
import { useAudioStore } from "@/stores/audio-store"
import { useEffectsStore } from "@/stores/effects-store"
import { useHapticsStore } from "@/stores/haptics-store"
import { useMediaStore } from "@/stores/media-store"
import { useMotionStore } from "@/stores/motion-store"
import {
    useSidebarPositionStore,
    useToolbarPositionStore
} from "@/stores/navigation-bar-position-store"

const getPreferenceChanges = () => {
    const categoriesMap: Record<
        string,
        {
            category: string
            icon: React.ElementType
            changes: { name: string; from: string; to: string }[]
        }
    > = {
        [NAVIGATION_MENU.name]: {
            category: NAVIGATION_MENU.name,
            icon: NAVIGATION_MENU.icon,
            changes: []
        },
        [SOUNDS_HAPTICS_MENU.name]: {
            category: SOUNDS_HAPTICS_MENU.name,
            icon: SOUNDS_HAPTICS_MENU.icon,
            changes: []
        },
        [MEDIA_MENU.name]: {
            category: MEDIA_MENU.name,
            icon: MEDIA_MENU.icon,
            changes: []
        },
        [EFFECTS_MENU.name]: {
            category: EFFECTS_MENU.name,
            icon: EFFECTS_MENU.icon,
            changes: []
        },
        [MOTION_MENU.name]: {
            category: MOTION_MENU.name,
            icon: MOTION_MENU.icon,
            changes: []
        }
    }

    const audioState = useAudioStore.getState()
    if (audioState.audioMode !== DEFAULT_AUDIO_PREFERENCES.audioMode) {
        categoriesMap[SOUNDS_HAPTICS_MENU.name].changes.push({
            name: "Sound effects",
            from: AUDIO_PREFERENCES[audioState.audioMode].label,
            to: AUDIO_PREFERENCES[DEFAULT_AUDIO_PREFERENCES.audioMode].label
        })
    }

    const hapticsState = useHapticsStore.getState()
    if (!hapticsState.isHapticEnabled) {
        categoriesMap[SOUNDS_HAPTICS_MENU.name].changes.push({
            name: "Haptic feedback",
            from: "Off",
            to: "On"
        })
    }

    const effectsState = useEffectsStore.getState()
    AVAILABLE_EFFECTS.forEach((effect) => {
        const current = effectsState.effects.includes(effect)
        const def = DEFAULT_EFFECTS_PREFERENCES.includes(effect)
        if (current !== def) {
            categoriesMap[EFFECTS_MENU.name].changes.push({
                name: EFFECTS[effect].label,
                from: current ? "On" : "Off",
                to: def ? "On" : "Off"
            })
        }
    })

    const mediaState = useMediaStore.getState()
    AVAILABLE_MEDIA_PREFERENCES.forEach((pref) => {
        const current = mediaState.preferences.includes(pref)
        const def = DEFAULT_MEDIA_PREFERENCES.includes(pref)
        if (current !== def) {
            categoriesMap[MEDIA_MENU.name].changes.push({
                name: MEDIA_PREFERENCES[pref].label,
                from: current ? "On" : "Off",
                to: def ? "On" : "Off"
            })
        }
    })

    if (mediaState.autoplay !== DEFAULT_AUTOPLAY_PREFERENCE) {
        categoriesMap[MEDIA_MENU.name].changes.push({
            name: "Auto-play",
            from: AUTOPLAY_OPTIONS[mediaState.autoplay].label,
            to: AUTOPLAY_OPTIONS[DEFAULT_AUTOPLAY_PREFERENCE].label
        })
    }

    const motionState = useMotionStore.getState()
    if (motionState.preference !== DEFAULT_MOTION_PREFERENCES) {
        categoriesMap[MOTION_MENU.name].changes.push({
            name: "Preference",
            from: MOTION_PREFERENCES[motionState.preference].label,
            to: MOTION_PREFERENCES[DEFAULT_MOTION_PREFERENCES].label
        })
    }

    const sidebarState = useSidebarPositionStore.getState()
    if (sidebarState.position !== DEFAULT_SIDEBAR_PREFERENCES) {
        categoriesMap[NAVIGATION_MENU.name].changes.push({
            name: "Sidebar position",
            from: sidebarState.position === "left" ? "Left" : "Right",
            to: DEFAULT_SIDEBAR_PREFERENCES === "left" ? "Left" : "Right"
        })
    }

    const toolbarState = useToolbarPositionStore.getState()
    if (toolbarState.position !== DEFAULT_TOOLBAR_PREFERENCES) {
        categoriesMap[NAVIGATION_MENU.name].changes.push({
            name: "Toolbar position",
            from: toolbarState.position === "top" ? "Top" : "Bottom",
            to: DEFAULT_TOOLBAR_PREFERENCES === "top" ? "Top" : "Bottom"
        })
    }

    return Object.values(categoriesMap).filter((g) => g.changes.length > 0)
}

function ResetMenuItem({ onClick }: { onClick?: () => void }) {
    return (
        <DropdownMenuItem onClick={onClick} variant="destructive">
            <RotateCcw />
            Reset to defaults
        </DropdownMenuItem>
    )
}

function ResetPreferenceAlertDialog({
    open,
    onOpenChange
}: {
    open: boolean
    onOpenChange: (open: boolean) => void
}) {
    const changes = open ? getPreferenceChanges() : []

    const handleReset = () => {
        useAudioStore
            .getState()
            .setAudioMode(DEFAULT_AUDIO_PREFERENCES.audioMode)
        useAudioStore
            .getState()
            .setIsAudioEnabled(DEFAULT_AUDIO_PREFERENCES.isAudioEnabled)
        useEffectsStore.getState().setEffects(DEFAULT_EFFECTS_PREFERENCES)
        useMediaStore.getState().setPreferences(DEFAULT_MEDIA_PREFERENCES)
        useMediaStore.getState().setAutoplay(DEFAULT_AUTOPLAY_PREFERENCE)
        useHapticsStore.getState().setIsHapticEnabled(true)
        useMotionStore.getState().setPreference(DEFAULT_MOTION_PREFERENCES)
        useSidebarPositionStore
            .getState()
            .setPosition(DEFAULT_SIDEBAR_PREFERENCES)
        useToolbarPositionStore
            .getState()
            .setPosition(DEFAULT_TOOLBAR_PREFERENCES)
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent
                size="lg"
                className="grid-rows-[minmax(0,1fr)_auto]"
            >
                <AlertDialogHeader className="min-h-0">
                    <AlertDialogTitle>Reset all preferences?</AlertDialogTitle>
                    <AlertDialogDescription
                        render={
                            <div className="flex min-h-0 flex-col">
                                <p className="shrink-0">
                                    {`All your custom preferences will be reset to their default values. This action cannot be undone.${changes.length > 0 ? " Review what will be changed below:" : ""}`}
                                </p>
                                {changes.length > 0 && (
                                    <div className="-mx-2 -mb-2 mt-4 flex min-h-0 shrink flex-col rounded-xlg border border-dashed border-stroke bg-element-hover/50 text-sm">
                                        <h4
                                            className={cn(
                                                "shrink-0 rounded-t-inherit border-b border-dashed border-stroke bg-stroke/40 px-4 py-2.5 text-foreground font-wght-600"
                                            )}
                                        >
                                            Changes to be made:
                                        </h4>
                                        <ul
                                            className={cn(
                                                "flex-1 space-y-3 overflow-y-auto px-4 py-3.5 scroll-fade-y scroll-fade-16 scrollbar-thin"
                                            )}
                                        >
                                            {changes.map((group) => {
                                                const Icon = group.icon
                                                return (
                                                    <li key={group.category}>
                                                        <div className="flex items-center gap-1.5 text-foreground font-wght-600">
                                                            <Icon className="size-4" />
                                                            <span>
                                                                {group.category}
                                                            </span>
                                                        </div>
                                                        <ul className="mt-1.5 flex flex-col gap-1.5 pl-5.5">
                                                            {group.changes.map(
                                                                (
                                                                    change,
                                                                    index,
                                                                    arr
                                                                ) => {
                                                                    const isFirst =
                                                                        index ===
                                                                        0
                                                                    const isLast =
                                                                        index ===
                                                                        arr.length -
                                                                            1
                                                                    const isOnly =
                                                                        isFirst &&
                                                                        isLast
                                                                    return (
                                                                        <li
                                                                            key={
                                                                                change.name
                                                                            }
                                                                            className={cn(
                                                                                "relative flex items-baseline gap-2 text-muted-foreground",
                                                                                "[--indent:-14.5px] [--line-width:var(--px)] [--top-offset:var(--spacing)]",
                                                                                {
                                                                                    before: [
                                                                                        "absolute left-[--indent] w-2.5 rounded-bl-sm border-b border-l border-stroke",
                                                                                        isFirst
                                                                                            ? "-top-[--top-offset] h-[calc(theme(fontSize.sm.1)/2+var(--line-width)/2+var(--top-offset))]"
                                                                                            : "top-0 h-[10.5px]"
                                                                                    ],
                                                                                    after: !isLast && [
                                                                                        "absolute left-[--indent] w-[--line-width] bg-stroke",
                                                                                        isFirst
                                                                                            ? "-top-[--top-offset]"
                                                                                            : "top-0",
                                                                                        "-bottom-1.5"
                                                                                    ]
                                                                                }
                                                                            )}
                                                                        >
                                                                            {/* <svg
                                                                                className="absolute left-[--indent] w-2.5 overflow-visible text-stroke pointer-events-none"
                                                                                style={{
                                                                                    top: isFirst ? "calc(-1 * var(--top-offset))" : "0",
                                                                                    height: isLast
                                                                                        ? isFirst
                                                                                            ? "17px"
                                                                                            : "11px"
                                                                                        : isFirst
                                                                                            ? "calc(100% + var(--top-offset) + 6px)"
                                                                                            : "calc(100% + 6px)"
                                                                                }}
                                                                            >
                                                                                <path
                                                                                    d={`M 0.5 0 L 0.5 ${isFirst ? 16 - 4 : 10 - 4} A 4 4 0 0 0 4.5 ${isFirst ? 16 : 10} L 10 ${isFirst ? 16 : 10}`}
                                                                                    fill="none"
                                                                                    stroke="currentColor"
                                                                                    strokeWidth="var(--line-width, 1.5px)"
                                                                                    strokeLinecap="round"
                                                                                    strokeLinejoin="round"
                                                                                />
                                                                                {!isLast && (
                                                                                    <line
                                                                                        x1="0.5"
                                                                                        y1={isFirst ? 16 - 4 : 10 - 4}
                                                                                        x2="0.5"
                                                                                        y2="100%"
                                                                                        stroke="currentColor"
                                                                                        strokeWidth="var(--line-width, 1.5px)"
                                                                                        strokeLinecap="round"
                                                                                    />
                                                                                )}
                                                                            </svg> */}
                                                                            <span className="whitespace-nowrap">
                                                                                {
                                                                                    change.name
                                                                                }
                                                                            </span>
                                                                            <div
                                                                                className={cn(
                                                                                    "min-w-6 flex-1 -translate-y-1 border-b border-dotted border-stroke"
                                                                                )}
                                                                            />
                                                                            <span className="text-right text-foreground">
                                                                                <span className="line-through decoration-current decoration-solid decoration-[.03125rem] opacity-70 dark:decoration-1">
                                                                                    {
                                                                                        change.from
                                                                                    }
                                                                                </span>
                                                                                <ArrowRight className="mx-1.5 mb-[2px] inline-block size-3 align-middle text-muted-foreground" />
                                                                                <span className="text-primary font-wght-600">
                                                                                    {
                                                                                        change.to
                                                                                    }
                                                                                </span>
                                                                            </span>
                                                                        </li>
                                                                    )
                                                                }
                                                            )}
                                                        </ul>
                                                    </li>
                                                )
                                            })}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        }
                    />
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        variant="destructive"
                        onClick={() => {
                            onOpenChange(false)

                            handleReset()
                        }}
                    >
                        Reset
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export { ResetMenuItem, ResetPreferenceAlertDialog }
