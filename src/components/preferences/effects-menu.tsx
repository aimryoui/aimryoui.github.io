"use client"

import { sendGAEvent } from "@next/third-parties/google"
import {
    CursorBoldDuotoneIcon,
    ListBoldDuotoneIcon,
    Palette2BoldDuotoneIcon,
    Reorder2BoldDuotoneIcon,
    StarRingBoldDuotoneIcon
} from "@solar-icons/react"

import { showMenuToast } from "@/components/preferences/menu-toast"
import {
    DropdownMenuCheckboxItem,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger
} from "@/components/ui/dropdown-menu"
import {
    AVAILABLE_EFFECTS,
    DEFAULT_EFFECTS_PREFERENCES,
    type Effect
} from "@/configs/effects.config"
import { type DeviceInfo, useDevice } from "@/hooks/use-device"
import { useMediaQuery } from "@/hooks/use-media-query"
import { usePreference } from "@/hooks/use-preference"
import { useEffectsStore } from "@/stores/effects-store"

interface EffectDisableContext {
    device: DeviceInfo
    isLg: boolean
    motionReduced: boolean
}

interface EffectConfig {
    label: string
    description: React.ReactNode
    icon?: React.ReactNode
    shouldDisable?: (ctx: EffectDisableContext) => boolean
}

const MENU_CONFIG = {
    name: "Effects",
    icon: <StarRingBoldDuotoneIcon />
}

const EFFECTS: Record<Effect, EffectConfig> = {
    "target-cursor": {
        label: "Target cursor",
        description:
            "Use custom cursor that snappy-snaps to clickable elements. Not available on touch devices. Disabled with reduced motion.",
        icon: <CursorBoldDuotoneIcon />,
        shouldDisable: (ctx) => ctx.device.isTouchDevice || ctx.motionReduced
    },
    "line-sidebar": {
        label: "Line sidebar",
        description:
            "Magnifying lines effect on sidebar. Not available on small screen or touch devices. Disabled with reduced motion.",
        icon: (
            <ListBoldDuotoneIcon className="[--solar-secondary-opacity:0.4]" />
        ),
        shouldDisable: (ctx) =>
            ctx.device.isTouchDevice || ctx.motionReduced || ctx.isLg
    },
    "ambient-colors": {
        label: "Ambient colors",
        description:
            "Use project vibrant-based colors instead of default colors.",
        icon: <Palette2BoldDuotoneIcon />
    },
    "page-transition": {
        label: "Page transition",
        description:
            "Enable browser's native view-transition API when navigating between pages. Disabled with reduced motion.",
        icon: <Reorder2BoldDuotoneIcon />,
        shouldDisable: (ctx) => ctx.motionReduced
    }
}

function EffectsMenu() {
    const effects = useEffectsStore((state) => state.effects)
    const toggleEffect = useEffectsStore((state) => state.toggleEffect)

    const isTouchDevice = useDevice()
    const isLg = useMediaQuery("lg")
    const { motionReduced } = usePreference()

    return (
        <DropdownMenuSub>
            <DropdownMenuSubTrigger>
                {MENU_CONFIG.icon}
                {MENU_CONFIG.name}
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="max-w-66">
                {AVAILABLE_EFFECTS.map((effect) => (
                    <DropdownMenuCheckboxItem
                        key={effect}
                        isDefault={DEFAULT_EFFECTS_PREFERENCES.includes(effect)}
                        checked={effects.includes(effect)}
                        onCheckedChange={(checked) => {
                            toggleEffect(effect)

                            const eventName = "change_effects_preference"
                            const eventParams = { effect, enabled: checked }
                            sendGAEvent("event", eventName, eventParams)

                            showMenuToast(
                                EFFECTS[effect].label,
                                checked ? "Off" : "On",
                                checked ? "On" : "Off",
                                () => {
                                    toggleEffect(effect)
                                    sendGAEvent("event", `${eventName}_undo`, eventParams)
                                }
                            )
                        }}
                        disabled={EFFECTS[effect].shouldDisable?.({
                            device: isTouchDevice,
                            isLg,
                            motionReduced
                        })}
                        description={EFFECTS[effect].description}
                    >
                        {EFFECTS[effect].icon}
                        {EFFECTS[effect].label}
                    </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuSubContent>
        </DropdownMenuSub>
    )
}

export { EFFECTS, EffectsMenu, MENU_CONFIG }
