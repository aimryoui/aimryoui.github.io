interface TocItemProps {
    id: string
    label: string
    depth: number
    href?: string
    mode?: "anchor" | "route"
    kind?: "static" | "project"
    icon?: React.ReactNode
    hidden?: boolean
    caseStudy?: boolean
}

type TocItemVariant = "header" | "item" | "anchor"

interface TocConfig {
    items?: TocItemProps[]
    enableStartEndAutoHighlight?: boolean
    compact?: boolean
    labelElement?: "span" | "bdi"
    lineSidebarEffect?: boolean
}

export type { TocConfig, TocItemProps, TocItemVariant }
