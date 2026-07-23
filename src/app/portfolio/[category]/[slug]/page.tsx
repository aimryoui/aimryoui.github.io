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
import { resolveSocialData } from "@/portfolio/_helpers/resolve-social-data"
import Footer from "@/portfolio/_sections/footer"
import ProjectCard from "@/portfolio/[category]/_components/project-card"
import { AmbientStyle } from "@/portfolio/[category]/[slug]/_components/ambient-style"
import SocialButton from "@/portfolio/[category]/[slug]/_components/social-button"

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

    const prev = projectIndex > 0 ? categoryProjects[projectIndex - 1] : null
    const next =
        projectIndex < categoryProjects.length - 1
            ? categoryProjects[projectIndex + 1]
            : null
    const nextCategory =
        !next && groupIndex < groups.length - 1 ? groups[groupIndex + 1] : null

    const socialData = resolveSocialData(project.social)

    return (
        // <ViewTransition name="main">
        <main className={cn("relative flex-1")}>
            <AmbientStyle project={project} category={category} />
            <FlashOverlay />
            <section>
                {socialData ? (
                    <Space
                        className={cn(
                            "pointer-events-none sticky top-0 z-60 flex items-center justify-end bg-transparent px-6"
                        )}
                    >
                        <SocialButton
                            social={project.social}
                            className={cn({
                                lg: "fixed bottom-25 right-6 h-[36px] text-base"
                            })}
                        />
                    </Space>
                ) : (
                    <Space />
                )}
                <SectionLine showDecoration />
                <Space
                    {...(socialData && {
                        className: cn("relative", {
                            before: "absolute inset-x-0 bottom-full h-20 bg-background"
                        })
                    })}
                />
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

                    <MDXContent
                        code={project.code}
                        hasSocialLinks={!!socialData}
                    />
                </article>
            </section>

            <Space className={cn("grid place-items-center")}>
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
                <Pagination>
                    <PaginationContent
                        className={cn(
                            "grid grid-cols-[1fr_0_1fr] items-center"
                        )}
                    >
                        <PaginationItem>
                            {prev ? (
                                <ProjectCard
                                    href={getProjectPath(prev)}
                                    project={prev}
                                    projectNavigation
                                    navigation="backward"
                                />
                            ) : (
                                <PaginationPrevious
                                    href={getCategoryPath(category)}
                                    label={`Go back to ${group.title} category page`}
                                    className={cn(
                                        "group flex min-h-20 min-w-0 items-center justify-between gap-4 px-6 py-4.5 transition-[background-color] duration-100",
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
                                        className={cn("text-end", {
                                            sm: "flex flex-col"
                                        })}
                                    >
                                        <Text
                                            className={cn(
                                                "inline wrap-anywhere transition-[color] duration-100",
                                                {
                                                    "group-hover":
                                                        "text-foreground transition-none",
                                                    "group-active":
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
                                                        "text-highlighted font-wght-900 transition-[font-variation-settings]",
                                                    "group-active":
                                                        "text-highlighted transition-none"
                                                }
                                            )}
                                        >
                                            {group.title}
                                        </Bold>
                                    </div>
                                </PaginationPrevious>
                            )}
                        </PaginationItem>
                        <li className="h-full">
                            <SvgElementLine />
                        </li>
                        <PaginationItem>
                            {next ? (
                                <ProjectCard
                                    href={getProjectPath(next)}
                                    project={next}
                                    projectNavigation
                                    navigation="forward"
                                />
                            ) : (
                                <PaginationNext
                                    href={
                                        nextCategory
                                            ? getCategoryPath(nextCategory.id)
                                            : "/portfolio#contact"
                                    }
                                    label={
                                        nextCategory
                                            ? `Go next to ${nextCategory.title} category page`
                                            : "No more projects, contact me"
                                    }
                                    className={cn(
                                        "group flex min-h-20 min-w-0 items-center justify-between gap-4 px-6 py-4.5 transition-[background-color] duration-100",
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
                                                <Text
                                                    className={cn(
                                                        "inline wrap-anywhere transition-[color] duration-100",
                                                        {
                                                            "group-hover":
                                                                "text-foreground transition-none",
                                                            "group-active":
                                                                "text-foreground transition-none",
                                                            sm: "text-sm"
                                                        }
                                                    )}
                                                >
                                                    Next to
                                                </Text>{" "}
                                                <Bold
                                                    className={cn(
                                                        "will-change-[color,font-variation-settings] wrap-anywhere transition-[color,font-variation-settings] ease-spring duration-500",
                                                        {
                                                            "group-hover":
                                                                "text-highlighted font-wght-900 transition-[font-variation-settings]",
                                                            "group-active":
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
                                                        "inline wrap-anywhere transition-[color] duration-100",
                                                        {
                                                            "group-hover":
                                                                "text-foreground transition-none",
                                                            "group-active":
                                                                "text-foreground transition-none",
                                                            sm: "text-sm"
                                                        }
                                                    )}
                                                >
                                                    No more projects.
                                                </Text>{" "}
                                                <Bold
                                                    className={cn(
                                                        "will-change-[color,font-variation-settings] wrap-anywhere transition-[color,font-variation-settings] ease-spring duration-500",
                                                        {
                                                            "group-hover":
                                                                "text-highlighted font-wght-900 transition-[font-variation-settings]",
                                                            "group-active":
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
                            )}
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </section>

            <SectionLine />
            <Divider />
            <SectionLine />

            <Footer hasSocialLinks={!!socialData} />
        </main>
        // </ViewTransition>
    )
}
