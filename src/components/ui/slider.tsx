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
                "cursor-pointer data-horizontal:w-full data-vertical:h-full",
                className
            )}
            data-slot="slider"
            defaultValue={defaultValue}
            value={value}
            min={min}
            max={max}
            thumbAlignment="edge-client-only"
            {...props}
        >
            <SliderPrimitive.Control
                className={cn(
                    "relative flex w-full touch-none select-none items-center",
                    {
                        "data-vertical": "h-full min-h-40 w-auto flex-col",
                        "data-disabled": "opacity-40"
                    }
                )}
            >
                <SliderPrimitive.Track
                    data-slot="slider-track"
                    className={cn(
                        "relative grow select-none overflow-hidden rounded-full border border-default/15 bg-background hover:bg-element-hover",
                        {
                            "data-horizontal": "h-1.5 w-full",
                            "data-vertical": "h-full w-1.5"
                        }
                    )}
                >
                    <SliderPrimitive.Indicator
                        data-slot="slider-range"
                        className={cn(
                            "select-none bg-muted-foreground/60 data-horizontal:h-full data-vertical:w-full"
                        )}
                    />
                </SliderPrimitive.Track>
                {Array.from({ length: _values.length }, (_, index) => (
                    <SliderPrimitive.Thumb
                        key={index}
                        aria-label={label}
                        data-slot="slider-thumb"
                        className={cn(
                            "relative block size-5 shrink-0 select-none rounded-sm border border-muted-foreground/60 bg-background ring-ring/50 will-change-[color,box-shadow] transition-[color,box-shadow]",
                            {
                                after: "absolute -inset-2",
                                hover: "bg-element-hover ring-2",
                                "focus-visible": "ring-2 outline-hidden",
                                active: "ring-4",
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
