import { Fragment, type ReactNode } from "react"

import { Bold, Text } from "@/components/ui/typography"
import { type PortfolioRole } from "@/configs/role.config"

const SUMMARY: Record<PortfolioRole, ReactNode> = {
    pd: (
        <>
            <Text>
                <Bold>Detail-oriented</Bold> UI/UX Designer with experience in
                building scalable UI patterns and design systems.
            </Text>
            <Text>
                <Bold>Practical front-end background</Bold> (Next.js, React,
                Tailwind CSS) ensuring clean, accurate design specs and{" "}
                <Bold>smooth handoff to engineering</Bold>.
            </Text>
            <Text>
                Passionate about building web and application products; building
                open source tools that help improve DX; a11y (accessibility -
                WCAG 2.2 AA compliance, WAI-ARIA).
            </Text>
        </>
    ),
    cd: (
        <>
            <Text>
                <Bold>Detail-oriented</Bold> Creative Designer with a strong
                foundation in visual identity, digital marketing assets, and web
                design.
            </Text>
            <Text>
                Proficient in leveraging the <Bold>Adobe Creative Suite</Bold>{" "}
                and <Bold>Figma</Bold> to deliver pixel-perfect, on-brand
                graphics and clean layouts.
            </Text>
            <Text>
                Experienced in transforming creative briefs into{" "}
                <Bold>
                    compelling visuals while maintaining high-quality standards
                </Bold>{" "}
                for both digital and print mediums.
            </Text>
        </>
    )
}

const SKILLS: Record<PortfolioRole, { title: string; content: string[] }[]> = {
    pd: [
        {
            title: "Design Systems & UI/UX:",
            content: [
                "Figma (Advanced Libraries, Assets; Variables, Variable Mode, Styles; Auto-layout, Grid System, Component Audits, Responsive; Advanced Properties, Variants, Instance Swap, Slot)",
                "Scalable UI Patterns",
                "Component-based / Token-based Design",
                "Web Design",
                "Mobile Application Design",
                "User Flows",
                "Detailed Engineering Specs",
                "Interaction Design",
                "Prototyping",
                "Design Systems",
                "Information Architecture",
                "Accessibility (WCAG, ARIA)",
                "Surveys",
                "Competitive Analysis",
                "User Research",
                "Usability Testing"
            ]
        },
        {
            title: "Development & Handoff:",
            content: [
                "Figma Sites (Publish, CMS)",
                "Figma Make",
                "Figma AI",
                "VS Code",
                "Cursor",
                "Frontend Basics (Next.js, React, shadcn/ui, React Aria - RAC, Base UI, Radix UI, Tailwind CSS, HTML/CSS)",
                "Smooth Engineering Handoff",
                "Technical Constraint Problem Solving"
            ]
        },
        {
            title: "Visual & Graphic:",
            content: [
                "Adobe Creative Cloud (Photoshop, Illustrator, InDesign) for high-fidelity assets and visual design"
            ]
        },
        {
            title: "Other Tools:",
            content: [
                "Sketch",
                "Adobe After Effects",
                "Adobe Premiere Pro",
                "Adobe XD",
                "Adobe Dreamweaver",
                "Adobe Dimension",
                "ElevenLabs",
                "AI Audio Generation",
                "Notion",
                "Obsidian",
                "Excalidraw",
                "Microsoft Teams",
                "Slack",
                "Trello",
                "etc"
            ]
        }
    ],
    cd: [
        {
            title: "Visual & Graphic Design:",
            content: [
                "Adobe Creative Cloud (Advanced proficiency in Photoshop, Illustrator, InDesign) for high fidelity marketing assets, print materials, digital campaigns, layout design, and brand identity development"
            ]
        },
        {
            title: "Web/Application Design & UI/UX:",
            content: [
                "Figma (Auto-layout, Components, Styles, Prototyping)",
                "Landing Pages",
                "Visual Hierarchy",
                "Accessibility (WCAG)"
            ]
        },
        {
            title: "Design-to-Code Basics:",
            content: [
                "HTML/CSS",
                "Tailwind CSS",
                "Next.js (understanding front-end constraints to ensure smooth developer handoff and realistic design specs)"
            ]
        },
        {
            title: "Other Tools:",
            content: [
                "Sketch",
                "Adobe After Effects",
                "Adobe Premiere Pro",
                "Adobe XD",
                "Adobe Dreamweaver",
                "Adobe Dimension",
                "ElevenLabs",
                "AI Audio Generation",
                "Notion",
                "Obsidian",
                "Excalidraw",
                "Microsoft Teams",
                "Slack",
                "Trello",
                "etc"
            ]
        }
    ]
}

const INTERESTING = [
    <>Web a11y.</>,
    <>I18n.</>,
    <>RTL Languages.</>,
    <>Upper-intermediate in English.</>
]

const FIELDS = ["event projects", "short films", "social posts", "publications"]

const pdFacts = [
    <>
        I came up from{" "}
        {FIELDS.map((item, index, arr) => (
            <Fragment key={item}>
                <Bold>{item}</Bold>
                {index < arr.length - 1 && ", "}
            </Fragment>
        ))}
        , or event-type university course projects. So glad that I joined a club
        in university.
    </>,
    <>
        I don&#39;t consider perfectionism as a weakness. I really like software
        that allows me to zoom in on an image down to the individual pixel.
    </>,
    <>
        I became <Bold>addicted to coding</Bold> after taking a web development
        course at university. I was the only one to achieve a{" "}
        <Bold>perfect score</Bold> that semester, and the rest is history.
    </>,
    <>
        I don&#39;t like eating green onions. Therefore, anything that looks
        like green onion — or even just has the word &#34;onion&#34; in its name
        — gets caught in the crossfire.
    </>
]

const FACTS: Record<PortfolioRole, ReactNode[]> = {
    pd: pdFacts,
    cd: pdFacts.filter((_, i) => i !== 2) // Exclude the coding fact
}

const THINGS = [
    {
        title: "Those are:",
        items: ["Data", "Algorithm", "Family", "Environment", "Nguyễn Sỹ Cương"]
    },
    {
        title: "Only can choose 3?",
        items: ["Data", "Algorithm", "Family"]
    },
    {
        title: "Only can choose 1?",
        items: ["Family"]
    }
]

export { FACTS, INTERESTING, SKILLS, SUMMARY, THINGS }
