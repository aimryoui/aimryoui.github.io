"use client"

import { createContext, useContext } from "react"

import { ChevronDown } from "lucide-react"
import {
    DisclosurePanel as AccordionContentPrimitive,
    Heading as AccordionHeaderPrimitive,
    Disclosure as AccordionItemPrimitive,
    type DisclosurePanelProps,
    type DisclosureProps
} from "react-aria-components/Disclosure"
import {
    DisclosureGroup as AccordionPrimitive,
    type DisclosureGroupProps,
    type Key
} from "react-aria-components/DisclosureGroup"

import {
    Button as AccordionTriggerPrimitive,
    type ButtonProps
} from "@/components/ui/button"
import { Bold } from "@/components/ui/typography"
import { usePreference } from "@/hooks/use-preference"
import { cn } from "@/lib/utils"

const AccordionItemContext = createContext(false)

type AccordionProps = DisclosureGroupProps

function Accordion({ className, ...props }: AccordionProps) {
    return (
        <AccordionPrimitive
            data-slot="accordion"
            className={cn("flex w-full flex-col", className)}
            {...props}
        />
    )
}

type AccordionItemProps = DisclosureProps

function AccordionItem({ className, ...props }: AccordionItemProps) {
    return (
        <AccordionItemPrimitive
            data-slot="accordion-item"
            className={cn("group/accordion-item", className)}
            {...props}
        >
            {(renderProps) => (
                <AccordionItemContext.Provider value={renderProps.isExpanded}>
                    {typeof props.children === "function"
                        ? props.children(renderProps)
                        : props.children}
                </AccordionItemContext.Provider>
            )}
        </AccordionItemPrimitive>
    )
}

type AccordionTriggerProps = ButtonProps

function AccordionTrigger({
    className,
    children,
    pressSound,
    ...props
}: Omit<ButtonProps, "children"> & { children: React.ReactNode }) {
    const isExpanded = useContext(AccordionItemContext)
    const { motionReduced } = usePreference()

    return (
        <AccordionHeaderPrimitive className="flex">
            <AccordionTriggerPrimitive
                slot="trigger"
                data-slot="accordion-trigger"
                nativeButton
                keepFeedback
                pressSound={
                    pressSound
                    ?? (motionReduced
                        ? "button"
                        : isExpanded
                          ? "zoom-out"
                          : "zoom-in")
                }
                className={cn(
                    "group/accordion-trigger relative flex flex-1 items-start justify-between py-2.5 text-left font-wght-600",
                    {
                        disabled: "pointer-events-none opacity-50"
                    },
                    className
                )}
                {...props}
            >
                <Bold
                    className={cn(
                        "leading-normal text-muted-foreground transition-[color] duration-100",
                        {
                            "group-hover/accordion-trigger":
                                "text-foreground transition-none",
                            "group-active/accordion-trigger":
                                "text-foreground transition-none",
                            "group-focus-visible/accordion-trigger":
                                "text-foreground transition-none",
                            "group-data-expanded/accordion-item":
                                "text-foreground transition-none"
                        }
                    )}
                >
                    {children}
                </Bold>
                <div
                    data-slot="accordion-trigger-icon"
                    className={cn(
                        "grid size-6 place-items-center rounded-full bg-foreground/40 text-inverted transition-[transform,translate] duration-100",
                        {
                            dark: "bg-foreground/60",
                            rtl: "-scale-y-100",
                            "group-hover/accordion-trigger":
                                "bg-foreground/35 dark:bg-foreground/55",
                            "group-active/accordion-trigger":
                                "motion-preferred:translate-y-0.5",
                            "group-focus-visible/accordion-trigger":
                                "bg-foreground/35 dark:bg-foreground/55",
                            "group-data-expanded/accordion-item": [
                                "bg-foreground/15 text-muted-foreground",
                                {
                                    dark: "bg-foreground/20",
                                    "group-hover/accordion-trigger":
                                        "bg-foreground/25 text-foreground dark:bg-foreground/30",
                                    "group-focus-visible/accordion-trigger":
                                        "bg-foreground/25 text-foreground dark:bg-foreground/30"
                                }
                            ]
                        }
                    )}
                >
                    <ChevronDown
                        className={cn("size-5 translate-y-[.5px]", {
                            "motion-preferred":
                                "transition-transform duration-350",
                            rtl: "-translate-y-[.5px] rotate-180",
                            "group-not-data-expanded/accordion-item": [
                                "translate-x-[.5px] translate-y-0 -rotate-90 dark:stroke-2.5",
                                {
                                    rtl: "-translate-x-[.5px] rotate-90"
                                }
                            ]
                        })}
                    />
                </div>
            </AccordionTriggerPrimitive>
        </AccordionHeaderPrimitive>
    )
}

type AccordionContentProps = DisclosurePanelProps

function AccordionContent({
    className,
    children,
    ...props
}: AccordionContentProps) {
    return (
        <AccordionContentPrimitive
            data-slot="accordion-content"
            className={cn(
                "h-[--disclosure-panel-height] min-h-0 overflow-clip",
                {
                    "motion-preferred":
                        "transition-[height] ease-spring duration-400"
                }
            )}
            {...props}
        >
            <div
                className={cn(
                    "space-y-1.5 text-pretty px-safe-zone py-safe-zone-vertical",
                    {
                        "[&_a]":
                            "underline underline-offset-3 hover:text-foreground"
                    },
                    className
                )}
            >
                {children}
            </div>
        </AccordionContentPrimitive>
    )
}

export type {
    AccordionContentProps,
    AccordionItemProps,
    AccordionProps,
    AccordionTriggerProps,
    Key
}
export { Accordion, AccordionContent, AccordionItem, AccordionTrigger }
