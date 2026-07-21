"use client"

import type React from "react"
import { Fragment, useRef } from "react"
import NextLink from "next/link"

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
    const TextComp = isAnchorTag ? "h4" : Fragment

    return (
        <ContainerComp
            id={isAnchorTag ? slugify(sectionName) : undefined}
            className={cn(
                isAnchorTag && "sticky top-3.5 z-50",
                "pointer-events-none grid h-13 place-items-center",
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
                    {formatOrdinals(sectionName)}
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

interface MediaFrameProps extends React.ComponentProps<"div"> {
    sectionName?: string
    author?: string
    lowercase?: boolean
    flex?: boolean
    continuous?: boolean
    targetCursor?: CursorSelector
}

function MediaFrame({
    className,
    sectionName,
    author,
    lowercase,
    flex,
    continuous,
    targetCursor,
    children,
    ...props
}: MediaFrameProps) {
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
                    <SectionLine />
                )}
                <div
                    className={cn(
                        "grid size-inherit place-items-center overflow-clip"
                    )}
                >
                    {sectionName && (
                        <div
                            className={cn(
                                "sticky top-16.5 z-50 flex h-0 items-end justify-center"
                            )}
                        >
                            <SectionName
                                as="div"
                                sectionName={sectionName}
                                author={author}
                                lowercase={lowercase}
                                className={cn(
                                    "static top-0 bg-transparent text-foreground shadow-sm -outline-offset-px outline-stroke outline"
                                )}
                            />
                        </div>
                    )}
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

function MediaFrameContent({
    children,
    targetCursor,
    className,
    ...props
}: MediaFrameProps) {
    return (
        <div
            data-cursor={targetCursor ?? "ignore"}
            className={cn(
                "relative grid w-full cursor-auto grid-cols-1 justify-items-center gap-2 overflow-clip bg-stroke p-2 md:grid-cols-1",
                className
            )}
            {...props}
        >
            <Lightbox>{children}</Lightbox>
        </div>
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

export { JustifiedColumn, MediaFrame, MediaFrameContent }
