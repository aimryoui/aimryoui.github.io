"use client"

import {
    DisclosurePanel as CollapsibleContentPrimitive,
    Disclosure as CollapsiblePrimitive,
    type DisclosurePanelProps,
    type DisclosureProps
} from "react-aria-components/Disclosure"

import {
    type ButtonProps,
    Button as CollapsibleTriggerPrimitive
} from "@/components/ui/button"
import { cn } from "@/lib/utils"

type CollapsibleProps = DisclosureProps

function Collapsible({ className, ...props }: CollapsibleProps) {
    return (
        <CollapsiblePrimitive
            data-slot="collapsible"
            className={cn(className)}
            {...props}
        />
    )
}

type CollapsibleTriggerProps = ButtonProps

function CollapsibleTrigger({ className, ...props }: CollapsibleTriggerProps) {
    return (
        <CollapsibleTriggerPrimitive
            slot="trigger"
            data-slot="collapsible-trigger"
            nativeButton
            keepFeedback
            className={cn(className)}
            {...props}
        />
    )
}

type CollapsibleContentProps = DisclosurePanelProps

function CollapsibleContent({ className, ...props }: CollapsibleContentProps) {
    return (
        <CollapsibleContentPrimitive
            data-slot="collapsible-content"
            className={cn(
                "h-[--disclosure-panel-height] min-h-0 overflow-clip",
                {
                    "motion-safe":
                        "transition-[height] ease-spring duration-350"
                },
                className
            )}
            {...props}
        />
    )
}

export type {
    CollapsibleContentProps,
    CollapsibleProps,
    CollapsibleTriggerProps
}
export { Collapsible, CollapsibleContent, CollapsibleTrigger }
