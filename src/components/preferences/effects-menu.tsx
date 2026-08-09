import { sendGAEvent } from "@next/third-parties/google"
import { MousePointerClick, Palette, Sparkles } from "lucide-react"

import {
    DropdownMenuCheckboxItem,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger
} from "@/components/ui/dropdown-menu"
import { AVAILABLE_EFFECTS, type Effect } from "@/configs/effects.config"
import { useEffectsStore } from "@/stores/effects-store"

interface EffectConfig {
    label: string
    description: React.ReactNode
    icon?: React.ReactNode
}

const MENU_NAME = "Visual effects"

const EFFECTS: Record<Effect, EffectConfig> = {
    "target-cursor": {
        label: "Target cursor",
        description:
            "Use custom cursor that snappy-snaps to clickable elements",
        icon: <MousePointerClick />
    },
    "ambient-colors": {
        label: "Ambient colors",
        description:
            "Use project vibrant-based colors instead of default colors",
        icon: <Palette />
    }
}

function EffectsMenu() {
    const effects = useEffectsStore((state) => state.effects)
    const toggleEffect = useEffectsStore((state) => state.toggleEffect)

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
