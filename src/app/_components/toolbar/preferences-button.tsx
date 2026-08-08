"use client"

import { useState } from "react"

import { Ellipsis } from "@/components/icons/icons"
import { AudioMenu } from "@/components/preferences/audio-menu"
import { EffectsMenu } from "@/components/preferences/effects-menu"
import { MediaMenu } from "@/components/preferences/media-menu"
import { MotionMenu } from "@/components/preferences/motion-menu"
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

function PreferencesButton() {
    const [isPreferencesOpen, setIsPreferencesOpen] = useState(false)

    return (
        <DropdownMenu
            onOpenChange={(open) => {
                setIsPreferencesOpen(open)
            }}
        >
            <TooltipTrigger
                delay={500}
                disabled={isPreferencesOpen}
                payload={{
                    content: <span>Preferences</span>
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
                                            Preferences
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

export { PreferencesButton }
