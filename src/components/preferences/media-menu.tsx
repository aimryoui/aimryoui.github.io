import { sendGAEvent, sendGTMEvent } from "@next/third-parties/google"

import {
    DropdownMenuCheckboxItem,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger
} from "@/components/ui/dropdown-menu"
import {
    AVAILABLE_MEDIA_PREFERENCES,
    MEDIA_PREFERENCE_DESCRIPTIONS,
    MEDIA_PREFERENCE_LABELS
} from "@/configs/media.config"
import { useMediaStore } from "@/stores/media-store"

function MediaMenu() {
    const preferences = useMediaStore((state) => state.preferences)
    const togglePreference = useMediaStore((state) => state.togglePreference)

    return (
        <DropdownMenuSub>
            <DropdownMenuSubTrigger>Media</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
                {AVAILABLE_MEDIA_PREFERENCES.map((preference) => (
                    <DropdownMenuCheckboxItem
                        key={preference}
                        checked={preferences.includes(preference)}
                        onCheckedChange={(checked) => {
                            togglePreference(preference)

                            const eventName = "change_media_preference"
                            const eventParams = { preference, enabled: checked }
                            sendGAEvent("event", eventName, eventParams)
                            sendGTMEvent({ event: eventName, ...eventParams })
                        }}
                        closeOnClick={false}
                        description={MEDIA_PREFERENCE_DESCRIPTIONS[preference]}
                    >
                        {MEDIA_PREFERENCE_LABELS[preference]}
                    </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuSubContent>
        </DropdownMenuSub>
    )
}

export { MediaMenu }
