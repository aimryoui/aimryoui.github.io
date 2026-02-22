import Link from "next/link"

import { Ellipsis } from "lucide-react"

import { SectionLine } from "@/components/layout/line"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import { At, Bold } from "@/components/ui/typography"
import { siteConfig } from "@/configs/site.config"
import { slugify } from "@/helpers/slugify"
import { groupProjectsByCategory } from "@/lib/project-sort"
import { cn } from "@/lib/utils"
import { TableOfContents } from "@/portfolio/_components/_layout/table-of-contents"

import { projects } from "~/.velite"

function Sidebar() {
    const projectGroups = groupProjectsByCategory(projects)
    const projectItems = projectGroups.flatMap((group) => [
        // Project Headers
        {
            id: group.id,
            label: group.title,
            depth: 2 as const
        },
        // Projects
        ...group.projects.map((p) => ({
            id: slugify(p.projectName),
            label: p.projectName,
            depth: 3 as const
        }))
    ])

    const tocItems = [
        { id: "about", label: "About", depth: 1 as const },
        { id: "experiences", label: "Experiences", depth: 3 as const },
        { id: "education", label: "Education", depth: 3 as const },
        { id: "software", label: "Software", depth: 3 as const },
        { id: "contact", label: "Contact", depth: 3 as const },
        { id: "outlines", label: "Outlines", depth: 2 as const },
        ...projectItems
        // { id: "footer", label: "Footer", depth: 3 as const }
    ]

    return (
        <aside
            className={cn(
                "sticky top-0 z-20 flex h-dvh w-78 flex-col justify-end lg:hidden"
            )}
        >
            <TableOfContents items={tocItems} />
            <SectionLine fit />
            <div className={cn("flex w-full gap-2 bg-background px-6 py-5.5")}>
                <Link href="/" className="group flex flex-1 gap-2">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 48 48"
                        className={cn(
                            "size-9 will-change-transform transition-[transform,rotate] ease-spring duration-700 group-hover:rotate-180"
                        )}
                    >
                        <path
                            className="fill-highlighted"
                            filter="url(#logo)"
                            d="M40.541 30.03c-3.115-.193-4.673-.29-5.248.671-.574.962.25 2.288 1.897 4.94l1.868 3.004c.964 1.551 1.446 2.327 1.243 3.093-.202.767-1.004 1.203-2.608 2.077l-3.994 2.174c-1.572.855-2.359 1.283-3.103 1.05-.745-.235-1.145-1.036-1.944-2.638l-1.595-3.196c-1.39-2.785-2.086-4.178-3.204-4.195-1.118-.016-1.854 1.356-3.325 4.1l-1.676 3.125c-.854 1.593-1.282 2.39-2.04 2.6-.757.209-1.533-.255-3.085-1.181L9.75 43.278c-1.552-.927-2.328-1.39-2.503-2.158-.174-.766.325-1.52 1.322-3.028l1.957-2.956c1.719-2.597 2.578-3.895 2.034-4.872-.545-.977-2.1-.928-5.213-.832l-3.552.11c-1.797.056-2.696.083-3.255-.464-.56-.548-.552-1.447-.535-3.245l.042-4.522c.017-1.815.026-2.722.603-3.26.576-.538 1.482-.484 3.294-.375l3.536.212c3.102.187 4.653.28 5.226-.68.573-.958-.245-2.28-1.88-4.923L8.965 9.273c-.955-1.544-1.432-2.316-1.232-3.079.2-.763.996-1.2 2.586-2.076l3.987-2.195c1.564-.86 2.346-1.291 3.09-1.062.745.229 1.15 1.024 1.96 2.616l1.62 3.186c1.402 2.754 2.102 4.13 3.216 4.142 1.114.012 1.843-1.35 3.302-4.073l1.64-3.063c.855-1.594 1.282-2.39 2.04-2.601.758-.21 1.534.254 3.087 1.181l3.974 2.374c1.552.928 2.329 1.391 2.503 2.158.175.767-.325 1.521-1.324 3.029l-1.919 2.896c-1.706 2.575-2.559 3.863-2.02 4.838.538.975 2.082.94 5.17.868l3.593-.083c1.777-.041 2.665-.062 3.22.482.553.544.55 1.433.541 3.21l-.021 4.577c-.008 1.826-.013 2.74-.591 3.28-.58.542-1.49.486-3.314.372l-3.53-.22Z"
                        />
                        <defs>
                            <filter id="logo" colorInterpolationFilters="sRGB">
                                <feColorMatrix
                                    in="SourceAlpha"
                                    result="alpha"
                                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                                />
                                <feGaussianBlur stdDeviation="4.18" />
                                <feComposite
                                    in2="alpha"
                                    operator="arithmetic"
                                    k2="-1"
                                    k3="1"
                                />
                                <feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0" />
                                <feBlend in2="SourceGraphic" />
                            </filter>
                        </defs>
                    </svg>
                    <div className="flex flex-col">
                        <Bold className="text-sm">
                            <At className="font-bold text-current" />
                            {siteConfig.username}
                        </Bold>
                        <p className="font-mono text-xs">
                            {projects.length} PROJECTS
                        </p>
                    </div>
                </Link>
                <ModeToggle />
                <Button size="icon" variant="outline">
                    <Ellipsis className="size-5.5" />
                </Button>
            </div>
        </aside>
    )
}

export default Sidebar
