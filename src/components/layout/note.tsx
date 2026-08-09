import { Space } from "@/components/layout/space"
import { Highlight } from "@/components/ui/typography"
import { cn } from "@/lib/utils"

interface NoteProps extends React.ComponentProps<typeof Highlight> {
    bold?: boolean
}

function Note({ className, bold = false, ...props }: NoteProps) {
    return (
        <Space data-cursor="target" className="h-auto min-h-space">
            <Highlight
                className={cn(
                    "grid size-full min-h-space place-items-center bg-highlighted/10 px-safe-zone py-safe-zone-vertical leading-6",
                    !bold && "font-wght-400",
                    {
                        "[&_strong]": "font-wght-600",
                        "[&_code]": [
                            "text-nowrap rounded-lg border border-highlighted/30 bg-highlighted/5 px-1.25 pb-0.75 pt-0.5 text-sm font-[600] corner-superellipse wrap-anywhere dark:font-[400]",
                            {
                                md: "rounded-md text-xs"
                            }
                        ],
                        "has-[code]": "leading-[1.625rem] md:leading-6",

                        md: "leading-5"
                    },
                    className
                )}
                {...props}
            />
        </Space>
    )
}

export type { NoteProps }
export { Note }
