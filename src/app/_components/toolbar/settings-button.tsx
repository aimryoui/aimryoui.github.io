"use client"

import { useState } from "react"

import { Ellipsis } from "@/components/icons/icons"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuGroup,
    DropdownMenuLabel,
    DropdownMenuLinkItem,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { TooltipTrigger } from "@/components/ui/tooltip"
import { playPressSound } from "@/lib/sounds"
import { cn } from "@/lib/utils"
import { type AudioState, useAudioStore } from "@/stores/audio-store"

function SettingButton() {
    const [isSettingsOpen, setIsSettingsOpen] = useState(false)

    const audioMode = useAudioStore((state) => state.audioMode)
    const setAudioMode = useAudioStore((state) => state.setAudioMode)

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
                                    dark: "bg-input/25",
                                    lg: "size-[36px]"
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
                                        <DropdownMenuSub>
                                            <DropdownMenuSubTrigger>
                                                Audio mode
                                            </DropdownMenuSubTrigger>
                                            <DropdownMenuSubContent>
                                                <DropdownMenuRadioGroup
                                                    value={audioMode}
                                                    onValueChange={(value) => {
                                                        const nextMode =
                                                            value as AudioState["audioMode"]
                                                        setAudioMode(nextMode)

                                                        if (
                                                            nextMode === "auto"
                                                        ) {
                                                            useAudioStore
                                                                .getState()
                                                                .setIsAudioEnabled(
                                                                    true
                                                                )

                                                            playPressSound(
                                                                "button"
                                                            )
                                                        }
                                                    }}
                                                >
                                                    <DropdownMenuRadioItem
                                                        value="manual"
                                                        closeOnClick
                                                    >
                                                        Manual
                                                    </DropdownMenuRadioItem>
                                                    <DropdownMenuRadioItem
                                                        value="auto"
                                                        closeOnClick
                                                    >
                                                        Auto
                                                    </DropdownMenuRadioItem>
                                                </DropdownMenuRadioGroup>
                                            </DropdownMenuSubContent>
                                        </DropdownMenuSub>
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
