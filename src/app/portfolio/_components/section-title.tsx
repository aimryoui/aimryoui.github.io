import { ViewTransition } from "react"

import { H2, Highlight } from "@/components/ui/typography"
import { formatViewTransitionName } from "@/helpers/format-view-transition-name"
import { cn } from "@/lib/utils"

function SectionTitle({
    className,
    id,
    noteId,
    order,
    title,
    note
}: React.ComponentProps<"div"> & {
    id: string
    noteId?: string
    order?: number
    title: string
    note?: string
}) {
    return (
        <div
            className={cn(
                "relative flex min-h-20 items-center bg-background px-6",
                className
            )}
        >
            {note && (
                <span
                    id={noteId}
                    className={cn(
                        "absolute inset-x-6 bottom-[calc(100%+1rem)] w-fit max-w-full font-mono uppercase leading-normal",
                        noteId && "scroll-mt-[calc(var(--spacing)*20*2-2.5rem)]"
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
                    "w-fit text-foreground will-change-[font-variation-settings] transition-[color,font-variation-settings] ease-spring duration-500",
                    {
                        "group-hover":
                            "text-highlighted font-wght-900 transition-[font-variation-settings]",
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
