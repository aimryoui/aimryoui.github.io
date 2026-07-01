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
            className={cn("relative bg-background px-6 pb-4.5 pt-4", className)}
        >
            {note && (
                <span
                    id={noteId}
                    className={cn(
                        "absolute inset-x-6 bottom-22 font-mono uppercase tracking-normal",
                        noteId &&
                            "scroll-mt-[calc(var(--spacing)*20*2+var(--px)-2.59375rem)]"
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
                    "w-fit text-foreground will-change-[color] transition-[color] duration-100",
                    {
                        "group-hover": "text-highlighted transition-none"
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
