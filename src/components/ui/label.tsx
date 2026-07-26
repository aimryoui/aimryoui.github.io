"use client"

import {
    LabelContext,
    Label as LabelPrimitive,
    type LabelProps
} from "react-aria-components/Label"

import { cn } from "@/lib/utils"

function Label({ className, htmlFor, slot, ...props }: LabelProps) {
    const label = (
        <LabelPrimitive
            data-slot="label"
            className={cn(
                "flex select-none items-center gap-2 text-sm leading-none font-wght-600",
                {
                    "peer-disabled": "cursor-not-allowed opacity-50",
                    "group-data-[disabled=true]":
                        "pointer-events-none opacity-50",
                    "peer-data-disabled": "opacity-50"
                },
                className
            )}
            {...props}
            htmlFor={htmlFor}
            slot={slot}
        />
    )

    if (htmlFor && slot === undefined) {
        return (
            <LabelContext.Provider value={null}>{label}</LabelContext.Provider>
        )
    }

    return label
}

export { Label }
