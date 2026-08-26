"use client"

import { useEffect, useRef, useState } from "react"

import { ArrowLeft, Logo } from "@/components/icons/icons"
import { SectionLine } from "@/components/layout/line"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbMenu,
    BreadcrumbMenuPage,
    BreadcrumbPage
} from "@/components/ui/breadcrumb"
import {
    createDropdownMenuHandle,
    DropdownMenu,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLinkItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { getPreferences } from "@/hooks/use-preference"
import { getCategoryPath, groupProjectsByCategory } from "@/lib/project-sort"
import { cn } from "@/lib/utils"
import { useQueryStore } from "@/stores/query-store"

import { projects } from "~/.velite"

interface ProjectBreadcrumbProps {
    category: string
    categoryTitle: string
    projectName?: string
}

function PortfolioBreadcrumb({
    category,
    categoryTitle,
    projectName
}: ProjectBreadcrumbProps) {
    const listRef = useRef<HTMLOListElement>(null)

    const [menuHandle] = useState(createDropdownMenuHandle)

    const isSelectedCategory = category === "selected-works"
    const isFeatureSelected = useQueryStore((s) => s.isFeatureSelected)

    const isSelectedWorks = isSelectedCategory || isFeatureSelected

    useEffect(() => {
        const rafId = requestAnimationFrame(() => {
            const { motionReduced } = getPreferences()
            listRef.current?.scroll({
                left: listRef.current.scrollWidth,
                behavior: motionReduced ? "instant" : "smooth"
            })
        })
        return () => {
            cancelAnimationFrame(rafId)
        }
    }, [category, categoryTitle, projectName])

    return (
        <Breadcrumb
            className={cn("w-full min-w-0", {
                md: [
                    "fixed inset-x-0 bottom-[--toolbar-height] h-auto bg-background",
                    {
                        before: "absolute inset-0 z-1 bg-input/25"
                    }
                ]
            })}
        >
            <SectionLine
                fit
                containerClassName={cn("hidden", {
                    md: "absolute inset-x-0 top-0 z-2 block"
                })}
            />
            <BreadcrumbList
                ref={listRef}
                className={cn(
                    "w-full min-w-0 overflow-x-scroll px-safe-zone scroll-fade-x scroll-fade-24 scrollbar-thin",
                    {
                        md: "z-2"
                    }
                )}
            >
                <BreadcrumbItem
                    data-cursor={false}
                    className={cn("flex items-center gap-3.75")}
                >
                    <Logo
                        className={cn("-ms-0.5", {
                            md: "hidden"
                        })}
                    />
                    <BreadcrumbLink
                        data-cursor="target"
                        href="/portfolio"
                        scroll={false}
                    >
                        Portfolio
                    </BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbItem>
                    <BreadcrumbDropdownMenu
                        handle={menuHandle}
                        content={
                            isSelectedWorks ? (
                                <DropdownMenuGroup>
                                    <DropdownMenuLinkItem href="/portfolio#design-projects">
                                        Design Projects
                                    </DropdownMenuLinkItem>
                                    <DropdownMenuItem disabled>
                                        Coding Projects
                                    </DropdownMenuItem>
                                    {projectName && (
                                        <>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuGroup>
                                                <DropdownMenuLinkItem
                                                    href="/portfolio/selected-works"
                                                    className="gap-2"
                                                >
                                                    <ArrowLeft className="-ms-0.25 size-3 rtl:rotate-180" />
                                                    Selected Works
                                                </DropdownMenuLinkItem>
                                            </DropdownMenuGroup>
                                        </>
                                    )}
                                </DropdownMenuGroup>
                            ) : (
                                <>
                                    <DropdownMenuGroup>
                                        <DropdownMenuLinkItem href="/portfolio/selected-works">
                                            Selected Works
                                        </DropdownMenuLinkItem>
                                        <DropdownMenuItem disabled>
                                            Coding Projects
                                        </DropdownMenuItem>
                                    </DropdownMenuGroup>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuGroup>
                                        <DropdownMenuLinkItem
                                            href="/portfolio#design-projects"
                                            className="gap-2"
                                        >
                                            <ArrowLeft className="-ms-0.25 size-3 rtl:rotate-180" />
                                            Design Projects
                                        </DropdownMenuLinkItem>
                                    </DropdownMenuGroup>
                                </>
                            )
                        }
                    >
                        {isSelectedWorks ? "Selected Works" : "Design Projects"}
                    </BreadcrumbDropdownMenu>
                </BreadcrumbItem>

                {!isSelectedWorks && (
                    <BreadcrumbItem>
                        <BreadcrumbDropdownMenu
                            handle={menuHandle}
                            isPage={!projectName}
                            content={
                                <>
                                    <DropdownMenuGroup>
                                        {groupProjectsByCategory(projects)
                                            .filter(
                                                (g) =>
                                                    g.id !== category
                                                    && g.id !== "selected-works"
                                            )
                                            .map((g) => (
                                                <DropdownMenuLinkItem
                                                    key={g.id}
                                                    href={getCategoryPath(g.id)}
                                                >
                                                    {g.title}
                                                </DropdownMenuLinkItem>
                                            ))}
                                    </DropdownMenuGroup>
                                    {!!projectName && (
                                        <>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuGroup>
                                                <DropdownMenuLinkItem
                                                    href={getCategoryPath(
                                                        category
                                                    )}
                                                    className="gap-2"
                                                >
                                                    <ArrowLeft className="-ms-0.25 size-3 rtl:rotate-180" />
                                                    {categoryTitle}
                                                </DropdownMenuLinkItem>
                                            </DropdownMenuGroup>
                                        </>
                                    )}
                                </>
                            }
                        >
                            {categoryTitle}
                        </BreadcrumbDropdownMenu>
                    </BreadcrumbItem>
                )}

                {projectName && (
                    <BreadcrumbItem>
                        <BreadcrumbPage>
                            <bdi translate="no">{projectName}</bdi>
                        </BreadcrumbPage>
                    </BreadcrumbItem>
                )}
            </BreadcrumbList>

            <DropdownMenu handle={menuHandle} />
        </Breadcrumb>
    )
}

function BreadcrumbDropdownMenu({
    handle,
    isPage,
    content,
    children
}: {
    handle: ReturnType<typeof createDropdownMenuHandle>
    isPage?: boolean
    content: React.ReactNode
    children: React.ReactNode
}) {
    const [anchor, setAnchor] = useState<HTMLElement | null>(null)
    const Comp = isPage ? BreadcrumbMenuPage : BreadcrumbMenu

    return (
        <DropdownMenuTrigger
            handle={handle}
            render={<Comp anchorRef={setAnchor}>{children}</Comp>}
            payload={{
                anchor,
                sideOffset: 6,
                className: "min-w-auto",
                content
            }}
        />
    )
}

export { PortfolioBreadcrumb }
