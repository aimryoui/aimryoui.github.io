import { type Metadata } from "next"
import { notFound } from "next/navigation"

import { ArrowLeft, ArrowRight } from "@/components/icons/icons"
import { Divider } from "@/components/layout/divider"
import { SectionLine, SvgElementLine } from "@/components/layout/line"
import { Space } from "@/components/layout/space"
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationNext,
    PaginationPrevious
} from "@/components/ui/pagination"
import { Highlight } from "@/components/ui/typography"
import { siteConfig } from "@/configs/site.config"
import {
    getCategoryPath,
    getProjectPath,
    groupProjectsByCategory
} from "@/lib/project-sort"
import { cn } from "@/lib/utils"
import ProjectCard from "@/portfolio/_components/cards/project-card"
import FlashOverlay from "@/portfolio/_components/flash-overlay"
import { PortfolioBreadcrumb } from "@/portfolio/_components/portfolio-breadcrumb"
import SectionTitle from "@/portfolio/_components/section-title"
import Footer from "@/portfolio/_sections/footer"
import { BoldPart, TextPart } from "@/portfolio/[category]/_components/shared"

import { projects } from "~/.velite"

interface CategoryPageProps {
    params: Promise<{
        category: string
    }>
}

export function generateStaticParams() {
    const groups = groupProjectsByCategory(projects)

    return groups.map((group) => ({
        category: group.id
    }))
}

const APP_FULL_URL = siteConfig.fullUrl
const APP_BASE_PATH = "/portfolio"

export async function generateMetadata({
    params
}: CategoryPageProps): Promise<Metadata> {
    const { category } = await params
    const groups = groupProjectsByCategory(projects)
    const group = groups.find((projectGroup) => projectGroup.id === category)

    if (!group) {
        return {}
    }

    const CATEGORY_TITLE = `${group.title} Projects | aimryoui`
    const CATEGORY_DESCRIPTION = `${group.title} Category detail page.`
    const portfolioOgImage = `${siteConfig.fullUrl}/portfolio/opengraph-image.jpg`

    return {
        title: CATEGORY_TITLE,
        description: CATEGORY_DESCRIPTION,
        openGraph: {
            title: CATEGORY_TITLE,
            description: CATEGORY_DESCRIPTION,
            type: "website",
            url: APP_FULL_URL + APP_BASE_PATH,
            siteName: siteConfig.domain,
            locale: "vi_VN",
            images: [{ url: portfolioOgImage }]
        },
        twitter: {
            card: "summary_large_image",
            title: CATEGORY_TITLE,
            description: CATEGORY_DESCRIPTION,
            site: APP_FULL_URL + APP_BASE_PATH,
            images: [portfolioOgImage]
        }
    }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
    const { category } = await params
    const groups = groupProjectsByCategory(projects)
    const categoryIndex = groups.findIndex(
        (projectGroup) => projectGroup.id === category
    )
    const group = groups.find((projectGroup) => projectGroup.id === category)

    // Get prev and next category
    const prevGroup = categoryIndex > 0 ? groups[categoryIndex - 1] : null
    const prev = prevGroup?.id === "selected-works" ? null : prevGroup
    const next =
        categoryIndex >= 0 && categoryIndex < groups.length - 1
            ? groups[categoryIndex + 1]
            : null

    const isSelectedWorks = category === "selected-works"

    if (!group) notFound()

    return (
        // <ViewTransition name="main">
        <main className={cn("relative flex-1")}>
            <FlashOverlay />
            <Space
                className={cn("flex items-center justify-start px-safe-zone")}
            >
                <PortfolioBreadcrumb
                    category={category}
                    categoryTitle={group.title}
                />
            </Space>
            <SectionLine showDecoration />
            <Space />
            <SectionLine />
            <section>
                <SectionTitle
                    id={group.id}
                    title={group.title}
                    note={group.note}
                />
                <SectionLine />
                <div className={cn("bg-background")}>
                    <div className={cn("bg-highlighted/10 p-2")}>
                        <div
                            className={cn(
                                "flex aspect-3 size-full items-center justify-evenly rounded-2xl border border-highlighted bg-background",
                                "bg-[image:radial-gradient(oklch(from_var(--color-stroke)_l_c_h/40%)_.125rem,transparent_.125rem),radial-gradient(oklch(from_var(--color-stroke)_l_c_h/40%)_.125rem,transparent_.125rem)] bg-[length:.75rem_.75rem] bg-[position:0_0,.375rem_.375rem]",
                                {
                                    md: "rounded-xl",
                                    sm: "bg-[image:radial-gradient(oklch(from_var(--color-stroke)_l_c_h/40%)_.09375rem,transparent_.09375rem),radial-gradient(oklch(from_var(--color-stroke)_l_c_h/40%)_.09375rem,transparent_.09375rem)] bg-[length:.5625rem_.5625rem] bg-[position:0_0,.28125rem_.28125rem]"
                                }
                            )}
                        >
                            {group.icons}
                        </div>
                    </div>
                </div>
                <SectionLine />
                <Divider />
                <SectionLine />
                <ul
                    className={cn(
                        "grid grid-cols-2 bg-background md:grid-cols-1"
                    )}
                >
                    {group.projects.map((project, index) => (
                        <li
                            key={project.slug}
                            data-cursor="target"
                            className="group"
                        >
                            <ProjectCard
                                href={getProjectPath(project)}
                                project={project}
                            />
                            {index < group.projects.length - 1 && (
                                <SectionLine
                                    className={cn({
                                        lg: "w-[calc(100%+var(--spacing-safe-zone))]",
                                        "group-odd": "right-0",
                                        "group-even": [
                                            "w-[calc(100%+var(--spacing-safe-zone))]",
                                            {
                                                lg: "-right-safe-zone left-auto"
                                            }
                                        ]
                                    })}
                                />
                            )}
                        </li>
                    ))}
                </ul>
            </section>
            <SectionLine />
            <Divider />
            <SectionLine />
            <Space className={cn("grid place-items-center")}>
                <Highlight
                    className={cn(
                        "grid size-full place-items-center bg-highlighted/10 px-safe-zone py-safe-zone-vertical"
                    )}
                >
                    {isSelectedWorks
                        ? "That's what I've picked. What's next?"
                        : "Category ends. What's next?"}
                </Highlight>
            </Space>
            <SectionLine />
            <section className={cn("bg-background")}>
                <Pagination>
                    <PaginationContent
                        className={cn(
                            "grid grid-cols-[1fr_0_1fr] items-center"
                        )}
                    >
                        <PaginationItem>
                            <PaginationPrevious
                                href={
                                    prev
                                        ? getCategoryPath(prev.id)
                                        : isSelectedWorks
                                          ? "/portfolio#selected-works"
                                          : "/portfolio#design-projects"
                                }
                                {...(!prev && {
                                    label: isSelectedWorks
                                        ? "Go back to Portfolio"
                                        : "Go back to Design Projects"
                                })}
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
                                            "group-hover":
                                                "text-highlighted transition-none",
                                            "group-active":
                                                "text-highlighted transition-none"
                                        }
                                    )}
                                />
                                <div
                                    className={cn("text-right", {
                                        sm: "flex flex-col"
                                    })}
                                >
                                    {prev ? (
                                        <>
                                            <BoldPart>{prev.title}</BoldPart>
                                            <TextPart secodary>
                                                {prev.note}
                                            </TextPart>
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
                            <SvgElementLine />
                        </li>
                        <PaginationItem>
                            <PaginationNext
                                href={
                                    next
                                        ? getCategoryPath(next.id)
                                        : "/portfolio#contact"
                                }
                                {...(!next && {
                                    label: "No more categories, contact me"
                                })}
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
                                            <TextPart secodary>
                                                {next.note}
                                            </TextPart>
                                        </>
                                    ) : (
                                        <>
                                            <TextPart>
                                                No more categories.
                                            </TextPart>{" "}
                                            <BoldPart>Contact me</BoldPart>
                                        </>
                                    )}
                                </div>
                                <ArrowRight
                                    className={cn(
                                        "m-1 transition-[color] duration-100",
                                        {
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
            </section>
            <SectionLine />
            <Divider />
            <SectionLine />

            <Footer />
        </main>
        // </ViewTransition>
    )
}
