"use client"

import { useState } from "react"

import { RotateCcw, Undo2 } from "lucide-react"

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
import { Button } from "@/components/ui/button"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipTrigger } from "@/components/ui/tooltip"
import { DEFAULT_AUDIO_PREFERENCES } from "@/configs/audio.config"
import {
    AVAILABLE_EFFECTS,
    DEFAULT_EFFECTS_PREFERENCES
} from "@/configs/effects.config"
import {
    AVAILABLE_MEDIA_PREFERENCES,
    DEFAULT_GIF_AUTOPLAY_PREFERENCE,
    DEFAULT_MEDIA_PREFERENCES,
    DEFAULT_VIDEO_AUTOPLAY_PREFERENCE
} from "@/configs/media.config"
import { DEFAULT_MOTION_PREFERENCES } from "@/configs/motion.config"
import {
    DEFAULT_SIDEBAR_PREFERENCES,
    DEFAULT_TOOLBAR_PREFERENCES
} from "@/configs/navigation.config"
import { cn } from "@/lib/utils"
import { PREFERENCE_STORES } from "@/stores"
import { useAudioStore } from "@/stores/audio-store"
import { useEffectsStore } from "@/stores/effects-store"
import { useHapticsStore } from "@/stores/haptics-store"
import { useMediaStore } from "@/stores/media-store"
import { useMotionStore } from "@/stores/motion-store"
import {
    useSidebarPositionStore,
    useToolbarPositionStore
} from "@/stores/navigation-bar-position-store"

const RESET_MENU_CONFIG = {
    name: "Reset to defaults",
    icon: RotateCcw
}

const getPreferenceChanges = () => {
    const categoriesMap: Record<
        string,
        {
            category: string
            icon: React.ElementType
            changes: {
                id: string
                name: string
                from: string
                to: string
                onReset: () => void
                onUndo: () => void
            }[]
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
            id: "audioMode",
            name: "Sound effects",
            from: AUDIO_PREFERENCES[audioState.audioMode].label,
            to: AUDIO_PREFERENCES[DEFAULT_AUDIO_PREFERENCES.audioMode].label,
            onReset: () => {
                useAudioStore
                    .getState()
                    .setAudioMode(DEFAULT_AUDIO_PREFERENCES.audioMode)
            },
            onUndo: () => {
                useAudioStore.getState().setAudioMode(audioState.audioMode)
            }
        })
    }

    const hapticsState = useHapticsStore.getState()
    if (!hapticsState.isHapticEnabled) {
        categoriesMap[SOUNDS_HAPTICS_MENU.name].changes.push({
            id: "hapticFeedback",
            name: "Haptic feedback",
            from: "Off",
            to: "On",
            onReset: () => {
                useHapticsStore.getState().setIsHapticEnabled(true)
            },
            onUndo: () => {
                useHapticsStore.getState().setIsHapticEnabled(false)
            }
        })
    }

    const effectsState = useEffectsStore.getState()
    AVAILABLE_EFFECTS.forEach((effect) => {
        const current = effectsState.effects.includes(effect)
        const def = DEFAULT_EFFECTS_PREFERENCES.includes(effect)
        if (current !== def) {
            categoriesMap[EFFECTS_MENU.name].changes.push({
                id: `effect-${effect}`,
                name: EFFECTS[effect].label,
                from: current ? "On" : "Off",
                to: def ? "On" : "Off",
                onReset: () => {
                    useEffectsStore.getState().toggleEffect(effect)
                },
                onUndo: () => {
                    useEffectsStore.getState().toggleEffect(effect)
                }
            })
        }
    })

    const mediaState = useMediaStore.getState()
    AVAILABLE_MEDIA_PREFERENCES.forEach((pref) => {
        const current = mediaState.preferences.includes(pref)
        const def = DEFAULT_MEDIA_PREFERENCES.includes(pref)
        if (current !== def) {
            categoriesMap[MEDIA_MENU.name].changes.push({
                id: `media-pref-${pref}`,
                name: MEDIA_PREFERENCES[pref].label,
                from: current ? "On" : "Off",
                to: def ? "On" : "Off",
                onReset: () => {
                    useMediaStore.getState().togglePreference(pref)
                },
                onUndo: () => {
                    useMediaStore.getState().togglePreference(pref)
                }
            })
        }
    })

    if (mediaState.videoAutoplay !== DEFAULT_VIDEO_AUTOPLAY_PREFERENCE) {
        categoriesMap[MEDIA_MENU.name].changes.push({
            id: "videoAutoplay",
            name: "Auto-play videos",
            from: AUTOPLAY_OPTIONS[mediaState.videoAutoplay].label,
            to: AUTOPLAY_OPTIONS[DEFAULT_VIDEO_AUTOPLAY_PREFERENCE].label,
            onReset: () => {
                useMediaStore
                    .getState()
                    .setVideoAutoplay(DEFAULT_VIDEO_AUTOPLAY_PREFERENCE)
            },
            onUndo: () => {
                useMediaStore
                    .getState()
                    .setVideoAutoplay(mediaState.videoAutoplay)
            }
        })
    }

    if (mediaState.gifAutoplay !== DEFAULT_GIF_AUTOPLAY_PREFERENCE) {
        categoriesMap[MEDIA_MENU.name].changes.push({
            id: "gifAutoplay",
            name: "Auto-play GIFs",
            from: AUTOPLAY_OPTIONS[mediaState.gifAutoplay].label,
            to: AUTOPLAY_OPTIONS[DEFAULT_GIF_AUTOPLAY_PREFERENCE].label,
            onReset: () => {
                useMediaStore
                    .getState()
                    .setGifAutoplay(DEFAULT_GIF_AUTOPLAY_PREFERENCE)
            },
            onUndo: () => {
                useMediaStore.getState().setGifAutoplay(mediaState.gifAutoplay)
            }
        })
    }

    const motionState = useMotionStore.getState()
    if (motionState.preference !== DEFAULT_MOTION_PREFERENCES) {
        categoriesMap[MOTION_MENU.name].changes.push({
            id: "motionPreference",
            name: "Preference",
            from: MOTION_PREFERENCES[motionState.preference].label,
            to: MOTION_PREFERENCES[DEFAULT_MOTION_PREFERENCES].label,
            onReset: () => {
                useMotionStore
                    .getState()
                    .setPreference(DEFAULT_MOTION_PREFERENCES)
            },
            onUndo: () => {
                useMotionStore.getState().setPreference(motionState.preference)
            }
        })
    }

    const sidebarState = useSidebarPositionStore.getState()
    if (sidebarState.position !== DEFAULT_SIDEBAR_PREFERENCES) {
        categoriesMap[NAVIGATION_MENU.name].changes.push({
            id: "sidebarPosition",
            name: "Sidebar position",
            from: sidebarState.position === "left" ? "Left" : "Right",
            to: DEFAULT_SIDEBAR_PREFERENCES === "left" ? "Left" : "Right",
            onReset: () => {
                useSidebarPositionStore
                    .getState()
                    .setPosition(DEFAULT_SIDEBAR_PREFERENCES)
            },
            onUndo: () => {
                useSidebarPositionStore
                    .getState()
                    .setPosition(sidebarState.position)
            }
        })
    }

    const toolbarState = useToolbarPositionStore.getState()
    if (toolbarState.position !== DEFAULT_TOOLBAR_PREFERENCES) {
        categoriesMap[NAVIGATION_MENU.name].changes.push({
            id: "toolbarPosition",
            name: "Toolbar position",
            from: toolbarState.position === "top" ? "Top" : "Bottom",
            to: DEFAULT_TOOLBAR_PREFERENCES === "top" ? "Top" : "Bottom",
            onReset: () => {
                useToolbarPositionStore
                    .getState()
                    .setPosition(DEFAULT_TOOLBAR_PREFERENCES)
            },
            onUndo: () => {
                useToolbarPositionStore
                    .getState()
                    .setPosition(toolbarState.position)
            }
        })
    }

    return Object.values(categoriesMap).filter((g) => g.changes.length > 0)
}

function ResetMenuItem({ onClick }: { onClick?: () => void }) {
    const Icon = RESET_MENU_CONFIG.icon
    return (
        <DropdownMenuItem onClick={onClick} variant="destructive">
            <Icon />
            {RESET_MENU_CONFIG.name}
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
    const [initialChanges, setInitialChanges] = useState<
        ReturnType<typeof getPreferenceChanges>
    >([])
    const [resetItems, setResetItems] = useState<Set<string>>(new Set())
    const [prevOpen, setPrevOpen] = useState(open)

    if (open !== prevOpen) {
        setPrevOpen(open)
        if (open) {
            setInitialChanges(getPreferenceChanges())
            setResetItems(new Set())
        }
    }

    const changes = initialChanges
    const ResetIcon = RESET_MENU_CONFIG.icon

    const handleReset = () => {
        PREFERENCE_STORES.forEach((store) => {
            store.persist.clearStorage()
            store.getState().reset()
        })
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent
                size="xl"
                className="grid-rows-[minmax(0,1fr)_auto]"
            >
                <AlertDialogHeader
                    className={cn("min-h-0", {
                        sm: "place-items-stretch text-start"
                    })}
                >
                    <AlertDialogTitle>Reset all preferences?</AlertDialogTitle>
                    <AlertDialogDescription
                        render={
                            <div className="flex min-h-0 flex-col">
                                <p className="shrink-0">
                                    {`All your custom preferences will be reset to their default values. This action cannot be undone.${changes.length > 0 ? " Review what will be changed below:" : ""}`}
                                </p>
                                {changes.length > 0 && (
                                    <div
                                        className={cn(
                                            "-mx-2 -mb-2 mt-4 flex min-h-0 shrink flex-col rounded-xlg border border-dashed border-stroke text-sm",
                                            {
                                                dark: "bg-element-hover/25",
                                                sm: "-mx-6 mt-4.5 rounded-none border-x-0"
                                            }
                                        )}
                                    >
                                        <h4
                                            className={cn(
                                                "shrink-0 rounded-t-inherit border-b border-dashed border-stroke bg-default/5 px-4 py-2.5 text-foreground font-wght-600 dark:bg-default/[0.075]",
                                                {
                                                    sm: "px-6"
                                                }
                                            )}
                                        >
                                            Changes to be made:
                                        </h4>
                                        <Tooltip>
                                            <ul
                                                className={cn(
                                                    "flex-1 space-y-3 overflow-y-auto px-4 py-3.5 scroll-fade-y scroll-fade-16 scrollbar-thin",
                                                    {
                                                        sm: "space-y-5 px-5.75 py-5.5"
                                                    }
                                                )}
                                            >
                                                {changes.map((group) => {
                                                    const Icon = group.icon
                                                    return (
                                                        <li
                                                            key={group.category}
                                                            className={cn(
                                                                "[--gap:calc(var(--spacing)*1.5)] sm:[--gap:calc(var(--spacing)*4)]",
                                                                "flex flex-col gap-[--gap]"
                                                            )}
                                                        >
                                                            <div className="flex items-center gap-1.5 text-foreground font-wght-600">
                                                                <Icon className="size-4" />
                                                                <span>
                                                                    {
                                                                        group.category
                                                                    }
                                                                </span>
                                                            </div>
                                                            <ul
                                                                className={cn(
                                                                    // 4 is icon size, 1.5 is the gap between icon and label
                                                                    "[--indent:calc(var(--spacing)*4+var(--spacing)*1.5)]",
                                                                    "[--line-indent:calc(var(--indent)-var(--spacing)*4/2+var(--line-width)/3)] [--line-width:var(--px)] [--top-offset:calc(var(--gap)-var(--spacing)*.5)]",
                                                                    "flex flex-col gap-[--gap] pl-[--indent]"
                                                                )}
                                                            >
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
                                                                        const isReset =
                                                                            resetItems.has(
                                                                                change.id
                                                                            )
                                                                        return (
                                                                            <li
                                                                                key={
                                                                                    change.name
                                                                                }
                                                                                className={cn(
                                                                                    "relative flex items-baseline gap-2",
                                                                                    {
                                                                                        before: [
                                                                                            "absolute -left-[--line-indent] w-2.25 rounded-bl-sm border-b-[length:--line-width] border-l-[length:--line-width] border-stroke",
                                                                                            isFirst
                                                                                                ? "-top-[--top-offset] h-[calc(theme(fontSize.sm.1)/2+var(--line-width)/2+var(--top-offset))]"
                                                                                                : "top-0 h-[.65625rem]"
                                                                                        ],
                                                                                        after: !isLast && [
                                                                                            "absolute -left-[--line-indent] border-l-[length:--line-width] border-stroke",
                                                                                            isFirst
                                                                                                ? "-top-[--top-offset]"
                                                                                                : "top-0",
                                                                                            "-bottom-[--gap]"
                                                                                        ]
                                                                                    }
                                                                                )}
                                                                            >
                                                                                {/* <svg
                                                                                    className="absolute -left-[--line-indent] w-2.5 overflow-visible text-stroke pointer-events-none"
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
                                                                                <span
                                                                                    className={cn(
                                                                                        "text-end text-foreground",
                                                                                        (change.name.startsWith(
                                                                                            "Auto-play"
                                                                                        ) ||
                                                                                            change.name ===
                                                                                                "Preference") &&
                                                                                            "sm:text-xs"
                                                                                    )}
                                                                                >
                                                                                    {!isReset && (
                                                                                        <>
                                                                                            <span className="line-through decoration-current decoration-solid decoration-[.03125rem] opacity-70 dark:decoration-1">
                                                                                                {
                                                                                                    change.from
                                                                                                }
                                                                                            </span>
                                                                                            <ArrowRight className="mx-1.5 mb-0.5 inline-block size-3 align-middle text-muted-foreground" />
                                                                                        </>
                                                                                    )}
                                                                                    <span className="text-primary font-wght-600">
                                                                                        {
                                                                                            change.to
                                                                                        }
                                                                                    </span>
                                                                                </span>
                                                                                <TooltipTrigger
                                                                                    delay={
                                                                                        500
                                                                                    }
                                                                                    payload={{
                                                                                        content:
                                                                                            (
                                                                                                <span>
                                                                                                    {isReset
                                                                                                        ? "Revert this change"
                                                                                                        : "Reset this preference only"}
                                                                                                </span>
                                                                                            ),
                                                                                        side: "right",
                                                                                        sideOffset: 8
                                                                                    }}
                                                                                    render={
                                                                                        <Button
                                                                                            data-cursor={
                                                                                                null
                                                                                            }
                                                                                            variant={
                                                                                                isReset
                                                                                                    ? "ghost"
                                                                                                    : "ghost-highlighted"
                                                                                            }
                                                                                            size="icon-sm"
                                                                                            className={cn(
                                                                                                "-my-1.5 -me-2 ml-auto shrink-0 self-start !rounded-full"
                                                                                            )}
                                                                                            onClick={() => {
                                                                                                const next =
                                                                                                    new Set(
                                                                                                        resetItems
                                                                                                    )
                                                                                                if (
                                                                                                    isReset
                                                                                                ) {
                                                                                                    change.onUndo()
                                                                                                    next.delete(
                                                                                                        change.id
                                                                                                    )
                                                                                                } else {
                                                                                                    change.onReset()
                                                                                                    next.add(
                                                                                                        change.id
                                                                                                    )
                                                                                                }
                                                                                                setResetItems(
                                                                                                    next
                                                                                                )
                                                                                            }}
                                                                                        >
                                                                                            {isReset ? (
                                                                                                <Undo2
                                                                                                    className="-m-0.25 size-4.5 -translate-y-[1px]"
                                                                                                    strokeWidth={
                                                                                                        1.5
                                                                                                    }
                                                                                                />
                                                                                            ) : (
                                                                                                <ResetIcon />
                                                                                            )}
                                                                                        </Button>
                                                                                    }
                                                                                />
                                                                            </li>
                                                                        )
                                                                    }
                                                                )}
                                                            </ul>
                                                        </li>
                                                    )
                                                })}
                                            </ul>
                                        </Tooltip>
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
                        <ResetIcon />
                        Reset all
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export { ResetMenuItem, ResetPreferenceAlertDialog }
