"use client"

import { Fragment, useMemo, useState } from "react"

import { sendGAEvent } from "@next/third-parties/google"
import { ChevronDown } from "lucide-react"

import { Divider } from "@/components/layout/divider"
import { SectionLine, SvgElementLine } from "@/components/layout/line"
import {
    Collapsible,
    CollapsibleContent,
    type CollapsibleContentProps,
    type CollapsibleProps,
    CollapsibleTrigger
} from "@/components/ui/collapsible"
import { Bold, Text } from "@/components/ui/typography"
import { cn } from "@/lib/utils"
import {
    Emotion1,
    Emotion2,
    Emotion3,
    Emotion4,
    Emotion5,
    EmotionNeutral
} from "@/portfolio/_sections/components/about/emotion-icons"

const EMOTIONS = [
    EmotionNeutral,
    Emotion1,
    Emotion2,
    Emotion3,
    Emotion4,
    Emotion5
]

function Details({ className, ...props }: React.ComponentProps<"div">) {
    const [expandedStates, setExpandedStates] = useState({
        summary: false,
        skills: false,
        interesting: false,
        facts: false,
        things: false
    })

    const handlers = useMemo(() => {
        const createHandler =
            (key: keyof typeof expandedStates) => (isOpen: boolean) => {
                setExpandedStates((p) => ({ ...p, [key]: isOpen }))
                const eventName = isOpen
                    ? "expand_about_detail"
                    : "collapse_about_detail"
                const eventParams = { detail_id: key }
                sendGAEvent("event", eventName, eventParams)
            }

        return {
            summary: createHandler("summary"),
            skills: createHandler("skills"),
            interesting: createHandler("interesting"),
            facts: createHandler("facts"),
            things: createHandler("things")
        }
    }, [])

    let expandedCount = 0
    if (expandedStates.summary) expandedCount++
    if (expandedStates.skills) expandedCount++
    if (expandedStates.interesting) expandedCount++
    if (expandedStates.facts) expandedCount++
    if (expandedStates.things) expandedCount++

    const EmotionIcon = EMOTIONS[Math.min(expandedCount, 5)]

    return (
        <section
            className={cn(
                "grid w-full grid-cols-5 gap-x-safe-zone bg-background @container",
                {
                    md: "grid-cols-3"
                },
                className
            )}
            {...props}
        >
            <div className="col-span-3">
                {/* Desktop version (hidden on mobile) */}
                <SummaryDetail
                    defaultExpanded={false}
                    onExpandedChange={handlers.summary}
                    className="w-full md:hidden"
                />
                {/* Mobile version (hidden on desktop) */}
                <SummaryDetail
                    defaultExpanded={true}
                    onExpandedChange={handlers.summary}
                    className="hidden w-full md:flex"
                />
                <SvgElementLine dir="horizontal" />
                <SkillsDetail
                    onExpandedChange={handlers.skills}
                    className="w-full"
                />
                <SvgElementLine dir="horizontal" />
                <LearningDetail
                    onExpandedChange={handlers.interesting}
                    className="w-full"
                />
                <SvgElementLine dir="horizontal" />
                <FactsDetail
                    onExpandedChange={handlers.facts}
                    className="w-full"
                />
                <SvgElementLine dir="horizontal" />
                <ThingsThatMatters
                    onExpandedChange={handlers.things}
                    className="w-full"
                />
            </div>
            <div
                className="col-span-2 -ms-safe-zone flex md:hidden"
                style={{
                    "--trigger-quantity": Object.keys(expandedStates).length,
                    "--padding-block": "calc(var(--spacing)*8)"
                }}
            >
                <SvgElementLine className={cn("h-auto")} />
                <Divider dir="vertical" className={cn("h-auto")} />
                <SvgElementLine className={cn("h-auto")} />
                <div className={cn("h-full flex-1")}>
                    <div
                        className={cn(
                            "h-full overflow-clip bg-highlighted/10 p-2"
                        )}
                    >
                        <div
                            className={cn(
                                "[--padding:calc(var(--spacing)*2)]",
                                "[--border-radius:--radius-2xl]",
                                "[--offset-outer:calc(var(--padding)+var(--px)/2)]",
                                "[--subpixel-correction:1px]",
                                // "[--background-color:theme(colors.alert/0.3)]",
                                "[--background-color:color-mix(in_srgb,var(--color-highlighted)_10%,var(--color-background))]",
                                "[--icon-height:calc((var(--spacing)*5+var(--spacing-safe-zone-vertical)*2)*var(--trigger-quantity)-var(--padding-block)*2)]",
                                "relative grid size-full grid-rows-[1fr] rounded-[--border-radius] bg-background",
                                "bg-[image:radial-gradient(oklch(from_var(--color-stroke)_l_c_h/40%)_.125rem,transparent_.125rem),radial-gradient(oklch(from_var(--color-stroke)_l_c_h/40%)_.125rem,transparent_.125rem)] bg-[length:.75rem_.75rem] bg-[position:0_0,.375rem_.375rem]",
                                {
                                    before: "absolute inset-0 rounded-inherit border border-highlighted",

                                    md: "rounded-xl",
                                    sm: "bg-[image:radial-gradient(oklch(from_var(--color-stroke)_l_c_h/40%)_.09375rem,transparent_.09375rem),radial-gradient(oklch(from_var(--color-stroke)_l_c_h/40%)_.09375rem,transparent_.09375rem)] bg-[length:.5625rem_.5625rem] bg-[position:0_0,.28125rem_.28125rem]"
                                }
                            )}
                        >
                            <span className="absolute inset-0 flex items-start justify-center">
                                <PseudoFiller className="top-0 -mt-[--padding] mb-[calc(var(--icon-height)+var(--padding-block))]" />
                            </span>
                            <span className="absolute inset-0 flex justify-center">
                                <EmotionIcon
                                    className={cn(
                                        "sticky top-[calc(49vh-var(--icon-height)/2)] my-[--padding-block] h-[--icon-height] justify-self-center",
                                        {
                                            rtl: "-scale-x-100",
                                            lg: "top-[calc(50vh-var(--icon-height)/2-var(--spacing-space)/2)]"
                                        }
                                    )}
                                />
                            </span>
                            <span className="absolute inset-0 flex items-end justify-center">
                                <PseudoFiller className="bottom-0 -mb-[--padding] mt-[calc(var(--icon-height)+var(--padding-block))] -scale-y-100 lg:bottom-space" />
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

function PseudoFiller({ className, ...props }: React.ComponentProps<"span">) {
    return (
        <span
            className={cn(
                "sticky -mx-[--offset-outer] box-content h-[--padding-block] w-full rounded-t-[calc(var(--border-radius)+var(--offset-outer))] border-x-[length:--padding] border-t-[length:--padding] border-[--background-color]",
                {
                    before: "absolute -inset-x-[--padding] -top-[calc(var(--padding)+var(--subpixel-correction))] bottom-0 border-x-[length:--padding] border-t-[calc(var(--padding)+var(--subpixel-correction))] border-[--background-color]",
                    after: "absolute inset-0 rounded-t-[--border-radius] border-x border-t border-highlighted"
                },
                className
            )}
            {...props}
        />
    )
}

function CollapsibleContainer({
    className,
    containerClassName,
    label,
    defaultExpanded = false,
    isExpanded: controlledIsExpanded,
    onExpandedChange,
    children,
    ...props
}: Omit<CollapsibleProps, "isExpanded" | "onExpandedChange">
    & CollapsibleContentProps & {
        label: string
        defaultExpanded?: boolean
        isExpanded?: boolean
        containerClassName?: CollapsibleProps["className"]
        onExpandedChange?: (isOpen: boolean) => void
    }) {
    const [uncontrolledIsExpanded, setIsExpanded] = useState(defaultExpanded)
    const isExpanded = controlledIsExpanded ?? uncontrolledIsExpanded

    return (
        <Collapsible
            isExpanded={isExpanded}
            onExpandedChange={(isOpen) => {
                if (controlledIsExpanded === undefined) {
                    setIsExpanded(isOpen)
                }
                onExpandedChange?.(isOpen)
            }}
            className={cn(
                "group/collapsible flex flex-col",
                containerClassName
            )}
            {...props}
        >
            <CollapsibleTrigger
                pressSound={isExpanded ? "zoom-out" : "zoom-in"}
                className={cn(
                    "group/collapsibile-trigger flex items-center justify-between gap-3 py-safe-zone-vertical pe-[calc(var(--spacing-safe-zone)-var(--spacing)*.5)] ps-safe-zone transition-[background-color] duration-100",
                    {
                        hover: "bg-muted/45 transition-none",
                        active: "bg-muted/60 transition-none",
                        "group-data-expanded/collapsible":
                            "bg-muted/20 hover:bg-muted/45 active:bg-muted/60 dark:bg-muted/30"
                    }
                )}
            >
                <Bold
                    className={cn(
                        "text-muted-foreground transition-[color] duration-100",
                        {
                            "group-hover/collapsibile-trigger":
                                "text-foreground transition-none",
                            "group-data-expanded/collapsible":
                                "text-foreground transition-none"
                        }
                    )}
                >
                    {label}
                </Bold>
                <div
                    className={cn(
                        "grid size-6 place-items-center rounded-[.75rem] bg-foreground/10 !corner-round transition-[transform,translate] duration-100",
                        {
                            dark: "bg-foreground/15",
                            rtl: "-scale-y-100",
                            "group-hover/collapsibile-trigger":
                                "bg-foreground/20 dark:bg-foreground/25",
                            "group-active/collapsibile-trigger":
                                "motion-preferred:translate-y-0.5",
                            "group-not-data-expanded/collapsible": [
                                "bg-foreground/40 text-inverted dark:bg-foreground/60",
                                {
                                    "group-hover/collapsibile-trigger":
                                        "bg-foreground/35 dark:bg-foreground/55"
                                }
                            ]
                        }
                    )}
                >
                    <ChevronDown
                        className={cn("size-5 translate-y-[.5px]", {
                            "motion-preferred":
                                "transition-transform duration-350",
                            rtl: "-translate-y-[.5px] rotate-180",
                            "group-not-data-expanded/collapsible": [
                                "translate-x-[.5px] translate-y-0 -rotate-90 dark:stroke-2.5",
                                {
                                    rtl: "-translate-x-[.5px] rotate-90"
                                }
                            ]
                        })}
                    />
                </div>
            </CollapsibleTrigger>
            <SectionLine fit />
            <CollapsibleContent>
                <div
                    className={cn(
                        "relative space-y-1.5 px-safe-zone py-safe-zone-vertical leading-normal",
                        className
                    )}
                >
                    {children}
                </div>
            </CollapsibleContent>
        </Collapsible>
    )
}

type DetailSectionProps = Pick<CollapsibleProps, "className"> & {
    onExpandedChange?: (isOpen: boolean) => void
    defaultExpanded?: boolean
}

function SummaryDetail({
    className,
    defaultExpanded,
    onExpandedChange
}: DetailSectionProps) {
    return (
        <CollapsibleContainer
            defaultExpanded={defaultExpanded}
            onExpandedChange={onExpandedChange}
            label="TL;DR"
            containerClassName={cn(className)}
        >
            <Text className={cn("text-pretty")}>
                <Bold>Detail-oriented</Bold> UI/UX Designer with experience in
                building scalable UI patterns and design systems.
            </Text>
            <Text className={cn("text-pretty")}>
                <Bold>Practical front-end background</Bold> (Next.js, React,
                Tailwind CSS) ensuring clean, accurate design specs and{" "}
                <Bold>smooth handoff to engineering</Bold>.
            </Text>
            <Text className={cn("text-pretty")}>
                Passionate about building web and application products; building
                open source tools that help improve DX; a11y (accessibility -
                WCAG 2.2 AA compliance, WAI-ARIA).
            </Text>
        </CollapsibleContainer>
    )
}

const SKILLS = [
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
]

function SkillsDetail({ className, onExpandedChange }: DetailSectionProps) {
    return (
        <CollapsibleContainer
            onExpandedChange={onExpandedChange}
            label="Tools & Skills"
            containerClassName={cn(className)}
        >
            {SKILLS.map((skill, index) => (
                <Text key={index} className={cn("text-pretty")}>
                    <Bold>{skill.title}</Bold> {skill.content.join(", ")}.
                </Text>
            ))}
        </CollapsibleContainer>
    )
}

const INTERESTING = [
    <>Web a11y.</>,
    <>I18n.</>,
    <>RTL Languages.</>,
    <>Upper-intermediate in English.</>
]

function LearningDetail({ className, onExpandedChange }: DetailSectionProps) {
    return (
        <CollapsibleContainer
            onExpandedChange={onExpandedChange}
            label="Currently learning"
            containerClassName={cn(className)}
        >
            <ul className="space-y-1.5">
                {INTERESTING.map((fact, index) => (
                    <Text
                        key={index}
                        as="li"
                        className={cn(
                            "ms-[calc(1em-0.125rem-1px)] list-outside list-disc text-pretty",
                            {
                                marker: "text-sm text-muted-foreground/40",
                                md: "ms-[calc(1em-1px)]"
                            }
                        )}
                    >
                        {fact}
                    </Text>
                ))}
            </ul>
        </CollapsibleContainer>
    )
}

const FIELDS = ["event projects", "short films", "social posts", "publications"]

const FACTS = [
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

function FactsDetail({ className, onExpandedChange }: DetailSectionProps) {
    return (
        <CollapsibleContainer
            onExpandedChange={onExpandedChange}
            label="Facts"
            containerClassName={cn(className)}
        >
            <ul className="space-y-1.5">
                {FACTS.map((fact, index) => (
                    <Text
                        key={index}
                        as="li"
                        className={cn(
                            "ms-[calc(1em-0.125rem-1px)] list-outside list-disc text-pretty",
                            {
                                marker: "text-sm text-muted-foreground/40",
                                md: "ms-[calc(1em-1px)]"
                            }
                        )}
                    >
                        {fact}
                    </Text>
                ))}
            </ul>
        </CollapsibleContainer>
    )
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

function ThingsThatMatters({
    className,
    onExpandedChange
}: DetailSectionProps) {
    return (
        <CollapsibleContainer
            onExpandedChange={onExpandedChange}
            label="5 things that matter"
            containerClassName={cn(className)}
            className={cn(
                "grid grid-cols-3 gap-x-safe-zone space-y-0 px-0",
                "first-of-type:*:ps-safe-zone last-of-type:*:pe-safe-zone",
                {
                    "@[58.75rem]":
                        "flex flex-col gap-y-safe-zone-vertical !px-safe-zone *:!px-0"
                }
            )}
        >
            {THINGS.map(({ title, items }, index, arr) => (
                <Fragment key={title}>
                    <div
                        className={cn("flex w-full flex-col gap-1.5", {
                            "@[58.75rem]": "grid grid-cols-2 gap-safe-zone",
                            xs: "flex gap-1.5"
                        })}
                    >
                        <Bold
                            className={cn(
                                "text-pretty text-muted-foreground",
                                index === 0 && "xs:sr-only"
                            )}
                        >
                            {title}
                        </Bold>
                        <ul className="space-y-1.5 text-pretty">
                            {items.map((item, index) => (
                                <Text
                                    key={index}
                                    as="li"
                                    className={cn(
                                        "ms-[calc(1em-0.125rem-1px)] list-outside list-disc text-foreground",
                                        {
                                            marker: "text-sm text-muted-foreground/40",
                                            md: "ms-[calc(1em-1px)]"
                                        }
                                    )}
                                >
                                    {item}
                                </Text>
                            ))}
                        </ul>
                    </div>
                    {index < arr.length - 1 && (
                        <SectionLine
                            fit
                            containerClassName="hidden @[58.75rem]:block"
                            className="-mx-safe-zone w-[calc(100%+var(--spacing-safe-zone)*4)]"
                        />
                    )}
                </Fragment>
            ))}
        </CollapsibleContainer>
    )
}

export { Details }
