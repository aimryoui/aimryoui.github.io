"use client"

import { Fragment } from "react"

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
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import { Tooltip, TooltipTrigger } from "@/components/ui/tooltip"
import { slugify } from "@/helpers/slugify"
import { cn } from "@/lib/utils"
import SectionTitle from "@/portfolio/_components/section-title"
import { TOOL_ICONS, type ToolProps } from "@/portfolio/_configs/tools"

interface SectionProps {
    title: string
    tools: ToolProps[]
    isRowHeader?: boolean
}

interface Section {
    section: string
    frequencies: SectionProps[]
}

const ICON = TOOL_ICONS()

const sections: Section[] = [
    {
        section: "Main",
        frequencies: [
            {
                title: "Most frequently used and experienced",
                tools: [
                    ICON.figma,
                    ICON.photoshop,
                    ICON.illustrator,
                    ICON.inDesign,
                    ICON.afterEffects
                ],
                isRowHeader: true
            },
            {
                title: "Less experienced",
                tools: [ICON.blender, ICON.premierePro]
            }
        ]
    },
    {
        section: "Outdated",
        frequencies: [
            {
                title: "Used but outdated",
                tools: [ICON.dreamweaver, ICON.xd, ICON.dimension],
                isRowHeader: true
            }
        ]
    }
]

function Software() {
    return (
        <section className="@container">
            <Space />
            <SectionLine />
            <SectionTitle id="software" title="Software" />
            <SectionLine />
            <Divider />
            <SectionLine />
            <Tooltip>
                {sections.map((section, index, arr) => (
                    <Fragment key={section.section}>
                        <TableContainer
                            className={cn(
                                "grid grid-cols-5 gap-x-[calc(var(--spacing-safe-zone)+var(--px)*2)] gap-y-table-between bg-background py-safe-zone-vertical"
                            )}
                        >
                            <TableCaption
                                className={cn(
                                    "absolute left-safe-zone top-safe-zone-vertical whitespace-pre-line font-wght-500",
                                    {
                                        "@[46.875rem]":
                                            "static col-span-full whitespace-normal px-safe-zone font-wght-600"
                                    }
                                )}
                            >
                                {section.section}
                            </TableCaption>
                            <Table
                                aria-label="Software"
                                className={cn(
                                    "col-span-full col-start-2 grid table-fixed gap-y-table-between pb-0.75",
                                    index === 0 && {
                                        "@[39.5rem]":
                                            "pb-[calc(1em*1.5+2px+var(--spacing-table-between)*2+var(--spacing)*8+var(--spacing)*.75)]"
                                    },
                                    {
                                        "@[46.875rem]":
                                            "col-start-1 px-safe-zone",
                                        md: "text-sm"
                                    }
                                )}
                            >
                                <TableHeader
                                    className={cn("grid", {
                                        "[&>tr]":
                                            "relative grid grid-cols-4 gap-x-[calc(var(--spacing-safe-zone)+var(--px)*2+var(--spacing)*.5)]"
                                    })}
                                >
                                    {section.frequencies.map(
                                        (frequency, _index, arr) => (
                                            <TableHead
                                                key={frequency.title}
                                                isRowHeader={
                                                    frequency.isRowHeader
                                                }
                                                className={cn(
                                                    "col-span-2 flex px-0",
                                                    _index === arr.length - 1 &&
                                                        "pe-safe-zone",
                                                    _index === 1 && {
                                                        "@[39.5rem]":
                                                            "absolute left-0 top-[calc(1em*1.5+2px+var(--spacing-table-between)*2+var(--spacing)*8)]"
                                                    }
                                                )}
                                            >
                                                {frequency.title}
                                            </TableHead>
                                        )
                                    )}
                                </TableHeader>

                                <TableBody
                                    className={cn("grid gap-y-table-between")}
                                >
                                    <TableRow
                                        id={`software-${slugify(section.section)}`}
                                        className={cn(
                                            "relative grid grid-cols-4 gap-x-[calc(var(--spacing-safe-zone)+var(--px)*2)]"
                                        )}
                                    >
                                        {section.frequencies.map(
                                            (frequency, _index, arr) => (
                                                <TableCell
                                                    key={frequency.title}
                                                    className={cn(
                                                        "col-span-2 p-0 align-top text-foreground font-wght-600",
                                                        _index ===
                                                            arr.length - 1 &&
                                                            "pe-safe-zone",
                                                        _index === 1 && {
                                                            "@[39.5rem]":
                                                                "absolute left-0 top-[calc(1em*1.5+2px+var(--spacing-table-between)*2+var(--spacing)*8)]"
                                                        }
                                                    )}
                                                >
                                                    <div
                                                        className={cn(
                                                            "flex gap-3"
                                                        )}
                                                    >
                                                        {frequency.tools.map(
                                                            (
                                                                tool,
                                                                toolindex
                                                            ) => (
                                                                <Fragment
                                                                    key={
                                                                        toolindex
                                                                    }
                                                                >
                                                                    <TooltipTrigger
                                                                        payload={
                                                                            tool.label
                                                                        }
                                                                        render={
                                                                            <LinkButton
                                                                                href={
                                                                                    tool.url
                                                                                }
                                                                                openInNewTab
                                                                                nativeLink
                                                                                keepFeedback
                                                                                hoverSound="tick"
                                                                                pressSound="link"
                                                                            >
                                                                                {
                                                                                    tool.icon
                                                                                }
                                                                                <span className="sr-only">
                                                                                    {
                                                                                        tool.label
                                                                                    }
                                                                                </span>
                                                                            </LinkButton>
                                                                        }
                                                                    />
                                                                </Fragment>
                                                            )
                                                        )}
                                                    </div>
                                                </TableCell>
                                            )
                                        )}
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                        {index < arr.length - 1 &&
                            arr[index + 1].section !== section.section && (
                                <SectionLine />
                            )}
                    </Fragment>
                ))}
            </Tooltip>
        </section>
    )
}

export default Software
