"use client"

import { Slider as SliderPrimitive } from "@base-ui/react/slider"

import { cn } from "@/lib/utils"

function Slider({
    label,
    className,
    defaultValue,
    value,
    min = 0,
    max = 100,
    snapCount = 0,
    ...props
}: SliderPrimitive.Root.Props & { label?: string; snapCount?: number }) {
    const val = value ?? defaultValue ?? [min, max]
    const _values = (Array.isArray(val) ? val : [val]) as readonly number[]

    const currentProgress = Array.isArray(value)
        ? (value[0] as number)
        : typeof value === "number"
          ? value
          : 0

    return (
        <SliderPrimitive.Root
            className={cn(
                "data-horizontal:w-full data-vertical:h-full",
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
                    "group relative flex w-full cursor-pointer touch-none select-none items-center",
                    {
                        "data-vertical": "h-full min-h-40 w-auto flex-col",
                        "data-disabled": "pointer-events-none opacity-40"
                    }
                )}
            >
                <SliderPrimitive.Track
                    data-slot="slider-track"
                    className={cn(
                        "relative grow select-none overflow-hidden rounded-full border border-default/15 bg-background",
                        {
                            hover: "bg-element-hover",
                            "data-horizontal": "h-2 w-full",
                            "data-vertical": "h-full w-2"
                        }
                    )}
                >
                    {snapCount > 1 && (
                        <SliderPrimitive.Indicator
                            data-slot="slider-range"
                            className={cn(
                                "-ml-px -mt-px select-none bg-muted-foreground/60 data-horizontal:h-full data-vertical:w-full"
                            )}
                        />
                    )}
                </SliderPrimitive.Track>
                {snapCount > 1 && (
                    <>
                        <div
                            data-slot="carousel-dots"
                            className={cn(
                                "pointer-events-none absolute flex justify-between",
                                {
                                    "group-data-horizontal":
                                        "inset-x-2 top-1/2 -translate-y-1/2",
                                    "group-data-vertical":
                                        "inset-y-2 left-1/2 -translate-x-1/2 flex-col"
                                }
                            )}
                        >
                            {Array.from({ length: snapCount }).map(
                                (_, index) => {
                                    const fraction = index / (snapCount - 1)

                                    const isActive =
                                        currentProgress >= fraction - 0.001

                                    return (
                                        <div
                                            key={index}
                                            data-slot="carousel-dot"
                                            className={cn(
                                                "size-1 rounded-full first:-translate-x-1.5 last:translate-x-1.5",
                                                isActive
                                                    ? "bg-background dark:bg-default/60"
                                                    : "bg-muted-foreground/60"
                                            )}
                                        />
                                    )
                                }
                            )}
                        </div>
                        {Array.from({ length: _values.length }, (_, index) => (
                            <SliderPrimitive.Thumb
                                key={index}
                                aria-label={label}
                                data-slot="slider-thumb"
                                className={cn(
                                    "relative block size-5 shrink-0 select-none rounded-md border border-muted-foreground/60 bg-background ring-ring/50 will-change-[color,box-shadow] transition-[color,box-shadow]",
                                    {
                                        after: "absolute -inset-2",
                                        hover: "bg-element-hover ring-2",
                                        "focus-visible":
                                            "ring-2 outline-hidden",
                                        active: "ring-4",
                                        disabled:
                                            "pointer-events-none opacity-40"
                                    }
                                )}
                            />
                        ))}
                    </>
                )}
            </SliderPrimitive.Control>
        </SliderPrimitive.Root>
    )
}

export { Slider }
