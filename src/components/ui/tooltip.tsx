"use client"

import { isValidElement } from "react"

import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip"

import { cn } from "@/lib/utils"

type TooltipOptions = {
    content: React.ReactNode
} & Pick<TooltipPrimitive.Positioner.Props, "side" | "sideOffset">

type TooltipPayload = React.ReactNode | TooltipOptions

const tooltipHandle = TooltipPrimitive.createHandle<TooltipPayload>()

function TooltipProvider({
    delay = 50,
    children,
    ...props
}: TooltipPrimitive.Provider.Props) {
    return (
        <TooltipPrimitive.Provider
            data-slot="tooltip-provider"
            delay={delay}
            closeDelay={250}
            {...props}
        >
            {children}
            <Tooltip handle={tooltipHandle}>
                {({ payload }) => {
                    const { content, ...options } =
                        typeof payload === "object" &&
                        payload !== null &&
                        "content" in payload &&
                        !isValidElement(payload)
                            ? payload
                            : { content: payload }

                    return (
                        <TooltipContent
                            sideOffset={options.sideOffset}
                            side={options.side}
                        >
                            {content}
                        </TooltipContent>
                    )
                }}
            </Tooltip>
        </TooltipPrimitive.Provider>
    )
}

function Tooltip<Payload>({ ...props }: TooltipPrimitive.Root.Props<Payload>) {
    return (
        <TooltipPrimitive.Root<Payload>
            data-slot="tooltip"
            disableHoverablePopup
            {...props}
        />
    )
}

function TooltipTrigger({ ...props }: TooltipPrimitive.Trigger.Props) {
    return (
        <TooltipPrimitive.Trigger
            data-slot="tooltip-trigger"
            handle={tooltipHandle}
            {...props}
        />
    )
}

function TooltipContent({
    className,
    side = "top",
    sideOffset = 12,
    align = "center",
    alignOffset = 0,
    children,
    ...props
}: TooltipPrimitive.Popup.Props &
    Pick<
        TooltipPrimitive.Positioner.Props,
        "align" | "alignOffset" | "side" | "sideOffset"
    >) {
    return (
        <TooltipPrimitive.Portal>
            <TooltipPrimitive.Positioner
                align={align}
                alignOffset={alignOffset}
                side={side}
                sideOffset={sideOffset}
                collisionPadding={12}
                arrowPadding={7}
                className={cn(
                    "z-50 h-[--positioner-height] w-[--positioner-width] max-w-[--available-width] duration-400 data-instant:transition-none",
                    "will-change-[top,left,right,bottom,transform] transition-[top,left,right,bottom,transform] ease-spring"
                )}
            >
                <TooltipPrimitive.Popup
                    data-slot="tooltip-content"
                    className={cn(
                        "group relative h-[--popup-height,auto] w-[--popup-width,auto] max-w-125 origin-[--transform-origin] text-balance rounded-lg bg-background text-sm tracking-tight text-foreground -outline-offset-px outline-muted-foreground will-change-[width,height,opacity,transform] outline transition-[width,height,opacity,transform] ease-spring duration-400",
                        {
                            "data-ending-style": "scale-90 opacity-0",
                            "data-instant": "transition-none",
                            "data-starting-style": "scale-90 opacity-0"
                        },
                        className
                    )}
                    role="tooltip"
                    {...props}
                >
                    <TooltipPrimitive.Arrow
                        className={cn(
                            "will-change-[left] transition-[left] ease-spring duration-400",
                            {
                                "data-instant": "transition-none",
                                "data-[side=bottom]":
                                    "top-0 -translate-y-full rotate-180",
                                "data-[side=left]": "hidden",
                                "data-[side=right]": "hidden",
                                "data-[side=top]": "bottom-0 translate-y-full"
                            }
                        )}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 10"
                            fill="none"
                            className={cn("h-2.5 w-6 -translate-y-0.75")}
                        >
                            <path
                                className={cn("fill-background")}
                                d="M9.66 7.244 7.847 5.3C6.797 4.176 6.273 3.614 5.65 3.21a6 6 0 0 0-1.796-.78C3.134 2.25 2.537 2.25 1 2.25V0h22v2.25c-1.537 0-2.134 0-2.854.18a6 6 0 0 0-1.796.781c-.623.403-1.148.965-2.196 2.089l-1.815 1.944c-.813.87-1.22 1.307-1.695 1.468a2 2 0 0 1-1.288 0c-.476-.161-.882-.597-1.695-1.468Z"
                            />
                            <path
                                className={cn("stroke-muted-foreground")}
                                strokeWidth="1.3"
                                vectorEffect="non-scaling-stroke"
                                d="M0 2.25h.828c1.538 0 2.306 0 3.026.18a6 6 0 0 1 1.796.781c.623.403 1.147.965 2.196 2.089l1.64 1.756c.873.936 1.31 1.405 1.821 1.578a2.15 2.15 0 0 0 1.386 0c.51-.173.948-.642 1.822-1.578L16.154 5.3c1.049-1.124 1.573-1.686 2.196-2.089a6 6 0 0 1 1.796-.78c.72-.181 1.488-.181 3.026-.181H24"
                            />
                        </svg>
                    </TooltipPrimitive.Arrow>
                    <TooltipPrimitive.Viewport
                        className={cn(
                            "[--viewport-inline-padding:calc(var(--spacing)*2)]",
                            "relative size-full overflow-clip px-[--viewport-inline-padding] py-1 will-change-[width,transform,opacity]",
                            "has-[kbd]:pr-1",
                            {
                                "[&_:is([data-current],[data-previous])]":
                                    "w-[calc(var(--popup-width)-2*var(--viewport-inline-padding))] translate-x-0 opacity-100 transition-[transform,opacity] ease-spring duration-[.5s,.4s]",
                                "[&_[data-current][data-starting-style]]": {
                                    "data-[activation-direction~='left']":
                                        "-translate-x-1/2 opacity-0",
                                    "data-[activation-direction~='right']":
                                        "translate-x-1/2 opacity-0"
                                },
                                "[&_[data-previous][data-ending-style]]": {
                                    "data-[activation-direction~='left']":
                                        "translate-x-1/2 opacity-0",
                                    "data-[activation-direction~='right']":
                                        "-translate-x-1/2 opacity-0"
                                },
                                "[[data-instant]_&_:is([data-current],[data-previous])]":
                                    "transition-none"
                            }
                        )}
                    >
                        {children}
                    </TooltipPrimitive.Viewport>
                </TooltipPrimitive.Popup>
            </TooltipPrimitive.Positioner>
        </TooltipPrimitive.Portal>
    )
}

export {
    Tooltip,
    TooltipContent,
    tooltipHandle,
    TooltipProvider,
    TooltipTrigger
}
