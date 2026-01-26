import rehypeSlug from "rehype-slug"
import { defineCollection, defineConfig, s } from "velite"

import { TOOL_ICONS, type ToolKey } from "@/configs/tools"

const projects = defineCollection({
    name: "Project",
    pattern: "projects/**/*.mdx",
    schema: s.object({
        // slug: s.slug("projects"),
        projectName: s.string(),
        category: s.string(),

        information: s.object({
            newest: s.boolean().default(false),
            duration: s.string(),
            subject: s.string(),
            place: s.string()
        }),

        tools: s.array(
            s.enum(Object.keys(TOOL_ICONS()) as [ToolKey, ...ToolKey[]])
        ),

        detail: s.object({
            description: s.string(),
            abbreviation: s.string()
        }),

        content: s.mdx()
    })
})

export default defineConfig({
    root: "src/content",
    collections: { projects },
    mdx: {
        rehypePlugins: [rehypeSlug]
    }
})
