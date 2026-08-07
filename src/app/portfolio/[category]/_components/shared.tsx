import { Bold, Text } from "@/components/ui/typography"
import { cn } from "@/lib/utils"

function BoldPart({ className, ...props }: React.ComponentProps<typeof Bold>) {
    return (
        <Bold
            className={cn(
                "wrap-anywhere transition-[color] duration-100",
                {
                    "motion-preferred": [
                        "will-change-[font-variation-settings] transition-[color,font-variation-settings] ease-spring duration-500",
                        {
                            "group-hover":
                                "transition-[font-variation-settings]"
                        }
                    ],
                    "group-hover": "text-highlighted transition-none",
                    "group-active": "text-highlighted transition-none"
                },
                className
            )}
            {...props}
        />
    )
}

function TextPart({
    className,
    secodary = false,
    ...props
}: React.ComponentProps<typeof Text> & { secodary?: boolean }) {
    return (
        <Text
            className={cn(
                secodary ? "text-sm" : "inline",
                "wrap-anywhere transition-[color] duration-100",
                {
                    "group-hover": "text-foreground transition-none",
                    "group-active": "text-foreground transition-none",
                    sm: "text-xs"
                },
                className
            )}
            {...props}
        />
    )
}

export { BoldPart, TextPart }
