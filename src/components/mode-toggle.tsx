"use client"

import { useEffect, useState } from "react"

import { Monitor, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"

function ThemedIcon() {
    const { theme } = useTheme()

    switch (theme) {
        case "light":
            return <Sun className="size-6" />
        case "dark":
            return <Moon className="size-5.5" />
        default:
            return <Monitor className="size-5" />
    }
}

export function ModeToggle({ className }: React.ComponentProps<"button">) {
    const [mounted, setMounted] = useState(false)
    const { theme, setTheme } = useTheme()

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMounted(true)
    }, [])

    return (
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
            className={cn("disabled:opacity-100", className)}
        >
            {!mounted ? <Spinner /> : <ThemedIcon />}
            <span className="sr-only">Toggle theme</span>
        </Button>
    )
}
