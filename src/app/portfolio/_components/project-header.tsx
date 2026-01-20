import { Divider } from "@/components/layout/divider"
import { ElementLine, SectionLine } from "@/components/layout/line"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger
} from "@/components/ui/tooltip"
import {
    At,
    Bold,
    H3,
    H4,
    Highlight,
    Link,
    Text
} from "@/components/ui/typography"
import { TOOL_ICONS, type ToolKey } from "@/configs/tools"
import { cn } from "@/lib/utils"

function ProjectHeader({
    projectName,
    category,
    information,
    tools,
    detail
}: {
    projectName: string
    category: string
    information: {
        newest?: boolean
        duration: string
        subject: string
        place: string
    }
    tools: ToolKey[]
    detail: {
        description: string
        abbreviation: string
    }
}) {
    return (
        <div className={cn("bg-background relative")}>
            <div
                className={cn(
                    "grid grid-cols-[3fr_var(--px)_calc(var(--spacing)*6)_var(--px)_2fr]"
                )}
            >
                <span
                    className={cn(`
                        absolute -top-10.5 left-6
                        font-mono tracking-normal uppercase
                    `)}
                >
                    Project
                </span>
                <div
                    className={cn(
                        "flex flex-1 flex-col gap-2 px-6 pt-3.5 pb-5"
                    )}
                >
                    <H3>{projectName}.</H3>
                    <H4 highlight>{category}</H4>
                </div>
                <ElementLine />
                <Divider dir="vertical" />
                <ElementLine />
                <div
                    className={cn(
                        "flex flex-1 flex-col justify-between px-6 pt-3.5 pb-5"
                    )}
                >
                    {information.newest && (
                        <Highlight className={cn("font-normal")}>
                            Newest
                        </Highlight>
                    )}
                    <Text>{information.duration}</Text>
                    <Text>
                        {information.subject} <At /> {information.place}
                    </Text>
                </div>
                {tools.length > 0 && (
                    <div
                        className={cn(`
                            absolute -top-10.5 right-4.5
                            flex gap-2
                        `)}
                    >
                        <TooltipProvider>
                            {tools.map((key) => {
                                const tool = TOOL_ICONS({ size: "sm" })[key]

                                return (
                                    <Tooltip key={key}>
                                        <TooltipTrigger>
                                            <Link openInNewTab href={tool.url}>
                                                {tool.icon}
                                            </Link>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            {tool.label}
                                        </TooltipContent>
                                    </Tooltip>
                                )
                            })}
                        </TooltipProvider>
                    </div>
                )}
            </div>
            <SectionLine />
            <div className={cn("flex flex-col gap-2 px-6 pt-3.5 pb-5")}>
                <Bold>{detail.description}</Bold>
                <Text>{detail.abbreviation}</Text>
            </div>
        </div>
    )
}

export default ProjectHeader
