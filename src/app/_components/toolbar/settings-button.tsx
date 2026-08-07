"use client"

import { useState } from "react"

import { Ellipsis } from "@/components/icons/icons"
import { AudioMenu } from "@/components/settings/audio-menu"
import { EffectsMenu } from "@/components/settings/effects-menu"
import { MediaMenu } from "@/components/settings/media-menu"
import { MotionMenu } from "@/components/settings/motion-menu"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuGroup,
    DropdownMenuLabel,
    DropdownMenuLinkItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

function SettingButton() {
    const [isSettingsOpen, setIsSettingsOpen] = useState(false)

    return (
        <DropdownMenu
            onOpenChange={(open) => {
                setIsSettingsOpen(open)
            }}
        >
            <TooltipTrigger
                delay={500}
                disabled={isSettingsOpen}
                payload={{
                    content: <span>Settings</span>
                }}
                render={
                    <DropdownMenuTrigger
                        render={
                            <Button
                                size="icon"
                                variant="outline"
                                className={cn({
                                    dark: "bg-input/25"
                                })}
                            />
                        }
                        payload={{
                            content: (
                                <>
                                    <DropdownMenuGroup>
                                        <DropdownMenuLabel>
                                            Settings
                                        </DropdownMenuLabel>
                                        <AudioMenu />
                                        <MediaMenu />
                                        <MotionMenu />
                                        <EffectsMenu />
                                    </DropdownMenuGroup>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuGroup>
                                        <DropdownMenuLabel>
                                            About
                                        </DropdownMenuLabel>
                                        <DropdownMenuLinkItem
                                            href="https://github.com/aimryoui/aimryoui.github.io"
                                            openInNewTab
                                        >
                                            Source code
                                        </DropdownMenuLinkItem>
                                    </DropdownMenuGroup>
                                </>
                            ),
                            side: "top"
                        }}
                    >
                        <Ellipsis className="size-6" />
                    </DropdownMenuTrigger>
                }
            />
        </DropdownMenu>
    )
}

export { SettingButton }
