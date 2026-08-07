import {
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger
} from "@/components/ui/dropdown-menu"
import { type MotionPreference, useMotionStore } from "@/stores/motion-store"

function MotionMenu() {
    const motionPreference = useMotionStore((state) => state.preference)
    const setMotionPreference = useMotionStore((state) => state.setPreference)

    return (
        <DropdownMenuSub>
            <DropdownMenuSubTrigger>Motion</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
                <DropdownMenuRadioGroup
                    value={motionPreference}
                    onValueChange={(value) => {
                        setMotionPreference(value as MotionPreference)
                    }}
                >
                    <DropdownMenuRadioItem value="preferred" closeOnClick>
                        Preferred
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="reduced" closeOnClick>
                        Reduced
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="system" closeOnClick>
                        Follow system
                    </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
        </DropdownMenuSub>
    )
}

export { MotionMenu }
