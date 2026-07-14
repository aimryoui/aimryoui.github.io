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
import { TooltipTrigger } from "@/components/ui/tooltip"
import { Link } from "@/components/ui/typography"
import { cn } from "@/lib/utils"
import SectionTitle from "@/portfolio/_components/section-title"
import { TOOL_ICONS, type ToolProps } from "@/portfolio/_configs/tools"

interface SectionProps {
    title: string
    tools: ToolProps[]
    hideOnMd?: boolean
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
                tools: [ICON.blender, ICON.premierePro],
                hideOnMd: true
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
        <section>
            <Space />
            <SectionLine />
            <SectionTitle id="software" title="Software" />
            <SectionLine />
            <Divider />
            <SectionLine />
            {sections.map((section, index, arr) => (
                <Fragment key={section.section}>
                    <div
                        data-slot="table-container"
                        className={cn(
                            "relative grid w-full grid-cols-5 gap-[calc(var(--spacing)*6+var(--px)*2)] bg-background py-3",
                            {
                                lg: "grid-cols-1 py-4"
                            }
                        )}
                    >
                        <Table
                            className={cn(
                                "col-span-full col-start-2 grid table-fixed gap-y-2 pb-1",
                                {
                                    lg: "col-start-1 px-6"
                                }
                            )}
                        >
                            <TableCaption
                                className={cn(
                                    "absolute left-6 whitespace-pre-line",
                                    {
                                        lg: "static font-wght-[625]"
                                    }
                                )}
                            >
                                {section.section}
                            </TableCaption>

                            <TableHeader className={cn("grid")}>
                                <TableRow
                                    className={cn(
                                        "grid grid-cols-4 gap-x-[calc(var(--spacing)*6+var(--px)*2)]"
                                    )}
                                >
                                    {section.frequencies.map(
                                        (frequency, _index, arr) => (
                                            <TableHead
                                                key={frequency.title}
                                                className={cn(
                                                    "col-span-2 px-0",
                                                    _index === arr.length - 1 &&
                                                        "pe-6",
                                                    frequency.hideOnMd &&
                                                        "md:hidden"
                                                )}
                                            >
                                                {frequency.title}
                                            </TableHead>
                                        )
                                    )}
                                </TableRow>
                            </TableHeader>

                            <TableBody className="grid gap-y-2">
                                <TableRow
                                    className={cn(
                                        "grid grid-cols-4 gap-x-[calc(var(--spacing)*6+var(--px)*2)]"
                                    )}
                                >
                                    {section.frequencies.map(
                                        (frequency, _index, arr) => (
                                            <TableCell
                                                key={frequency.title}
                                                className={cn(
                                                    "col-span-2 p-0 align-top text-foreground font-wght-[625]",
                                                    _index === arr.length - 1 &&
                                                        "pe-6",
                                                    frequency.hideOnMd &&
                                                        "md:hidden"
                                                )}
                                            >
                                                <div
                                                    className={cn("flex gap-3")}
                                                >
                                                    {frequency.tools.map(
                                                        (tool, toolindex) => (
                                                            <Fragment
                                                                key={toolindex}
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
        </section>
    )
}

export default Software
