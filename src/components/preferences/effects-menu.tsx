import {
    DropdownMenuCheckboxItem,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger
} from "@/components/ui/dropdown-menu"
import {
    AVAILABLE_EFFECTS,
    EFFECT_DESCRIPTIONS,
    EFFECT_LABELS
} from "@/configs/effects.config"
import { useEffectsStore } from "@/stores/effects-store"

function EffectsMenu() {
    const effects = useEffectsStore((state) => state.effects)
    const toggleEffect = useEffectsStore((state) => state.toggleEffect)

    return (
        <DropdownMenuSub>
            <DropdownMenuSubTrigger>Effects</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
                {AVAILABLE_EFFECTS.map((effect) => (
                    <DropdownMenuCheckboxItem
                        key={effect}
                        checked={effects.includes(effect)}
                        onCheckedChange={() => {
                            toggleEffect(effect)
                        }}
                        closeOnClick={false}
                        description={EFFECT_DESCRIPTIONS[effect]}
                    >
                        {EFFECT_LABELS[effect]}
                    </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuSubContent>
        </DropdownMenuSub>
    )
}

export { EffectsMenu }
