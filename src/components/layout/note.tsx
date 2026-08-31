import { Divider } from "@/components/layout/divider"
import { SectionLine } from "@/components/layout/line"
import { Space } from "@/components/layout/space"
import { Highlight } from "@/components/ui/typography"
import { cn } from "@/lib/utils"

interface NoteProps extends React.ComponentProps<typeof Highlight> {
    bold?: boolean
    spaceAround?: boolean
    sectionLineCenter?: boolean
}

function Note({
    className,
    bold = false,
    spaceAround = false,
    sectionLineCenter = false,
    children,
    ...props
}: NoteProps) {
    return (
        <>
            <Space className="h-auto min-h-space">
                <Highlight
                    className={cn(
                        "grid size-full min-h-space place-items-center bg-highlighted/10 px-safe-zone py-safe-zone-vertical text-center leading-6",
                        !bold && "font-wght-400",
                        {
                            "[&_p]": "inline",
                            "[&_strong]": "font-wght-600",

                            "[&_a]": "underline font-wght-600",
                            "[&_a:hover]":
                                "decoration-current decoration-solid",
                            "[&_a:active]":
                                "decoration-current decoration-solid",
                            "[&_a:focus-visible]": "text-highlighted",

                            "[&_code]": [
                                "text-nowrap rounded-lg border border-highlighted/30 bg-highlighted/5 px-1.25 pb-0.5 pt-0.25 text-sm font-[600] corner-superellipse wrap-anywhere dark:font-[400]",
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
                >
                    <span className="w-full">{children}</span>
                </Highlight>
            </Space>
            {spaceAround && (
                <>
                    <SectionLine center={sectionLineCenter} />
                    <Divider />
                    <SectionLine
                        center={sectionLineCenter}
                        containerClassName="z-55"
                    />
                </>
            )}
        </>
    )
}

export type { NoteProps }
export { Note }
