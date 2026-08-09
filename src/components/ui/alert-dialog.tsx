"use client"

import { AlertDialog as AlertDialogPrimitive } from "@base-ui/react/alert-dialog"

import { Button, type ButtonProps } from "@/components/ui/button"
import { playHoverSound } from "@/lib/sounds"
import { cn } from "@/lib/utils"

function AlertDialog({ ...props }: AlertDialogPrimitive.Root.Props) {
    return <AlertDialogPrimitive.Root data-slot="alert-dialog" {...props} />
}

function AlertDialogTrigger({ ...props }: AlertDialogPrimitive.Trigger.Props) {
    return (
        <AlertDialogPrimitive.Trigger
            data-slot="alert-dialog-trigger"
            {...props}
        />
    )
}

function AlertDialogPortal({ ...props }: AlertDialogPrimitive.Portal.Props) {
    return (
        <AlertDialogPrimitive.Portal
            data-slot="alert-dialog-portal"
            {...props}
        />
    )
}

function AlertDialogOverlay({
    className,
    ...props
}: AlertDialogPrimitive.Backdrop.Props) {
    return (
        <AlertDialogPrimitive.Backdrop
            data-slot="alert-dialog-overlay"
            className={cn(
                "fixed inset-0 isolate z-90 bg-black/40 duration-250",
                {
                    dark: "bg-black/50",
                    "supports-[backdrop-filter]": "backdrop-blur-sm",
                    "data-starting-style": "opacity-0 backdrop-blur-0",
                    "data-ending-style": "opacity-0 backdrop-blur-0"
                },
                className
            )}
            {...props}
        />
    )
}

function AlertDialogContent({
    className,
    size = "default",
    ...props
}: AlertDialogPrimitive.Popup.Props & {
    size?: "default" | "sm"
}) {
    return (
        <AlertDialogPortal>
            <AlertDialogOverlay />
            <AlertDialogPrimitive.Popup
                data-slot="alert-dialog-content"
                data-size={size}
                data-cursor="input"
                onMouseEnter={() => {
                    playHoverSound("tick")
                }}
                className={cn(
                    "group/alert-dialog-content fixed left-1/2 top-1/2 z-90 grid w-full -translate-x-1/2 -translate-y-1/2 cursor-auto gap-3 rounded-3xl px-4 py-3 text-popover-foreground outline-none duration-250",
                    {
                        "data-starting-style": "scale-95 opacity-0",
                        "data-ending-style": "scale-95 opacity-0",
                        "data-[size=default]": "max-w-sm sm:max-w-xs",
                        "data-[size=sm]": "max-w-xs",
                        before: [
                            "pointer-events-none absolute -inset-4 -z-20 bg-[repeating-linear-gradient(315deg,var(--color-pattern)_0,var(--color-pattern)_.0625rem,transparent_0,transparent_50%)] bg-[length:.625rem_.625rem]",
                            {
                                dark: "bg-background"
                            }
                        ],
                        after: [
                            "pointer-events-none absolute inset-0 -z-10 rounded-inherit bg-popover ring ring-stroke transition-[border-radius] duration-100",
                            {
                                hover: "rounded-none duration-200"
                            }
                        ]
                    },
                    className
                )}
                {...props}
            />
        </AlertDialogPortal>
    )
}

function AlertDialogHeader({
    className,
    ...props
}: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="alert-dialog-header"
            className={cn(
                "grid cursor-auto grid-rows-[auto_1fr] gap-3 p-2",
                {
                    "has-data-[slot=alert-dialog-media]":
                        "grid-rows-[auto_auto_1fr] gap-x-4",
                    "group-data-[size=default]/alert-dialog-content": [
                        "place-items-start text-left",
                        {
                            "has-data-[slot=alert-dialog-media]":
                                "grid-rows-[auto_1fr]"
                        }
                    ],
                    sm: "place-items-center text-center"
                },
                className
            )}
            {...props}
        />
    )
}

function AlertDialogFooter({
    className,
    ...props
}: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="alert-dialog-footer"
            className={cn(
                "-mx-4 -my-3 grid grid-cols-2 gap-2 p-4",
                {
                    sm: "flex flex-col-reverse"
                },
                className
            )}
            {...props}
        />
    )
}

function AlertDialogMedia({
    className,
    ...props
}: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="alert-dialog-media"
            className={cn(
                "*:[svg:not([class*='size-'])]:size-6 mb-2 inline-flex size-10 items-center justify-center rounded-md bg-muted",
                {
                    sm: {
                        "group-data-[size=default]/alert-dialog-content":
                            "row-span-2"
                    }
                },
                className
            )}
            {...props}
        />
    )
}

function AlertDialogTitle({
    className,
    ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Title>) {
    return (
        <AlertDialogPrimitive.Title
            data-slot="alert-dialog-title"
            className={cn(
                "text-pretty text-base font-wght-500",
                "group-data-[size=default]/alert-dialog-content:group-has-[[data-slot=alert-dialog-media]]/alert-dialog-content:col-start-2",
                className
            )}
            {...props}
        />
    )
}

function AlertDialogDescription({
    className,
    ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Description>) {
    return (
        <AlertDialogPrimitive.Description
            data-slot="alert-dialog-description"
            className={cn(
                "text-pretty text-sm text-foreground/90",
                {
                    dark: "text-foreground/80",
                    "*:is-[a]":
                        "underline underline-offset-2 hover:text-foreground"
                },
                className
            )}
            {...props}
        />
    )
}

function AlertDialogAction({ className, variant, ...props }: ButtonProps) {
    return (
        <Button
            data-slot="alert-dialog-action"
            data-cursor={false}
            variant={variant}
            haptic={variant === "destructive" ? "error" : "light"}
            className={cn(className)}
            {...props}
        />
    )
}

function AlertDialogCancel({
    className,
    variant = "tinted",
    size = "default",
    ...props
}: AlertDialogPrimitive.Close.Props & Pick<ButtonProps, "variant" | "size">) {
    return (
        <AlertDialogPrimitive.Close
            data-slot="alert-dialog-cancel"
            data-cursor={false}
            className={cn(className)}
            render={<Button variant={variant} size={size} />}
            {...props}
        />
    )
}

export {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogMedia,
    AlertDialogOverlay,
    AlertDialogPortal,
    AlertDialogTitle,
    AlertDialogTrigger
}
