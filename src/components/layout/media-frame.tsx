"use client"

import { SectionLine } from "@/components/layout/line"
import { Lightbox } from "@/components/ui/lightbox"
import { Highlight } from "@/components/ui/typography"
import { formatOrdinal } from "@/helpers/format-ordinal"
import { cn } from "@/lib/utils"

interface SectionNameProps extends React.ComponentProps<"div"> {
    as?: React.ElementType
    sectionName: string
    author?: string
    lowercase?: boolean
    containerClassName?: string
}

export function SectionName({
    as = "h4",
    lowercase = false,
    sectionName,
    author,
    className,
    containerClassName,
    ...props
}: SectionNameProps) {
    const Comp = as
    const ContainerComp = as === "h4" ? "figcaption" : "div"
    return (
        <ContainerComp
            className={cn(
                as === "h4" && "pointer-events-none sticky top-3.5 z-30",
                "grid h-13 place-items-center",
                containerClassName
            )}
            {...props}
        >
            <Comp
                aria-hidden={as === "h4" ? undefined : "true"}
                className={cn(
                    "pointer-events-auto mx-4 text-pretty rounded-full bg-background px-3.5 py-1.5 text-center font-mono",
                    !lowercase && "uppercase",
                    {
                        md: "py-2 text-sm"
                    },
                    className
                )}
            >
                {formatOrdinal(sectionName)}{" "}
                {author && (
                    <Highlight className="font-mono normal-case" italic>
                        ({author})
                    </Highlight>
                )}
            </Comp>
        </ContainerComp>
    )
}

function MediaFrame({
    sectionName,
    author,
    lowercase,
    flex,
    continuous,
    className,
    children
}: {
    sectionName?: string
    author?: string
    lowercase?: boolean
    flex?: boolean
    continuous?: boolean
    className?: string
    children: React.ReactNode
}) {
    return (
        <>
            {sectionName && <SectionLine />}
            <figure
                className={cn("w-full bg-background", flex && "h-full flex-1")}
            >
                {sectionName ? (
                    <>
                        <SectionName
                            sectionName={sectionName}
                            author={author}
                            lowercase={lowercase}
                        />
                        <SectionLine />
                    </>
                ) : (
                    !continuous && <SectionLine />
                )}
                <div
                    className={cn(
                        "grid size-inherit place-items-center overflow-clip"
                    )}
                >
                    {sectionName && (
                        <div
                            className={cn(
                                "sticky top-16.5 z-30 flex h-0 items-end justify-center"
                            )}
                        >
                            <SectionName
                                as="div"
                                sectionName={sectionName}
                                author={author}
                                lowercase={lowercase}
                                className={cn(
                                    "bg-transparent text-foreground shadow-sm -outline-offset-px outline-stroke outline"
                                )}
                            />
                        </div>
                    )}
                    <div
                        className={cn(
                            "relative grid w-full grid-cols-1 justify-items-center gap-2 overflow-clip bg-stroke p-2 md:grid-cols-1",
                            className
                        )}
                    >
                        <Lightbox>{children}</Lightbox>
                    </div>
                </div>
            </figure>
        </>
    )
}

export { MediaFrame }
