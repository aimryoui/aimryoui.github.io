"use client"

import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip"
import React from "react"

import { cn } from "@/lib/utils"

interface TooltipOptions {
    content: React.ReactNode
    side?: TooltipPrimitive.Positioner.Props["side"]
    sideOffset?: number
}

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
                    let content: React.ReactNode
                    let options: Partial<TooltipOptions> = {}

                    if (
                        typeof payload === "object" &&
                        payload !== null &&
                        "content" in payload &&
                        !React.isValidElement(payload)
                    ) {
                        const p = payload as {
                            content: React.ReactNode
                            sideOffset?: number
                        }
                        content = p.content
                        options = p
                    } else {
                        content = payload as React.ReactNode
                    }

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

function TooltipTrigger<Payload>({
    ...props
}: TooltipPrimitive.Trigger.Props<Payload>) {
    return (
        <TooltipPrimitive.Trigger<Payload>
            data-slot="tooltip-trigger"
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
                    `
                    z-50 h-(--positioner-height)
                    w-(--positioner-width) max-w-(--available-width)
                    transition-[top,left,right,bottom,transform]
                    duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]
                    will-change-[top,left,right,bottom,transform]
                    data-instant:transition-none
                    `
                )}
            >
                <TooltipPrimitive.Popup
                    data-slot="tooltip-content"
                    className={cn(
                        `
                        group bg-background -outline-offset-px
                        outline-muted-foreground text-foreground relative
                        h-(--popup-height,auto) w-(--popup-width,auto)
                        max-w-125 origin-(--transform-origin) rounded-lg
                        text-sm tracking-tight text-balance outline
                        transition-[width,height,opacity,scale] duration-400
                        ease-[cubic-bezier(0.22,1,0.36,1)]
                        data-ending-style:scale-90 data-ending-style:opacity-0
                        data-instant:transition-none
                        data-starting-style:scale-90 data-starting-style:opacity-0
                        `,
                        className
                    )}
                    {...props}
                >
                    <TooltipPrimitive.Arrow
                        className={cn(
                            `
                            will-channge-[left]
                            transition-[left]
                            duration-400
                            ease-[cubic-bezier(0.22,1,0.36,1)]
                            data-instant:transition-none
                            data-[side=bottom]:top-0 data-[side=bottom]:-translate-y-full data-[side=bottom]:rotate-180
                            data-[side=left]:hidden
                            data-[side=right]:hidden
                            data-[side=top]:bottom-0 data-[side=top]:translate-y-full
                            `
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
                            "[--viewport-inline-padding:0.5rem]",
                            "relative size-full overflow-clip px-(--viewport-inline-padding) py-1 will-change-[width,translate,opacity]",

                            "[&_:is([data-current],[data-previous])]:w-[calc(var(--popup-width)-2*var(--viewport-inline-padding))]",
                            "[&_:is([data-current],[data-previous])]:translate-x-0",
                            "[&_:is([data-current],[data-previous])]:opacity-100",
                            "[&_:is([data-current],[data-previous])]:transition-[translate,opacity]",
                            "[&_:is([data-current],[data-previous])]:duration-500",
                            "[&_:is([data-current],[data-previous])]:ease-[cubic-bezier(0.22,1,0.36,1)]",

                            "data-[activation-direction~='left']:[&_[data-current][data-starting-style]]:-translate-x-1/2",
                            "data-[activation-direction~='left']:[&_[data-current][data-starting-style]]:opacity-0",
                            "data-[activation-direction~='left']:[&_[data-previous][data-ending-style]]:translate-x-1/2",
                            "data-[activation-direction~='left']:[&_[data-previous][data-ending-style]]:opacity-0",

                            "data-[activation-direction~='right']:[&_[data-current][data-starting-style]]:translate-x-1/2",
                            "data-[activation-direction~='right']:[&_[data-current][data-starting-style]]:opacity-0",
                            "data-[activation-direction~='right']:[&_[data-previous][data-ending-style]]:-translate-x-1/2",
                            "data-[activation-direction~='right']:[&_[data-previous][data-ending-style]]:opacity-0",

                            "[[data-instant]_&_:is([data-current],[data-previous])]:transition-none"
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
