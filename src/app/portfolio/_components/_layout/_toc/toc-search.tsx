"use client"

import { forwardRef } from "react"

import { Button } from "@/components/ui/button"
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput
} from "@/components/ui/input-group"
import { Kbd, KbdGroup } from "@/components/ui/kbd"
import { TooltipTrigger } from "@/components/ui/tooltip"
import { useHotkeys } from "@/hooks/use-hotkeys"
import { usePlatform } from "@/hooks/use-platform"
import { cn } from "@/lib/utils"

interface TocSearchProps {
    value: string
    onChange: (value: string) => void
    onClear: () => void
    className?: string
}

export const TocSearch = forwardRef<HTMLInputElement, TocSearchProps>(
    ({ value, onChange, onClear, className }, ref) => {
        const platform = usePlatform()

        useHotkeys([
            [
                "mod + K",
                () => {
                    if (typeof ref === "object" && ref?.current) {
                        ref.current.focus()
                    }
                }
            ]
        ])

        return (
            <div className={cn("px-6 pb-1.5 pt-5.5", className)}>
                <InputGroup as="search">
                    <InputGroupInput
                        ref={ref}
                        id="toc-search"
                        type="search"
                        role="searchbox"
                        placeholder="Search for sections..."
                        autoComplete="off"
                        value={value}
                        onChange={(e) => {
                            onChange(e.target.value)
                        }}
                        onKeyDown={(e) => {
                            if (e.key === "Escape") {
                                if (value) {
                                    onClear()
                                } else {
                                    e.currentTarget.blur()
                                }
                            }
                        }}
                        className="text-sm"
                    />
                    <InputGroupAddon>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            className="size-4"
                        >
                            <path
                                className="fill-muted-foreground"
                                d="M1.102 9.99c0-4.959 4.03-8.99 8.99-8.99 4.958 0 8.99 4.031 8.99 8.99 0 1.933-.63 3.722-1.68 5.169l5.048 5.058c.298.31.453.718.453 1.16 0 .916-.674 1.623-1.613 1.623-.43 0-.861-.144-1.17-.464l-5.08-5.08a8.742 8.742 0 0 1-4.948 1.524c-4.96 0-8.99-4.031-8.99-8.99Zm2.297 0c0 3.7 2.993 6.693 6.693 6.693 3.7 0 6.692-2.993 6.692-6.693 0-3.7-2.993-6.693-6.692-6.693A6.688 6.688 0 0 0 3.399 9.99Z"
                            />
                        </svg>
                    </InputGroupAddon>
                    <InputGroupAddon align="inline-end">
                        {value ? (
                            <TooltipTrigger
                                delay={500}
                                payload={{
                                    content: (
                                        <div className="flex items-center gap-1">
                                            Clear search <Kbd>Esc</Kbd>
                                        </div>
                                    ),
                                    side: "right",
                                    sideOffset: 6
                                }}
                                render={
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="hover:bg-transparent"
                                        onClick={onClear}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            className="size-4 cursor-pointer"
                                        >
                                            <path
                                                fill="currentColor"
                                                d="M12 23C5.94 23 1 18.06 1 12 1 5.928 5.94 1 12 1c6.072 0 11 4.928 11 11 0 6.06-4.928 11-11 11Zm-3.624-6.47a.895.895 0 0 0 .648-.26L12 13.274l2.987 2.998a.854.854 0 0 0 .636.258.895.895 0 0 0 .906-.895.824.824 0 0 0-.27-.636l-2.986-2.987 2.998-2.998a.834.834 0 0 0 .27-.637.884.884 0 0 0-.896-.884.816.816 0 0 0-.615.259L12 10.76 8.991 7.762a.855.855 0 0 0-.615-.248.868.868 0 0 0-.884.884c0 .237.086.453.259.626l2.987 2.987-2.987 2.998a.847.847 0 0 0-.259.625c0 .496.388.895.884.895Z"
                                            />
                                        </svg>
                                    </Button>
                                }
                            />
                        ) : (
                            <KbdGroup>
                                <Kbd>
                                    {platform === "mac" ? (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 12 12"
                                            className="size-2.5"
                                        >
                                            <path
                                                fill="currentColor"
                                                d="M3.473 4.736H2.374A2.354 2.354 0 0 1 0 2.384 2.377 2.377 0 0 1 2.374 0 2.382 2.382 0 0 1 4.75 2.384v1.092h2.495V2.384A2.382 2.382 0 0 1 9.618 0 2.383 2.383 0 0 1 12 2.384c0 1.316-1.067 2.352-2.382 2.352H8.527v2.528h1.09C10.934 7.272 12 8.3 12 9.616A2.384 2.384 0 0 1 9.618 12a2.382 2.382 0 0 1-2.374-2.384V8.532H4.749v1.084A2.382 2.382 0 0 1 2.374 12 2.377 2.377 0 0 1 0 9.616C0 8.3 1.067 7.272 2.374 7.264h1.1V4.736ZM2.39 3.492h1.083V2.4c0-.618-.505-1.116-1.099-1.116-.593 0-1.09.498-1.09 1.1 0 .61.497 1.108 1.106 1.108Zm7.212 0a1.104 1.104 0 0 0 .016-2.208c-.594 0-1.091.498-1.091 1.116v1.092h1.075ZM4.749 7.264h2.495V4.736H4.749v2.528ZM2.39 8.508c-.61 0-1.107.498-1.107 1.1 0 .61.498 1.1 1.091 1.1.594 0 1.1-.498 1.1-1.116V8.508H2.39Zm7.212 0H8.527v1.084c0 .618.497 1.116 1.09 1.116.602 0 1.092-.49 1.092-1.1 0-.602-.49-1.1-1.107-1.1Z"
                                            />
                                        </svg>
                                    ) : (
                                        "Ctrl"
                                    )}
                                </Kbd>
                                <Kbd>K</Kbd>
                            </KbdGroup>
                        )}
                    </InputGroupAddon>
                </InputGroup>
            </div>
        )
    }
)
TocSearch.displayName = "TocSearch"
