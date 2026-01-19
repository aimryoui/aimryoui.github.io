import { H3, Highlight } from "@/components/ui/typography"
import { cn } from "@/lib/utils"

function SectionTitle({
    order,
    title,
    note
}: {
    order?: number
    title: string
    note?: string
}) {
    return (
        <div className={cn("bg-background relative px-6 pt-3.5 pb-5")}>
            {note && (
                <span
                    className={cn(`
                    absolute -top-10.5 left-6
                    font-mono tracking-normal uppercase
                `)}
                >
                    {note}
                </span>
            )}
            <H3>
                {order && (
                    <Highlight>{String(order).padStart(2, "0")}.</Highlight>
                )}{" "}
                {title}
            </H3>
        </div>
    )
}

export default SectionTitle
