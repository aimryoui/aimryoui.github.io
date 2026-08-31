import fs from "node:fs"

import { type Route } from "next"

import {
    context,
    defineCollection,
    defineConfig,
    defineSchema,
    type Schema,
    s
} from "velite"

import { slugify } from "@/helpers/slugify"
import { TOOL_ICONS, type ToolKey } from "@/portfolio/_configs/tools"
import { type ProjectId } from "@/types/project-ids"

const HEX_COLOR_REGEX = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/u
const DIM_PROP_REGEX = /<[^>]+?\bdim\b[^>]*?>/u
const HEADING_REGEX =
    /<(SectionHeading|SectionTitle|Section|MediaFrame)[^>]*(?:title|sectionName)=(["'])(.*?)\2[^>]*>/gu

const fileNameWithoutExt = defineSchema(() =>
    s.custom<string | undefined>().transform((value) => {
        if (value !== undefined) return value
        return context().file.stem
    })
)

const projects = defineCollection({
    name: "Project",
    pattern: "projects/**/*.mdx",
    schema: s.object({
        id: fileNameWithoutExt() as Schema<ProjectId>,
        slug: s.path(),
        filePath: s.path(),
        // oxlint-disable-next-line typescript/no-unnecessary-type-assertion
        link: s.string().optional() as Schema<
            Route<"/projects/${string}"> | undefined
        >,

        type: s.string(),
        name: s.string(),
        category: s.string(),

        caseStudy: s.boolean().default(false),

        information: s.object({
            duration: s.string(),
            subject: s.string(),
            place: s.string().optional()
        }),

        features: s
            .object({
                new: s.boolean().default(false),
                selectedCover: s.string().optional()
            })
            .optional(),

        social: s
            .object({
                behance: s.string().url().optional(),
                dribbble: s.string().url().optional(),
                github: s.string().url().optional(),
                "product-website": s.string().url().optional()
            })
            .optional(),

        override: s
            .object({
                forceExpand: s.boolean().default(false),
                coverImage: s.string().optional(),
                colorOverrideHex: s
                    .string()
                    .regex(HEX_COLOR_REGEX, {
                        message:
                            "Invalid hex color format. Must be #FFF or #FFFFFF"
                    })
                    .optional()
            })
            .optional(),

        tools: s.array(
            s.enum(Object.keys(TOOL_ICONS()) as [ToolKey, ...ToolKey[]])
        ),

        detail: s
            .object({
                description: s.string(),
                abbreviation: s.string().optional()
            })
            .optional(),

        caveat: s
            .object({
                lightness: s.boolean().default(false)
            })
            .optional()
            .transform((value, { meta }) => {
                if (meta.content && DIM_PROP_REGEX.test(meta.content)) {
                    return { lightness: true, ...value }
                }
                return value
            }),

        code: s.mdx(),
        toc: s
            .custom<{ id: string; text: string; level: 1 | 2 }[]>()
            .transform((_, { meta }) => {
                if (!meta.content) return []
                const headings: { id: string; text: string; level: 1 | 2 }[] =
                    []
                for (const match of meta.content.matchAll(HEADING_REGEX)) {
                    const tag = match[1]
                    const title = match[3]
                    headings.push({
                        id: slugify(title),
                        text: title,
                        level:
                            tag === "SectionHeading" || tag === "MediaFrame"
                                ? 1
                                : 2
                    })
                }
                return headings
            })
            .default([])
    })
})

export default defineConfig({
    root: "src/content",
    output: {
        clean: true
    },
    collections: { projects },
    prepare: (collections) => {
        const ids = collections.projects.map((p) => p.id)
        const typeDefinition = `export type ProjectId =\n    | "${ids.join('"\n    | "')}"\n`
        fs.writeFileSync("src/types/project-ids.d.ts", typeDefinition)
    }
})
