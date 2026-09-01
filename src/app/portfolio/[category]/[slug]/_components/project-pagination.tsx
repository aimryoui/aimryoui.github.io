"use client"

import { useMemo } from "react"

import { ArrowLeft, ArrowRight } from "@/components/icons/icons"
import { SvgElementLine } from "@/components/layout/line"
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationNext,
    PaginationPrevious
} from "@/components/ui/pagination"
import {
    DEFAULT_PORTFOLIO_ROLE,
    PORTFOLIO_ROLES,
    ROLE_QUERY_PARAM_KEY
} from "@/configs/role.config"
import { useClientSearchParams } from "@/hooks/use-client-search-params"
import {
    getCategoryPath,
    getProjectPath,
    getProjectRouteSlug,
    groupProjectsByCategory
} from "@/lib/project-sort"
import { cn } from "@/lib/utils"
import ProjectCard from "@/portfolio/_components/cards/project-card"
import { BoldPart, TextPart } from "@/portfolio/[category]/_components/shared"

import { projects } from "~/.velite"

const buildProjectHref = (
    basePath: string,
    roleParam: string | null,
    isSelectedWorksMode: boolean,
    preserveFeature = true
) => {
    const [path, hash] = basePath.split("#")
    const query = new URLSearchParams()
    if (isSelectedWorksMode && preserveFeature) {
        query.set("feature", "selected")
    }
    if (roleParam) query.set(ROLE_QUERY_PARAM_KEY, roleParam)
    const qs = query.toString()
    const urlWithQuery = qs ? `${path}?${qs}` : path
    return hash ? `${urlWithQuery}#${hash}` : urlWithQuery
}

interface ProjectPaginationProps {
    category: string
    slug: string
}

function ProjectPagination({ category, slug }: ProjectPaginationProps) {
    const searchParams = useClientSearchParams()
    const r = searchParams.get(ROLE_QUERY_PARAM_KEY)
    const feature = searchParams.get("feature")

    const role = (PORTFOLIO_ROLES as readonly string[]).includes(r ?? "")
        ? (r as typeof DEFAULT_PORTFOLIO_ROLE)
        : DEFAULT_PORTFOLIO_ROLE
    const isSelectedWorksMode = feature === "selected"

    const groups = useMemo(
        () => groupProjectsByCategory(projects, role),
        [role]
    )

    const targetCategoryId = isSelectedWorksMode ? "selected-works" : category
    const groupIndex = groups.findIndex((g) => g.id === targetCategoryId)
    const group = groupIndex === -1 ? null : groups[groupIndex]

    const categoryProjects = group?.projects ?? []
    const projectIndex = categoryProjects.findIndex(
        (p) => getProjectRouteSlug(p) === slug
    )

    const prev = projectIndex > 0 ? categoryProjects[projectIndex - 1] : null
    const next =
        projectIndex !== -1 && projectIndex < categoryProjects.length - 1
            ? categoryProjects[projectIndex + 1]
            : null
    const nextCategory =
        !next && groupIndex !== -1 && groupIndex < groups.length - 1
            ? groups[groupIndex + 1]
            : null

    if (!group) return null

    return (
        <Pagination>
            <PaginationContent
                className={cn("grid grid-cols-[1fr_0_1fr] items-center")}
            >
                <PaginationItem>
                    {prev ? (
                        <ProjectCard
                            href={buildProjectHref(
                                getProjectPath(prev),
                                r,
                                isSelectedWorksMode
                            )}
                            project={prev}
                            navigation="backward"
                        />
                    ) : (
                        <PaginationPrevious
                            href={buildProjectHref(
                                getCategoryPath(group.id),
                                r,
                                isSelectedWorksMode,
                                false
                            )}
                            label={`Go back to ${group.title} category page`}
                            tracking={{
                                eventName: "navigate_category",
                                eventParams: {
                                    category_id: group.id,
                                    category_title: group.title,
                                    direction: "backward"
                                }
                            }}
                            className={cn(
                                "group flex min-h-space min-w-0 items-center justify-between gap-4 px-safe-zone py-safe-zone-vertical transition-[background-color] duration-100",
                                {
                                    hover: "bg-highlighted/5 transition-none",
                                    active: "bg-highlighted/10 transition-none"
                                }
                            )}
                        >
                            <ArrowLeft
                                className={cn(
                                    "m-1 transition-[color] duration-100",
                                    {
                                        rtl: "rotate-180",
                                        "group-hover":
                                            "text-highlighted transition-none",
                                        "group-active":
                                            "text-highlighted transition-none"
                                    }
                                )}
                            />
                            <div
                                className={cn("text-end", {
                                    sm: "flex flex-col"
                                })}
                            >
                                <TextPart>Back to</TextPart>{" "}
                                <BoldPart>{group.title}</BoldPart>
                            </div>
                        </PaginationPrevious>
                    )}
                </PaginationItem>
                <li className="h-full">
                    <SvgElementLine className="h-full" />
                </li>
                <PaginationItem>
                    {next ? (
                        <ProjectCard
                            href={buildProjectHref(
                                getProjectPath(next),
                                r,
                                isSelectedWorksMode
                            )}
                            project={next}
                            navigation="forward"
                        />
                    ) : (
                        <PaginationNext
                            href={
                                nextCategory
                                    ? buildProjectHref(
                                          getCategoryPath(nextCategory.id),
                                          r,
                                          isSelectedWorksMode,
                                          false
                                      )
                                    : buildProjectHref(
                                          "/portfolio#contact",
                                          r,
                                          isSelectedWorksMode,
                                          false
                                      )
                            }
                            label={
                                nextCategory
                                    ? `Go next to ${nextCategory.title} category page`
                                    : "No more projects, contact me"
                            }
                            tracking={{
                                eventName: nextCategory
                                    ? "navigate_category"
                                    : "navigate_hash",
                                eventParams: {
                                    category_id: nextCategory
                                        ? nextCategory.id
                                        : "contact",
                                    category_title: nextCategory
                                        ? nextCategory.title
                                        : "Contact",
                                    direction: "forward"
                                }
                            }}
                            className={cn(
                                "group flex min-h-space min-w-0 items-center justify-between gap-4 px-safe-zone py-safe-zone-vertical transition-[background-color] duration-100",
                                {
                                    hover: "bg-highlighted/5 transition-none",
                                    active: "bg-highlighted/10 transition-none"
                                }
                            )}
                        >
                            <div
                                className={cn({
                                    sm: "flex flex-col"
                                })}
                            >
                                {nextCategory ? (
                                    <>
                                        <TextPart>Next to</TextPart>{" "}
                                        <BoldPart>
                                            {nextCategory.title}
                                        </BoldPart>
                                    </>
                                ) : (
                                    <>
                                        <TextPart>No more projects.</TextPart>{" "}
                                        <BoldPart>Contact me</BoldPart>
                                    </>
                                )}
                            </div>
                            <ArrowRight
                                className={cn(
                                    "m-1 transition-[color] duration-100",
                                    {
                                        rtl: "rotate-180",
                                        "group-hover":
                                            "text-highlighted transition-none",
                                        "group-active":
                                            "text-highlighted transition-none"
                                    }
                                )}
                            />
                        </PaginationNext>
                    )}
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    )
}

export type { ProjectPaginationProps }
export { ProjectPagination }
