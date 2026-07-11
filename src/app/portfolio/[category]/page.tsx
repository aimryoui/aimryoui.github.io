import { type Metadata } from "next"
import { notFound } from "next/navigation"

import { ArrowLeft, ArrowRight } from "@/components/icons/icons"
import { Divider } from "@/components/layout/divider"
import { ElementLine, SectionLine } from "@/components/layout/line"
import { Space } from "@/components/layout/space"
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationNext,
    PaginationPrevious
} from "@/components/ui/pagination"
import { Bold, Highlight, Text } from "@/components/ui/typography"
import { siteConfig } from "@/configs/site.config"
import {
    getCategoryPath,
    getProjectPath,
    groupProjectsByCategory
} from "@/lib/project-sort"
import { cn } from "@/lib/utils"
import FlashOverlay from "@/portfolio/_components/flash-overlay"
import SectionTitle from "@/portfolio/_components/section-title"
import Footer from "@/portfolio/_sections/footer"
import ProjectCard from "@/portfolio/[category]/_components/project-card"

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
    const prev = categoryIndex > 0 ? groups[categoryIndex - 1] : null
    const next =
        categoryIndex >= 0 && categoryIndex < groups.length - 1
            ? groups[categoryIndex + 1]
            : null

    if (!group) notFound()

    return (
        // <ViewTransition name="main">
        <main className={cn("relative flex-1")}>
            <FlashOverlay />
            <Space />
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
                                "bg-[radial-gradient(oklch(from_var(--color-stroke)_l_c_h/40%)_.125rem,transparent_.125rem),radial-gradient(oklch(from_var(--color-stroke)_l_c_h/40%)_.125rem,transparent_.125rem)] bg-[length:.75rem_.75rem] bg-[position:0_0,.375rem_.375rem]",
                                {
                                    md: "rounded-xl"
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
                            className={cn({
                                "[&:nth-child(odd)]":
                                    "border-r border-dashed border-stroke",
                                md: "!border-none"
                            })}
                        >
                            <ProjectCard
                                href={getProjectPath(project)}
                                project={project}
                            />
                            {index < group.projects.length - 1 && (
                                <SectionLine />
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
                        "grid size-full place-items-center bg-highlighted/10 px-6 py-4.5"
                    )}
                >
                    Category ends. What&#39;s next?
                </Highlight>
            </Space>
            <SectionLine />
            <section className={cn("bg-background")}>
                <Pagination>
                    <PaginationContent
                        className={cn(
                            "grid grid-cols-[1fr_var(--px)_1fr] items-center"
                        )}
                    >
                        <PaginationItem>
                            <PaginationPrevious
                                href={
                                    prev
                                        ? getCategoryPath(prev.id)
                                        : "/portfolio#projects"
                                }
                                {...(!prev && {
                                    label: "Go back to Projects page"
                                })}
                                className={cn(
                                    "group flex min-h-20 min-w-0 items-center justify-between gap-4 bg-background px-6 py-4.5 will-change-[background-color] transition-[background-color] duration-100",
                                    {
                                        hover: "bg-element-hover transition-none"
                                    }
                                )}
                            >
                                <ArrowLeft
                                    className={cn(
                                        "m-1 will-change-[transform,color] transition-[transform,color] ease-spring duration-500",
                                        {
                                            "group-hover":
                                                "scale-125 text-highlighted transition-[transform]"
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
                                            <Bold
                                                className={cn(
                                                    "will-change-[color,font-variation-settings] wrap-anywhere transition-[color,font-variation-settings] ease-spring duration-500",
                                                    {
                                                        "group-hover":
                                                            "text-highlighted font-wght-900 transition-[font-variation-settings]"
                                                    }
                                                )}
                                            >
                                                {prev.title}
                                            </Bold>
                                            <Text
                                                className={cn(
                                                    "text-sm will-change-[color] wrap-anywhere transition-[color] duration-100",
                                                    {
                                                        "group-hover":
                                                            "text-foreground transition-none"
                                                    }
                                                )}
                                            >
                                                {prev.note}
                                            </Text>
                                        </>
                                    ) : (
                                        <>
                                            <Text
                                                className={cn(
                                                    "inline will-change-[color] transition-[color] duration-100",
                                                    {
                                                        "group-hover":
                                                            "text-foreground transition-none",
                                                        sm: "text-sm"
                                                    }
                                                )}
                                            >
                                                Back to
                                            </Text>{" "}
                                            <Bold
                                                className={cn(
                                                    "will-change-[color,font-variation-settings] wrap-anywhere transition-[color,font-variation-settings] ease-spring duration-500",
                                                    {
                                                        "group-hover":
                                                            "text-highlighted font-wght-900 transition-[font-variation-settings]"
                                                    }
                                                )}
                                            >
                                                Projects
                                            </Bold>
                                        </>
                                    )}
                                </div>
                            </PaginationPrevious>
                        </PaginationItem>
                        <li className="h-full">
                            <ElementLine />
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
                                    "group flex min-h-20 min-w-0 items-center justify-between gap-4 bg-background px-6 py-4.5 will-change-[background-color] transition-[background-color] duration-100",
                                    {
                                        hover: "bg-element-hover transition-none"
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
                                            <Bold
                                                className={cn(
                                                    "will-change-[color,font-variation-settings] wrap-anywhere transition-[color,font-variation-settings] ease-spring duration-500",
                                                    {
                                                        "group-hover":
                                                            "text-highlighted font-wght-900 transition-[font-variation-settings]"
                                                    }
                                                )}
                                            >
                                                {next.title}
                                            </Bold>
                                            <Text
                                                className={cn(
                                                    "text-sm will-change-[color] wrap-anywhere transition-[color] duration-100",
                                                    {
                                                        "group-hover":
                                                            "text-foreground transition-none"
                                                    }
                                                )}
                                            >
                                                {next.note}
                                            </Text>
                                        </>
                                    ) : (
                                        <>
                                            <Text
                                                className={cn(
                                                    "inline will-change-[color] transition-[color] duration-100",
                                                    {
                                                        "group-hover":
                                                            "text-foreground transition-none",
                                                        sm: "text-sm"
                                                    }
                                                )}
                                            >
                                                No more categories.
                                            </Text>{" "}
                                            <Bold
                                                className={cn(
                                                    "will-change-[color,font-variation-settings] wrap-anywhere transition-[color,font-variation-settings] ease-spring duration-500",
                                                    {
                                                        "group-hover":
                                                            "text-highlighted font-wght-900 transition-[font-variation-settings]"
                                                    }
                                                )}
                                            >
                                                Contact me
                                            </Bold>
                                        </>
                                    )}
                                </div>
                                <ArrowRight
                                    className={cn(
                                        "m-1 will-change-[transform,color] transition-[transform,color] ease-spring duration-500",
                                        {
                                            "group-hover":
                                                "scale-125 text-highlighted transition-[transform]"
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
