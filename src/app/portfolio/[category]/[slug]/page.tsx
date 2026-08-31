import { type Metadata } from "next"
import { notFound } from "next/navigation"

import { ArrowLeft, ArrowRight } from "@/components/icons/icons"
import { Divider } from "@/components/layout/divider"
import {
    MarginLine,
    SectionLine,
    SvgElementLine
} from "@/components/layout/line"
import { Note } from "@/components/layout/note"
import { Space } from "@/components/layout/space"
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationNext,
    PaginationPrevious
} from "@/components/ui/pagination"
import { siteConfig } from "@/configs/site.config"
import {
    getCategoryPath,
    getProject,
    getProjectPath,
    getProjectRouteSlug,
    groupProjectsByCategory
} from "@/lib/project-sort"
import { cn } from "@/lib/utils"
import ProjectCard from "@/portfolio/_components/cards/project-card"
import { FlashOverlay } from "@/portfolio/_components/flash-overlay"
import { ArticleIndex } from "@/portfolio/_components/mdx/article-index"
import { CaveatLightness } from "@/portfolio/_components/mdx/caveat"
import { MDXContent } from "@/portfolio/_components/mdx/mdx-content"
import { PortfolioBreadcrumb } from "@/portfolio/_components/portfolio-breadcrumb"
import ProjectHeader from "@/portfolio/_components/project-header"
import { resolveSocialData } from "@/portfolio/_helpers/resolve-social-data"
import Footer from "@/portfolio/_sections/footer"
import { BoldPart, TextPart } from "@/portfolio/[category]/_components/shared"
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
    const project = getProject(projects, category, slug)

    if (!project) {
        return {}
    }

    const SLUG_TITLE = `${project.type} — ${project.name} | aimryoui`
    const SLUG_DESCRIPTION =
        project.detail?.description ?? "Project detail page."

    return {
        title: SLUG_TITLE,
        description: SLUG_DESCRIPTION,
        openGraph: {
            title: SLUG_TITLE,
            description: SLUG_DESCRIPTION,
            type: "website",
            url: APP_FULL_URL + APP_BASE_PATH,
            siteName: siteConfig.domain,
            locale: "vi_VN"
        },
        twitter: {
            card: "summary_large_image",
            title: SLUG_TITLE,
            description: SLUG_DESCRIPTION,
            site: APP_FULL_URL + APP_BASE_PATH
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

    const OG_ALT = `${project.type} — ${project.name}`

    return (
        <>
            <meta property="og:image:alt" content={OG_ALT} />
            <meta name="twitter:image:alt" content={OG_ALT} />
            {/* <ViewTransition name="main"> */}
            <main className={cn("order-5 min-w-0 flex-1")}>
                <AmbientStyle project={project} />
                <Space
                    className={cn(
                        "relative z-60 flex items-center justify-start"
                    )}
                >
                    <PortfolioBreadcrumb
                        category={category}
                        categoryTitle={group.title}
                        projectName={project.name}
                    />
                </Space>
                <SectionLine showDecoration containerClassName="z-60" />
                <section
                    id={project.id}
                    className={cn("flex scroll-mt-full @container")}
                >
                    {socialData && (
                        <Space
                            className={cn(
                                "pointer-events-none fixed top-0 z-65 flex w-[100cqw] items-center justify-end bg-transparent px-safe-zone",
                                {
                                    lg: "bottom-[--toolbar-height] top-auto px-0",
                                    md: "bottom-[calc(var(--toolbar-height)+var(--spacing)*10+var(--px)/2)]"
                                }
                            )}
                        >
                            <SocialButton
                                projectId={project.id}
                                social={project.social}
                            />
                        </Space>
                    )}
                    <MarginLine
                        className={cn("order-6", {
                            xl: "hidden",
                            "group-data-[sidebar-position=inline-end]/html":
                                "order-4"
                        })}
                    />
                    <Divider
                        dir="vertical"
                        className={cn("sticky top-0 order-7 h-dvh xl:hidden", {
                            "group-data-[sidebar-position=inline-end]/html":
                                "order-3"
                        })}
                    />
                    <MarginLine
                        className={cn("order-8 xl:hidden", {
                            "group-data-[sidebar-position=inline-end]/html":
                                "order-2"
                        })}
                    />
                    <ArticleIndex toc={project.toc} />
                    <div className="relative order-5 flex-1 @container">
                        <FlashOverlay />
                        <Space />
                        <SectionLine center />
                        <article>
                            <ProjectHeader project={project} />

                            <SectionLine center />
                            <Divider />
                            <SectionLine containerClassName="z-55" center />

                            {project.caveat?.lightness && (
                                <>
                                    <CaveatLightness />
                                    <SectionLine center />
                                    <Divider />
                                    <SectionLine
                                        containerClassName="z-55"
                                        center
                                    />
                                </>
                            )}

                            <MDXContent
                                code={project.code}
                                hasSocialLinks={!!socialData}
                            />
                        </article>
                    </div>
                </section>

                <SectionLine containerClassName="z-60" />

                <Note bold>Project ends. What&#39;s next?</Note>

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
                                        navigation="backward"
                                    />
                                ) : (
                                    <PaginationPrevious
                                        href={getCategoryPath(category)}
                                        label={`Go back to ${group.title} category page`}
                                        tracking={{
                                            eventName: "navigate_category",
                                            eventParams: {
                                                category_id: category,
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
                                        href={getProjectPath(next)}
                                        project={next}
                                        navigation="forward"
                                    />
                                ) : (
                                    <PaginationNext
                                        href={
                                            nextCategory
                                                ? getCategoryPath(
                                                      nextCategory.id
                                                  )
                                                : "/portfolio#contact"
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
                                                    <TextPart>
                                                        No more projects.
                                                    </TextPart>{" "}
                                                    <BoldPart>
                                                        Contact me
                                                    </BoldPart>
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
                </section>

                <SectionLine />
                <Divider />
                <SectionLine />

                <Footer hasSocialLinks={!!socialData} />
            </main>
            {/* </ViewTransition> */}
        </>
    )
}
