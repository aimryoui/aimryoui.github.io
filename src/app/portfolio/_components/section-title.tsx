"use client"

import { usePathname } from "next/navigation"

import { sendGAEvent } from "@next/third-parties/google"
import { type PressEvent, usePress } from "react-aria"

import { ViewTransition } from "@/components/animations/view-transition"
import { ArrowRight } from "@/components/icons/icons"
import { SectionLine, type SectionLineProps } from "@/components/layout/line"
import { Link, type LinkProps } from "@/components/ui/link"
import { H1, H2, H3, H4, Highlight } from "@/components/ui/typography"
import {
    TRAILING_MEDIA_FILE_EXTENSIONS_REGEX,
    TRAILING_PUNCTUATION_REGEX
} from "@/helpers/character-regexes"
import { formatViewTransitionName } from "@/helpers/format-view-transition-name"
import { usePressFeedback } from "@/hooks/use-press-feedback"
import { getCategoryPath } from "@/lib/project-sort"
import { cn } from "@/lib/utils"
import { useFlashStore } from "@/portfolio/_components/flash-overlay"

type SectionTitleProps = React.ComponentProps<"div">
    & React.ComponentProps<"a">
    & LinkProps & {
        link?: "route" | "hash"
        sticky?: boolean
        titleClassName?: string
        titleContainerClassName?: string
        noteClassName?: string
        id: string
        order?: number
        titleId?: string
        headingLevel?: "1" | "2" | "3" | "4"
        noteId?: string
        title: string
        note?: string
        sectionLineFit?: SectionLineProps["fit"]
        sectionLineCenter?: SectionLineProps["center"]
    }

function SectionTitle({
    className,
    sticky = true,
    link,
    titleClassName,
    titleContainerClassName,
    noteClassName,
    id,
    order,
    titleId,
    headingLevel = "2",
    noteId,
    title,
    note,
    sectionLineFit = false,
    sectionLineCenter = false,
    onPress,
    ...props
}: SectionTitleProps) {
    const pathname = usePathname()
    const playPressFeedback = usePressFeedback()

    const ContainerComp: React.ElementType =
        link === "route" ? Link : link === "hash" ? "a" : "div"

    const NoteComp: React.ElementType = headingLevel === "1" ? "h2" : "span"

    const handlePress = (e: PressEvent) => {
        if (link) {
            const eventName =
                link === "route" ? "navigate_category" : "navigate_hash"
            const eventParams = {
                category_id: id,
                category_title: title
            }
            sendGAEvent("event", eventName, eventParams)

            const targetPath =
                link === "route" ? getCategoryPath(id) : "/portfolio"
            if (targetPath === pathname) {
                useFlashStore.getState().triggerFlash()
            }
        }
        onPress?.(e)
    }

    let { pressProps } = usePress({
        onPress: (e) => {
            playPressFeedback("link")
            handlePress(e)
        }
    })

    return (
        <ContainerComp
            {...(titleId && {
                id: titleId
            })}
            {...(link && {
                href: link === "route" ? getCategoryPath(id) : `#${id}`
            })}
            {...(link === "route" && {
                hoverSound: "button",
                pressSound: "button",
                prefetch: false,
                onPress: handlePress
            })}
            data-cursor={link === "route" ? "target" : "ignore"}
            {...(link === "hash" && {
                ...pressProps,
                "data-sound": "tick"
            })}
            className={cn(
                "group flex min-h-space flex-col items-center text-pretty bg-background",
                sticky && "sticky top-0 z-50",
                className
            )}
            {...props}
        >
            {note && (
                <NoteComp
                    id={noteId}
                    className={cn(
                        "absolute bottom-full start-0 max-w-[calc(100%-var(--spacing-safe-zone)*2)] px-safe-zone pb-4 font-mono uppercase leading-normal",
                        noteId
                            && "scroll-mt-[calc(var(--spacing-space)*2-var(--spacing)*4-1em*1.5)] md:scroll-mt-[calc(var(--spacing-space)*2-var(--spacing)*3-1.25rem)]",
                        {
                            md: "pb-3 text-sm"
                        },
                        noteClassName
                    )}
                >
                    {note}
                </NoteComp>
            )}
            <div
                className={cn(
                    "flex w-full justify-between gap-4 px-safe-zone py-[calc(var(--spacing-safe-zone)-var(--spacing)/2)]",
                    link && [
                        "transition-[background-color] duration-100",
                        link === "route"
                            ? [
                                  "items-center",
                                  {
                                      "group-hover":
                                          "bg-highlighted/5 transition-none",
                                      "group-active":
                                          "bg-highlighted/10 transition-none"
                                  }
                              ]
                            : {
                                  "group-hover":
                                      "bg-element-hover transition-none",
                                  "group-active": "bg-muted transition-none"
                              }
                    ],
                    titleContainerClassName
                )}
            >
                <Title
                    headingLevel={headingLevel}
                    title={title}
                    order={order}
                    link={link}
                    className={titleClassName}
                />
                {link === "route" ? (
                    <ArrowRight
                        className={cn("z-1 transition-[color] duration-100", {
                            rtl: "rotate-180",
                            "group-hover": "text-highlighted transition-none",
                            "group-active": "text-highlighted transition-none"
                        })}
                    />
                ) : (
                    link === "hash" && (
                        <span
                            aria-hidden={true}
                            className={cn(
                                "pointer-events-none text-xl leading-9 text-muted-foreground",
                                {
                                    "group-hover": "text-foreground"
                                }
                            )}
                        >
                            #
                        </span>
                    )
                )}
            </div>
            <SectionLine
                fit={sectionLineFit}
                center={sectionLineCenter}
                containerClassName="sticky top-space"
            />
        </ContainerComp>
    )
}

function Title({
    className,
    headingLevel = "2",
    order,
    title,
    link
}: {
    className?: SectionTitleProps["titleClassName"]
    headingLevel?: SectionTitleProps["headingLevel"]
    order?: number
    title: SectionTitleProps["title"]
    link?: SectionTitleProps["link"]
}) {
    const Comp =
        headingLevel === "1"
            ? H1
            : headingLevel === "2"
              ? H2
              : headingLevel === "3"
                ? H3
                : H4

    const hasTrailingPunctuation =
        TRAILING_PUNCTUATION_REGEX.test(title)
        || TRAILING_MEDIA_FILE_EXTENSIONS_REGEX.test(title)

    return (
        <ViewTransition
            name={formatViewTransitionName(`overall-category-${title}`)}
        >
            <Comp
                className={cn(
                    "w-fit text-foreground wrap-anywhere transition-[color] duration-100",
                    link === "hash"
                        ? {
                              "group-hover":
                                  "underline decoration-current decoration-solid decoration-1",
                              "group-active":
                                  "underline decoration-current decoration-solid decoration-1",
                              "group-focus-visible": "text-highlighted"
                          }
                        : link === "route" && {
                              "motion-preferred": [
                                  "will-change-[font-variation-settings] transition-[color,font-variation-settings] ease-spring duration-500",
                                  {
                                      "group-hover":
                                          "font-wght-900 transition-[font-variation-settings]"
                                  }
                              ],
                              "group-hover": "text-highlighted transition-none",
                              "group-active": "text-highlighted transition-none"
                          },
                    className
                )}
            >
                {order && (
                    <Highlight className="hidden !text-[length:inherit] md:inline">
                        {String(order).padStart(2, "0")}.
                    </Highlight>
                )}{" "}
                {hasTrailingPunctuation ? title : `${title}.`}
            </Comp>
        </ViewTransition>
    )
}

export type { SectionTitleProps }
export default SectionTitle
