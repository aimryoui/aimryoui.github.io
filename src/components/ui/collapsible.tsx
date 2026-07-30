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

function Collapsible({ className, ...props }: DisclosureProps) {
    return (
        <CollapsiblePrimitive
            data-slot="collapsible"
            className={cn(className)}
            {...props}
        />
    )
}

function CollapsibleTrigger({ className, ...props }: ButtonProps) {
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

function CollapsibleContent({ className, ...props }: DisclosurePanelProps) {
    return (
        <CollapsibleContentPrimitive
            data-slot="collapsible-content"
            className={cn(
                "h-[--disclosure-panel-height] overflow-clip",
                {
                    "motion-safe":
                        "will-change-[height] transition-[height] ease-spring duration-250"
                },
                className
            )}
            {...props}
        />
    )
}

export { Collapsible, CollapsibleContent, CollapsibleTrigger }
