"use client"

import { Monitor, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

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
            icon = <Moon className="size-6" />
            break
        default:
            icon = <Monitor className="size-6" />
            break
    }

    return icon
}

export function ModeToggle() {
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
            className={cn("fixed right-6 bottom-6 z-50")}
        >
            <ThemedIcon />
            <span className="sr-only">Toggle theme</span>
        </Button>
    )
}
