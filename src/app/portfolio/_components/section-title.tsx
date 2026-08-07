import { ViewTransition } from "react"

import { H2, Highlight } from "@/components/ui/typography"
import { formatViewTransitionName } from "@/helpers/format-view-transition-name"
import { cn } from "@/lib/utils"

function SectionTitle({
    className,
    noteClassName,
    id,
    noteId,
    order,
    title,
    note
}: React.ComponentProps<"div"> & {
    noteClassName?: string
    id: string
    noteId?: string
    order?: number
    title: string
    note?: string
}) {
    return (
        <div
            className={cn(
                "flex min-h-space items-center bg-background px-safe-zone py-[calc(var(--spacing-safe-zone)-var(--spacing)/2)]",
                className
            )}
        >
            {note && (
                <span
                    id={noteId}
                    className={cn(
                        "absolute bottom-full left-0 max-w-[calc(100%-var(--spacing-safe-zone)*2)] px-safe-zone pb-4 font-mono uppercase leading-normal",
                        noteId &&
                            "scroll-mt-[calc(var(--spacing-space)*2-1rem-1em*1.5)] md:scroll-mt-[calc(var(--spacing-space)*2-.75rem-1.25rem)]",
                        {
                            md: "pb-3 text-sm"
                        },
                        noteClassName
                    )}
                >
                    {note}
                </span>
            )}
            <Title id={id} order={order} title={title} />
        </div>
    )
}

function Title({
    id,
    order,
    title
}: {
    id: string
    order?: number
    title: string
}) {
    return (
        <ViewTransition
            name={formatViewTransitionName(`overall-category-${title}`)}
        >
            <H2
                id={id}
                className={cn(
                    "w-fit text-foreground wrap-anywhere transition-[color] duration-100",
                    {
                        "motion-safe": [
                            "will-change-[font-variation-settings] transition-[color,font-variation-settings] ease-spring duration-500",
                            {
                                "group-hover":
                                    "transition-[font-variation-settings]"
                            }
                        ],
                        "group-hover": "text-highlighted transition-none",
                        "group-active": "text-highlighted transition-none"
                    }
                )}
            >
                {order && (
                    <Highlight>{String(order).padStart(2, "0")}.</Highlight>
                )}{" "}
                {title}.
            </H2>
        </ViewTransition>
    )
}

export default SectionTitle
