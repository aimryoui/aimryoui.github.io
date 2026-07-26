"use client"

import { useCallback, useEffect, useRef } from "react"

import {
    SliderFill,
    Slider as SliderPrimitive,
    type SliderProps as SliderPrimitiveProps,
    SliderThumb,
    SliderTrack
} from "react-aria-components/Slider"
import { useWebHaptics } from "web-haptics/react"

import { Label } from "@/components/ui/label"
import { useDevice } from "@/hooks/use-device"
import { createTickPlayer } from "@/lib/sounds"
import { cn } from "@/lib/utils"
import { useAudioStore } from "@/stores/audio-store"

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
    onChange,
    ...props
}: SliderProps<T>) {
    const snapFractions =
        snapCount > 1
            ? Array.from({ length: snapCount }).map(
                  (_, index) => index / (snapCount - 1)
              )
            : []

    const { isTouchDevice } = useDevice()
    const { trigger } = useWebHaptics()

    const playerRef = useRef<ReturnType<typeof createTickPlayer> | null>(null)
    const activeDotRef = useRef<number | null>(null)

    useEffect(() => {
        if (isTouchDevice) return

        playerRef.current = createTickPlayer()
        return () => playerRef.current?.dispose()
    }, [isTouchDevice])

    const handleTick = useCallback(
        (val: T) => {
            if (isTouchDevice || snapCount <= 1) return

            const currentValue: number = Array.isArray(val) ? val[0] : val
            const min = props.minValue ?? 0
            const max = props.maxValue ?? 100
            const range = max - min

            if (range <= 0) return

            const progress = (currentValue - min) / range
            const floatIndex = progress * (snapCount - 1)

            if (activeDotRef.current === null) {
                activeDotRef.current = Math.round(floatIndex)
                return
            }

            let nextActive = activeDotRef.current

            while (
                floatIndex > nextActive + 0.55 &&
                nextActive < snapCount - 1
            ) {
                nextActive++
            }

            while (floatIndex < nextActive - 0.55 && nextActive > 0) {
                nextActive--
            }

            if (nextActive !== activeDotRef.current) {
                if (useAudioStore.getState().isAudioEnabled) {
                    playerRef.current?.play()
                }
                activeDotRef.current = nextActive
            }
        },
        [snapCount, props.minValue, props.maxValue, isTouchDevice]
    )

    useEffect(() => {
        if (props.value !== undefined) {
            handleTick(props.value)
        }
    }, [props.value, handleTick])

    const handleOnChange = (val: T) => {
        handleTick(val)
        if (onChange) {
            onChange(val)
        }
    }

    return (
        <SliderPrimitive
            data-slot="slider"
            aria-label={label}
            onChange={handleOnChange}
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
                            <div
                                data-slot="slider-track"
                                className={cn(
                                    "relative cursor-pointer overflow-hidden rounded-full border border-default/15 bg-background",
                                    {
                                        hover: "bg-element-hover",
                                        "group-data-horizontal": "h-2 w-full",
                                        "group-data-vertical": "h-full w-2"
                                    }
                                )}
                            >
                                {snapCount > 1 && (
                                    <SliderFill
                                        data-slot="slider-range"
                                        offset={fillOffset}
                                        className={cn("bg-muted-foreground/60")}
                                    />
                                )}
                            </div>
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
                                    {snapFractions.map((fraction, index) => {
                                        const currentProgress = state.values[0]
                                        const isActive =
                                            currentProgress >= fraction - 0.001

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
                                    })}
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
                                        onTouchStart={() => {
                                            if (isTouchDevice) {
                                                void trigger("light")
                                            }
                                        }}
                                        onTouchEnd={() => {
                                            if (isTouchDevice) {
                                                void trigger("light")
                                            }
                                        }}
                                        className={cn(
                                            "relative block size-5 shrink-0 cursor-grab select-none rounded-md border border-muted-foreground/60 bg-background ring-ring/50 will-change-[top,left] transition-[color,box-shadow]",
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
