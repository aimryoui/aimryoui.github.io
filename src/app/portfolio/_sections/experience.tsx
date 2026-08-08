"use client"

import { Fragment, useState } from "react"

import { type Key } from "react-aria-components/Collection"

import { Divider } from "@/components/layout/divider"
import { SectionLine } from "@/components/layout/line"
import { Space } from "@/components/layout/space"
import { LinkButton } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableContainer,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import { At } from "@/components/ui/typography"
import { slugify } from "@/helpers/slugify"
import { cn } from "@/lib/utils"
import SectionTitle from "@/portfolio/_components/section-title"
import { EXPERIENCE_SECTIONS } from "@/portfolio/_configs/experience-sections"

function Experience() {
    let [expandedKeys, setExpandedKeys] = useState(
        new Set<Key>([
            "12-2025-motion-designer-san-data-systems-inc",
            "12-2024-design-team-mentor-coc-sai-gon-communication-club",
            "10-2023-design-team-lead-coc-sai-gon-communication-club"
        ])
    )

    return (
        <section className="@container">
            <Space />
            <SectionLine containerClassName="z-55" />
            <SectionTitle
                id="experience"
                title="Experience"
                note="Information"
                link="hash"
                className="sticky top-0 z-50"
            />
            <Divider />
            <SectionLine />

            {EXPERIENCE_SECTIONS.map((section, index, arr) => (
                <Fragment key={section.section}>
                    <TableContainer
                        className={cn(
                            "grid grid-cols-5 gap-x-[calc(var(--spacing-safe-zone)+var(--px)*2)] gap-y-table-between bg-background py-safe-zone-vertical"
                        )}
                    >
                        <TableCaption
                            className={cn(
                                "sticky top-[calc(var(--spacing-space)+var(--spacing-safe-zone-vertical))] z-45 h-fit whitespace-pre-line ps-safe-zone font-wght-500",
                                {
                                    "@[69rem]":
                                        "static col-span-full whitespace-normal px-safe-zone font-wght-600"
                                }
                            )}
                        >
                            {section.section}
                        </TableCaption>
                        <Table
                            aria-label="Experience"
                            treeColumn="organization"
                            expandedKeys={expandedKeys}
                            onExpandedChange={setExpandedKeys}
                            className={cn(
                                "col-span-full col-start-2 grid table-fixed gap-y-table-between",
                                {
                                    "@[69rem]": "col-start-1 ps-safe-zone"
                                }
                            )}
                        >
                            <TableHeader
                                className={cn("sr-only grid", {
                                    "[&>tr]": [
                                        "grid grid-cols-4 gap-x-[calc(var(--spacing-safe-zone)+var(--px)*2)]",
                                        {
                                            "last:*": "pe-safe-zone"
                                        }
                                    ]
                                })}
                            >
                                <TableHead id="period" className="px-0">
                                    Period
                                </TableHead>
                                <TableHead
                                    id="position"
                                    className="px-0"
                                    isRowHeader
                                >
                                    Position
                                </TableHead>
                                <TableHead
                                    id="organization"
                                    className="col-span-2 px-0"
                                >
                                    Organization
                                </TableHead>
                            </TableHeader>

                            <TableBody
                                items={section.items.map((place) => ({
                                    ...place,
                                    id: slugify(
                                        `${place.startDate} ${place.position} ${place.organization?.text}`
                                    )
                                }))}
                                dependencies={[section.items]}
                                className={cn("grid gap-y-table-between", {
                                    md: "gap-y-2.75"
                                })}
                            >
                                {(place) => (
                                    <TableRow
                                        id={place.id}
                                        className={cn(
                                            "relative grid grid-cols-4 gap-x-[calc(var(--spacing-safe-zone)+var(--px)*2)]",
                                            place.description && [
                                                {
                                                    "aria-expanded:before":
                                                        "border border-muted bg-muted/20 hover:bg-muted/45 active:bg-muted/60 dark:bg-muted/30"
                                                },
                                                {
                                                    before: [
                                                        "absolute -inset-y-1.25 -left-2.25 right-2.75 rounded-lg transition-[background-color] duration-100",
                                                        {
                                                            hover: "bg-muted/45 transition-none",
                                                            active: "bg-muted/60 transition-none",

                                                            "@[69rem]":
                                                                "-left-[calc(var(--spacing-safe-zone)/2)] right-[calc(var(--spacing-safe-zone)/2)]",
                                                            "@[56.5rem]":
                                                                "-left-[calc(var(--spacing-safe-zone)/2)] right-[calc(var(--spacing-safe-zone)/2)] rounded-xlg",

                                                            md: "-left-[calc(var(--spacing-safe-zone)*1.75/3)] right-[calc(var(--spacing-safe-zone)*1.25/3)]",
                                                            sm: "-bottom-1.5 -left-[calc(var(--spacing-safe-zone)*1.75/3)] right-[calc(var(--spacing-safe-zone)*1.25/3)]"
                                                        }
                                                    ]
                                                }
                                            ],
                                            {
                                                "last:*": "pe-safe-zone",
                                                "@[56.5rem]": "grid-cols-2",
                                                sm: "order-none flex flex-wrap justify-between gap-y-0.5 last-of-type:mb-px"
                                            }
                                        )}
                                    >
                                        <TableCell
                                            className={cn(
                                                "z-1 inline-block p-0 align-top font-mono",
                                                {
                                                    "@[56.5rem]": "absolute",
                                                    sm: "static order-1 pe-safe-zone text-[.84375rem]"
                                                }
                                            )}
                                        >
                                            {place.startDate ===
                                            place.endDate ? (
                                                place.startDate
                                            ) : (
                                                <>
                                                    {place.startDate} —{" "}
                                                    {place.endDate ?? (
                                                        <span className="text-foreground">
                                                            Now
                                                        </span>
                                                    )}
                                                </>
                                            )}
                                        </TableCell>

                                        <TableCell
                                            className={cn(
                                                "z-1 flex justify-between gap-x-[calc(var(--spacing-safe-zone)+var(--px)*2)] p-0 align-top text-foreground font-wght-500",
                                                {
                                                    "@[56.5rem]":
                                                        "mt-5.5 gap-x-2",
                                                    lg: "font-wght-600",
                                                    sm: "mt-0"
                                                }
                                            )}
                                        >
                                            {place.position}{" "}
                                            {place.organization && (
                                                <At className="float-end sm:hidden" />
                                            )}
                                        </TableCell>

                                        <TableCell
                                            className={cn(
                                                "col-span-2 p-0 align-top",
                                                {
                                                    "@[56.5rem]":
                                                        "col-span-1 mt-5.5",
                                                    sm: "order-2 mt-0 inline basis-full"
                                                }
                                            )}
                                            spanClassName={cn({
                                                "@[69rem]":
                                                    "-ms-[calc(var(--spacing-safe-zone)*1.1/3)] min-w-[calc(100%+var(--spacing)*4.5)] pe-1",
                                                "@[56.5rem]":
                                                    "mt-[calc(var(--spacing)*5+var(--px))]",
                                                md: "-ms-[calc(var(--spacing-safe-zone)*1.25/3)] mt-[calc(var(--spacing)*5)] min-w-[calc(100%+var(--spacing)*1.625*2)] pe-1",
                                                sm: "mt-[calc(var(--spacing)*5+var(--px))]"
                                            })}
                                        >
                                            {place.organization ? (
                                                <LinkButton
                                                    href={
                                                        place.organization.url
                                                    }
                                                    aria-label={
                                                        place.organization
                                                            .ariaLabel
                                                    }
                                                    nativeLink
                                                    keepFeedback
                                                    hoverSound="tick"
                                                    pressSound="link"
                                                    openInNewTab
                                                    translate="no"
                                                    className={cn(
                                                        "[--space-between:calc(var(--spacing-table-between)/2)]",
                                                        "group relative z-3 inline-block text-base text-foreground font-wght-500",
                                                        place.organization
                                                            .duplicate && [
                                                            "text-muted-foreground transition-[color] duration-100",
                                                            {
                                                                hover: "text-foreground transition-none"
                                                            }
                                                        ],
                                                        "-my-[--space-between] py-[--space-between]",
                                                        {
                                                            "focus-visible":
                                                                "text-highlighted",
                                                            "group-first/table-row":
                                                                "-mb-[--space-between] -mt-safe-zone-vertical pb-[--space-between] pt-safe-zone-vertical",
                                                            "group-last/table-row":
                                                                "-mb-safe-zone-vertical -mt-[--space-between] pb-safe-zone-vertical pt-[--space-between]",

                                                            lg: "font-wght-600",
                                                            md: "text-sm",
                                                            sm: "flex w-fit gap-x-1 italic text-muted-foreground font-wght-450 group-hover/table-row:text-foreground group-active/table-row:text-foreground group-aria-expanded/table-row:text-foreground dark:font-wght-400",

                                                            "@[56.5rem]":
                                                                "!m-0 !me-6 !p-0"
                                                        }
                                                    )}
                                                >
                                                    <span className="hidden italic text-muted-foreground/50 sm:inline-block">
                                                        |
                                                    </span>
                                                    <span
                                                        data-cursor="lock"
                                                        className={cn(
                                                            "-mx-1.5 -my-0.5 inline-block text-pretty px-1.5 py-0.5 underline",
                                                            {
                                                                "group-hover":
                                                                    "decoration-current decoration-solid"
                                                            }
                                                        )}
                                                    >
                                                        {
                                                            place.organization
                                                                .text
                                                        }
                                                    </span>
                                                </LinkButton>
                                            ) : (
                                                <span
                                                    className={cn(
                                                        "pointer-events-none relative z-3 hidden text-base text-muted-foreground font-wght-500",
                                                        {
                                                            md: "text-sm",
                                                            sm: "inline-block group-hover/table-row:text-foreground group-active/table-row:text-foreground"
                                                        }
                                                    )}
                                                >
                                                    Self-employed
                                                </span>
                                            )}
                                        </TableCell>
                                        {(!!place.description ||
                                            !!place.summary) && (
                                            <TableRow
                                                className={cn(
                                                    "grid grid-cols-4 border-b border-dashed border-stroke pe-safe-zone not-last:mb-[calc(var(--spacing-safe-zone-vertical)*1/3)]",
                                                    {
                                                        "@[69rem]":
                                                            "-ms-safe-zone ps-safe-zone",
                                                        md: "mt-1",
                                                        sm: "not-last:mb-0"
                                                    }
                                                )}
                                            >
                                                <TableCell
                                                    className={cn(
                                                        "col-span-3 space-y-1.5 overflow-hidden italic group-not-last/table-row:pb-safe-zone-vertical",
                                                        {
                                                            "@[69rem]":
                                                                "col-span-full"
                                                        }
                                                    )}
                                                >
                                                    {place.summary && (
                                                        <p className="not-italic text-foreground font-wght-550">
                                                            {place.summary}
                                                        </p>
                                                    )}
                                                    {place.description && (
                                                        <ul className="space-y-1.5 text-pretty">
                                                            {place.description.map(
                                                                (
                                                                    item,
                                                                    index
                                                                ) => (
                                                                    <li
                                                                        key={
                                                                            index
                                                                        }
                                                                        className={cn(
                                                                            "ms-[calc(1em-0.125rem-1px)] list-outside list-disc",
                                                                            {
                                                                                marker: "text-sm text-muted-foreground/40",
                                                                                md: "ms-[calc(1em-1px)]"
                                                                            }
                                                                        )}
                                                                    >
                                                                        {item}
                                                                    </li>
                                                                )
                                                            )}
                                                        </ul>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableRow>
                                )}
                            </TableBody>

                            {index === arr.length - 1 && (
                                <TableFooter className="grid border-t-0 bg-transparent">
                                    <TableRow
                                        className={cn({
                                            hover: "bg-transparent",
                                            "last:*": "pe-safe-zone"
                                        })}
                                    >
                                        <TableCell
                                            colSpan={3}
                                            className={cn(
                                                "flex flex-col gap-y-safe-zone-vertical p-0 pt-[calc(var(--spacing-safe-zone-vertical)-var(--spacing-table-between))] align-top"
                                            )}
                                        >
                                            <SectionLine
                                                className={cn(
                                                    "-right-[calc(var(--spacing-safe-zone)*2)]",
                                                    {
                                                        lg: [
                                                            "-right-[calc(var(--spacing-safe-zone)*2)] left-auto"
                                                        ]
                                                    }
                                                )}
                                            />
                                            And a bunch of University course
                                            projects or miscellaneous freelance
                                            jobs on the road...
                                        </TableCell>
                                    </TableRow>
                                </TableFooter>
                            )}
                        </Table>
                    </TableContainer>
                    {index < arr.length - 1 &&
                        arr[index + 1].section !== section.section && (
                            <SectionLine />
                        )}
                </Fragment>
            ))}

            <SectionLine />
        </section>
    )
}

export default Experience
