"use client"

import { composeRenderProps } from "react-aria-components"
import { Input as InputPrimitive } from "react-aria-components/Input"

import { playPressSound } from "@/lib/sounds"
import { cn } from "@/lib/utils"

type InputProps = React.ComponentProps<typeof InputPrimitive>

function Input({
    className,
    type,
    onFocus,
    onPointerDown,
    ...props
}: InputProps) {
    return (
        <InputPrimitive
            type={type}
            onFocus={(e) => {
                playPressSound("input")
                onFocus?.(e)
            }}
            onPointerDown={(e) => {
                if (
                    document.activeElement === e.currentTarget
                    && !e.currentTarget.value
                ) {
                    playPressSound("button")
                }
                onPointerDown?.(e)
            }}
            data-slot="input"
            className={composeRenderProps(className, (className) =>
                cn(
                    "h-9 w-full min-w-0 rounded-xlg border border-input bg-transparent px-3 pb-1.5 pt-1 text-base caret-highlighted will-change-[outline,border]",
                    {
                        hover: "bg-element-hover",
                        dark: "bg-input/30",
                        file: "inline-flex h-7 border-0 bg-transparent text-sm text-foreground",
                        placeholder: "text-muted-foreground",
                        disabled:
                            "pointer-events-none cursor-not-allowed opacity-50",
                        "focus-visible":
                            "animate-focus border-ring hover:bg-transparent",
                        "aria-invalid":
                            "border-destructive ring-destructive/20 dark:ring-destructive/40",

                        lg: "text-[16px]"
                    },
                    className
                )
            )}
            {...props}
        />
    )
}

export type { InputProps }
export { Input }
