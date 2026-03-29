"use client"

import { useMemo } from "react"

import { Slider as SliderPrimitive } from "@base-ui/react/slider"

import { cn } from "@/lib/utils"

function Slider({
    label,
    className,
    defaultValue,
    value,
    min = 0,
    max = 100,
    ...props
}: SliderPrimitive.Root.Props & { label?: string }) {
    const _values = useMemo<readonly number[]>(() => {
        const val = value ?? defaultValue ?? [min, max]

        return (Array.isArray(val) ? val : [val]) as readonly number[]
    }, [value, defaultValue, min, max])

    return (
        <SliderPrimitive.Root
            className={cn(
                "cursor-pointer data-[orientation=vertical]:h-full data-[orientation=horizontal]:w-full",
                className
            )}
            data-slot="slider"
            defaultValue={defaultValue}
            value={value}
            min={min}
            max={max}
            thumbAlignment="edge"
            {...props}
        >
            <SliderPrimitive.Control
                className={cn(
                    "relative flex w-full touch-none select-none items-center",
                    {
                        "data-[orientation=vertical]":
                            "h-full min-h-40 w-auto flex-col",
                        "data-[disabled]": "opacity-40"
                    }
                )}
            >
                <SliderPrimitive.Track
                    data-slot="slider-track"
                    className={cn(
                        "relative grow select-none overflow-hidden rounded-full border border-default/15 bg-background",
                        {
                            "data-[orientation=horizontal]": "h-1.5 w-full",
                            "data-[orientation=vertical]": "h-full w-1.5"
                        }
                    )}
                >
                    <SliderPrimitive.Indicator
                        data-slot="slider-range"
                        className={cn(
                            "select-none bg-muted-foreground data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full"
                        )}
                    />
                </SliderPrimitive.Track>
                {Array.from({ length: _values.length }, (_, index) => (
                    <SliderPrimitive.Thumb
                        key={index}
                        aria-label={label}
                        data-slot="slider-thumb"
                        className={cn(
                            "relative block size-4 shrink-0 select-none rounded-sm border border-default/20 bg-background ring-ring/50 transition-[color,box-shadow]",
                            {
                                after: "absolute -inset-2",
                                hover: "ring-2",
                                "focus-visible": "ring-2 outline-hidden",
                                active: "ring-2",
                                disabled: "pointer-events-none opacity-40"
                            }
                        )}
                    />
                ))}
            </SliderPrimitive.Control>
        </SliderPrimitive.Root>
    )
}

export { Slider }
