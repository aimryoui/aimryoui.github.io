import { H1, H2, H3, H4, Highlight } from "@/components/ui/typography"
import { cn } from "@/lib/utils"

function SectionTitle({
    id,
    order,
    level = 3,
    title,
    note
}: {
    id: string
    order?: number
    level?: 1 | 2 | 3 | 4 | 5 | 6
    title: string
    note?: string
}) {
    const Comp = level === 1 ? H1 : level === 2 ? H2 : level === 3 ? H3 : H4
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
            <Comp id={id}>
                {order && (
                    <Highlight>{String(order).padStart(2, "0")}.</Highlight>
                )}{" "}
                {title}
            </Comp>
        </div>
    )
}

export default SectionTitle
