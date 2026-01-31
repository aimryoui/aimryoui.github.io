import React from "react"

import SectionTitle from "@/app/portfolio/_components/section-title"
import { Divider } from "@/components/layout/divider"
import { SectionLine } from "@/components/layout/line"
import { Space } from "@/components/layout/space"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger
} from "@/components/ui/tooltip"
import { Bold, Highlight, Link, Text } from "@/components/ui/typography"
import { TOOL_ICONS, type ToolProps } from "@/configs/tools"
import { cn } from "@/lib/utils"

interface SectionProps {
    title: string
    tools: ToolProps[]
}

interface Section {
    section: string
    frequencies: SectionProps[]
}

const sections: Section[] = [
    {
        section: "Main",
        frequencies: [
            {
                title: "Most frequently used and experienced",
                tools: [
                    TOOL_ICONS().figma,
                    TOOL_ICONS().photoshop,
                    TOOL_ICONS().illustrator,
                    TOOL_ICONS().inDesign,
                    TOOL_ICONS().afterEffects
                ]
            },
            {
                title: "Less experienced",
                tools: [TOOL_ICONS().blender, TOOL_ICONS().premierePro]
            }
        ]
    },
    {
        section: "Outdated",
        frequencies: [
            {
                title: "Used but outdated",
                tools: [
                    TOOL_ICONS().dreamweaver,
                    TOOL_ICONS().xd,
                    TOOL_ICONS().dimension
                ]
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
                <React.Fragment key={section.section}>
                    <div
                        className={cn(
                            "bg-background relative grid grid-cols-5 gap-6 gap-y-3 pt-3.25 pb-3.75 [&>*:first-child]:ps-6 [&>*:last-child]:pe-6"
                        )}
                    >
                        <Highlight className={cn("font-normal")}>
                            {section.section}
                        </Highlight>

                        {section.frequencies.map(
                            (frequency, frequencyindex) => (
                                <div
                                    key={frequencyindex}
                                    className={cn(
                                        "col-span-2 flex flex-col gap-2"
                                    )}
                                >
                                    <Text>{frequency.title}</Text>
                                    <Bold className={cn("sr-only")}>
                                        {frequency.tools.map(
                                            (tool, toolindex) => (
                                                <React.Fragment key={toolindex}>
                                                    {tool.label}
                                                    {toolindex <
                                                        frequency.tools.length -
                                                            1 && ", "}
                                                </React.Fragment>
                                            )
                                        )}
                                    </Bold>
                                    <div className={cn("flex gap-3")}>
                                        <TooltipProvider>
                                            {frequency.tools.map(
                                                (tool, toolindex) => (
                                                    <Tooltip key={toolindex}>
                                                        <TooltipTrigger>
                                                            <Link
                                                                openInNewTab
                                                                href={tool.url}
                                                            >
                                                                {tool.icon}
                                                            </Link>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            {tool.label}
                                                        </TooltipContent>
                                                    </Tooltip>
                                                )
                                            )}
                                        </TooltipProvider>
                                    </div>
                                </div>
                            )
                        )}
                    </div>
                    {index < arr.length - 1 &&
                        arr[index + 1].section !== section.section && (
                            <SectionLine />
                        )}
                </React.Fragment>
            ))}
        </section>
    )
}

export default Software
