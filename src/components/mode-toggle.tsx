"use client"

import { useEffect, useState } from "react"

import { Monitor, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

function ThemedIcon() {
    const { theme } = useTheme()
    let icon
    switch (theme) {
        case "light":
            icon = <Sun className="size-6" />
            break
        case "dark":
            icon = <Moon className="size-5.5" />
            break
        default:
            icon = <Monitor className="size-5" />
            break
    }

    return icon
}

export function ModeToggle({ className }: React.ComponentProps<"button">) {
    const [mounted, setMounted] = useState(false)
    const { theme, setTheme } = useTheme()

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMounted(true)
    }, [])

    if (!mounted) {
        return null
    }

    return (
        <Button
            variant="outline"
            size="icon"
            onClick={() => {
                setTheme(
                    theme === "light"
                        ? "dark"
                        : theme === "dark"
                          ? "system"
                          : "light"
                )
            }}
            className={cn(className)}
        >
            <ThemedIcon />
            <span className="sr-only">Toggle theme</span>
        </Button>
    )
}
