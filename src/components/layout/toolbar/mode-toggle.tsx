"use client"

import {
    MonitorBoldDuotoneIcon,
    MoonBoldDuotoneIcon,
    Sun2BoldDuotoneIcon
} from "@solar-icons/react"
import { useTheme } from "next-themes"

import { Button, type ButtonProps } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { TooltipTrigger } from "@/components/ui/tooltip"
import { Highlight } from "@/components/ui/typography"
import { useIsMounted } from "@/hooks/use-is-mounted"
import { cn } from "@/lib/utils"

function ThemedIcon() {
    const { theme } = useTheme()

    switch (theme) {
        case "light":
            return <Sun2BoldDuotoneIcon className="size-6" />
        case "dark":
            return <MoonBoldDuotoneIcon className="size-5.5" />
        case "system":
        case undefined:
            return <MonitorBoldDuotoneIcon className="size-5" />
    }
}

function ModeToggle({ className, onPress, tracking, ...props }: ButtonProps) {
    const { theme, setTheme } = useTheme()

    const mounted = useIsMounted()

    const newTheme =
        theme === "light" ? "dark" : theme === "dark" ? "system" : "light"

    return (
        <TooltipTrigger
            delay={500}
            payload={{
                content: (
                    <span>
                        Theme:{" "}
                        <Highlight className="capitalize">{theme}</Highlight>
                    </span>
                )
            }}
            render={
                <Button
                    suppressHydrationWarning
                    isDisabled={!mounted}
                    variant="outline"
                    size="icon"
                    haptic="success"
                    onPress={(e) => {
                        setTheme(newTheme)

                        onPress?.(e)
                    }}
                    tracking={{
                        eventName: tracking?.eventName ?? "toggle_theme",
                        eventParams: {
                            theme: newTheme,
                            ...tracking?.eventParams
                        }
                    }}
                    className={cn(
                        {
                            dark: "bg-input/25",
                            disabled: "cursor-wait opacity-100"
                        },
                        className
                    )}
                    {...props}
                >
                    {mounted ? <ThemedIcon /> : <Spinner />}
                    <span className="sr-only">Toggle theme</span>
                </Button>
            }
        />
    )
}

export { ModeToggle }
