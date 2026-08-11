"use client"

import { createContext, useContext, useMemo } from "react"

import { Drawer as DrawerPrimitive } from "@base-ui/react/drawer"

import { cn } from "@/lib/utils"

interface DrawerContextProps {
    hasSnapPoints: boolean
    modal: DrawerPrimitive.Root.Props["modal"]
    showSwipeHandle: boolean
    swipeDirection: NonNullable<DrawerPrimitive.Root.Props["swipeDirection"]>
}

const DrawerContext = createContext<DrawerContextProps | null>(null)

function useDrawer() {
    const context = useContext(DrawerContext)

    if (!context) {
        throw new Error("useDrawer must be used within a Drawer.")
    }

    return context
}

function Drawer({
    modal = true,
    showSwipeHandle = true,
    snapPoints,
    swipeDirection = "down",
    ...props
}: DrawerPrimitive.Root.Props & {
    showSwipeHandle?: boolean
}) {
    const hasSnapPoints = snapPoints !== undefined && snapPoints.length > 0
    const contextValue = useMemo(
        () => ({ hasSnapPoints, modal, showSwipeHandle, swipeDirection }),
        [hasSnapPoints, modal, showSwipeHandle, swipeDirection]
    )

    return (
        <DrawerContext.Provider value={contextValue}>
            <DrawerPrimitive.Root
                data-slot="drawer"
                modal={modal}
                snapPoints={snapPoints}
                swipeDirection={swipeDirection}
                {...props}
            />
        </DrawerContext.Provider>
    )
}

function DrawerSwipeArea({ ...props }: DrawerPrimitive.SwipeArea.Props) {
    return (
        <DrawerPrimitive.SwipeArea data-slot="drawer-swipe-area" {...props} />
    )
}

function DrawerTrigger({ ...props }: DrawerPrimitive.Trigger.Props) {
    return <DrawerPrimitive.Trigger data-slot="drawer-trigger" {...props} />
}

function DrawerPortal({ ...props }: DrawerPrimitive.Portal.Props) {
    return <DrawerPrimitive.Portal data-slot="drawer-portal" {...props} />
}

function DrawerClose({ ...props }: DrawerPrimitive.Close.Props) {
    return <DrawerPrimitive.Close data-slot="drawer-close" {...props} />
}

function DrawerOverlay({
    className,
    ...props
}: DrawerPrimitive.Backdrop.Props) {
    return (
        <DrawerPrimitive.Backdrop
            data-slot="drawer-overlay"
            className={cn(
                "fixed inset-0 z-60 min-h-dvh select-none bg-black/80 opacity-[max(var(--drawer-overlay-min-opacity,0),calc(1-var(--drawer-swipe-progress)))] transition-opacity ease-[cubic-bezier(0.32,0.72,0,1)] duration-450 data-starting-style:opacity-0 data-ending-style:pointer-events-none data-ending-style:opacity-0 data-ending-style:duration-[calc(var(--drawer-swipe-strength)*400ms)] data-[swiping]:duration-0 data-[snap-points]:[--drawer-overlay-min-opacity:0.5] supports-[-webkit-touch-callout:none]:absolute",
                className
            )}
            {...props}
        />
    )
}

function DrawerSwipeHandle({
    className,
    ...props
}: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="drawer-swipe-handle"
            aria-hidden={true}
            className={cn(
                "absolute inset-x-0 top-0 z-10 flex shrink-0 cursor-grab transition-opacity duration-200",
                {
                    active: "cursor-grabbing",

                    "group-data-[swipe-direction=left]/drawer-popup":
                        "order-last justify-start",
                    "group-data-[swipe-direction=right]/drawer-popup":
                        "justify-end",

                    "group-data-[swipe-direction=up]/drawer-popup":
                        "order-last items-start",
                    "group-data-[swipe-direction=down]/drawer-popup":
                        "items-end",

                    "group-data-[swipe-axis=x]/drawer-popup": [
                        "h-full w-[calc(var(--spacing-safe-zone)-var(--spacing)*.5)] items-center",
                        {
                            after: "h-space w-1.5 lg:h-16 sm:h-14 sm:w-0.75"
                        }
                    ],
                    "group-data-[swipe-axis=y]/drawer-popup": [
                        "h-[calc(var(--spacing-safe-zone)-var(--spacing)*.5)] w-full items-center justify-center",
                        {
                            after: "h-1 w-space lg:w-16 sm:h-0.75 sm:w-14"
                        }
                    ],

                    "group-data-[nested-drawer-open]/drawer-popup": "opacity-0",
                    "group-data-[nested-drawer-swiping]/drawer-popup":
                        "opacity-100",

                    after: "block shrink-0 rounded-full bg-default/10"
                },
                className
            )}
            {...props}
        />
    )
}

const variables = true

function DrawerContent({
    className,
    children,
    ...props
}: DrawerPrimitive.Popup.Props) {
    const { hasSnapPoints, modal, showSwipeHandle, swipeDirection } =
        useDrawer()
    const swipeAxis =
        swipeDirection === "down" || swipeDirection === "up" ? "y" : "x"

    return (
        <DrawerPrimitive.VirtualKeyboardProvider data-slot="drawer-vk-provider">
            <DrawerPortal data-slot="drawer-portal">
                {modal === true && (
                    <DrawerOverlay
                        data-snap-points={hasSnapPoints ? "" : undefined}
                    />
                )}
                <DrawerPrimitive.Viewport
                    data-slot="drawer-viewport"
                    data-modal={modal}
                    data-cursor="ignore"
                    className="pointer-events-none fixed inset-0 z-60 cursor-auto select-none data-[modal=true]:pointer-events-auto"
                >
                    <DrawerPrimitive.Popup
                        data-slot="drawer-popup"
                        data-swipe-axis={swipeAxis}
                        data-snap-points={hasSnapPoints ? "" : undefined}
                        className={cn(
                            // Variables.
                            "[--drawer-bleed-background:var(--color-background)] [--drawer-inset:0px]",
                            "[--drawer-stacked-shadow:0_-20px_25px_-5px_rgb(0_0_0/0.1),0_-8px_10px_-6px_rgb(0_0_0/0.1)]",

                            "group/drawer-popup pointer-events-auto fixed z-60 flex select-none flex-col rounded-t-4xl text-popover-foreground shadow-xl outline-none",

                            // Sizing.
                            "m-[--drawer-inset,0px] h-[--drawer-content-height] max-h-[--drawer-content-max-height,none] min-h-0 w-[--drawer-content-width,auto]",
                            "pb-[max(0px,calc(var(--drawer-snap-point-offset)+var(--drawer-swipe-movement-y)))] data-[current-snap-points=1]:not-data-[swiping]:rounded-t-none",

                            // Gradient border.
                            "border border-transparent bg-[image:linear-gradient(var(--color-background),var(--color-background)),linear-gradient(to_bottom,var(--color-stroke)_0%,var(--color-background)_60%)] bg-origin-border bg-clip-[padding-box,border-box]",

                            // Animations.
                            [
                                "transform-[translate3d(var(--translate-x,0px),var(--translate-y,0px),0)_scale(var(--stack-scale))]",
                                {
                                    "motion-reduced": "transition-none",
                                    "motion-preferred":
                                        "will-change-transform transition-[transform,height,opacity,filter,border-radius] ease-[cubic-bezier(0.22,1,0.36,1)] duration-450 [interpolate-size:allow-keywords]"
                                }
                            ],
                            {
                                // Nested.
                                "data-[nested-drawer-open]":
                                    "overflow-hidden brightness-95",

                                // Bleed.
                                after: [
                                    "pointer-events-none absolute bg-[var(--drawer-bleed-background,inherit)]",
                                    {
                                        "data-[swipe-axis=x]":
                                            "-inset-y-px w-[--bleed]",
                                        "data-[swipe-axis=y]":
                                            "-inset-x-px h-[--bleed]",
                                        "data-[swipe-direction=down]":
                                            "top-full",
                                        "data-[swipe-direction=left]":
                                            "right-full",
                                        "data-[swipe-direction=right]":
                                            "left-full",
                                        "data-[swipe-direction=up]":
                                            "bottom-full"
                                    }
                                ],

                                // Sizing.
                                "[--drawer-content-height:--drawer-height,auto]":
                                    variables,
                                "data-[swipe-axis=y]": [
                                    "[--drawer-content-max-height:calc(100dvh+var(--bleed))] data-[snap-points]:[--drawer-content-height:100dvh]",
                                    // Axis: y.
                                    "inset-x-0 data-[nested-drawer-open]:h-[--stack-height]"
                                ],
                                "data-[swipe-axis=x]": [
                                    "[--drawer-content-width:24rem] sm:[--drawer-content-width:75%]",
                                    // Axis: x.
                                    "inset-y-0 flex-row"
                                ],

                                // Stack.
                                "[--bleed:3rem] [--peek:1rem]": variables,
                                "[--stack-height:--drawer-frontmost-height,var(--drawer-height,0px)]":
                                    variables,
                                "[--stack-peek-offset:max(0px,calc((var(--nested-drawers)-var(--stack-progress))*var(--peek)))]":
                                    variables,
                                "[--stack-progress:clamp(0,var(--drawer-swipe-progress),1)]":
                                    variables,
                                "[--stack-scale-base:max(0,calc(1-(var(--nested-drawers)*var(--stack-step))))]":
                                    variables,
                                "[--stack-scale:clamp(0,calc(var(--stack-scale-base)+(var(--stack-step)*var(--stack-progress))),1)]":
                                    variables,
                                "[--stack-shrink:calc(1-var(--stack-scale))] [--stack-step:0.05]":
                                    variables,

                                // Transitions.
                                "data-starting-style":
                                    "transform-[--closed-transform]",
                                "data-ending-style": [
                                    "opacity-[0.9999] transform-[--closed-transform] duration-[calc(var(--drawer-swipe-strength)*400ms)]",
                                    {
                                        "data-[nested-drawer-swiping]":
                                            "duration-[calc(var(--drawer-swipe-strength)*400ms)]",
                                        "data-[swiping]":
                                            "duration-[calc(var(--drawer-swipe-strength)*400ms)]"
                                    }
                                ],
                                "data-[nested-drawer-swiping]": "duration-0",
                                "data-[swiping]":
                                    "not-data-ending-style:motion-preferred:!transition-[border-radius]",

                                // Direction: down.
                                "data-[swipe-direction=down]": [
                                    "[--closed-transform:translate3d(0,calc(100%+var(--drawer-inset,0px)+2px),0)]",
                                    "[--translate-y:calc(var(--drawer-snap-point-offset,0px)+var(--drawer-swipe-movement-y)-var(--stack-peek-offset)-(var(--stack-shrink)*var(--stack-height)))]",
                                    "bottom-0 origin-bottom",
                                    // Shadow.
                                    "data-[nested-drawer-open]:shadow-[--drawer-stacked-shadow]"
                                ],

                                // Direction: up.
                                "data-[swipe-direction=up]": [
                                    "[--closed-transform:translate3d(0,calc(-100%-var(--drawer-inset,0px)-2px),0)]",
                                    "[--translate-y:calc(var(--drawer-snap-point-offset,0px)+var(--drawer-swipe-movement-y)+var(--stack-peek-offset)+(var(--stack-shrink)*var(--stack-height)))]",
                                    "top-0 origin-top"
                                ],

                                // Direction: left.
                                "data-[swipe-direction=left]": [
                                    "[--closed-transform:translate3d(calc(-100%-var(--drawer-inset,0px)-2px),0,0)]",
                                    "[--translate-x:calc(var(--drawer-swipe-movement-x)+var(--stack-peek-offset)+(var(--stack-shrink)*100%))]",
                                    "left-0 origin-left"
                                ],

                                // Direction: right.
                                "data-[swipe-direction=right]": [
                                    "[--closed-transform:translate3d(calc(100%+var(--drawer-inset,0px)+2px),0,0)]",
                                    "[--translate-x:calc(var(--drawer-swipe-movement-x)-var(--stack-peek-offset)-(var(--stack-shrink)*100%))]",
                                    "right-0 origin-right"
                                ],

                                // Responsives.
                                lg: "rounded-t-3xl"
                            },
                            className
                        )}
                        {...props}
                    >
                        {showSwipeHandle && <DrawerSwipeHandle />}
                        <DrawerPrimitive.Content
                            data-slot="drawer-content"
                            className={cn(
                                "pointer-events-none flex min-h-0 flex-1 select-text flex-col overflow-hidden overscroll-contain rounded-inherit transition-opacity ease-[cubic-bezier(0.45,1.005,0,1.005)] duration-300",
                                "group-data-[swiping]/drawer-popup:select-none group-data-[nested-drawer-open]/drawer-popup:opacity-0 group-data-[nested-drawer-swiping]/drawer-popup:opacity-100"
                            )}
                        >
                            {children}
                        </DrawerPrimitive.Content>
                    </DrawerPrimitive.Popup>
                </DrawerPrimitive.Viewport>
            </DrawerPortal>
        </DrawerPrimitive.VirtualKeyboardProvider>
    )
}

function DrawerHeader({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="drawer-header"
            className={cn(
                "flex shrink-0 flex-col gap-1.5 p-safe-zone pb-0 text-start group-data-[swipe-axis=y]/drawer-popup:text-center md:gap-0.5",
                className
            )}
            {...props}
        />
    )
}

function DrawerFooter({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="drawer-footer"
            className={cn(
                "mt-auto flex shrink-0 flex-col gap-2 p-4 pt-0",
                className
            )}
            {...props}
        />
    )
}

function DrawerTitle({ className, ...props }: DrawerPrimitive.Title.Props) {
    return (
        <DrawerPrimitive.Title
            data-slot="drawer-title"
            className={cn("text-base text-foreground font-wght-500", className)}
            {...props}
        />
    )
}

function DrawerDescription({
    className,
    ...props
}: DrawerPrimitive.Description.Props) {
    return (
        <DrawerPrimitive.Description
            data-slot="drawer-description"
            className={cn(
                "text-balance text-sm text-muted-foreground",
                className
            )}
            {...props}
        />
    )
}

export {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerPortal,
    DrawerSwipeArea,
    DrawerSwipeHandle,
    DrawerTitle,
    DrawerTrigger
}
