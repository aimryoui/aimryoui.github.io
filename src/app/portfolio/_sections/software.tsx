import { Fragment } from "react"

import { Divider } from "@/components/layout/divider"
import { SectionLine } from "@/components/layout/line"
import { Space } from "@/components/layout/space"
import { TooltipTrigger } from "@/components/ui/tooltip"
import { Bold, Highlight, Link, Text } from "@/components/ui/typography"
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
                        className={cn(
                            "relative grid grid-cols-5 gap-6 gap-y-3 bg-background pb-3.75 pt-3.25",
                            "[&>*:first-child]:ps-6 [&>*:last-child]:pe-6"
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
                                                <Fragment key={toolindex}>
                                                    {tool.label}
                                                    {toolindex <
                                                        frequency.tools.length -
                                                            1 && ", "}
                                                </Fragment>
                                            )
                                        )}
                                    </Bold>
                                    <div className={cn("flex gap-3")}>
                                        {frequency.tools.map(
                                            (tool, toolindex) => (
                                                <Fragment key={toolindex}>
                                                    <TooltipTrigger
                                                        payload={tool.label}
                                                        render={
                                                            <Link
                                                                openInNewTab
                                                                href={tool.url}
                                                            >
                                                                {tool.icon}
                                                                <span className="sr-only">
                                                                    {tool.label}
                                                                </span>
                                                            </Link>
                                                        }
                                                    />
                                                </Fragment>
                                            )
                                        )}
                                    </div>
                                </div>
                            )
                        )}
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
