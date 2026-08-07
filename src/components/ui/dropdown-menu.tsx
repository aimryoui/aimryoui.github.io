"use client"

import {
    createContext,
    Fragment,
    isValidElement,
    useContext,
    useState
} from "react"
import NextLink from "next/link"

import { Menu as MenuPrimitive } from "@base-ui/react/menu"
import { ArrowUpRight, CheckIcon, ChevronRightIcon } from "lucide-react"

import { usePressFeedback } from "@/hooks/use-press-feedback"
import { cn } from "@/lib/utils"

type DropdownMenuOptions = {
    anchor?: HTMLElement | null
    content: React.ReactNode
    className?: string
} & Pick<
    MenuPrimitive.Positioner.Props,
    "align" | "alignOffset" | "side" | "sideOffset"
>

type DropdownMenuPayload = React.ReactNode | DropdownMenuOptions

type DropdownMenuHandle = MenuPrimitive.Handle<DropdownMenuPayload>

const DropdownMenuHandleContext = createContext<DropdownMenuHandle | null>(null)

const createDropdownMenuHandle = MenuPrimitive.createHandle<DropdownMenuPayload>

function DropdownMenu({
    children,
    handle: externalHandle,
    ...props
}: Omit<
    MenuPrimitive.Root.Props<DropdownMenuPayload>,
    "children" | "handle"
> & {
    children?: React.ReactNode
    handle?: DropdownMenuHandle
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
                        typeof payload === "object" &&
                        payload !== null &&
                        "content" in payload &&
                        !isValidElement(payload)
                            ? payload
                            : { content: payload, className: undefined }

                    return (
                        <DropdownMenuContent
                            align={options.align}
                            alignOffset={options.alignOffset}
                            side={options.side}
                            sideOffset={options.sideOffset}
                            anchor={options.anchor}
                            className={className}
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

    const handle = (explicitHandle ??
        contextHandle) as MenuPrimitive.Handle<TPayload> | null

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
    shadow = true,
    isSubMenu = false,
    className,
    viewportClassName,
    children,
    ...props
}: MenuPrimitive.Popup.Props &
    Pick<
        MenuPrimitive.Positioner.Props,
        "align" | "alignOffset" | "side" | "sideOffset"
    > & {
        anchor?: HTMLElement | null
        shadow?: boolean
        isSubMenu?: boolean
        viewportClassName?: Pick<MenuPrimitive.Viewport.Props, "className">
    }) {
    return (
        <DropdownMenuPortal
            className={
                shadow
                    ? cn(
                          "z-80",
                          "[filter:drop-shadow(0px_0px_25px_rgba(0,0,0,0.16))_drop-shadow(0px_0px_2px_rgba(0,0,0,0.10))]",
                          "dark:[filter:drop-shadow(0px_0px_25px_theme(colors.background/0.6))_drop-shadow(0px_0px_2px_theme(colors.background/0.4))]"
                      )
                    : undefined
            }
        >
            <MenuPrimitive.Positioner
                data-slot="dropdown-menu-positioner"
                data-cursor="target"
                anchor={anchor ?? undefined}
                className={cn(
                    "group/dropdown-menu-positioner z-80 h-[--positioner-height] w-[--positioner-width] max-w-[--available-width] cursor-auto outline-none",
                    isSubMenu && "mt-px",
                    {
                        "motion-preferred":
                            "will-change-[top,left,right,bottom,transform] transition-[top,left,right,bottom,transform] ease-[cubic-bezier(0.22,1,0.36,1)] duration-400",
                        "data-instant": "transition-none"
                    }
                )}
                align={align}
                alignOffset={alignOffset}
                side={side}
                sideOffset={sideOffset}
                sticky
            >
                <MenuPrimitive.Popup
                    data-slot="dropdown-menu-content"
                    data-cursor="lock"
                    tabIndex={-1}
                    className={cn(
                        "group/dropdown-menu-popup relative z-50 grid h-[--popup-height,auto] max-h-[--available-height] w-[--popup-width] min-w-48 origin-[--transform-origin] overflow-y-auto overflow-x-hidden rounded-xl bg-background text-foreground ring ring-stroke outline-none",
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
                        "w-[calc(var(--popup-width)-var(--spacing)*2)] translate-x-0 opacity-100 transition-opacity ease-[cubic-bezier(0.22,1,0.36,1)] duration-[.4s,.25s]",
                        {
                            "motion-preferred": "transition-[transform,opacity]"
                        }
                    ],
                    "motion-preferred": {
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
                        }
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
            data-sound="button"
            onClick={(e) => {
                playPressFeedback("button")
                onClick?.(e)
            }}
            className={cn(
                "group/dropdown-menu-item relative flex cursor-default select-none items-center gap-1.5 rounded-lg px-3 py-2 text-sm outline-hidden",
                {
                    focus: "bg-accent/60 text-accent-foreground dark:bg-accent",
                    "data-inset": "ps-7",
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
    onClick,
    children,
    ...props
}: MenuPrimitive.SubmenuTrigger.Props & {
    inset?: boolean
}) {
    const playPressFeedback = usePressFeedback()

    return (
        <MenuPrimitive.SubmenuTrigger
            data-slot="dropdown-menu-sub-trigger"
            data-inset={inset}
            data-sound="button"
            delay={0}
            onClick={(e) => {
                playPressFeedback("button")
                onClick?.(e)
            }}
            className={cn(
                "flex cursor-default select-none items-center gap-3 rounded-lg px-3 py-2 text-sm outline-hidden",
                {
                    focus: "bg-accent/60 text-accent-foreground dark:bg-accent",
                    "data-open":
                        "bg-accent/60 text-accent-foreground dark:bg-accent",
                    "data-popup-open":
                        "bg-accent/60 text-accent-foreground dark:bg-accent",
                    "data-inset": "ps-7",
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
            isSubMenu={true}
            className={cn(
                "w-auto min-w-32 max-w-53 rounded-xl bg-background text-foreground sm:max-w-auto",
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
    onClick,
    ...props
}: Omit<MenuPrimitive.LinkItem.Props, "href"> &
    Pick<React.ComponentProps<typeof NextLink>, "href"> & {
        openInNewTab?: boolean
        inset?: boolean
    }) {
    const playPressFeedback = usePressFeedback()

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
                "relative flex cursor-pointer select-none items-center gap-2 text-nowrap rounded-lg py-2 text-sm outline-hidden",
                openInNewTab ? "pe-8 ps-3" : "px-3",
                {
                    focus: "bg-accent/60 text-accent-foreground **:text-accent-foreground dark:bg-accent",
                    "data-inset": "ps-7",
                    "data-disabled": "pointer-events-none opacity-50",
                    "[&_svg]": "pointer-events-none shrink-0",
                    "[&_svg:not([class*='size-'])]": "size-4"
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
            {openInNewTab && (
                <span
                    data-slot="dropdown-menu-link-item-indicator"
                    className="pointer-events-none absolute right-3 flex items-center justify-center"
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
    description,
    checked,
    inset,
    onClick,
    ...props
}: MenuPrimitive.CheckboxItem.Props & {
    inset?: boolean
    description?: React.ReactNode
}) {
    const playPressFeedback = usePressFeedback()

    const Comp = description ? "div" : Fragment

    return (
        <MenuPrimitive.CheckboxItem
            data-slot="dropdown-menu-checkbox-item"
            data-inset={inset}
            data-sound="tick"
            onClick={(e) => {
                playPressFeedback("button")
                onClick?.(e)
            }}
            className={cn(
                "relative flex cursor-pointer select-none items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm outline-hidden",
                !description && "pe-9.5",
                {
                    focus: "bg-accent/60 text-accent-foreground **:text-accent-foreground dark:bg-accent",
                    "data-inset": "ps-7",
                    "data-disabled": "pointer-events-none opacity-50",
                    "[&_svg:not([class*='size-'])]": "size-4",
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
                        className: "flex gap-1.5 pe-9.5 justify-between"
                    })}
                >
                    {children}
                    <MenuPrimitive.CheckboxItemIndicator
                        data-slot="dropdown-menu-checkbox-item-indicator"
                        className={cn(
                            "pointer-events-none absolute right-2 top-2 grid size-5 place-items-center"
                        )}
                    >
                        <CheckIcon />
                    </MenuPrimitive.CheckboxItemIndicator>
                </Comp>
                {description && (
                    <span
                        className="text-xs text-muted-foreground"
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
    inset,
    onClick,
    ...props
}: MenuPrimitive.RadioItem.Props & {
    inset?: boolean
    description?: React.ReactNode
}) {
    const playPressFeedback = usePressFeedback()

    const Comp = description ? "div" : Fragment

    return (
        <MenuPrimitive.RadioItem
            data-slot="dropdown-menu-radio-item"
            data-inset={inset}
            data-sound="tick"
            onClick={(e) => {
                playPressFeedback("button")
                onClick?.(e)
            }}
            className={cn(
                "relative flex cursor-pointer select-none items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm outline-hidden",
                !description && "pe-9.5",
                {
                    focus: "bg-accent/60 text-accent-foreground **:text-accent-foreground dark:bg-accent",
                    "data-inset": "ps-7",
                    "data-disabled": "pointer-events-none opacity-50",
                    "[&_svg:not([class*='size-'])]": "size-4",
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
                        className: "flex gap-1.5 pe-9.5 justify-between"
                    })}
                >
                    {children}
                    <MenuPrimitive.RadioItemIndicator
                        data-slot="dropdown-menu-radio-item-indicator"
                        className={cn(
                            "pointer-events-none absolute right-2 top-2 grid size-5 place-items-center"
                        )}
                    >
                        <CheckIcon />
                    </MenuPrimitive.RadioItemIndicator>
                </Comp>
                {description && (
                    <span
                        className="text-xs text-muted-foreground"
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
                "ml-auto text-xs tracking-widest text-muted-foreground",
                "group-focus/dropdown-menu-item:text-accent-foreground",
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
