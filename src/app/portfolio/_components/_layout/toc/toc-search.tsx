"use client"

import { sendGAEvent } from "@next/third-parties/google"
import { MinimalisticMagnifierLinearIcon } from "@solar-icons/react"

import { XCircle } from "@/components/icons/icons"
import { Button } from "@/components/ui/button"
import {
    InputGroupAddon,
    InputGroupInput,
    SearchGroup
} from "@/components/ui/input-group"
import { Kbd, KbdGroup } from "@/components/ui/kbd"
import { TooltipTrigger } from "@/components/ui/tooltip"
import { Highlight, Text } from "@/components/ui/typography"
import { useHotkeys } from "@/hooks/use-hotkeys"
import { cn } from "@/lib/utils"

interface TocSearchProps extends Omit<
    React.ComponentProps<"input">,
    "value" | "onChange"
> {
    value: string
    onChange: (value: string) => void
    onClear: () => void
}

function TocSearch({
    className,
    value,
    onChange,
    onClear,
    ref,
    ...props
}: TocSearchProps) {
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

    const hasValue = Boolean(value)

    return (
        <SearchGroup
            label="Search for sections"
            labelFor="toc-search"
            data-cursor="input"
            data-sound="button"
            className={cn("pointer-events-auto cursor-auto")}
        >
            <InputGroupInput
                ref={ref}
                id="toc-search"
                type="search"
                role="search"
                tabIndex={0}
                placeholder="Search for sections..."
                autoComplete="off"
                value={value}
                onFocus={() => {
                    if (!value) {
                        const eventName = "focus_toc_search"
                        sendGAEvent("event", eventName)
                    }
                }}
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
                className={cn("text-md", className)}
                {...props}
            />
            <InputGroupAddon align="inline-start">
                <MinimalisticMagnifierLinearIcon
                    strokeWidth={2}
                    className="mb-0.25 size-4.5 group-hover/input-group:text-foreground group-has-[[data-slot=input-group-control]:focus-visible]/input-group:text-foreground"
                />
            </InputGroupAddon>
            <Addons hasValue={hasValue} onClear={onClear} />
        </SearchGroup>
    )
}

function Addons({
    hasValue,
    onClear
}: {
    hasValue: boolean
    onClear: TocSearchProps["onClear"]
}) {
    return (
        <InputGroupAddon align="inline-end">
            {hasValue ? (
                <TooltipTrigger
                    delay={500}
                    payload={{
                        content: (
                            <span className="flex items-center gap-1">
                                Clear search{" "}
                                <Kbd className="rounded-md border border-muted-foreground/20">
                                    Esc
                                </Kbd>
                            </span>
                        ),
                        side: "inline-end",
                        sideOffset: 8
                    }}
                    render={
                        <Button
                            variant="ghost"
                            size="icon"
                            className="!bg-transparent"
                            onPress={onClear}
                            tracking={{
                                eventName: "clear_toc_search"
                            }}
                            pressSound={false}
                        >
                            <XCircle className="cursor-pointer md:size-5" />
                        </Button>
                    }
                />
            ) : (
                <KbdGroup className={cn({ lg: "hidden" })}>
                    <Kbd>
                        <Command className="size-2.5 win:hidden" />
                        <span className="mac:hidden">Ctrl</span>
                    </Kbd>
                    <Kbd>K</Kbd>
                </KbdGroup>
            )}
        </InputGroupAddon>
    )
}

function Command({ className, ...props }: React.ComponentProps<"svg">) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 12 12"
            aria-hidden={true}
            className={cn("size-4", className)}
            {...props}
        >
            <path
                fill="currentColor"
                d="M3.473 4.736H2.374A2.354 2.354 0 0 1 0 2.384 2.377 2.377 0 0 1 2.374 0 2.382 2.382 0 0 1 4.75 2.384v1.092h2.495V2.384A2.382 2.382 0 0 1 9.618 0 2.383 2.383 0 0 1 12 2.384c0 1.316-1.067 2.352-2.382 2.352H8.527v2.528h1.09C10.934 7.272 12 8.3 12 9.616A2.384 2.384 0 0 1 9.618 12a2.382 2.382 0 0 1-2.374-2.384V8.532H4.749v1.084A2.382 2.382 0 0 1 2.374 12 2.377 2.377 0 0 1 0 9.616C0 8.3 1.067 7.272 2.374 7.264h1.1V4.736ZM2.39 3.492h1.083V2.4c0-.618-.505-1.116-1.099-1.116-.593 0-1.09.498-1.09 1.1 0 .61.497 1.108 1.106 1.108Zm7.212 0a1.104 1.104 0 0 0 .016-2.208c-.594 0-1.091.498-1.091 1.116v1.092h1.075ZM4.749 7.264h2.495V4.736H4.749v2.528ZM2.39 8.508c-.61 0-1.107.498-1.107 1.1 0 .61.498 1.1 1.091 1.1.594 0 1.1-.498 1.1-1.116V8.508H2.39Zm7.212 0H8.527v1.084c0 .618.497 1.116 1.09 1.116.602 0 1.092-.49 1.092-1.1 0-.602-.49-1.1-1.107-1.1Z"
            />
        </svg>
    )
}

function TocSearchNoResult({ onClear }: { onClear: () => void }) {
    return (
        <Text
            className={cn("px-safe-zone py-4", {
                lg: "py-safe-zone-vertical"
            })}
        >
            No results found.{" "}
            <Highlight
                onClick={onClear}
                className={cn(
                    "cursor-pointer decoration-solid hover:underline"
                )}
            >
                Clear search
            </Highlight>
        </Text>
    )
}

export type { TocSearchProps }
export { TocSearch, TocSearchNoResult }
