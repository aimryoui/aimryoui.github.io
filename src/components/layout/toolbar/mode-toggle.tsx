"use client"

import { useSyncExternalStore } from "react"

import { useTheme } from "next-themes"

import { Moon, Sun, System } from "@/components/icons/icons"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { TooltipTrigger } from "@/components/ui/tooltip"
import { Highlight } from "@/components/ui/typography"
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
            return <System className="size-6" />
    }
}

export function ModeToggle({ className }: React.ComponentProps<"button">) {
    const { theme, setTheme } = useTheme()

    const mounted = useSyncExternalStore(
        () => () => {},
        () => true,
        () => false
    )

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
                    variant="outline"
                    size="icon"
                    disabled={!mounted}
                    onClick={() => {
                        setTheme(
                            theme === "light"
                                ? "dark"
                                : theme === "dark"
                                  ? "system"
                                  : "light"
                        )
                    }}
                    className={cn(
                        {
                            dark: "bg-input/25",
                            disabled: "cursor-wait opacity-100"
                        },
                        className
                    )}
                    suppressHydrationWarning
                >
                    {mounted ? <ThemedIcon /> : <Spinner />}
                    <span className="sr-only">Toggle theme</span>
                </Button>
            }
        />
    )
}
