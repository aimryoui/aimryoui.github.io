"use client"

import { memo } from "react"
import Link from "next/link"

import { ChevronDown } from "lucide-react"
import { type useReducedMotion, type Variants } from "motion/react"
import * as m from "motion/react-m"

import { formatOrdinal } from "@/helpers/format-ordinal"
import { cn } from "@/lib/utils"

interface TocItemProps {
    id: string
    label: string
    depth: number
    icon?: React.ReactNode
    hidden?: boolean
}

const liVariants: Variants = {
    hidden: { x: 10, opacity: 0 },
    visible: {
        x: 0,
        opacity: 1,
        transition: { duration: 0.3, bounce: 0 }
    }
}

const TocItemRow = memo(
    ({
        item,
        isActive,
        prefersReducedMotion,
        onClick
    }: {
        item: TocItemProps
        isActive: boolean
        prefersReducedMotion: ReturnType<typeof useReducedMotion>
        onClick: (id: string) => void
    }) => {
        return (
            <m.li
                variants={prefersReducedMotion ? undefined : liVariants}
                className={cn(
                    item.label.toLowerCase() === "footer" && "hidden",
                    item.depth === 3 &&
                        !item.icon &&
                        "border-s-[.0625rem] border-muted-foreground/20",
                    "relative mx-6 box-content flex h-fit list-inside items-center gap-4 will-change-[transform,opacity]",
                    item.depth === 3 &&
                        isActive &&
                        !item.icon && {
                            before: "absolute inset-y-0 -left-[.0625rem] w-[.1875rem] bg-highlighted"
                        }
                )}
            >
                <Link
                    href={`#${item.id}`}
                    data-toc-id={item.id}
                    onClick={(e) => {
                        e.preventDefault()
                        onClick(item.id)
                    }}
                    className={cn(
                        isActive
                            ? "text-highlighted"
                            : [
                                  "transition-[color] duration-100",
                                  {
                                      hover: "text-foreground transition-none",
                                      "focus-visible": "text-foreground"
                                  }
                              ],
                        "group/link relative flex-1 leading-6 will-change-[color]",
                        item.depth === 3 && !item.icon ? "ps-3" : "font-bold",
                        item.icon ? "flex gap-2 py-1" : "inline-block py-0.5"
                    )}
                >
                    {item.icon && (
                        <div
                            className={cn(
                                "grid size-6 place-items-center rounded-md will-change-[background-color,color]",
                                isActive
                                    ? "bg-highlighted text-white dark:bg-highlighted/70"
                                    : [
                                          "bg-muted-foreground/15 transition-[background-color,color] duration-100 dark:bg-muted-foreground/20",
                                          {
                                              "group-hover/link":
                                                  "text-default bg-muted-foreground/40 transition-none"
                                          }
                                      ]
                            )}
                        >
                            {item.icon}
                        </div>
                    )}
                    {formatOrdinal(item.label)}
                    {isActive && (
                        <div
                            className={cn(
                                "absolute right-0 top-1/2 hidden size-5 -translate-y-1/2 place-items-center rounded-full bg-highlighted/10 text-highlighted",
                                "group-hover:grid group-focus-visible/link:hidden dark:bg-highlighted/20"
                            )}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                className={cn("size-3")}
                            >
                                <path
                                    fill="currentColor"
                                    d="M11.998 23c-.741 0-1.263-.521-1.263-1.286V7.325l.093-2.502L7.77 8.241l-2.63 2.595c-.22.22-.545.37-.892.37-.695 0-1.217-.532-1.217-1.24 0-.335.128-.636.394-.914l7.635-7.647c.255-.254.59-.405.938-.405s.684.15.939.405l7.634 7.647c.266.278.394.579.394.915 0 .707-.51 1.24-1.205 1.24-.36 0-.672-.151-.904-.371l-2.63-2.595-3.058-3.406.093 2.49v14.39c0 .764-.51 1.285-1.263 1.285Z"
                                />
                            </svg>
                        </div>
                    )}
                </Link>
                {item.depth === 2 && item.id !== "outlines" && (
                    <div
                        className={cn(
                            "bg-default/5 grid size-5 place-items-center rounded-full",
                            "dark:bg-default/10"
                        )}
                    >
                        <ChevronDown className="size-4" />
                    </div>
                )}
            </m.li>
        )
    }
)
TocItemRow.displayName = "TocItemRow"

export type { TocItemProps }
export { TocItemRow }
