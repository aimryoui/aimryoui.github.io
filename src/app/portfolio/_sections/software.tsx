import { Fragment } from "react"

import { Divider } from "@/components/layout/divider"
import { SectionLine } from "@/components/layout/line"
import { Space } from "@/components/layout/space"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import { Tooltip, TooltipTrigger } from "@/components/ui/tooltip"
import { Link } from "@/components/ui/typography"
import { cn } from "@/lib/utils"
import SectionTitle from "@/portfolio/_components/section-title"
import { TOOL_ICONS, type ToolProps } from "@/portfolio/_configs/tools"

interface SectionProps {
    title: string
    tools: ToolProps[]
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
                ]
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
                tools: [ICON.dreamweaver, ICON.xd, ICON.dimension]
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
                        <div
                            data-slot="table-container"
                            className={cn(
                                "relative grid w-full grid-cols-5 gap-[calc(var(--spacing)*6+var(--px)*2)] bg-background py-4.5"
                            )}
                        >
                            <Table
                                className={cn(
                                    "col-span-full col-start-2 grid table-fixed gap-y-2 pb-1",
                                    index === 0 && {
                                        "@[39.5rem]":
                                            "pb-[calc(1em*1.3+2px+var(--spacing)*15)]"
                                    },
                                    {
                                        "@[46.875rem]": "col-start-1 px-6"
                                    }
                                )}
                            >
                                <TableCaption
                                    className={cn(
                                        "absolute left-6 whitespace-pre-line font-wght-500",
                                        {
                                            "@[46.875rem]":
                                                "static mb-2 font-wght-600"
                                        }
                                    )}
                                >
                                    {section.section}
                                </TableCaption>

                                <TableHeader className={cn("grid")}>
                                    <TableRow
                                        className={cn(
                                            "relative grid grid-cols-4 gap-x-[calc(var(--spacing)*6+var(--px)*2)]"
                                        )}
                                    >
                                        {section.frequencies.map(
                                            (frequency, _index, arr) => (
                                                <TableHead
                                                    key={frequency.title}
                                                    className={cn(
                                                        "col-span-2 px-0",
                                                        _index ===
                                                            arr.length - 1 &&
                                                            "pe-6",
                                                        _index === 1 && {
                                                            "@[39.5rem]":
                                                                "absolute -bottom-[calc(1em*1.3+2px+var(--spacing)*14)] left-0"
                                                        }
                                                    )}
                                                >
                                                    {frequency.title}
                                                </TableHead>
                                            )
                                        )}
                                    </TableRow>
                                </TableHeader>

                                <TableBody
                                    className={cn("grid gap-y-2", {
                                        lg: "gap-y-4"
                                    })}
                                >
                                    <TableRow
                                        className={cn(
                                            "relative grid grid-cols-4 gap-x-[calc(var(--spacing)*6+var(--px)*2)]"
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
                                                            "pe-6",
                                                        _index === 1 && {
                                                            "@[39.5rem]":
                                                                "absolute -bottom-[calc(1em*1.3+2px+var(--spacing)*14)] left-0"
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
                                                                            <Link
                                                                                openInNewTab
                                                                                href={
                                                                                    tool.url
                                                                                }
                                                                            >
                                                                                {
                                                                                    tool.icon
                                                                                }
                                                                                <span className="sr-only">
                                                                                    {
                                                                                        tool.label
                                                                                    }
                                                                                </span>
                                                                            </Link>
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
                        </div>
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
