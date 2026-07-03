import { type Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import { ArrowLeft, ArrowRight } from "@/components/icons/icons"
import { Divider } from "@/components/layout/divider"
import { ElementLine, SectionLine } from "@/components/layout/line"
import { Space } from "@/components/layout/space"
import { Bold, Highlight, Text } from "@/components/ui/typography"
import { siteConfig } from "@/configs/site.config"
import {
    getCategoryPath,
    getProjectPath,
    getProjectRouteSlug,
    groupProjectsByCategory
} from "@/lib/project-sort"
import { cn } from "@/lib/utils"
import FlashOverlay from "@/portfolio/_components/flash-overlay"
import { MDXContent } from "@/portfolio/_components/mdx-content"
import ProjectHeader from "@/portfolio/_components/project-header"
import Footer from "@/portfolio/_sections/footer"
import ProjectCard from "@/portfolio/[category]/_components/project-card"

import { projects } from "~/.velite"

interface ProjectPageProps {
    params: Promise<{
        category: string
        slug: string
    }>
}

export function generateStaticParams() {
    return groupProjectsByCategory(projects).flatMap((group) =>
        group.projects.map((project) => ({
            category: group.id,
            slug: getProjectRouteSlug(project)
        }))
    )
}

const APP_FULL_URL = siteConfig.fullUrl
const APP_BASE_PATH = "/portfolio"

export async function generateMetadata({
    params
}: ProjectPageProps): Promise<Metadata> {
    const { category, slug } = await params
    const groups = groupProjectsByCategory(projects)
    const project = groups
        .find((g) => g.id === category)
        ?.projects.find((p) => getProjectRouteSlug(p) === slug)

    if (!project) {
        return {}
    }

    const SLUG_TITLE = `Project — ${project.projectName} | aimryoui`
    const SLUG_DESCRIPTION =
        project.detail?.description ?? "Project detail page."
    const portfolioOgImage = `${siteConfig.fullUrl}/portfolio/opengraph-image.jpg`

    return {
        title: SLUG_TITLE,
        description: SLUG_DESCRIPTION,
        openGraph: {
            title: SLUG_TITLE,
            description: SLUG_DESCRIPTION,
            type: "website",
            url: APP_FULL_URL + APP_BASE_PATH,
            siteName: siteConfig.domain,
            locale: "vi_VN",
            images: [{ url: portfolioOgImage }]
        },
        twitter: {
            card: "summary_large_image",
            title: SLUG_TITLE,
            description: SLUG_DESCRIPTION,
            site: APP_FULL_URL + APP_BASE_PATH,
            images: [portfolioOgImage]
        }
    }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
    const { category, slug } = await params
    const groups = groupProjectsByCategory(projects)
    const groupIndex = groups.findIndex((g) => g.id === category)
    const group = groupIndex === -1 ? null : groups[groupIndex]

    const categoryProjects = group?.projects ?? []
    const projectIndex = categoryProjects.findIndex(
        (p) => getProjectRouteSlug(p) === slug
    )
    const project = projectIndex === -1 ? null : categoryProjects[projectIndex]

    if (!group || !project) notFound()

    // Get prev and next project
    const prev = projectIndex > 0 ? categoryProjects[projectIndex - 1] : null
    const next =
        projectIndex < categoryProjects.length - 1
            ? categoryProjects[projectIndex + 1]
            : null
    // Get next category if there is no more project in current category
    const nextCategory =
        !next && groupIndex < groups.length - 1 ? groups[groupIndex + 1] : null

    return (
        // <ViewTransition name="main">
        <main className={cn("relative flex-1")}>
            <FlashOverlay />
            <section>
                <Space />
                <SectionLine showDecoration />
                <Space />
                <SectionLine />
                <article>
                    <ProjectHeader
                        type={project.type}
                        projectName={project.projectName}
                        category={project.category}
                        information={project.information}
                        tools={project.tools}
                        detail={project.detail}
                    />

                    <SectionLine />
                    <Divider />
                    <SectionLine />

                    <MDXContent code={project.code} />
                </article>
            </section>

            <SectionLine />
            <Divider />
            <SectionLine />

            <Space
                className={cn("grid place-items-center", {
                    md: "min-h-16"
                })}
            >
                <Highlight
                    className={cn(
                        "grid size-full place-items-center bg-highlighted/10 px-6 py-4.5"
                    )}
                >
                    Project ends. What&#39;s next?
                </Highlight>
            </Space>

            <SectionLine />

            <section className={cn("bg-background")}>
                <div
                    className={cn(
                        "grid grid-cols-[1fr_var(--px)_1fr] items-center"
                    )}
                >
                    {prev ? (
                        <ProjectCard
                            href={getProjectPath(prev)}
                            navigation="backward"
                            projectNavigation
                            project={prev}
                            projectName={prev.projectName}
                            category={prev.category}
                        />
                    ) : (
                        <Link
                            href={getCategoryPath(category)}
                            className={cn(
                                "group flex h-full items-center justify-between gap-4 bg-background px-6 py-4.5 will-change-[background-color] transition-[background-color] duration-100",
                                {
                                    hover: "bg-element-hover transition-none"
                                }
                            )}
                        >
                            <ArrowLeft
                                className={cn(
                                    "m-1 will-change-[color] transition-[color] duration-100",
                                    {
                                        "group-hover":
                                            "text-highlighted transition-none"
                                    }
                                )}
                            />
                            <div
                                className={cn("text-end", {
                                    sm: "flex flex-col"
                                })}
                            >
                                <Text
                                    className={cn(
                                        "inline will-change-[color] wrap-anywhere transition-[color] duration-100",
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
                                        "will-change-[color] wrap-anywhere transition-[color] duration-100",
                                        {
                                            "group-hover":
                                                "text-highlighted transition-none"
                                        }
                                    )}
                                >
                                    {group.title}
                                </Bold>
                            </div>
                        </Link>
                    )}
                    <ElementLine />
                    {next ? (
                        <ProjectCard
                            href={getProjectPath(next)}
                            projectNavigation
                            project={next}
                            projectName={next.projectName}
                            category={next.category}
                        />
                    ) : (
                        <Link
                            href={
                                nextCategory
                                    ? getCategoryPath(nextCategory.id)
                                    : "/portfolio#contact"
                            }
                            className={cn(
                                "group flex h-full items-center justify-between gap-4 bg-background px-6 py-4.5 will-change-[background-color] transition-[background-color] duration-100",
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
                                {nextCategory ? (
                                    <>
                                        <Text
                                            className={cn(
                                                "inline will-change-[color] wrap-anywhere transition-[color] duration-100",
                                                {
                                                    "group-hover":
                                                        "text-foreground transition-none",
                                                    sm: "text-sm"
                                                }
                                            )}
                                        >
                                            Next to
                                        </Text>{" "}
                                        <Bold
                                            className={cn(
                                                "will-change-[color] wrap-anywhere transition-[color] duration-100",
                                                {
                                                    "group-hover":
                                                        "text-highlighted transition-none"
                                                }
                                            )}
                                        >
                                            {nextCategory.title}
                                        </Bold>
                                    </>
                                ) : (
                                    <>
                                        <Text
                                            className={cn(
                                                "inline will-change-[color] wrap-anywhere transition-[color] duration-100",
                                                {
                                                    "group-hover":
                                                        "text-foreground transition-none",
                                                    sm: "text-sm"
                                                }
                                            )}
                                        >
                                            End of portfolio.
                                        </Text>{" "}
                                        <Bold
                                            className={cn(
                                                "will-change-[color] wrap-anywhere transition-[color] duration-100",
                                                {
                                                    "group-hover":
                                                        "text-highlighted transition-none"
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
                                    "m-1 will-change-[color] transition-[color] duration-100",
                                    {
                                        "group-hover":
                                            "text-highlighted transition-none"
                                    }
                                )}
                            />
                        </Link>
                    )}
                </div>
            </section>

            <SectionLine />
            <Divider />
            <SectionLine />

            <Footer />
        </main>
        // </ViewTransition>
    )
}
