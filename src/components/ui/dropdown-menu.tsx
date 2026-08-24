"use client"

import {
    createContext,
    Fragment,
    isValidElement,
    useCallback,
    useContext,
    useMemo,
    useState
} from "react"

import { Menu as MenuPrimitive } from "@base-ui/react/menu"
import { ArrowUpRight, CheckIcon, ChevronRightIcon, Undo2 } from "lucide-react"

import { Link as NextLink } from "@/components/ui/link"
import { usePressFeedback } from "@/hooks/use-press-feedback"
import { cn } from "@/lib/utils"

type DropdownMenuOptions = {
    anchor?: HTMLElement | null
    content: React.ReactNode
    className?: string
} & Pick<
    MenuPrimitive.Positioner.Props,
    "sticky" | "align" | "alignOffset" | "side" | "sideOffset"
>

type DropdownMenuPayload = React.ReactNode | DropdownMenuOptions

type DropdownMenuHandle = MenuPrimitive.Handle<DropdownMenuPayload>

const DropdownMenuHandleContext = createContext<DropdownMenuHandle | null>(null)

const createDropdownMenuHandle = MenuPrimitive.createHandle<DropdownMenuPayload>

function DropdownMenu({
    containerClassName,
    children,
    handle: externalHandle,
    ...props
}: Omit<
    MenuPrimitive.Root.Props<DropdownMenuPayload>,
    "children" | "handle"
> & {
    children?: React.ReactNode
    handle?: DropdownMenuHandle
    containerClassName?: MenuPrimitive.Portal.Props["className"]
}) {
    const [internalHandle] = useState(
        MenuPrimitive.createHandle<DropdownMenuPayload>
    )
    const handle = externalHandle ?? internalHandle

    return (
        <DropdownMenuHandleContext value={handle}>
            {children}
            <MenuPrimitive.Root<DropdownMenuPayload>
                data-slot="dropdown-menu"
                handle={handle}
                modal={false}
                {...props}
            >
                {({ payload }) => {
                    const { content, className, ...options } =
                        typeof payload === "object"
                        && payload !== null
                        && "content" in payload
                        && !isValidElement(payload)
                            ? payload
                            : { content: payload, className: undefined }

                    return (
                        <DropdownMenuContent
                            align={options.align}
                            alignOffset={options.alignOffset}
                            side={options.side}
                            sideOffset={options.sideOffset}
                            anchor={options.anchor}
                            sticky={options.sticky}
                            className={className}
                            containerClassName={containerClassName}
                        >
                            {content}
                        </DropdownMenuContent>
                    )
                }}
            </MenuPrimitive.Root>
        </DropdownMenuHandleContext>
    )
}

function DropdownMenuPortal({ ...props }: MenuPrimitive.Portal.Props) {
    return <MenuPrimitive.Portal data-slot="dropdown-menu-portal" {...props} />
}

function DropdownMenuTrigger<TPayload = DropdownMenuPayload>({
    handle: explicitHandle,
    ...props
}: MenuPrimitive.Trigger.Props<TPayload>) {
    const contextHandle = useContext(DropdownMenuHandleContext)

    const handle = (explicitHandle
        ?? contextHandle) as MenuPrimitive.Handle<TPayload> | null

    return (
        <MenuPrimitive.Trigger
            data-slot="dropdown-menu-trigger"
            handle={handle ?? undefined}
            {...props}
        />
    )
}

function DropdownMenuContent({
    align = "start",
    alignOffset = 1.5,
    side = "bottom",
    sideOffset = 0,
    anchor,
    sticky = true,
    shadow = true,
    isSubMenu = false,
    className,
    containerClassName,
    positionerClassName,
    viewportClassName,
    children,
    ...props
}: MenuPrimitive.Popup.Props
    & Pick<
        MenuPrimitive.Positioner.Props,
        "sticky" | "align" | "alignOffset" | "side" | "sideOffset"
    > & {
        anchor?: HTMLElement | null
        shadow?: boolean
        isSubMenu?: boolean
        containerClassName?: MenuPrimitive.Portal.Props["className"]
        positionerClassName?: MenuPrimitive.Positioner.Props["className"]
        viewportClassName?: MenuPrimitive.Viewport.Props["className"]
    }) {
    return (
        <DropdownMenuPortal
            className={cn(
                shadow && [
                    "z-80",
                    "[filter:drop-shadow(0px_0px_25px_rgba(0,0,0,0.16))_drop-shadow(0px_0px_2px_rgba(0,0,0,0.10))]",
                    "dark:[filter:drop-shadow(0px_0px_25px_theme(colors.background/0.6))_drop-shadow(0px_0px_2px_theme(colors.background/0.4))]"
                ],
                containerClassName
            )}
        >
            <MenuPrimitive.Positioner
                data-slot="dropdown-menu-positioner"
                data-cursor="target"
                anchor={anchor ?? undefined}
                className={cn(
                    "group/dropdown-menu-positioner z-80 h-[--positioner-height] w-[--positioner-width] cursor-auto outline-none",
                    isSubMenu && "mt-px",
                    {
                        "motion-preferred":
                            "will-change-[top,left,right,bottom,transform] transition-[top,left,right,bottom,transform] ease-[cubic-bezier(0.22,1,0.36,1)] duration-400",
                        "data-instant": "transition-none"
                    },
                    positionerClassName
                )}
                align={align}
                alignOffset={alignOffset}
                side={side}
                sideOffset={sideOffset}
                sticky={sticky}
            >
                <MenuPrimitive.Popup
                    data-slot="dropdown-menu-content"
                    data-cursor="lock"
                    tabIndex={-1}
                    className={cn(
                        "group/dropdown-menu-popup relative z-50 grid h-[--popup-height,auto] max-h-[--available-height] w-[--popup-width] min-w-52 max-w-56 origin-[--transform-origin] overflow-y-auto overflow-x-hidden rounded-xl bg-background text-foreground ring ring-stroke outline-none scrollbar-thin",
                        "group-data-target-cursor/dropdown-menu-positioner:group-hover/dropdown-menu-positioner:rounded-none",
                        {
                            "motion-preferred": [
                                "will-change-[width,height,opacity,transform,border-radius] transition-[width,height,opacity,transform,border-radius] ease-[cubic-bezier(0.22,1,0.36,1)]",
                                isSubMenu ? "duration-200" : "duration-400",
                                {
                                    "data-starting-style": [
                                        isSubMenu ? "scale-95" : "scale-50",
                                        "opacity-0"
                                    ],
                                    "data-ending-style": [
                                        isSubMenu ? "scale-95" : "scale-0",
                                        "opacity-0"
                                    ],
                                    "data-instant": "transition-[border-radius]"
                                }
                            ],
                            "data-instant": "transition-none"
                        },
                        className
                    )}
                    {...props}
                >
                    <DropdownMenuViewport className={cn(viewportClassName)}>
                        {children}
                    </DropdownMenuViewport>
                </MenuPrimitive.Popup>
            </MenuPrimitive.Positioner>
        </DropdownMenuPortal>
    )
}

function DropdownMenuViewport({
    className,
    ...props
}: MenuPrimitive.Viewport.Props) {
    return (
        <MenuPrimitive.Viewport
            data-slot="dropdown-menu-viewport"
            className={cn(
                "relative flex size-full flex-col overflow-y-auto overflow-x-hidden p-1 scrollbar-none",
                {
                    "group-data-[side=top]/dropdown-menu-popup": "justify-end",
                    "[&_:is([data-current],[data-previous])]": [
                        "w-[calc(var(--popup-width)-var(--spacing)*2)] translate-x-0 opacity-100 transition-opacity ease-[cubic-bezier(0.22,1,0.36,1)] duration-300",
                        {
                            "motion-preferred":
                                "transition-[transform,opacity] duration-[.4s,.3s]"
                        }
                    ],
                    "motion-preferred": {
                        "[&_[data-current][data-starting-style]]": [
                            "opacity-0",
                            {
                                "data-[activation-direction~='left']":
                                    "-translate-x-1/2",
                                "data-[activation-direction~='right']":
                                    "translate-x-1/2"
                            }
                        ],
                        "[&_[data-previous][data-ending-style]]": [
                            "opacity-0",
                            {
                                "data-[activation-direction~='left']":
                                    "translate-x-1/2",
                                "data-[activation-direction~='right']":
                                    "-translate-x-1/2"
                            }
                        ]
                    },
                    "[[data-instant]_&_:is([data-current],[data-previous])]":
                        "transition-none"
                },
                className
            )}
            {...props}
        />
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
                "pointer-events-none px-3 py-1.5 text-xs text-muted-foreground",
                {
                    "data-inset": "ps-7"
                },
                className
            )}
            {...props}
        />
    )
}

function DropdownMenuItem({
    className,
    disabled,
    inset,
    onClick,
    variant = "default",
    ...props
}: MenuPrimitive.Item.Props & {
    inset?: boolean
    variant?: "default" | "destructive"
}) {
    const playPressFeedback = usePressFeedback()

    return (
        <MenuPrimitive.Item
            data-slot="dropdown-menu-item"
            data-inset={inset}
            data-variant={variant}
            data-sound={disabled ? false : "button"}
            disabled={disabled}
            onClick={(e) => {
                playPressFeedback("button")
                onClick?.(e)
            }}
            className={cn(
                "group/dropdown-menu-item relative flex cursor-pointer select-none items-center gap-1.5 rounded-lg px-3 py-2 text-sm outline-hidden",
                {
                    focus: "bg-accent/60 text-accent-foreground dark:bg-accent",
                    "data-inset": "ps-7",
                    "data-disabled":
                        "cursor-not-allowed !bg-transparent opacity-50",
                    "data-[variant=destructive]": [
                        "text-destructive",
                        {
                            focus: "bg-destructive/10 text-destructive dark:bg-destructive/20",
                            "not-focus": "**:text-accent-foreground"
                        }
                    ],
                    "[&_svg:not([class*='size-'])]": "-ms-0.5 size-4.5",
                    "[&_svg]":
                        "pointer-events-none shrink-0 data-[variant=destructive]:*:text-destructive"
                },
                className
            )}
            {...props}
        />
    )
}

const DropdownMenuSubContext = createContext<{
    open: boolean
    setOpen: (open: boolean) => void
} | null>(null)

function DropdownMenuSub({
    open: openProp,
    onOpenChange,
    ...props
}: MenuPrimitive.SubmenuRoot.Props) {
    const [internalOpen, setInternalOpen] = useState(false)
    const open = openProp ?? internalOpen

    const handleBaseUIOpenChange = useCallback(
        (
            newOpen: boolean,
            eventDetails: MenuPrimitive.SubmenuRoot.ChangeEventDetails
        ) => {
            if (eventDetails.reason === "trigger-press") {
                return
            }

            setInternalOpen(newOpen)
            onOpenChange?.(newOpen, eventDetails)
        },
        [onOpenChange]
    )

    const forceSetOpen = useCallback(
        (newOpen: boolean) => {
            setInternalOpen(newOpen)
            if (onOpenChange) {
                onOpenChange(
                    newOpen,
                    undefined as unknown as MenuPrimitive.SubmenuRoot.ChangeEventDetails
                )
            }
        },
        [onOpenChange]
    )

    const contextValue = useMemo(
        () => ({ open, setOpen: forceSetOpen }),
        [open, forceSetOpen]
    )

    return (
        <DropdownMenuSubContext.Provider value={contextValue}>
            <MenuPrimitive.SubmenuRoot
                data-slot="dropdown-menu-sub"
                open={open}
                onOpenChange={handleBaseUIOpenChange}
                {...props}
            />
        </DropdownMenuSubContext.Provider>
    )
}

function DropdownMenuSubTrigger({
    className,
    description,
    srOnlyDescription,
    disabled,
    inset,
    onClick,
    children,
    ...props
}: MenuPrimitive.SubmenuTrigger.Props & {
    description?: string
    srOnlyDescription?: string
    inset?: boolean
}) {
    const playPressFeedback = usePressFeedback()
    const context = useContext(DropdownMenuSubContext)

    const Comp = description ? "div" : Fragment

    return (
        <MenuPrimitive.SubmenuTrigger
            data-slot="dropdown-menu-sub-trigger"
            data-inset={inset}
            data-sound={disabled ? false : "button"}
            disabled={disabled}
            delay={0}
            onClick={(e) => {
                playPressFeedback("button")
                if (context) {
                    context.setOpen(!context.open)
                }
                onClick?.(e)
            }}
            className={cn(
                "relative flex cursor-default select-none items-center gap-1.5 rounded-lg px-3 py-2 text-sm outline-hidden",
                !description && "pe-10",
                {
                    focus: "bg-accent/60 text-accent-foreground dark:bg-accent",
                    "data-open":
                        "bg-accent/60 text-accent-foreground dark:bg-accent",
                    "data-popup-open":
                        "bg-accent/60 text-accent-foreground dark:bg-accent",
                    "data-inset": "ps-7",
                    "not-data-[variant=destructive]":
                        "focus:**:text-accent-foreground",
                    "[&_svg:not([class*='size-'])]": "-ms-0.5 size-4.5",
                    "[&_svg]": "pointer-events-none shrink-0"
                },
                className
            )}
            {...props}
        >
            <Comp
                {...(description && {
                    className: "flex flex-col gap-y-0.5"
                })}
            >
                <Comp
                    {...(description && {
                        className: cn("flex items-center gap-1.5 pe-10")
                    })}
                >
                    {children}
                    <span
                        data-slot="dropdown-menu-sub-trigger-indicator"
                        className={cn(
                            "pointer-events-none absolute end-2 top-2 grid size-4.5 place-items-center"
                        )}
                    >
                        <ChevronRightIcon
                            strokeWidth={1.5}
                            className="size-4.5 rtl:rotate-180"
                        />
                    </span>
                </Comp>
                {description && (
                    <span
                        className={cn(
                            "text-wrap text-xs text-muted-foreground",
                            srOnlyDescription && "sr-only"
                        )}
                        data-slot="dropdown-menu-sub-trigger-description"
                    >
                        {description}
                    </span>
                )}
            </Comp>
        </MenuPrimitive.SubmenuTrigger>
    )
}

function DropdownMenuSubContent({
    align = "start",
    alignOffset = -5.5,
    side = "inline-end",
    sideOffset = -1.5,
    className,
    ...props
}: React.ComponentProps<typeof DropdownMenuContent>) {
    return (
        <DropdownMenuContent
            data-slot="dropdown-menu-sub-content"
            shadow={false}
            isSubMenu={true}
            className={cn(
                "w-auto min-w-32 rounded-xl bg-background text-foreground",
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
    description,
    srOnlyDescription,
    openInNewTab,
    inset,
    onClick,
    ...props
}: Omit<MenuPrimitive.LinkItem.Props, "href">
    & Pick<React.ComponentProps<typeof NextLink>, "href"> & {
        description?: React.ReactNode
        srOnlyDescription?: boolean
        openInNewTab?: boolean
        inset?: boolean
    }) {
    const playPressFeedback = usePressFeedback()

    const Comp = description ? "div" : Fragment

    return (
        <MenuPrimitive.LinkItem
            data-slot="dropdown-menu-link-item"
            data-inset={inset}
            data-sound="tick"
            onClick={(e) => {
                playPressFeedback("link")
                onClick?.(e)
            }}
            className={cn(
                "group/dropdown-link-item relative flex cursor-pointer select-none items-center gap-1.5 text-nowrap rounded-lg py-2 text-sm outline-hidden",
                openInNewTab && !description ? "pe-10 ps-3" : "px-3",
                {
                    focus: "bg-accent/60 text-accent-foreground **:text-accent-foreground dark:bg-accent",
                    "data-inset": "ps-7",
                    "data-disabled":
                        "cursor-not-allowed !bg-transparent opacity-50",
                    "[&_svg]": "pointer-events-none shrink-0",
                    "[&_svg:not([class*='size-'])]": "-ms-0.5 size-4.5"
                },
                className
            )}
            render={
                <NextLink
                    href={href}
                    {...(openInNewTab && {
                        target: "_blank",
                        rel: "noreferrer"
                    })}
                />
            }
            {...props}
        >
            <Comp
                {...(description && {
                    className: "flex flex-col gap-y-0.5"
                })}
            >
                <Comp
                    {...(description && {
                        className: cn(
                            "flex items-center gap-1.5",
                            openInNewTab && "pe-10"
                        )
                    })}
                >
                    {children}
                    {openInNewTab && (
                        <span
                            data-slot="dropdown-menu-link-item-indicator"
                            className="pointer-events-none absolute end-2.75 grid place-items-center"
                        >
                            <ArrowUpRight className="size-4 rtl:-scale-x-100" />
                        </span>
                    )}
                </Comp>
                {description && (
                    <span
                        className={cn(
                            "text-wrap text-xs text-muted-foreground",
                            srOnlyDescription && "sr-only",
                            "group-data-disabled/dropdown-menu-link-item:text-foreground"
                        )}
                        data-slot="dropdown-menu-link-item-description"
                    >
                        {description}
                    </span>
                )}
            </Comp>
        </MenuPrimitive.LinkItem>
    )
}

function DropdownMenuCheckboxItem({
    className,
    children,
    description,
    srOnlyDescription,
    isDefault,
    disabled,
    checked,
    inset,
    onClick,
    ...props
}: MenuPrimitive.CheckboxItem.Props & {
    description?: React.ReactNode
    srOnlyDescription?: boolean
    isDefault?: boolean
    inset?: boolean
}) {
    const playPressFeedback = usePressFeedback()

    const Comp = description ? "div" : Fragment

    return (
        <MenuPrimitive.CheckboxItem
            data-slot="dropdown-menu-checkbox-item"
            data-inset={inset}
            data-sound={disabled ? false : "tick"}
            disabled={disabled}
            onClick={(e) => {
                playPressFeedback("button")
                onClick?.(e)
            }}
            className={cn(
                "group/dropdown-menu-checkbox-item relative flex cursor-pointer select-none items-center gap-1.5 rounded-lg px-3 py-2 text-sm outline-hidden",
                !description && "pe-10",
                {
                    focus: "bg-accent/60 text-accent-foreground **:text-accent-foreground dark:bg-accent",
                    "data-inset": "ps-7",
                    "data-disabled":
                        "cursor-not-allowed !bg-transparent opacity-50",
                    "[&_svg:not([class*='size-'])]": "-ms-0.5 size-4.5",
                    "[&_svg]": "pointer-events-none shrink-0"
                },
                className
            )}
            checked={checked}
            {...props}
        >
            <Comp
                {...(description && {
                    className: "flex flex-col gap-y-0.5"
                })}
            >
                <Comp
                    {...(description && {
                        className: "flex gap-1.5 items-center pe-10"
                    })}
                >
                    {children}
                    {isDefault !== undefined && (
                        <DropdownMenuDefaultIndicator
                            className={cn(
                                isDefault
                                    ? "group-data-checked/dropdown-menu-checkbox-item:hidden"
                                    : "group-data-unchecked/dropdown-menu-checkbox-item:hidden"
                            )}
                        />
                    )}
                    <MenuPrimitive.CheckboxItemIndicator
                        data-slot="dropdown-menu-checkbox-item-indicator"
                        className={cn(
                            "pointer-events-none absolute end-2 top-2 grid size-4.5 place-items-center"
                        )}
                    >
                        <CheckIcon />
                    </MenuPrimitive.CheckboxItemIndicator>
                </Comp>
                {description && (
                    <span
                        className={cn(
                            "text-xs text-muted-foreground",
                            srOnlyDescription && "sr-only",
                            "group-data-disabled/dropdown-menu-checkbox-item:text-foreground"
                        )}
                        data-slot="dropdown-menu-checkbox-item-description"
                    >
                        {description}
                    </span>
                )}
            </Comp>
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
    description,
    srOnlyDescription,
    isDefault,
    disabled,
    inset,
    onClick,
    ...props
}: MenuPrimitive.RadioItem.Props & {
    description?: React.ReactNode
    srOnlyDescription?: boolean
    isDefault?: boolean
    inset?: boolean
}) {
    const playPressFeedback = usePressFeedback()

    const Comp = description ? "div" : Fragment

    return (
        <MenuPrimitive.RadioItem
            data-slot="dropdown-menu-radio-item"
            data-inset={inset}
            data-sound={disabled ? false : "tick"}
            disabled={disabled}
            onClick={(e) => {
                playPressFeedback("button")
                onClick?.(e)
            }}
            className={cn(
                "group/dropdown-menu-radio-item relative flex cursor-pointer select-none items-center gap-1.5 rounded-lg px-3 py-2 text-sm outline-hidden",
                !description && "pe-10",
                {
                    focus: "bg-accent/60 text-accent-foreground **:text-accent-foreground dark:bg-accent",
                    "data-inset": "ps-7",
                    "data-disabled":
                        "cursor-not-allowed !bg-transparent opacity-50",
                    "[&_svg:not([class*='size-'])]": "-ms-0.5 size-4.5",
                    "[&_svg]": "pointer-events-none shrink-0"
                },
                className
            )}
            {...props}
        >
            <Comp
                {...(description && {
                    className: "flex flex-col gap-y-0.5"
                })}
            >
                <Comp
                    {...(description && {
                        className: "flex gap-1.5 items-center pe-10"
                    })}
                >
                    {children}
                    {isDefault && (
                        <DropdownMenuDefaultIndicator
                            className={cn(
                                "group-data-checked/dropdown-menu-radio-item:hidden"
                            )}
                        />
                    )}
                    <MenuPrimitive.RadioItemIndicator
                        data-slot="dropdown-menu-radio-item-indicator"
                        className={cn(
                            "pointer-events-none absolute end-2 top-2 grid size-4.5 place-items-center"
                        )}
                    >
                        <CheckIcon />
                    </MenuPrimitive.RadioItemIndicator>
                </Comp>
                {description && (
                    <span
                        className={cn(
                            "text-xs text-muted-foreground",
                            srOnlyDescription && "sr-only",
                            "group-data-disabled/dropdown-menu-radio-item:text-foreground"
                        )}
                        data-slot="dropdown-menu-radio-item-description"
                    >
                        {description}
                    </span>
                )}
            </Comp>
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
            className={cn("-mx-1 my-1 h-px border-t border-stroke", className)}
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
                "ms-auto text-xs tracking-widest text-muted-foreground",
                "group-focus/dropdown-menu-item:text-accent-foreground",
                className
            )}
            {...props}
        />
    )
}

function DropdownMenuDefaultIndicator({
    className,
    ...props
}: React.ComponentProps<"svg">) {
    return (
        <Undo2
            data-slot="dropdown-menu-default-indicator"
            className={cn(
                "size-4 -translate-y-[1px] text-muted-foreground rtl:-scale-x-100",
                className
            )}
            {...props}
        />
    )
}

export {
    createDropdownMenuHandle,
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
