// oxlint-disable tailwindcss/enforces-shorthand

import { readFile } from "node:fs/promises"
import { join } from "node:path"

import { ImageResponse } from "next/og"

import { groupProjectsByCategory } from "@/lib/project-sort"
import { cn } from "@/lib/utils"
import {
    CornerBackgroundLayer,
    DecorationLayer,
    LineLayer,
    LogoLayer
} from "@/portfolio/[category]/_components/og/layers"
import { Layer } from "@/portfolio/[category]/_components/og/og-components"

import { projects } from "~/.velite"

export const dynamic = "force-static"

export const size = {
    width: 1200,
    height: 630
}

export const contentType = "image/png"

export function generateStaticParams() {
    return groupProjectsByCategory(projects).map((group) => ({
        category: group.id
    }))
}

const TRAILING_REGEX = /[.!?]$/u
const MEDIA_REGEX = /\.(jpg|png|mp4|mp3)$/u

const googleSansFlexMedium = await readFile(
    join(process.cwd(), "public/fonts/GoogleSansFlex_36pt-Medium.ttf")
)

const googleSansFlexSemiBold = await readFile(
    join(process.cwd(), "public/fonts/GoogleSansFlex_72pt-SemiBold.ttf")
)

export default async function Image({
    params
}: {
    params: Promise<{ category: string }>
}) {
    const { category } = await params

    const groups = groupProjectsByCategory(projects)
    const group = groups.find((g) => g.id === category)
    const note = group?.note ?? "Category detail page."

    const title = group?.title ?? "Aimryoui"

    const finalTitle =
        TRAILING_REGEX.test(title) || MEDIA_REGEX.test(title)
            ? title
            : `${title}.`

    const numProjects = group?.projects.length ?? 0
    const formattedNum =
        numProjects < 10 ? `0${numProjects}` : numProjects.toString()
    const projectsCountText = `Category • ${formattedNum} Project${numProjects === 1 ? "" : "s"}`

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

                "--pattern": "#d4d6d9",
                "--stroke": "#ccced1",

                "--stroke-width": "2px",

                backgroundColor: "var(--background)",
                backgroundImage:
                    "repeating-linear-gradient(315deg, var(--pattern) 0, var(--pattern) var(--stroke-width), transparent 0, transparent 50%)",
                backgroundSize: "15px 15px",

                padding: "120px"
            }}
        >
            {/* Layers */}
            <CornerBackgroundLayer />
            <LineLayer />
            <DecorationLayer />
            <LogoLayer color="#009ee7" />

            {/* Text */}
            <Layer>
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
                    {projectsCountText}
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
                        {finalTitle}
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
                        {note}
                    </div>
                </div>
            </Layer>
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
