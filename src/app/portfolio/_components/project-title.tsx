import { Divider } from "@/components/layout/divider"
import { ElementLine, SectionLine } from "@/components/layout/line"
import { At, Bold, H3, H4, Highlight, Text } from "@/components/ui/typography"
import { cn } from "@/lib/utils"

function ProjectHeader({
    projectName,
    category,
    information,
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
    detail: {
        description: string
        abbreviation: string
    }
}) {
    return (
        <div className={cn("bg-background relative")}>
            <div className={cn("flex items-stretch")}>
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
                        "flex flex-1 flex-col justify-between gap-2 px-6 pt-3.5 pb-5"
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
