"use client"

import type React from "react"
import { Fragment, useRef } from "react"
import NextLink from "next/link"

import { type PhotoSwipeOptions } from "photoswipe"

import { type CursorSelector } from "@/components/animations/target-cursor"
import { Divider } from "@/components/layout/divider"
import { SectionLine } from "@/components/layout/line"
import { Lightbox } from "@/components/ui/lightbox"
import { Highlight } from "@/components/ui/typography"
import { formatOrdinals } from "@/helpers/format-ordinals"
import { slugify } from "@/helpers/slugify"
import { useIsomorphicLayoutEffect } from "@/hooks/use-isomorphic-layout-effect"
import { cn } from "@/lib/utils"

interface SectionNameProps extends React.ComponentProps<"div"> {
    as?: React.ElementType
    sectionName: string
    author?: string
    normalcase?: boolean
    hasSocialLinks?: boolean
    containerClassName?: string
}

export function SectionName({
    as = NextLink,
    normalcase = false,
    sectionName,
    author,
    hasSocialLinks = false,
    className,
    containerClassName,
    ...props
}: SectionNameProps) {
    const isAnchorTag = as === NextLink

    const Comp = as
    const TextComp = isAnchorTag ? "h4" : Fragment

    return (
        <div
            id={isAnchorTag ? slugify(sectionName) : undefined}
            className={cn(
                isAnchorTag && "sticky top-3.5 z-50",
                "pointer-events-none grid min-h-13 place-items-center py-2",
                containerClassName
            )}
            {...props}
        >
            <Comp
                aria-hidden={isAnchorTag ? undefined : "true"}
                {...(isAnchorTag && {
                    href: `#${slugify(sectionName)}`,
                    draggable: false
                })}
                {...(isAnchorTag && {
                    "data-cursor": "ignore"
                })}
                className={cn(
                    isAnchorTag &&
                        "pointer-events-auto hover:underline hover:decoration-foreground",
                    "text-pretty rounded-full bg-background px-3.5 py-1.5 text-center font-mono",
                    hasSocialLinks ? "mx-17 lg:mx-4" : "mx-4",
                    !normalcase && "uppercase",
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
                    {formatOrdinals(sectionName)}
                </TextComp>{" "}
                {author && (
                    <Highlight className="font-mono normal-case" italic>
                        ({author})
                    </Highlight>
                )}
            </Comp>
        </div>
    )
}

interface MediaFrameContentProps extends React.ComponentProps<"div"> {
    targetCursor?: CursorSelector
}

function MediaFrameContent({
    className,
    targetCursor,
    showHideAnimationType = "zoom",
    children,
    ...props
}: MediaFrameContentProps & {
    showHideAnimationType?: PhotoSwipeOptions["showHideAnimationType"]
}) {
    return (
        <div
            data-cursor={targetCursor ?? "ignore"}
            className={cn(
                "relative grid w-full cursor-auto grid-cols-1 justify-items-center gap-2 overflow-clip bg-stroke p-2 md:grid-cols-1",
                className
            )}
            {...props}
        >
            <Lightbox options={{ showHideAnimationType }}>{children}</Lightbox>
        </div>
    )
}

interface MediaFrameProps extends MediaFrameContentProps {
    sectionName?: string
    author?: string
    normalcase?: boolean
    flex?: boolean
    continuous?: boolean
    hasSocialLinks?: SectionNameProps["hasSocialLinks"]
}

function MediaFrame({
    className,
    sectionName,
    author,
    normalcase,
    flex,
    continuous,
    hasSocialLinks,
    targetCursor,
    children,
    ...props
}: MediaFrameProps) {
    return (
        <>
            <figure
                className={cn(
                    "grid w-full grid-cols-1 bg-background",
                    flex && "h-full flex-1"
                )}
            >
                {sectionName ? (
                    <>
                        <figcaption
                            className={cn(
                                "pointer-events-none z-30 col-start-1 row-span-2 row-start-1 flex flex-col"
                            )}
                        >
                            <SectionName
                                sectionName={sectionName}
                                author={author}
                                normalcase={normalcase}
                                hasSocialLinks={hasSocialLinks}
                                containerClassName="!z-30"
                                className={cn("bg-background text-foreground")}
                            />
                        </figcaption>

                        <div
                            aria-hidden={true}
                            role="presentation"
                            className={cn(
                                "pointer-events-none z-10 col-start-1 row-span-2 row-start-1 flex flex-col"
                            )}
                        >
                            <SectionName
                                as="div"
                                sectionName={sectionName}
                                author={author}
                                normalcase={normalcase}
                                hasSocialLinks={hasSocialLinks}
                                containerClassName="sticky top-3.5 !z-10"
                                className={cn(
                                    "bg-transparent text-transparent shadow-sm outline-default/15 outline"
                                )}
                            />
                        </div>

                        <div
                            aria-hidden={true}
                            role="presentation"
                            className={cn(
                                "pointer-events-none z-20 col-start-1 row-start-1 flex flex-col bg-background"
                            )}
                        >
                            <SectionName
                                as="div"
                                sectionName={sectionName}
                                author={author}
                                normalcase={normalcase}
                                hasSocialLinks={hasSocialLinks}
                                className="invisible"
                            />
                            <SectionLine />
                        </div>
                    </>
                ) : (
                    <div
                        className={cn(
                            "z-20 col-start-1 row-start-1 flex h-0 flex-col justify-end bg-background"
                        )}
                    >
                        <SectionLine />
                    </div>
                )}

                <div
                    className={cn(
                        "z-0 col-start-1 grid place-items-center overflow-clip",
                        sectionName ? "row-start-2" : "row-start-1"
                    )}
                >
                    {continuous ? (
                        children
                    ) : (
                        <MediaFrameContent
                            targetCursor={targetCursor}
                            className={cn(className)}
                            {...props}
                        >
                            {children}
                        </MediaFrameContent>
                    )}
                </div>
            </figure>
            <SectionLine />
            <Divider />
            <SectionLine />
        </>
    )
}

function JustifiedColumn({
    children,
    className,
    style,
    ...props
}: React.ComponentProps<"div">) {
    const ref = useRef<HTMLDivElement>(null)

    useIsomorphicLayoutEffect(() => {
        const el = ref.current
        if (!el) return

        let currentRatio = 0.5

        const updateRatio = () => {
            const firstChild = el.firstElementChild
            const lastChild = el.lastElementChild

            if (firstChild && lastChild) {
                const firstRect = firstChild.getBoundingClientRect()
                const lastRect = lastChild.getBoundingClientRect()
                const intrinsicHeight = lastRect.bottom - firstRect.top
                const width = el.getBoundingClientRect().width

                if (intrinsicHeight > 0) {
                    const x = width / intrinsicHeight

                    if (Math.abs(currentRatio - x) > 0.0001) {
                        currentRatio = x
                        el.style.setProperty("--flex-ratio", x.toFixed(5))
                    }
                }
            }
        }

        updateRatio()

        const observer = new ResizeObserver(() => {
            requestAnimationFrame(updateRatio)
        })

        observer.observe(el)

        const childrenList = Array.from(el.children)
        for (const child of childrenList) {
            observer.observe(child)
        }

        return () => {
            observer.disconnect()
        }
    }, [])

    return (
        <div
            ref={ref}
            className={cn("flex flex-col", className)}
            style={{
                flex: "var(--flex-ratio, 1) 1 0%",
                ...style
            }}
            {...props}
        >
            {children}
        </div>
    )
}

export type { MediaFrameProps }
export { JustifiedColumn, MediaFrame, MediaFrameContent }
