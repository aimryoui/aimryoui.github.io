"use client"

import {
    SliderFill,
    Slider as SliderPrimitive,
    type SliderProps as SliderPrimitiveProps,
    SliderThumb,
    SliderTrack
} from "react-aria-components/Slider"

import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

export interface SliderProps<
    T extends number | number[]
> extends SliderPrimitiveProps<T> {
    label?: string
    hideLabel?: boolean
    thumbLabels?: string[]
    fillOffset?: number
    snapCount?: number
}

function Slider<T extends number | number[]>({
    className,
    label,
    hideLabel = true,
    thumbLabels,
    fillOffset = 0,
    snapCount = 0,
    ...props
}: SliderProps<T>) {
    return (
        <SliderPrimitive
            data-slot="slider"
            aria-label={label}
            className={cn(
                "group flex touch-none select-none flex-col items-start gap-1",
                {
                    "data-horizontal": "w-full",
                    "data-vertical": "h-full min-h-40 w-auto flex-col",
                    "data-disabled": "pointer-events-none opacity-40"
                },
                className
            )}
            {...props}
        >
            <Label {...(hideLabel && { className: "sr-only" })}>{label}</Label>
            <SliderTrack
                className={cn("flex items-center", {
                    "data-horizontal": "h-5 w-full",
                    "data-vertical": "h-full w-5"
                })}
            >
                {({ state, orientation }) => {
                    return (
                        <>
                            {snapCount > 1 && (
                                <div
                                    data-slot="slider-track"
                                    className={cn(
                                        "relative cursor-pointer overflow-hidden rounded-full border border-default/15 bg-background",
                                        {
                                            hover: "bg-element-hover",
                                            "group-data-horizontal":
                                                "h-2 w-full",
                                            "group-data-vertical": "h-full w-2"
                                        }
                                    )}
                                >
                                    <SliderFill
                                        data-slot="slider-range"
                                        offset={fillOffset}
                                        className={cn("bg-muted-foreground/60")}
                                    />
                                </div>
                            )}
                            {snapCount > 1 && (
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
                                            const fraction =
                                                index / (snapCount - 1)

                                            const currentProgress =
                                                state.values[0]

                                            const isActive =
                                                currentProgress >=
                                                fraction - 0.001

                                            return (
                                                <div
                                                    key={index}
                                                    data-slot="carousel-dot"
                                                    className={cn(
                                                        "size-1 rounded-full",
                                                        isActive
                                                            ? "bg-background dark:bg-default/60"
                                                            : "bg-muted-foreground/60",
                                                        {
                                                            first: "-translate-x-1.5",
                                                            last: "translate-x-1.5"
                                                        }
                                                    )}
                                                />
                                            )
                                        }
                                    )}
                                </div>
                            )}

                            {state.values.map((_, index) => {
                                const thumbOffset = `calc(0.625rem - ${state.getThumbPercent(index) * 1.25}rem)`

                                return (
                                    <SliderThumb
                                        data-slot="slider-thumb"
                                        key={index}
                                        index={index}
                                        aria-label={thumbLabels?.[index]}
                                        className={cn(
                                            "relative block size-5 shrink-0 cursor-grab select-none rounded-md border border-muted-foreground/60 bg-background ring-ring/50 transition-[color,box-shadow]",
                                            {
                                                after: "absolute -inset-2",
                                                hover: "bg-element-hover ring-2",
                                                "focus-visible":
                                                    "ring-2 outline-hidden",
                                                active: "cursor-grabbing ring-4",
                                                disabled:
                                                    "pointer-events-none opacity-40",
                                                "group-data-horizontal": "mt-5",
                                                "group-data-vertical": "ml-2.5"
                                            }
                                        )}
                                        style={{
                                            ...(orientation === "vertical"
                                                ? { marginBottom: thumbOffset }
                                                : { marginLeft: thumbOffset })
                                        }}
                                    />
                                )
                            })}
                        </>
                    )
                }}
            </SliderTrack>
        </SliderPrimitive>
    )
}

export { Slider }
