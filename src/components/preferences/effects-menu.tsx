import { useEffect } from "react"

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
import { useEffectsStore } from "@/stores/effects-store"

interface EffectConfig {
    label: string
    description: React.ReactNode
    icon?: React.ReactNode
    shouldDisable?: (device: DeviceInfo) => boolean
}

const MENU_NAME = "Visual effects"

const EFFECTS: Record<Effect, EffectConfig> = {
    "target-cursor": {
        label: "Target cursor",
        description:
            "Use custom cursor that snappy-snaps to clickable elements. Not available on touch devices.",
        icon: <MousePointerClick />,
        shouldDisable: (device) => device.isTouchDevice
    },
    "line-sidebar": {
        label: "Line sidebar",
        description: "Magnifying lines effect on desktop sidebar.",
        icon: <TextAlignStart />,
        shouldDisable: () => true
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
    const setEffects = useEffectsStore((state) => state.setEffects)
    const device = useDevice()

    useEffect(() => {
        const nextEffects = effects.filter(
            (effect) => !EFFECTS[effect].shouldDisable?.(device)
        )

        if (nextEffects.length !== effects.length) {
            setEffects(nextEffects)
        }
    }, [device, effects, setEffects])

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
                        disabled={EFFECTS[effect].shouldDisable?.(device)}
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
