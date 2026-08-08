"use client"

import { useTheme } from "next-themes"

import { Moon, Sun, System } from "@/components/icons/icons"
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
            return <Sun className="size-6" />
        case "dark":
            return <Moon className="size-6" />
        case "system":
        case undefined:
            return <System className="size-5.75" />
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
                        Switch to{" "}
                        <Highlight className="capitalize">{newTheme}</Highlight>{" "}
                        theme
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
