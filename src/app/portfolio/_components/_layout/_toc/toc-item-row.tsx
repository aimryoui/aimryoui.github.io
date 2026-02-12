"use client"

import React, { memo } from "react"
import Link from "next/link"

import { motion } from "motion/react"

import { SectionLine } from "@/components/layout/line"
import { formatOrdinal } from "@/helpers/format-ordinal"
import { cn } from "@/lib/utils"

interface TocItem {
    id: string
    label: string
    depth: 1 | 2 | 3
}

const MotionSectionLine = motion.create(SectionLine)

export const TocItemRow = memo(
    ({
        item,
        isActive,
        onClick
    }: {
        item: TocItem
        isActive: boolean
        onClick: (id: string) => void
    }) => {
        return (
            <React.Fragment>
                {item.depth === 2 && (
                    <MotionSectionLine
                        variants={{
                            hidden: { opacity: 0 },
                            visible: {
                                opacity: 1,
                                transition: { duration: 0.3 }
                            }
                        }}
                        fit
                        containerClassName={cn(
                            "my-4 will-change-[opacity] first:hidden"
                        )}
                    />
                )}
                <motion.li
                    variants={{
                        hidden: { x: "10px", opacity: 0 },
                        visible: {
                            x: 0,
                            opacity: 1,
                            transition: { duration: 0.3, bounce: 0 }
                        }
                    }}
                    className={cn(
                        item.label.toLowerCase() === "footer" && "hidden",
                        item.depth === 3
                            ? "border-s-[.0625rem] border-muted-foreground/20"
                            : "mb-2",
                        "mx-6 box-content h-fit list-inside will-change-[translate,opacity,border,margin]",
                        item.depth === 3 &&
                            isActive &&
                            "!-translate-x-0.5 border-s-3 border-highlighted"
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
                                      "transition-[color] duration-50",
                                      {
                                          hover: "text-foreground transition-none"
                                      }
                                  ],
                            "relative inline-block w-full will-change-[color]",
                            item.depth === 3 ? "py-1 ps-3" : "font-bold"
                        )}
                    >
                        {item.depth === 1 ? "About" : formatOrdinal(item.label)}
                        {isActive && (
                            <div
                                className={cn(
                                    "absolute right-0 top-1/2 hidden size-5 -translate-y-1/2 place-items-center rounded-full bg-highlighted/10 text-highlighted group-hover:grid dark:bg-highlighted/20"
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
                </motion.li>
            </React.Fragment>
        )
    }
)

TocItemRow.displayName = "TocItemRow"
