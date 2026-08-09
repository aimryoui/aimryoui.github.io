"use client"

import { ViewTransition } from "react"

import { sendGAEvent } from "@next/third-parties/google"
import { type PressEvent, usePress } from "react-aria"

import { ArrowRight } from "@/components/icons/icons"
import { SectionLine } from "@/components/layout/line"
import { LinkButton, type LinkButtonProps } from "@/components/ui/button"
import { H1, H2, Highlight } from "@/components/ui/typography"
import { formatViewTransitionName } from "@/helpers/format-view-transition-name"
import { usePressFeedback } from "@/hooks/use-press-feedback"
import { getCategoryPath } from "@/lib/project-sort"
import { cn } from "@/lib/utils"

type SectionTitleProps = React.ComponentProps<"div"> &
    React.ComponentProps<"a"> &
    LinkButtonProps & {
        link?: "route" | "hash"
        noteClassName?: string
        id: string
        headingLevel?: "1" | "2"
        noteId?: string
        order?: number
        title: string
        note?: string
    }

function SectionTitle({
    className,
    link,
    noteClassName,
    id,
    headingLevel = "2",
    noteId,
    order,
    title,
    note,
    onPress,
    ...props
}: SectionTitleProps) {
    const playPressFeedback = usePressFeedback()

    const Comp: React.ElementType =
        link === "route" ? LinkButton : link === "hash" ? "a" : "div"

    const handlePress = (e: PressEvent) => {
        if (link) {
            const eventName =
                link === "route" ? "navigate_category" : "navigate_hash"
            const eventParams = {
                category_id: id,
                category_title: title
            }
            sendGAEvent("event", eventName, eventParams)
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
        <Comp
            {...(link && {
                href:
                    link === "route" ? getCategoryPath(id) : `/portfolio#${id}`
            })}
            {...(link === "route" && {
                nativeLink: true,
                keepFeedback: true,
                prefetch: false,
                onPress: handlePress
            })}
            data-cursor={link === "route" ? "target" : "ignore"}
            {...(link === "hash" && {
                ...pressProps,
                "data-sound": "tick"
            })}
            className={cn(
                "group sticky top-0 z-50 flex min-h-space flex-col items-center bg-background",
                className
            )}
            {...props}
        >
            {note && (
                <span
                    id={noteId}
                    className={cn(
                        "absolute bottom-full left-0 max-w-[calc(100%-var(--spacing-safe-zone)*2)] px-safe-zone pb-4 font-mono uppercase leading-normal",
                        noteId &&
                            "scroll-mt-[calc(var(--spacing-space)*2-1rem-1em*1.5)] md:scroll-mt-[calc(var(--spacing-space)*2-.75rem-1.25rem)]",
                        {
                            md: "pb-3 text-sm"
                        },
                        noteClassName
                    )}
                >
                    {note}
                </span>
            )}
            <div
                className={cn(
                    "flex w-full items-center justify-between gap-4 px-safe-zone py-[calc(var(--spacing-safe-zone)-var(--spacing)/2)]",
                    link && [
                        "transition-[background-color] duration-100",
                        link === "route"
                            ? [
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
                    ]
                )}
            >
                <Title
                    id={id}
                    headingLevel={headingLevel}
                    order={order}
                    title={title}
                    link={link}
                />
                {link === "route" ? (
                    <ArrowRight
                        className={cn("z-1 transition-[color] duration-100", {
                            "group-hover": "text-highlighted transition-none",
                            "group-active": "text-highlighted transition-none"
                        })}
                    />
                ) : (
                    link === "hash" && (
                        <span
                            aria-hidden
                            className={cn("text-xl text-muted-foreground", {
                                "group-hover": "text-foreground"
                            })}
                        >
                            #
                        </span>
                    )
                )}
            </div>
            <SectionLine containerClassName="sticky top-space" />
        </Comp>
    )
}

function Title({
    id,
    headingLevel = "2",
    order,
    title,
    link
}: {
    id: string
    headingLevel?: SectionTitleProps["headingLevel"]
    order?: number
    title: string
    link?: SectionTitleProps["link"]
}) {
    const Comp = headingLevel === "1" ? H1 : H2
    return (
        <ViewTransition
            name={formatViewTransitionName(`overall-category-${title}`)}
        >
            <Comp
                id={id}
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
                          }
                )}
            >
                {order && (
                    <Highlight>{String(order).padStart(2, "0")}.</Highlight>
                )}{" "}
                {title}.
            </Comp>
        </ViewTransition>
    )
}

export default SectionTitle
