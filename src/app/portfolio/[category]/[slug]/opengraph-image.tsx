// oxlint-disable tailwindcss/enforces-shorthand

import { readFile } from "node:fs/promises"
import { join } from "node:path"

import { ImageResponse } from "next/og"

import {
    getProject,
    getProjectRouteSlug,
    groupProjectsByCategory
} from "@/lib/project-sort"
import { cn } from "@/lib/utils"

import { projects } from "~/.velite"

export const dynamic = "force-static"

export const size = {
    width: 1200,
    height: 630
}

export const contentType = "image/png"

export function generateStaticParams() {
    return groupProjectsByCategory(projects).flatMap((group) =>
        group.projects.map((project) => ({
            category: group.id,
            slug: getProjectRouteSlug(project)
        }))
    )
}

const TRAILING_REGEX = /[.!?]$/u
const MEDIA_REGEX = /\.(jpg|png|mp4|mp3)$/u

const backgroundData = await readFile(
    join(process.cwd(), "public/images/og-background.png"),
    "base64"
)
const backgroundSrc = `data:image/png;base64,${backgroundData}`

const googleSansFlexMedium = await readFile(
    join(process.cwd(), "public/fonts/GoogleSansFlex_36pt-Medium.ttf")
)

const googleSansFlexSemiBold = await readFile(
    join(process.cwd(), "public/fonts/GoogleSansFlex_72pt-SemiBold.ttf")
)

export default async function Image({
    params
}: {
    params: Promise<{ category: string; slug: string }>
}) {
    const { category, slug } = await params

    const project = getProject(projects, category, slug)
    const description = project?.detail?.description ?? "Project detail page."

    const projectName = project?.name ?? "Aimryoui"

    const finalProjectName =
        TRAILING_REGEX.test(projectName) || MEDIA_REGEX.test(projectName)
            ? projectName
            : `${projectName}.`

    return new ImageResponse(
        <div
            tw={cn(
                "flex h-full w-full flex-col items-center justify-center p-0"
            )}
            style={{
                "--background": "#ebecee",
                "--highlighted": "#009ee7",
                "--foreground": "#363b45",
                "--muted-foreground": "#72767f",

                backgroundImage: `url(${backgroundSrc})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",

                padding: "120px"
            }}
        >
            <div
                tw="absolute w-full"
                style={{
                    display: "block",
                    fontSize: "32px",
                    lineHeight: 1.3,
                    color: "var(--foreground)",
                    lineClamp: 1,

                    top: "120px",
                    left: "50%",
                    transform: "translateX(-50%)",

                    paddingLeft: "216px",
                    paddingRight: "120px"
                }}
            >
                {`${project?.type ?? "Project"}${project?.category && ` • ${project.category}`}`}
            </div>
            <div
                tw="absolute flex w-full flex-col"
                style={{
                    gap: "20px",

                    bottom: "104px",
                    left: "50%",
                    transform: "translateX(-50%)",

                    paddingLeft: "120px",
                    paddingRight: "120px"
                }}
            >
                <div
                    tw="w-full"
                    style={{
                        display: "block",
                        fontSize: "85px",
                        fontWeight: 600,
                        lineHeight: 1,
                        color: "var(--highlighted)",
                        lineClamp: 2
                    }}
                >
                    {finalProjectName}
                </div>
                <div
                    tw="w-full"
                    style={{
                        display: "block",
                        fontSize: "32px",
                        lineHeight: 1.3,
                        color: "var(--muted-foreground)",
                        lineClamp: '2 "… [See more]"'
                    }}
                >
                    {description}
                </div>
            </div>
        </div>,
        {
            ...size,
            fonts: [
                {
                    name: "Google Sans Flex",
                    data: googleSansFlexMedium,
                    style: "normal",
                    weight: 500
                },
                {
                    name: "Google Sans Flex",
                    data: googleSansFlexSemiBold,
                    style: "normal",
                    weight: 600
                }
            ]
        }
    )
}
