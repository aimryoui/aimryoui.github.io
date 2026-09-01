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
import { getCategoryPath, groupProjectsByCategory } from "@/lib/project-sort"
import { cn } from "@/lib/utils"
import { BoldPart, TextPart } from "@/portfolio/[category]/_components/shared"

import { projects } from "~/.velite"

const buildCategoryHref = (basePath: string, roleParam: string | null) => {
    const [path, hash] = basePath.split("#")
    const query = new URLSearchParams()
    if (roleParam) query.set(ROLE_QUERY_PARAM_KEY, roleParam)
    const qs = query.toString()
    const urlWithQuery = qs ? `${path}?${qs}` : path
    return hash ? `${urlWithQuery}#${hash}` : urlWithQuery
}

interface CategoryPaginationProps {
    category: string
}

function CategoryPagination({ category }: CategoryPaginationProps) {
    const searchParams = useClientSearchParams()
    const r = searchParams.get(ROLE_QUERY_PARAM_KEY)

    const role = (PORTFOLIO_ROLES as readonly string[]).includes(r ?? "")
        ? (r as typeof DEFAULT_PORTFOLIO_ROLE)
        : DEFAULT_PORTFOLIO_ROLE

    const groups = useMemo(
        () => groupProjectsByCategory(projects, role),
        [role]
    )

    const categoryIndex = groups.findIndex((g) => g.id === category)

    const prevGroup = categoryIndex > 0 ? groups[categoryIndex - 1] : null
    const prev = prevGroup?.id === "selected-works" ? null : prevGroup
    const next =
        categoryIndex >= 0 && categoryIndex < groups.length - 1
            ? groups[categoryIndex + 1]
            : null

    const isSelectedWorks = category === "selected-works"

    return (
        <Pagination>
            <PaginationContent
                className={cn("grid grid-cols-[1fr_0_1fr] items-center")}
            >
                <PaginationItem>
                    <PaginationPrevious
                        href={
                            prev
                                ? buildCategoryHref(getCategoryPath(prev.id), r)
                                : isSelectedWorks
                                  ? buildCategoryHref("/portfolio#selected-works", r)
                                  : buildCategoryHref("/portfolio#design-projects", r)
                        }
                        {...(!prev && {
                            label: isSelectedWorks
                                ? "Go back to Portfolio"
                                : "Go back to Design Projects"
                        })}
                        tracking={{
                            eventName: prev
                                ? "navigate_category"
                                : "navigate_hash",
                            eventParams: {
                                category_id: prev
                                    ? prev.id
                                    : isSelectedWorks
                                      ? "selected-works"
                                      : "design-projects",
                                category_title: prev
                                    ? prev.title
                                    : isSelectedWorks
                                      ? "Portfolio"
                                      : "Design Projects",
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
                            {prev ? (
                                <>
                                    <BoldPart>{prev.title}</BoldPart>
                                    <TextPart secodary>{prev.note}</TextPart>
                                </>
                            ) : (
                                <>
                                    <TextPart>Back to</TextPart>{" "}
                                    <BoldPart>
                                        {isSelectedWorks
                                            ? "Portfolio"
                                            : "Design Projects"}
                                    </BoldPart>
                                </>
                            )}
                        </div>
                    </PaginationPrevious>
                </PaginationItem>
                <li className="h-full">
                    <SvgElementLine className="h-full" />
                </li>
                <PaginationItem>
                    <PaginationNext
                        href={
                            next
                                ? buildCategoryHref(getCategoryPath(next.id), r)
                                : buildCategoryHref("/portfolio#contact", r)
                        }
                        {...(!next && {
                            label: "No more categories, contact me"
                        })}
                        tracking={{
                            eventName: next
                                ? "navigate_category"
                                : "navigate_hash",
                            eventParams: {
                                category_id: next ? next.id : "contact",
                                category_title: next ? next.title : "Contact",
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
                            {next ? (
                                <>
                                    <BoldPart>{next.title}</BoldPart>
                                    <TextPart secodary>{next.note}</TextPart>
                                </>
                            ) : (
                                <>
                                    <TextPart>No more categories.</TextPart>{" "}
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
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    )
}

export type { CategoryPaginationProps }
export { CategoryPagination }
