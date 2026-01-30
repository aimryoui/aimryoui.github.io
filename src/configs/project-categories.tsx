import {
    Animations,
    Branding,
    Events,
    OtherCourseProjects,
    Others,
    Photography,
    UIUX,
    Weddings
} from "@/components/icons/category-icons"

export interface CategoryConfig {
    title: string
    note: string
    icons: React.ReactNode
}

export const PROJECT_CATEGORIES: Record<string, CategoryConfig> = {
    uiux: {
        title: "UI & UX",
        note: "Mobile Apps / Websites",
        icons: <UIUX />
    },
    events: {
        title: "Events & Short Films",
        note: "Posters / Social Media / Publications",
        icons: <Events />
    },
    branding: {
        title: "Branding",
        note: "Logo / Brand Identity Guidelines / Packaging",
        icons: <Branding />
    },
    animations: {
        title: "2D & 3D Animations",
        note: "Music Videos / Motion Graphics",
        icons: <Animations />
    },
    photography: {
        title: "Photography",
        note: "Photos",
        icons: <Photography />
    },
    weddings: {
        title: "Weddings",
        note: "Invitations / Posters / Publications",
        icons: <Weddings />
    },
    otherCourseProjects: {
        title: "Other Course Projects",
        note: "Typography / Infographics / Illustrations",
        icons: <OtherCourseProjects />
    },
    others: {
        title: "Others",
        note: "Miscellaneous Projects",
        icons: <Others />
    }
}
