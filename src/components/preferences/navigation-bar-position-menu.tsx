import { sendGAEvent, sendGTMEvent } from "@next/third-parties/google"

import {
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger
} from "@/components/ui/dropdown-menu"
import { useMediaQuery } from "@/hooks/use-media-query"
import {
    type SidebarPosition,
    type ToolbarPosition,
    useSidebarPositionStore,
    useToolbarPositionStore
} from "@/stores/navigation-bar-position-store"

function NavigationBarPositionMenu() {
    const isMobile = useMediaQuery("lg")

    const sidebarPosition = useSidebarPositionStore((state) => state.position)
    const setSidebarPosition = useSidebarPositionStore(
        (state) => state.setPosition
    )

    const toolbarPosition = useToolbarPositionStore((state) => state.position)
    const setToolbarPosition = useToolbarPositionStore(
        (state) => state.setPosition
    )

    return (
        <DropdownMenuSub>
            <DropdownMenuSubTrigger>
                {isMobile ? "Toolbar position" : "Sidebar position"}
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
                <DropdownMenuRadioGroup
                    value={isMobile ? toolbarPosition : sidebarPosition}
                    onValueChange={(value: string) => {
                        if (isMobile) {
                            setToolbarPosition(value as ToolbarPosition)
                        } else {
                            setSidebarPosition(value as SidebarPosition)
                        }

                        const eventName = "change_navigation_position"
                        const eventParams = {
                            position: value,
                            is_mobile: isMobile
                        }
                        sendGAEvent("event", eventName, eventParams)
                        sendGTMEvent({ event: eventName, ...eventParams })
                    }}
                >
                    <DropdownMenuRadioItem
                        value={isMobile ? "top" : "left"}
                        onClick={() => {
                            if (isMobile) {
                                setToolbarPosition("top")
                            } else {
                                setSidebarPosition("left")
                            }
                        }}
                        disabled={isMobile}
                    >
                        {isMobile ? "Top" : "Left"}
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem
                        value={isMobile ? "bottom" : "right"}
                        onClick={() => {
                            if (isMobile) {
                                setToolbarPosition("bottom")
                            } else {
                                setSidebarPosition("right")
                            }
                        }}
                    >
                        {isMobile ? "Bottom" : "Right"}
                    </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
        </DropdownMenuSub>
    )
}

export { NavigationBarPositionMenu }
