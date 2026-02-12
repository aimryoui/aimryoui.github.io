import { type Route } from "next"

import { defineCollection, defineConfig, s, type Schema } from "velite"

import { TOOL_ICONS, type ToolKey } from "@/portfolio/_configs/tools"

const projects = defineCollection({
    name: "Project",
    pattern: "projects/**/*.mdx",
    schema: s.object({
        slug: s.path(),
        link: s.string().optional() as Schema<
            Route<"/projects/${string}"> | undefined
        >,

        type: s.string(),
        projectName: s.string(),
        category: s.string(),

        information: s.object({
            newest: s.boolean().default(false),
            duration: s.string(),
            subject: s.string(),
            place: s.string().optional()
        }),

        tools: s.array(
            s.enum(Object.keys(TOOL_ICONS()) as [ToolKey, ...ToolKey[]])
        ),

        detail: s
            .object({
                description: s.string(),
                abbreviation: s.string().optional()
            })
            .optional(),

        code: s.mdx()
    })
})

export default defineConfig({
    root: "src/content",
    collections: { projects }
})
