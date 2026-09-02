"use client"

import { Fragment, useMemo, useRef } from "react"

import { type PhotoSwipeOptions } from "photoswipe"
import { usePress } from "react-aria"

import { Divider } from "@/components/layout/divider"
import { SectionLine } from "@/components/layout/line"
import { useDirection } from "@/components/ui/direction"
import { Lightbox } from "@/components/ui/lightbox"
import { Highlight } from "@/components/ui/typography"
import {
    RTL_CHAR_REGEX,
    TRAILING_PUNCTUATION_REGEX
} from "@/helpers/character-regexes"
import { formatOrdinals } from "@/helpers/format-ordinals"
import { slugify } from "@/helpers/slugify"
import { useIsomorphicLayoutEffect } from "@/hooks/use-isomorphic-layout-effect"
import { usePressFeedback } from "@/hooks/use-press-feedback"
import { cn } from "@/lib/utils"

interface SectionNameProps extends React.ComponentProps<"div"> {
    as?: React.ElementType
    sectionName: string
    author?: string
    normalcase?: boolean
    hasSocialLinks?: boolean
    containerClassName?: string
}

function SectionName({
    as = "a",
    normalcase = false,
    sectionName,
    author,
    hasSocialLinks = false,
    className,
    containerClassName,
    ...props
}: SectionNameProps) {
    const isAnchorTag = as === "a"

    const Comp = as
    const TextComp = isAnchorTag ? "h3" : Fragment

    const playPressFeedback = usePressFeedback()
    const direction = useDirection()

    const isRTLText = RTL_CHAR_REGEX.test(sectionName)
    const hasTrailingPunctuation = TRAILING_PUNCTUATION_REGEX.test(sectionName)

    const isDirectionClashing =
        hasTrailingPunctuation
        && ((direction === "rtl" && !isRTLText)
            || (direction === "ltr" && isRTLText))

    let { pressProps } = usePress({
        onPress: () => {
            playPressFeedback("link")
        }
    })

    return (
        <div
            className={cn(
                isAnchorTag && "sticky top-3 z-50 md:top-1",
                "pointer-events-none grid min-h-14 place-items-center py-2.5",
                containerClassName
            )}
            {...props}
        >
            <Comp
                aria-hidden={isAnchorTag ? undefined : "true"}
                {...(isAnchorTag && {
                    ...pressProps,
                    href: `#${slugify(sectionName)}`,
                    draggable: false,
                    "data-cursor": "ignore",
                    "data-sound": "tick"
                })}
                className={cn(
                    isAnchorTag && [
                        "pointer-events-auto",
                        {
                            hover: "underline decoration-foreground",
                            active: "underline decoration-foreground decoration-solid",
                            "focus-visible":
                                "text-highlighted underline decoration-highlighted decoration-solid"
                        }
                    ],
                    "min-h-9 text-pretty rounded-full bg-background px-3.5 py-2 text-center font-mono text-base",
                    hasSocialLinks ? "mx-17 lg:mx-2" : "mx-2",
                    !normalcase && "uppercase",
                    {
                        md: "text-sm"
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
                    {isDirectionClashing && (isRTLText ? "\u200F" : "\u200E")}
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
    widthFit?: boolean
}

function MediaFrameContent({
    className,
    showHideAnimationType = "zoom",
    widthFit = false,
    children,
    ...props
}: MediaFrameContentProps & {
    showHideAnimationType?: PhotoSwipeOptions["showHideAnimationType"]
}) {
    const options = useMemo(
        () => ({ showHideAnimationType }),
        [showHideAnimationType]
    )

    return (
        <div
            data-cursor="ignore"
            className={cn(
                "relative grid cursor-auto grid-cols-1 justify-items-center gap-2 overflow-clip bg-stroke p-2 md:grid-cols-1",
                widthFit ? "w-fit md:w-full" : "w-full",
                className
            )}
            {...props}
        >
            <Lightbox options={options}>{children}</Lightbox>
        </div>
    )
}

type MediaFrameProps = MediaFrameContentProps
    & Partial<Omit<SectionNameProps, "as" | "containerClassName">> & {
        flex?: boolean
        continuous?: boolean
        spaceAround?: boolean
    }

function MediaFrame({
    className,
    sectionName,
    author,
    normalcase,
    flex,
    continuous,
    hasSocialLinks,
    spaceAround = true,
    children,
    ...props
}: MediaFrameProps) {
    return (
        <>
            <figure
                data-slot="media-frame"
                id={sectionName ? slugify(sectionName) : undefined}
                className={cn(
                    "grid w-full scroll-mt-safe-zone grid-cols-1 bg-background",
                    flex && "h-full flex-1"
                )}
            >
                {sectionName ? (
                    <>
                        <figcaption
                            data-slot="media-frame-caption"
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
                                // Hide from browser Ctrl+F
                                inert
                                sectionName={sectionName}
                                author={author}
                                normalcase={normalcase}
                                hasSocialLinks={hasSocialLinks}
                                containerClassName="sticky top-3.5 !z-10 md:top-1.5"
                                className={cn(
                                    "select-none bg-transparent text-transparent shadow-sm outline-default/15 outline"
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
                            <SectionLine center />
                        </div>
                    </>
                ) : (
                    <div
                        className={cn(
                            "z-20 col-start-1 row-start-1 flex h-0 flex-col justify-end bg-background"
                        )}
                    >
                        <SectionLine fit />
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
                        <MediaFrameContent className={cn(className)} {...props}>
                            {children}
                        </MediaFrameContent>
                    )}
                </div>
            </figure>
            {spaceAround && (
                <>
                    <SectionLine
                        center
                        containerClassName="nth-last-3:hidden"
                    />
                    <Divider className="nth-last-2:hidden" />
                    <SectionLine center containerClassName="z-55 last:hidden" />
                </>
            )}
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
                        el.style.setProperty(
                            "--flex-ratio",
                            (x * 100).toFixed(5)
                        )
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
                flex: "var(--flex-ratio, 100) 1 0%",
                ...style
            }}
            {...props}
        >
            {children}
        </div>
    )
}

export type { MediaFrameProps }
export { JustifiedColumn, MediaFrame, MediaFrameContent, SectionName }
