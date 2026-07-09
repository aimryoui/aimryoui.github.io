"use client"

import { Menu as MenuPrimitive } from "@base-ui/react/menu"
import { ArrowUpRight, CheckIcon, ChevronRightIcon } from "lucide-react"

import { cn } from "@/lib/utils"

function DropdownMenu({ ...props }: MenuPrimitive.Root.Props) {
    return <MenuPrimitive.Root data-slot="dropdown-menu" {...props} />
}

function DropdownMenuPortal({ ...props }: MenuPrimitive.Portal.Props) {
    return <MenuPrimitive.Portal data-slot="dropdown-menu-portal" {...props} />
}

function DropdownMenuTrigger({ ...props }: MenuPrimitive.Trigger.Props) {
    return (
        <MenuPrimitive.Trigger data-slot="dropdown-menu-trigger" {...props} />
    )
}

function DropdownMenuContent({
    align = "start",
    alignOffset = 0,
    side = "top",
    sideOffset = -1.5,
    shadow = true,
    className,
    ...props
}: MenuPrimitive.Popup.Props &
    Pick<
        MenuPrimitive.Positioner.Props,
        "align" | "alignOffset" | "side" | "sideOffset"
    > & { shadow?: boolean }) {
    return (
        <DropdownMenuPortal
            className={
                shadow
                    ? cn(
                          "fixed inset-0 z-50",
                          "[filter:drop-shadow(0px_0px_25px_rgba(0,0,0,0.16))_drop-shadow(0px_0px_2px_rgba(0,0,0,0.10))]"
                      )
                    : undefined
            }
        >
            <MenuPrimitive.Positioner
                className="isolate z-50 overflow-hidden p-px outline-none"
                positionMethod="fixed"
                align={align}
                alignOffset={alignOffset}
                side={side}
                sideOffset={sideOffset}
            >
                <MenuPrimitive.Popup
                    data-slot="dropdown-menu-content"
                    tabIndex={-1}
                    className={cn(
                        "z-50 max-h-[--available-height] w-[--anchor-width] min-w-48 origin-[--transform-origin] overflow-y-auto overflow-x-hidden rounded-xl bg-background p-1 text-foreground ring ring-stroke outline-none",
                        "will-change-transform transition-transform duration-300",
                        {
                            "data-[starting-style]": [
                                "pointer-events-none",
                                {
                                    "data-[side=top]": {
                                        "data-[align=start]":
                                            "translate-y-full",
                                        "data-[align=end]": "translate-y-full"
                                    },
                                    "data-[side=bottom]": {
                                        "data-[align=start]":
                                            "-translate-y-full",
                                        "data-[align=end]": "translate-y-full"
                                    }
                                }
                            ]
                        },
                        className
                    )}
                    {...props}
                />
            </MenuPrimitive.Positioner>
        </DropdownMenuPortal>
    )
}

function DropdownMenuGroup({ ...props }: MenuPrimitive.Group.Props) {
    return <MenuPrimitive.Group data-slot="dropdown-menu-group" {...props} />
}

function DropdownMenuLabel({
    className,
    inset,
    ...props
}: MenuPrimitive.GroupLabel.Props & {
    inset?: boolean
}) {
    return (
        <MenuPrimitive.GroupLabel
            data-slot="dropdown-menu-label"
            data-inset={inset}
            className={cn(
                "px-3 py-1.5 text-xs text-muted-foreground",
                {
                    "data-inset": "pl-7"
                },
                className
            )}
            {...props}
        />
    )
}

function DropdownMenuItem({
    className,
    inset,
    variant = "default",
    ...props
}: MenuPrimitive.Item.Props & {
    inset?: boolean
    variant?: "default" | "destructive"
}) {
    return (
        <MenuPrimitive.Item
            data-slot="dropdown-menu-item"
            data-inset={inset}
            data-variant={variant}
            className={cn(
                "group/dropdown-menu-item relative flex cursor-default select-none items-center gap-1.5 rounded-lg px-3 py-2 text-sm outline-hidden",
                {
                    focus: "bg-accent text-accent-foreground",
                    "data-inset": "pl-7",
                    "data-disabled": "pointer-events-none opacity-50",
                    "data-[variant=destructive]": [
                        "text-destructive",
                        {
                            focus: "bg-destructive/10 text-destructive dark:bg-destructive/20",
                            "not-focus": "**:text-accent-foreground"
                        }
                    ],
                    "[&_svg:not([class*='size-'])]": "size-4",
                    "[&_svg]":
                        "pointer-events-none shrink-0 data-[variant=destructive]:*:text-destructive"
                },
                className
            )}
            {...props}
        />
    )
}

function DropdownMenuSub({ ...props }: MenuPrimitive.SubmenuRoot.Props) {
    return (
        <MenuPrimitive.SubmenuRoot data-slot="dropdown-menu-sub" {...props} />
    )
}

function DropdownMenuSubTrigger({
    className,
    inset,
    children,
    ...props
}: MenuPrimitive.SubmenuTrigger.Props & {
    inset?: boolean
}) {
    return (
        <MenuPrimitive.SubmenuTrigger
            data-slot="dropdown-menu-sub-trigger"
            data-inset={inset}
            className={cn(
                "flex cursor-default select-none items-center gap-1.5 rounded-lg px-3 py-2 text-sm outline-hidden",
                {
                    focus: "bg-accent text-accent-foreground",
                    "data-open": "bg-accent text-accent-foreground",
                    "data-popup-open": "bg-accent text-accent-foreground",
                    "data-inset": "pl-7",
                    "not-data-[variant=destructive]":
                        "focus:**:text-accent-foreground",
                    "[&_svg:not([class*='size-'])]": "size-4",
                    "[&_svg]": "pointer-events-none shrink-0"
                },
                className
            )}
            {...props}
        >
            {children}
            <ChevronRightIcon className="cn-rtl-flip ml-auto" />
        </MenuPrimitive.SubmenuTrigger>
    )
}

function DropdownMenuSubContent({
    align = "start",
    alignOffset = -5.5,
    side = "right",
    sideOffset = -1.5,
    className,
    ...props
}: React.ComponentProps<typeof DropdownMenuContent>) {
    return (
        <DropdownMenuContent
            data-slot="dropdown-menu-sub-content"
            shadow={false}
            className={cn(
                "w-auto min-w-32 rounded-xl bg-background p-1 text-foreground",
                "will-change-transform transition-transform",
                {
                    "data-[starting-style]": {
                        "data-[side=right]": "-translate-x-full",
                        "data-[side=left]": "translate-x-full"
                    }
                },
                className
            )}
            align={align}
            alignOffset={alignOffset}
            side={side}
            sideOffset={sideOffset}
            {...props}
        />
    )
}

function DropdownMenuLinkItem({
    className,
    children,
    href,
    openInNewTab,
    inset,
    ...props
}: MenuPrimitive.LinkItem.Props & {
    openInNewTab?: boolean
    inset?: boolean
}) {
    return (
        <MenuPrimitive.LinkItem
            data-slot="dropdown-menu-link-item"
            data-inset={inset}
            className={cn(
                "relative flex cursor-pointer select-none items-center gap-1.5 rounded-lg px-3 py-2 pr-8 text-sm outline-hidden",
                {
                    focus: "bg-accent text-accent-foreground **:text-accent-foreground",
                    "data-inset": "pl-7",
                    "data-disabled": "pointer-events-none opacity-50",
                    "[&_svg:not([class*='size-'])]": "size-4",
                    "[&_svg]": "pointer-events-none shrink-0"
                },
                className
            )}
            href={href}
            {...(openInNewTab && { target: "_blank", rel: "noreferrer" })}
            {...props}
        >
            {openInNewTab && (
                <span
                    className="pointer-events-none absolute right-3 flex items-center justify-center"
                    data-slot="dropdown-menu-link-item-indicator"
                >
                    <ArrowUpRight className="size-4" />
                </span>
            )}
            {children}
        </MenuPrimitive.LinkItem>
    )
}

function DropdownMenuCheckboxItem({
    className,
    children,
    checked,
    inset,
    ...props
}: MenuPrimitive.CheckboxItem.Props & {
    inset?: boolean
}) {
    return (
        <MenuPrimitive.CheckboxItem
            data-slot="dropdown-menu-checkbox-item"
            data-inset={inset}
            className={cn(
                "relative flex cursor-pointer select-none items-center gap-1.5 rounded-lg px-3 py-2 pr-8 text-sm outline-hidden",
                {
                    focus: "bg-accent text-accent-foreground **:text-accent-foreground",
                    "data-inset": "pl-7",
                    "data-disabled": "pointer-events-none opacity-50",
                    "[&_svg:not([class*='size-'])]": "size-4",
                    "[&_svg]": "pointer-events-none shrink-0"
                },
                className
            )}
            checked={checked}
            {...props}
        >
            <span
                className="pointer-events-none absolute right-3 flex items-center justify-center"
                data-slot="dropdown-menu-checkbox-item-indicator"
            >
                <MenuPrimitive.CheckboxItemIndicator>
                    <CheckIcon />
                </MenuPrimitive.CheckboxItemIndicator>
            </span>
            {children}
        </MenuPrimitive.CheckboxItem>
    )
}

function DropdownMenuRadioGroup({ ...props }: MenuPrimitive.RadioGroup.Props) {
    return (
        <MenuPrimitive.RadioGroup
            data-slot="dropdown-menu-radio-group"
            {...props}
        />
    )
}

function DropdownMenuRadioItem({
    className,
    children,
    inset,
    ...props
}: MenuPrimitive.RadioItem.Props & {
    inset?: boolean
}) {
    return (
        <MenuPrimitive.RadioItem
            data-slot="dropdown-menu-radio-item"
            data-inset={inset}
            className={cn(
                "relative flex cursor-pointer select-none items-center gap-1.5 rounded-lg px-3 py-2 pr-8 text-sm outline-hidden",
                {
                    focus: "bg-accent text-accent-foreground **:text-accent-foreground",
                    "data-inset": "pl-7",
                    "data-disabled": "pointer-events-none opacity-50",
                    "[&_svg:not([class*='size-'])]": "size-4",
                    "[&_svg]": "pointer-events-none shrink-0"
                },
                className
            )}
            {...props}
        >
            <span
                className="pointer-events-none absolute right-3 flex items-center justify-center"
                data-slot="dropdown-menu-radio-item-indicator"
            >
                <MenuPrimitive.RadioItemIndicator>
                    <CheckIcon />
                </MenuPrimitive.RadioItemIndicator>
            </span>
            {children}
        </MenuPrimitive.RadioItem>
    )
}

function DropdownMenuSeparator({
    className,
    ...props
}: MenuPrimitive.Separator.Props) {
    return (
        <MenuPrimitive.Separator
            data-slot="dropdown-menu-separator"
            className={cn("-mx-1 my-1 h-px bg-stroke", className)}
            {...props}
        />
    )
}

function DropdownMenuShortcut({
    className,
    ...props
}: React.ComponentProps<"span">) {
    return (
        <span
            data-slot="dropdown-menu-shortcut"
            className={cn(
                "ml-auto text-xs tracking-widest text-muted-foreground",
                "group-focus/dropdown-menu-item:text-accent-foreground",
                className
            )}
            {...props}
        />
    )
}

export {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuLinkItem,
    DropdownMenuPortal,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger
}
