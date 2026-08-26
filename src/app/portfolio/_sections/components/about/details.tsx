"use client"

import { Fragment, useState } from "react"

import { type AccordionItemProps } from "@base-ui/react"
import { sendGAEvent } from "@next/third-parties/google"

import { Divider } from "@/components/layout/divider"
import { SectionLine, SvgElementLine } from "@/components/layout/line"
import {
    Accordion,
    AccordionContent,
    type AccordionContentProps,
    AccordionItem,
    type AccordionProps,
    AccordionTrigger,
    type Key
} from "@/components/ui/accordion"
import { Bold, Text } from "@/components/ui/typography"
import { type PortfolioRole } from "@/configs/role.config"
import { slugify } from "@/helpers/slugify"
import { cn } from "@/lib/utils"
import {
    FACTS,
    INTERESTING,
    SKILLS,
    SUMMARY,
    THINGS
} from "@/portfolio/_configs/about-details"
import {
    Emotion1,
    Emotion2,
    Emotion3,
    Emotion4,
    Emotion5,
    EmotionNeutral
} from "@/portfolio/_sections/components/about/emotion-icons"
import { useQueryStore } from "@/stores/query-store"

const EMOTIONS = [
    EmotionNeutral,
    Emotion1,
    Emotion2,
    Emotion3,
    Emotion4,
    Emotion5
]

const VISUAL_SECTIONS_COUNT = EMOTIONS.length - 1

const MOBILE_SUMMARY_ID = "tl-dr-mobile"
const DEFAULT_EXPANDED_KEYS = new Set<Key>([MOBILE_SUMMARY_ID])

function Details({ className, ...props }: React.ComponentProps<"div">) {
    const role = useQueryStore((s) => s.role)

    const [expandedKeys, setExpandedKeys] = useState(DEFAULT_EXPANDED_KEYS)

    const handleExpandedChange = (keys: Set<Key>) => {
        const isExpand = keys.size > expandedKeys.size
        const changedKey = [...keys, ...expandedKeys].find(
            (k) => keys.has(k) !== expandedKeys.has(k)
        )

        sendGAEvent(
            "event",
            isExpand ? "expand_about_detail" : "collapse_about_detail",
            { detail_id: changedKey }
        )

        setExpandedKeys(keys)
    }

    const expandedCount = Math.min(
        expandedKeys.size - (expandedKeys.has(MOBILE_SUMMARY_ID) ? 1 : 0),
        VISUAL_SECTIONS_COUNT
    )

    const EmotionIcon = EMOTIONS[expandedCount]

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
            <Accordion
                allowsMultipleExpanded
                className="col-span-3"
                expandedKeys={expandedKeys}
                onExpandedChange={handleExpandedChange}
            >
                {/* Desktop version (hidden on mobile) */}
                <SummaryDetail role={role} className="w-full md:hidden" />
                {/* Mobile version (hidden on desktop) */}
                <SummaryDetail
                    role={role}
                    id={MOBILE_SUMMARY_ID}
                    className="hidden w-full md:block"
                />
                <SvgElementLine dir="horizontal" />
                <SkillsDetail role={role} className="w-full" />
                <SvgElementLine dir="horizontal" />
                <LearningDetail className="w-full" />
                <SvgElementLine dir="horizontal" />
                <FactsDetail role={role} className="w-full" />
                <SvgElementLine dir="horizontal" />
                <ThingsThatMatters className="w-full" />
            </Accordion>
            <div
                className="col-span-2 -ms-safe-zone flex md:hidden"
                style={{
                    "--trigger-quantity": VISUAL_SECTIONS_COUNT,
                    "--padding-block": "calc(var(--spacing)*8)"
                }}
            >
                <SvgElementLine className={cn("h-auto")} />
                <Divider dir="vertical" className={cn("h-auto")} />
                <SvgElementLine className={cn("h-auto")} />
                <div className={cn("h-full flex-1")}>
                    <div
                        className={cn(
                            "[--padding:calc(var(--spacing)*2)]",
                            "h-full overflow-clip bg-highlighted/10 p-[--padding]"
                        )}
                    >
                        <div
                            className={cn(
                                "[--border-radius:--radius-2xl]",
                                "[--offset-outer:calc(var(--padding)+var(--px)/2)]",
                                "[--subpixel-correction:1px]",
                                // "[--background-color:theme(colors.alert/0.3)]",
                                "[--background-color:color-mix(in_srgb,var(--color-highlighted)_10%,var(--color-background))]",
                                "[--icon-height:calc((var(--spacing)*6+var(--spacing-safe-zone-vertical)*2)*var(--trigger-quantity)-var(--padding-block)*2-var(--padding)*2)]",
                                "[--icon-max-height:calc(100dvh-var(--safe-area-inset-bottom)-var(--spacing-space)-var(--padding-block)*2)]",
                                "[--icon-actual-height:min(var(--icon-height),100cqw,var(--icon-max-height))]",
                                "relative grid size-full grid-rows-[1fr] rounded-[--border-radius] bg-background @container",
                                "bg-[image:radial-gradient(oklch(from_var(--color-stroke)_l_c_h/40%)_.125rem,transparent_.125rem),radial-gradient(oklch(from_var(--color-stroke)_l_c_h/40%)_.125rem,transparent_.125rem)] bg-[length:.75rem_.75rem] bg-[position:0_0,.375rem_.375rem]",
                                {
                                    before: "absolute inset-0 rounded-inherit border border-highlighted",

                                    md: "rounded-xl",
                                    sm: "bg-[image:radial-gradient(oklch(from_var(--color-stroke)_l_c_h/40%)_.09375rem,transparent_.09375rem),radial-gradient(oklch(from_var(--color-stroke)_l_c_h/40%)_.09375rem,transparent_.09375rem)] bg-[length:.5625rem_.5625rem] bg-[position:0_0,.28125rem_.28125rem]"
                                }
                            )}
                        >
                            <span className="absolute inset-0 flex items-start justify-center">
                                <PseudoFiller className="top-0 -mt-[--padding] mb-[calc(var(--icon-actual-height)+var(--padding-block))]" />
                            </span>
                            <span className="absolute inset-0 flex justify-center">
                                <EmotionIcon
                                    className={cn(
                                        "sticky top-[calc(49dvh-var(--icon-actual-height)/2)] my-[--padding-block] h-[--icon-actual-height] justify-self-center",
                                        {
                                            rtl: "-scale-x-100",
                                            lg: "top-[calc(50dvh-(var(--icon-actual-height)+var(--safe-area-inset-bottom)+var(--spacing-space))/2)]"
                                        }
                                    )}
                                />
                            </span>
                            <span className="absolute inset-0 flex items-end justify-center">
                                <PseudoFiller className="bottom-0 -mb-[--padding] mt-[calc(var(--icon-actual-height)+var(--padding-block))] -scale-y-100 lg:bottom-[calc(var(--safe-area-inset-bottom)+var(--spacing-space))]" />
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

function AboutAccordionItem({
    className,
    containerClassName,
    label,
    id = slugify(label),
    children,
    ...props
}: AccordionItemProps
    & AccordionContentProps & {
        label: string
        containerClassName?: AccordionProps["className"]
    }) {
    return (
        <AccordionItem id={id} className={cn(containerClassName)} {...props}>
            <AccordionTrigger
                className={cn(
                    "flex items-center justify-between gap-3 py-safe-zone-vertical pe-[calc(var(--spacing-safe-zone)-var(--spacing)*.5)] ps-safe-zone transition-[background-color] duration-100",
                    {
                        hover: "bg-muted/45 transition-none",
                        active: "bg-muted/60 transition-none",
                        "group-data-expanded/accordion-item":
                            "bg-muted/20 hover:bg-muted/45 active:bg-muted/60 dark:bg-muted/30"
                    }
                )}
            >
                <bdi>{label}</bdi>
            </AccordionTrigger>
            <SectionLine fit />
            <AccordionContent className={cn("leading-normal", className)}>
                {children}
            </AccordionContent>
        </AccordionItem>
    )
}

type DetailSectionProps = Pick<AccordionProps, "className"> & {
    id?: string
}

function SummaryDetail({
    className,
    role,
    id,
    ...props
}: DetailSectionProps & { role: PortfolioRole }) {
    return (
        <AboutAccordionItem
            id={id}
            label="TL;DR"
            containerClassName={cn(className)}
            {...props}
        >
            {SUMMARY[role]}
        </AboutAccordionItem>
    )
}

function SkillsDetail({
    className,
    role,
    ...props
}: DetailSectionProps & { role: PortfolioRole }) {
    return (
        <AboutAccordionItem
            label="Tools & Skills"
            containerClassName={cn(className)}
            {...props}
        >
            {SKILLS[role].map((skill, index) => (
                <Text key={index}>
                    <Bold>{skill.title}</Bold> {skill.content.join(", ")}.
                </Text>
            ))}
        </AboutAccordionItem>
    )
}

function LearningDetail({ className, ...props }: DetailSectionProps) {
    return (
        <AboutAccordionItem
            label="Currently learning"
            containerClassName={cn(className)}
            {...props}
        >
            <ul className="space-y-1.5">
                {INTERESTING.map((fact, index) => (
                    <Text
                        key={index}
                        as="li"
                        className={cn(
                            "ms-[calc(1em-0.125rem-1px)] list-outside list-disc",
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
        </AboutAccordionItem>
    )
}

function FactsDetail({
    className,
    role,
    ...props
}: DetailSectionProps & { role: PortfolioRole }) {
    return (
        <AboutAccordionItem
            label="Facts"
            containerClassName={cn(className)}
            {...props}
        >
            <ul className="space-y-1.5">
                {FACTS[role].map((fact, index) => (
                    <Text
                        key={index}
                        as="li"
                        className={cn(
                            "ms-[calc(1em-0.125rem-1px)] list-outside list-disc",
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
        </AboutAccordionItem>
    )
}

function ThingsThatMatters({ className, ...props }: DetailSectionProps) {
    return (
        <AboutAccordionItem
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
            {...props}
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
                                "text-muted-foreground",
                                index === 0 && "xs:sr-only"
                            )}
                        >
                            {title}
                        </Bold>
                        <ul className="space-y-1.5">
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
        </AboutAccordionItem>
    )
}

export { Details }
