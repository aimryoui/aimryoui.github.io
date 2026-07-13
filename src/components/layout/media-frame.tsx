"use client"

import React from "react"
import NextLink from "next/link"

import { Divider } from "@/components/layout/divider"
import { SectionLine } from "@/components/layout/line"
import { Lightbox } from "@/components/ui/lightbox"
import { Highlight } from "@/components/ui/typography"
import { formatOrdinal } from "@/helpers/format-ordinal"
import { slugify } from "@/helpers/slugify"
import { cn } from "@/lib/utils"

interface SectionNameProps extends React.ComponentProps<"div"> {
    as?: React.ElementType
    sectionName: string
    author?: string
    lowercase?: boolean
    containerClassName?: string
}

export function SectionName({
    as = NextLink,
    lowercase = false,
    sectionName,
    author,
    className,
    containerClassName,
    ...props
}: SectionNameProps) {
    const isAnchorTag = as === NextLink

    const Comp = as
    const ContainerComp = isAnchorTag ? "figcaption" : "div"
    const TextComp = isAnchorTag ? "h4" : React.Fragment

    return (
        <ContainerComp
            id={isAnchorTag ? slugify(sectionName) : undefined}
            className={cn(
                isAnchorTag && "sticky top-3.5 z-30",
                "pointer-events-none grid h-13 place-items-center",
                containerClassName
            )}
            {...props}
        >
            <Comp
                aria-hidden={isAnchorTag ? undefined : "true"}
                href={isAnchorTag ? `#${slugify(sectionName)}` : undefined}
                {...(isAnchorTag && {
                    "data-cursor": "ignore"
                })}
                className={cn(
                    isAnchorTag &&
                        "pointer-events-auto hover:underline hover:decoration-foreground",
                    "mx-4 text-pretty rounded-full bg-background px-3.5 py-1.5 text-center font-mono",
                    !lowercase && "uppercase",
                    {
                        md: "py-2 text-sm"
                    },
                    className
                )}
            >
                <TextComp
                    {...(isAnchorTag && {
                        className: "inline cursor-pointer"
                    })}
                >
                    {formatOrdinal(sectionName)}
                </TextComp>{" "}
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
                        data-cursor="ignore"
                        className={cn(
                            "relative grid w-full cursor-default grid-cols-1 justify-items-center gap-2 overflow-clip bg-stroke p-2 md:grid-cols-1",
                            className
                        )}
                    >
                        <Lightbox>{children}</Lightbox>
                    </div>
                </div>
            </figure>
            <SectionLine />
            <Divider />
            <SectionLine />
        </>
    )
}

export { MediaFrame }
