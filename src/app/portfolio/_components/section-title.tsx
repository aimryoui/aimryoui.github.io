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
            className={cn("relative bg-background px-6 pb-5 pt-3.5", className)}
        >
            {note && (
                <span
                    id={noteId}
                    className={cn(
                        "absolute -top-10 left-6 font-mono uppercase tracking-normal",
                        noteId &&
                            "scroll-mt-[calc(var(--spacing)*20*2+var(--px)-2.59375rem)]"
                    )}
                >
                    {note}
                </span>
            )}
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
        </div>
    )
}

export default SectionTitle
