"use client"

import { useState } from "react"
import { usePathname, useRouter } from "next/navigation"

import { Ellipsis } from "@/components/icons/icons"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog"
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
import { useMediaQuery } from "@/hooks/use-media-query"
import { playPressSound } from "@/lib/sounds"
import { cn } from "@/lib/utils"
import { type AudioState, useAudioStore } from "@/stores/audio-store"
import {
    type SidebarPosition,
    type ToolbarPosition,
    useSidebarPositionStore,
    useToolbarPositionStore
} from "@/stores/navigation-bar-position-store"
import {
    type PortfolioMode,
    usePortfolioModeStore
} from "@/stores/portfolio-mode-store"

function SettingButton() {
    const mode = usePortfolioModeStore((state) => state.mode)
    const router = useRouter()
    const pathname = usePathname()
    const setMode = usePortfolioModeStore((state) => state.setMode)

    const isMobile = useMediaQuery("lg")

    const [alertDialogOpen, setAlertDialogOpen] = useState(false)

    // Navigate back to the `/portfolio` page if mode is set to "spread"
    // and the current URL is not `/portfolio`
    const handleModeChange = (nextMode: PortfolioMode) => {
        setMode(nextMode)

        if (nextMode === "spread") {
            if (pathname !== "/portfolio") {
                router.push("/portfolio")
            }
        }
    }

    const sidebarPosition = useSidebarPositionStore((state) => state.position)
    const setSidebarPosition = useSidebarPositionStore(
        (state) => state.setPosition
    )

    const toolbarPosition = useToolbarPositionStore((state) => state.position)
    const setToolbarPosition = useToolbarPositionStore(
        (state) => state.setPosition
    )

    const [isSettingsOpen, setIsSettingsOpen] = useState(false)

    const audioMode = useAudioStore((state) => state.audioMode)
    const setAudioMode = useAudioStore((state) => state.setAudioMode)

    return (
        <>
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
                                            <DropdownMenuSub>
                                                <DropdownMenuSubTrigger>
                                                    View mode
                                                </DropdownMenuSubTrigger>
                                                <DropdownMenuSubContent>
                                                    <DropdownMenuRadioGroup
                                                        value={mode}
                                                    >
                                                        <DropdownMenuRadioItem
                                                            value="pages"
                                                            closeOnClick
                                                            onClick={() => {
                                                                handleModeChange(
                                                                    "pages"
                                                                )
                                                            }}
                                                        >
                                                            Pages
                                                        </DropdownMenuRadioItem>

                                                        <DropdownMenuRadioItem
                                                            value="spread"
                                                            closeOnClick
                                                            onClick={() => {
                                                                setAlertDialogOpen(
                                                                    true
                                                                )
                                                            }}
                                                        >
                                                            Spread
                                                        </DropdownMenuRadioItem>
                                                    </DropdownMenuRadioGroup>
                                                </DropdownMenuSubContent>
                                            </DropdownMenuSub>
                                            <DropdownMenuSub>
                                                <DropdownMenuSubTrigger>
                                                    {isMobile
                                                        ? "Toolbar position"
                                                        : "Sidebar position"}
                                                </DropdownMenuSubTrigger>
                                                <DropdownMenuSubContent>
                                                    <DropdownMenuRadioGroup
                                                        value={
                                                            isMobile
                                                                ? toolbarPosition
                                                                : sidebarPosition
                                                        }
                                                        onValueChange={(
                                                            value
                                                        ) => {
                                                            if (isMobile) {
                                                                setToolbarPosition(
                                                                    value as ToolbarPosition
                                                                )
                                                            } else {
                                                                setSidebarPosition(
                                                                    value as SidebarPosition
                                                                )
                                                            }
                                                        }}
                                                    >
                                                        <DropdownMenuRadioItem
                                                            value={
                                                                isMobile
                                                                    ? "top"
                                                                    : "left"
                                                            }
                                                            onClick={() => {
                                                                if (isMobile) {
                                                                    setToolbarPosition(
                                                                        "top"
                                                                    )
                                                                } else {
                                                                    setSidebarPosition(
                                                                        "left"
                                                                    )
                                                                }
                                                            }}
                                                            disabled={isMobile}
                                                        >
                                                            {isMobile
                                                                ? "Top"
                                                                : "Left"}
                                                        </DropdownMenuRadioItem>
                                                        <DropdownMenuRadioItem
                                                            value={
                                                                isMobile
                                                                    ? "bottom"
                                                                    : "right"
                                                            }
                                                            onClick={() => {
                                                                if (isMobile) {
                                                                    setToolbarPosition(
                                                                        "bottom"
                                                                    )
                                                                } else {
                                                                    setSidebarPosition(
                                                                        "right"
                                                                    )
                                                                }
                                                            }}
                                                        >
                                                            {isMobile
                                                                ? "Bottom"
                                                                : "Right"}
                                                        </DropdownMenuRadioItem>
                                                    </DropdownMenuRadioGroup>
                                                </DropdownMenuSubContent>
                                            </DropdownMenuSub>
                                            <DropdownMenuSub>
                                                <DropdownMenuSubTrigger>
                                                    Audio mode
                                                </DropdownMenuSubTrigger>
                                                <DropdownMenuSubContent>
                                                    <DropdownMenuRadioGroup
                                                        value={audioMode}
                                                        onValueChange={(
                                                            value
                                                        ) => {
                                                            const nextMode =
                                                                value as AudioState["audioMode"]
                                                            setAudioMode(
                                                                nextMode
                                                            )

                                                            if (
                                                                nextMode ===
                                                                "auto"
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
                                                            description={
                                                                <>
                                                                    Manually
                                                                    press the
                                                                    audio button
                                                                    to turn on
                                                                    audio.
                                                                </>
                                                            }
                                                        >
                                                            Manual
                                                        </DropdownMenuRadioItem>
                                                        <DropdownMenuRadioItem
                                                            value="auto"
                                                            closeOnClick
                                                            description={
                                                                <>
                                                                    Automatically
                                                                    capture
                                                                    first press
                                                                    interaction
                                                                    and turn on
                                                                    audio.
                                                                </>
                                                            }
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
                                )
                            }}
                        >
                            <Ellipsis className="size-6" />
                        </DropdownMenuTrigger>
                    }
                />
            </DropdownMenu>

            <AlertDialog
                open={alertDialogOpen}
                onOpenChange={setAlertDialogOpen}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Spread mode is not stable and will affect
                            performance!
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            <span>
                                A total of over 1000 media items—including
                                images and videos—will be displayed, with around
                                200 shown simultaneously.
                            </span>
                            <br />
                            <span className="mt-[.5em] block">
                                This causes significant performance degradation
                                and lag during scrolling and interaction.
                            </span>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            variant="destructive"
                            onClick={() => {
                                handleModeChange("spread")
                                setAlertDialogOpen(false)
                            }}
                        >
                            Continue
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}

export { SettingButton }
