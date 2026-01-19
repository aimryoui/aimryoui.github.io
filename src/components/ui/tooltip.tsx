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
                className={cn(
                    `
                        group bg-background outline-muted-foreground animate-in
                        fade-in-0 zoom-in-95 data-[state=closed]:fade-out-0
                        data-[state=closed]:zoom-out-95
                        data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2
                        data-[side=right]:slide-in-from-left-2
                        data-[side=top]:slide-in-from-bottom-2
                        text-foreground -outline-offset z-50
                        w-fit
                        origin-(--radix-tooltip-content-transform-origin)
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
                        "mx-1.5 -translate-y-px group-[:is([data-side=left],[data-side=right])]:scale-x-55"
                    )}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 8"
                        width="24"
                        height="8"
                        fill="none"
                    >
                        <path
                            className={cn("fill-background")}
                            d="M9.66 5.744 7.847 3.8C6.797 2.676 6.273 2.114 5.65 1.71a6 6 0 0 0-1.796-.78C3.134.75 2.366.75.828.75H0V0h24v.75h-.828c-1.538 0-2.306 0-3.026.18a6 6 0 0 0-1.796.781c-.623.403-1.148.965-2.196 2.089l-1.815 1.944c-.813.87-1.22 1.307-1.695 1.468a2 2 0 0 1-1.288 0c-.476-.161-.882-.597-1.695-1.468Z"
                        />
                        <path
                            className={cn("stroke-muted-foreground")}
                            strokeWidth="1.4"
                            d="M0 .75h.828c1.538 0 2.306 0 3.026.18a6 6 0 0 1 1.796.781c.623.403 1.147.965 2.196 2.089l1.64 1.756c.873.936 1.31 1.405 1.821 1.578a2.15 2.15 0 0 0 1.386 0c.51-.173.948-.642 1.822-1.578L16.154 3.8c1.049-1.124 1.573-1.686 2.196-2.089a6 6 0 0 1 1.796-.78C20.866.75 21.634.75 23.172.75H24"
                        />
                    </svg>
                </TooltipPrimitive.Arrow>
            </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
    )
}

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger }
