import { H2, Highlight } from "@/components/ui/typography"
import { cn } from "@/lib/utils"

function SectionTitle({
    id,
    order,
    title,
    note
}: {
    id: string
    order?: number
    title: string
    note?: string
}) {
    return (
        <div className={cn("relative bg-background px-6 pb-5 pt-3.5")}>
            {note && (
                <span
                    className={cn(
                        "absolute -top-10 left-6 font-mono uppercase tracking-normal"
                    )}
                >
                    {note}
                </span>
            )}
            <H2 id={id}>
                {order && (
                    <Highlight>{String(order).padStart(2, "0")}.</Highlight>
                )}{" "}
                {title}.
            </H2>
        </div>
    )
}

export default SectionTitle
