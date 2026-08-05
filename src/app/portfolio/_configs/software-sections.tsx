import { TOOL_ICONS, type ToolProps } from "@/portfolio/_configs/tools"

interface SoftwareSectionDetails {
    title: string
    tools: ToolProps[]
    isRowHeader?: boolean
}

interface SoftwareSection {
    section: string
    frequencies: SoftwareSectionDetails[]
}

const ICON = TOOL_ICONS()

const SOFTWARE_SECTIONS: SoftwareSection[] = [
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

export type { SoftwareSection, SoftwareSectionDetails }
export { SOFTWARE_SECTIONS }
