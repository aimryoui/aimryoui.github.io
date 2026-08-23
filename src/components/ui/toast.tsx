"use client"

import { useEffect, useRef } from "react"

import { Toast as ToastPrimitive } from "@base-ui/react/toast"
import {
    CircleCheckIcon,
    InfoIcon,
    Loader2Icon,
    OctagonXIcon,
    TriangleAlertIcon,
    XIcon
} from "lucide-react"

import { Button, type ButtonProps } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const toast = ToastPrimitive.createToastManager()

function ToastProvider({ ...props }: ToastPrimitive.Provider.Props) {
    return <ToastPrimitive.Provider {...props} />
}

function ToastPortal({ ...props }: ToastPrimitive.Portal.Props) {
    return <ToastPrimitive.Portal data-slot="toast-portal" {...props} />
}

function ToastViewport({ className, ...props }: ToastPrimitive.Viewport.Props) {
    const { toasts } = ToastPrimitive.useToastManager()
    const viewportRef = useRef<HTMLDivElement>(null)
    const currentMaxWidth = useRef(0)

    useEffect(() => {
        if (toasts.length === 0 && currentMaxWidth.current > 0) {
            currentMaxWidth.current = 0
            if (viewportRef.current) {
                viewportRef.current.style.removeProperty("--toast-max-width")
            }
        }
    }, [toasts.length])

    useEffect(() => {
        const viewport = viewportRef.current
        if (!viewport) return

        const observer = new ResizeObserver((entries) => {
            const isMobile =
                getComputedStyle(viewport)
                    .getPropertyValue("--is-mobile")
                    .trim() === "1"
            if (isMobile) return

            const width = entries[0].contentRect.width

            if (width > currentMaxWidth.current + 0.1) {
                currentMaxWidth.current = width
                viewport.style.setProperty("--toast-max-width", `${width}px`)
            }
        })

        observer.observe(viewport)

        return () => {
            observer.disconnect()
        }
    }, [])

    return (
        <ToastPrimitive.Viewport
            ref={viewportRef}
            data-slot="toast-viewport"
            className={cn(
                "[--toast-viewport-top:calc(var(--spacing-safe-zone)-var(--spacing)*.5)]",
                "[--is-mobile:0]",
                "pointer-events-none fixed inset-x-0 top-[--toast-viewport-top] z-70 mx-auto grid w-fit min-w-[var(--toast-max-width,0px)] max-w-md outline-none",
                {
                    sm: "w-full min-w-0 max-w-[calc(100vw-var(--spacing-safe-zone)*4)] [--is-mobile:1]"
                },
                className
            )}
            {...props}
        />
    )
}

const SWIPE_DIRECTIONS = [
    "up",
    "left",
    "right"
] as ToastPrimitive.Root.Props["swipeDirection"]

function Toast({
    className,
    swipeDirection = SWIPE_DIRECTIONS,
    ...props
}: ToastPrimitive.Root.Props) {
    return (
        <ToastPrimitive.Root
            data-slot="toast"
            swipeDirection={swipeDirection}
            className={cn(
                "group/toast pointer-events-auto z-[calc(1000-var(--toast-index))] col-start-1 row-start-1 min-w-0 origin-top select-none rounded-xlg bg-popover text-popover-foreground shadow-lg ring ring-inset ring-input outline-none",
                "[--gap:.5rem] [--height:var(--toast-frontmost-height,var(--toast-height))]",
                "[--offset-y:calc(var(--toast-offset-y)+calc(var(--toast-index)*var(--gap))+var(--toast-swipe-movement-y))]",
                "[--peek:0.5rem] [--scale:calc(max(0,1-(var(--toast-index)*0.1)))] [--shrink:calc(1-var(--scale))]",
                "h-[--height] translate-x-[var(--toast-swipe-movement-x)] translate-y-[calc(var(--toast-swipe-movement-y)+(var(--toast-index)*var(--peek))+(var(--shrink)*var(--height)))] scale-[var(--scale)] transition-opacity duration-300",
                {
                    "focus-visible": "border-ring ring-3 ring-ring/50",
                    after: "absolute left-0 top-full h-[calc(var(--gap)+1px)] w-full",
                    "data-limited": "opacity-0",
                    "data-ending-style:not-data-limited": "opacity-0",
                    "data-expanded":
                        "h-[--toast-height] translate-x-[var(--toast-swipe-movement-x)] translate-y-[var(--offset-y)] scale-100",
                    "motion-preferred": [
                        "[transition:transform_500ms_cubic-bezier(0.22,1,0.36,1),opacity_500ms,height_150ms]",
                        {
                            "data-ending-style:not-data-limited":
                                "translate-x-0 translate-y-[calc(-100%-var(--toast-viewport-top))] scale-100",
                            "data-starting-style":
                                "translate-x-0 translate-y-[calc(-100%-var(--toast-viewport-top))] scale-100",
                            "data-expanded": [
                                "[transition:transform_500ms_cubic-bezier(0.22,1,0.36,1),opacity_150ms,height_150ms]",
                                {
                                    "data-ending-style": {
                                        "data-[swipe-direction=down]":
                                            "translate-x-0 translate-y-[calc(var(--toast-swipe-movement-y)+100%+var(--toast-viewport-top))] scale-100",
                                        "data-[swipe-direction=left]":
                                            "translate-x-[calc(var(--toast-swipe-movement-x)-100vw)] translate-y-[var(--offset-y)] scale-100",
                                        "data-[swipe-direction=right]":
                                            "translate-x-[calc(var(--toast-swipe-movement-x)+100vw)] translate-y-[var(--offset-y)] scale-100",
                                        "data-[swipe-direction=up]":
                                            "translate-x-0 translate-y-[calc(var(--toast-swipe-movement-y)-100%-var(--toast-viewport-top))] scale-100"
                                    }
                                }
                            ],
                            "data-ending-style": {
                                "data-[swipe-direction=down]":
                                    "translate-x-0 translate-y-[calc(var(--toast-swipe-movement-y)+100%+var(--toast-viewport-top))] scale-100",
                                "data-[swipe-direction=left]":
                                    "translate-x-[calc(var(--toast-swipe-movement-x)-100vw)] translate-y-[var(--offset-y)] scale-100",
                                "data-[swipe-direction=right]":
                                    "translate-x-[calc(var(--toast-swipe-movement-x)+100vw)] translate-y-[var(--offset-y)] scale-100",
                                "data-[swipe-direction=up]":
                                    "translate-x-0 translate-y-[calc(var(--toast-swipe-movement-y)-100%-var(--toast-viewport-top))] scale-100"
                            }
                        }
                    ],
                    "motion-reduced": {
                        "not-data-ending-style:not-only-of-type": "duration-0",
                        "data-starting-style": "opacity-0"
                    }
                },
                className
            )}
            {...props}
        />
    )
}

function ToastContent({ className, ...props }: ToastPrimitive.Content.Props) {
    return (
        <ToastPrimitive.Content
            data-slot="toast-content"
            className={cn(
                "flex h-full items-center gap-1.5 overflow-hidden ps-3 transition-opacity ease-[cubic-bezier(0.22,1,0.36,1)] duration-250",
                {
                    "data-behind": "opacity-0",
                    "data-expanded": "!opacity-100"
                },
                className
            )}
            {...props}
        />
    )
}

function ToastTitle({ className, ...props }: ToastPrimitive.Title.Props) {
    return (
        <ToastPrimitive.Title
            data-slot="toast-title"
            className={cn("text-sm font-wght-550", className)}
            {...props}
        />
    )
}

function ToastDescription({
    className,
    ...props
}: ToastPrimitive.Description.Props) {
    return (
        <ToastPrimitive.Description
            data-slot="toast-description"
            className={cn("text-sm text-foreground", className)}
            {...props}
        />
    )
}

const defaultToastAction = (
    <Button
        variant="ghost"
        size="icon"
        pressSound="zoom-out"
        className={cn("!rounded-none")}
    />
)

function ToastAction({
    className,
    render = defaultToastAction,
    onClick,
    ...props
}: ToastPrimitive.Action.Props & Pick<ButtonProps, "onPress">) {
    return (
        <ToastPrimitive.Action
            data-slot="toast-action"
            render={render}
            onPress={onClick}
            className={cn("shrink-0", className)}
            {...props}
        />
    )
}

const defaultToastClose = (
    <Button
        variant="ghost"
        size="icon"
        pressSound="zoom-out"
        className={cn(
            "w-9.5 rounded-e-xlg rounded-s-none border-s border-input pe-px"
        )}
    />
)

function ToastClose({
    className,
    children,
    render = defaultToastClose,
    ...props
}: ToastPrimitive.Close.Props) {
    return (
        <ToastPrimitive.Close
            data-slot="toast-close"
            aria-label="Close toast"
            render={render}
            className={cn("relative shrink-0", className)}
            {...props}
        >
            {children ?? <XIcon />}
        </ToastPrimitive.Close>
    )
}

function ToastIcon({ type }: { type: string | undefined }) {
    let icon: React.ReactNode = null

    if (type === "success") {
        icon = <CircleCheckIcon />
    }

    if (type === "info") {
        icon = <InfoIcon />
    }

    if (type === "warning") {
        icon = <TriangleAlertIcon />
    }

    if (type === "error") {
        icon = <OctagonXIcon className="text-destructive" />
    }

    if (type === "loading") {
        icon = <Loader2Icon className="animate-spin" />
    }

    if (!icon) {
        return null
    }

    return (
        <span
            data-slot="toast-icon"
            className="-ms-0.5 shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none"
        >
            {icon}
        </span>
    )
}

function ToastList() {
    const { toasts } = ToastPrimitive.useToastManager()
    return toasts.map((toastItem) => (
        <Toast key={toastItem.id} toast={toastItem}>
            <ToastContent>
                <ToastIcon type={toastItem.type} />
                <div className="flex min-w-0 flex-auto flex-col gap-1">
                    <ToastTitle />
                    <ToastDescription />
                </div>
                <ToastAction />
                <ToastClose />
            </ToastContent>
        </Toast>
    ))
}

function Toaster({
    children,
    toastManager = toast,
    ...props
}: ToastPrimitive.Provider.Props) {
    return (
        <ToastProvider toastManager={toastManager} {...props}>
            {children}
            <ToastPortal>
                <ToastViewport>
                    <ToastList />
                </ToastViewport>
            </ToastPortal>
        </ToastProvider>
    )
}

const createToastManager = ToastPrimitive.createToastManager
const useToastManager = ToastPrimitive.useToastManager

// oxlint-disable-next-line simple-import-sort/exports
export {
    createToastManager,
    Toast,
    ToastAction,
    ToastClose,
    ToastContent,
    ToastDescription,
    Toaster,
    ToastPortal,
    ToastProvider,
    ToastTitle,
    ToastViewport,
    toast,
    useToastManager
}
