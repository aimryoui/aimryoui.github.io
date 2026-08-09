"use client"

import { sendGAEvent } from "@next/third-parties/google"
import {
    MousePointerClick,
    Palette,
    Sparkles,
    TextAlignStart
} from "lucide-react"

import {
    DropdownMenuCheckboxItem,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger
} from "@/components/ui/dropdown-menu"
import { AVAILABLE_EFFECTS, type Effect } from "@/configs/effects.config"
import { type DeviceInfo, useDevice } from "@/hooks/use-device"
import { useMediaQuery } from "@/hooks/use-media-query"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import { useEffectsStore } from "@/stores/effects-store"

interface EffectDisableContext {
    device: DeviceInfo
    isLg: boolean
    reduceMotion: boolean
}

interface EffectConfig {
    label: string
    description: React.ReactNode
    icon?: React.ReactNode
    shouldDisable?: (ctx: EffectDisableContext) => boolean
}

const MENU_NAME = "Visual effects"

const EFFECTS: Record<Effect, EffectConfig> = {
    "target-cursor": {
        label: "Target cursor",
        description:
            "Use custom cursor that snappy-snaps to clickable elements. Not available on touch devices. Disabled with reduced motion.",
        icon: <MousePointerClick />,
        shouldDisable: (ctx) => ctx.device.isTouchDevice || ctx.reduceMotion
    },
    "line-sidebar": {
        label: "Line sidebar",
        description:
            "Magnifying lines effect on sidebar. Not available on small screen or touch devices. Disabled with reduced motion.",
        icon: <TextAlignStart />,
        shouldDisable: (ctx) =>
            ctx.device.isTouchDevice || ctx.reduceMotion || ctx.isLg
    },
    "ambient-colors": {
        label: "Ambient colors",
        description:
            "Use project vibrant-based colors instead of default colors.",
        icon: <Palette />
    }
}

function EffectsMenu() {
    const effects = useEffectsStore((state) => state.effects)
    const toggleEffect = useEffectsStore((state) => state.toggleEffect)

    const isTouchDevice = useDevice()
    const isLg = useMediaQuery("lg")
    const reduceMotion = useReducedMotion()

    return (
        <DropdownMenuSub>
            <DropdownMenuSubTrigger>
                <Sparkles />
                {MENU_NAME}
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
                {AVAILABLE_EFFECTS.map((effect) => (
                    <DropdownMenuCheckboxItem
                        key={effect}
                        checked={effects.includes(effect)}
                        onCheckedChange={(checked) => {
                            toggleEffect(effect)

                            const eventName = "change_effects_preference"
                            const eventParams = { effect, enabled: checked }
                            sendGAEvent("event", eventName, eventParams)
                        }}
                        disabled={EFFECTS[effect].shouldDisable?.({
                            device: isTouchDevice,
                            isLg,
                            reduceMotion
                        })}
                        closeOnClick={false}
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

export { EffectsMenu }
