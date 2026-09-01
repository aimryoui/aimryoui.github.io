import { type Metadata } from "next"
import { notFound } from "next/navigation"

import { Divider } from "@/components/layout/divider"
import { ElementLine, MarginLine, SectionLine } from "@/components/layout/line"
import { Note } from "@/components/layout/note"
import { Space } from "@/components/layout/space"
import { Bold, Highlight } from "@/components/ui/typography"
import { siteConfig } from "@/configs/site.config"
import {
    getProject,
    getProjectRouteSlug,
    groupProjectsByCategory
} from "@/lib/project-sort"
import { cn } from "@/lib/utils"
import { FlashOverlay } from "@/portfolio/_components/flash-overlay"
import { ArticleIndex } from "@/portfolio/_components/mdx/article-index"
import { CaveatLightness } from "@/portfolio/_components/mdx/caveat"
import { MDXContent } from "@/portfolio/_components/mdx/mdx-content"
import { PortfolioBreadcrumb } from "@/portfolio/_components/portfolio-breadcrumb"
import ProjectHeader from "@/portfolio/_components/project-header"
import { resolveSocialData } from "@/portfolio/_helpers/resolve-social-data"
import Footer from "@/portfolio/_sections/footer"
import { AmbientStyle } from "@/portfolio/[category]/[slug]/_components/ambient-style"
import { ProjectPagination } from "@/portfolio/[category]/[slug]/_components/project-pagination"
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
    const group = groups.find((g) => g.id === category)

    const categoryProjects = group?.projects ?? []
    const project = categoryProjects.find(
        (p) => getProjectRouteSlug(p) === slug
    )

    if (!group || !project) notFound()

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
                    className={cn("relative flex scroll-mt-full @container")}
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
                    <div className="pointer-events-none absolute right-0 top-[calc(100dvh-var(--spacing-space))] z-60 h-[calc(100%-(100dvh-var(--spacing-space)))] w-sidebar xl:hidden">
                        <div className="pointer-events-auto sticky top-[calc(100dvh-var(--spacing-space))] flex w-full flex-col bg-background px-safe-zone py-safe-zone-vertical">
                            <ElementLine
                                dir="horizontal"
                                containerClassName="absolute inset-x-0 top-0"
                            />
                            <Bold
                                title={project.name}
                                className="max-w-full truncate text-xl"
                            >
                                {project.name}
                            </Bold>
                            <Highlight
                                title={project.category}
                                className="max-w-full truncate text-nowrap text-xs leading-4"
                            >
                                {project.category}
                            </Highlight>
                        </div>
                    </div>
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
                    <ProjectPagination category={category} slug={slug} />
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
