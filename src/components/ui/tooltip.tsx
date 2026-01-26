"use client"

import * as TooltipPrimitive from "@radix-ui/react-tooltip"
import React from "react"

import { cn } from "@/lib/utils"

function TooltipProvider({
    delayDuration = 50,
    ...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
    return (
        <TooltipPrimitive.Provider
            data-slot="tooltip-provider"
            delayDuration={delayDuration}
            skipDelayDuration={800}
            disableHoverableContent
            {...props}
        />
    )
}

function Tooltip({
    ...props
}: React.ComponentProps<typeof TooltipPrimitive.Root>) {
    return <TooltipPrimitive.Root data-slot="tooltip" {...props} />
}

function TooltipTrigger({
    ...props
}: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
    return (
        <TooltipPrimitive.Trigger
            asChild
            data-slot="tooltip-trigger"
            {...props}
        />
    )
}

function TooltipContent({
    className,
    sideOffset = 2,
    children,
    ...props
}: React.ComponentProps<typeof TooltipPrimitive.Content>) {
    return (
        <TooltipPrimitive.Portal>
            <TooltipPrimitive.Content
                data-slot="tooltip-content"
                sideOffset={sideOffset}
                collisionPadding={12}
                arrowPadding={6}
                className={cn(
                    `
                        group bg-background animate-in fade-in-0
                        zoom-in-95 data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95
                        data-[side=bottom]:slide-in-from-top-2
                        data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2
                        data-[side=top]:slide-in-from-bottom-2
                        text-foreground
                        -outline-offset-px outline-muted-foreground z-50
                        w-fit origin-(--radix-tooltip-content-transform-origin)
                        rounded-md px-2 py-1 text-sm tracking-tight text-balance
                        outline data-[state=closed]:animate-out
                    `,
                    className
                )}
                {...props}
            >
                {children}
                <TooltipPrimitive.Arrow
                    asChild
                    className={cn(
                        "group-[:is([data-side=left],[data-side=right])]:hidden"
                    )}
                    style={{
                        translate: "0 calc(var(--px) * -2)"
                    }}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 10"
                        fill="none"
                        className={cn("h-2.5 w-6")}
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
            </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
    )
}

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger }
