import { H3 } from "@/components/ui/typography"
import { cn } from "@/lib/utils"

function SectionTitle({ title, note }: { title: string; note?: string }) {
    return (
        <div className={cn("bg-background relative px-6 pt-3.5 pb-5")}>
            {note && (
                <span
                    className={cn(`
                    l-6 absolute -top-10.5
                    font-mono tracking-normal uppercase
                `)}
                >
                    {note}
                </span>
            )}
            <H3>{title}</H3>
        </div>
    )
}

export default SectionTitle
