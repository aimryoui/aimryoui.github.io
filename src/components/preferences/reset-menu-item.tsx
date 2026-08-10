"use client"

import { RotateCcw } from "lucide-react"

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
import { DEFAULT_EFFECTS_PREFERENCES } from "@/configs/effects.config"
import {
    DEFAULT_AUTOPLAY_PREFERENCE,
    DEFAULT_MEDIA_PREFERENCES
} from "@/configs/media.config"
import { DEFAULT_MOTION_PREFERENCES } from "@/configs/motion.config"
import {
    DEFAULT_SIDEBAR_PREFERENCES,
    DEFAULT_TOOLBAR_PREFERENCES
} from "@/configs/navigation.config"
import { useAudioStore } from "@/stores/audio-store"
import { useEffectsStore } from "@/stores/effects-store"
import { useMediaStore } from "@/stores/media-store"
import { useMotionStore } from "@/stores/motion-store"
import {
    useSidebarPositionStore,
    useToolbarPositionStore
} from "@/stores/navigation-bar-position-store"

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
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Reset all preferences?</AlertDialogTitle>
                    <AlertDialogDescription>
                        All your custom preferences will be reset to their
                        default values. This action cannot be undone.
                    </AlertDialogDescription>
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
