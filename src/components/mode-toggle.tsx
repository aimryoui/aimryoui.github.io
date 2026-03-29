"use client"

import { useSyncExternalStore } from "react"

import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { TooltipTrigger } from "@/components/ui/tooltip"
import { Highlight } from "@/components/ui/typography"
import { Moon, Sun, System } from "@/lib/icons"
import { cn } from "@/lib/utils"

function ThemedIcon() {
    const { theme } = useTheme()

    switch (theme) {
        case "light":
            return <Sun />
        case "dark":
            return <Moon />
        case "system":
        case undefined:
            return <System />
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
                        "disabled:cursor-wait disabled:opacity-100",
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
