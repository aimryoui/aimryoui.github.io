"use client"

import { useState } from "react"

import { MenuDotsBoldDuotoneIcon } from "@solar-icons/react"

import { EffectsMenu } from "@/components/preferences/effects-menu"
import { ExperimentalsMenu } from "@/components/preferences/experimentals-menu"
import { MediaMenu } from "@/components/preferences/media-menu"
import { MotionMenu } from "@/components/preferences/motion-menu"
import { NavigationBarPositionMenu } from "@/components/preferences/navigation-bar-position-menu"
import {
    ResetMenuItem,
    ResetPreferenceAlertDialog
} from "@/components/preferences/reset-menu-item"
import { ResumeDownloadMenuLinkItem } from "@/components/preferences/resume-download-menu-link-item"
import { SoundsHapticsMenu } from "@/components/preferences/sounds-haptics-menu"
import { SourceCodeMenuLinkItem } from "@/components/preferences/source-code-menu-link-item"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuGroup,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

function PreferencesButton() {
    const [isPreferencesOpen, setIsPreferencesOpen] = useState(false)
    const [isResetDialogOpen, setIsResetDialogOpen] = useState(false)

    return (
        <>
            <DropdownMenu
                onOpenChange={(open) => {
                    setIsPreferencesOpen(open)
                }}
                containerClassName="[--solar-secondary-opacity:0.25] dark:[--solar-secondary-opacity:0.4]"
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
                                sticky: false,
                                content: (
                                    <>
                                        <DropdownMenuGroup>
                                            <DropdownMenuLabel>
                                                Preferences
                                            </DropdownMenuLabel>
                                            <SoundsHapticsMenu />
                                            <MediaMenu />
                                            <MotionMenu />
                                            <EffectsMenu />
                                            <NavigationBarPositionMenu />
                                            <ExperimentalsMenu />
                                            <ResetMenuItem
                                                onClick={() => {
                                                    setIsResetDialogOpen(true)
                                                }}
                                            />
                                        </DropdownMenuGroup>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuGroup>
                                            <DropdownMenuLabel>
                                                About
                                            </DropdownMenuLabel>
                                            <ResumeDownloadMenuLinkItem />
                                            <SourceCodeMenuLinkItem />
                                        </DropdownMenuGroup>
                                    </>
                                )
                            }}
                        >
                            <MenuDotsBoldDuotoneIcon className="size-6" />
                        </DropdownMenuTrigger>
                    }
                />
            </DropdownMenu>
            <ResetPreferenceAlertDialog
                open={isResetDialogOpen}
                onOpenChange={setIsResetDialogOpen}
            />
        </>
    )
}

export { PreferencesButton }
