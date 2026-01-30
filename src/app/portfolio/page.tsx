import React from "react"

import Contact from "@/app/portfolio/_sections/contact"
import Education from "@/app/portfolio/_sections/education"
import Experiences from "@/app/portfolio/_sections/experiences"
import NoAI from "@/app/portfolio/_sections/no-ai"
import Outlines from "@/app/portfolio/_sections/outlines"
import Projects from "@/app/portfolio/_sections/projects"
import Software from "@/app/portfolio/_sections/software"
import { Divider } from "@/components/layout/divider"
import { ElementLine, SectionLine } from "@/components/layout/line"
import { Space } from "@/components/layout/space"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger
} from "@/components/ui/tooltip"
import { Bold, H1, Highlight, Link, Text } from "@/components/ui/typography"
import { cn } from "@/lib/utils"

export default function Portfolio() {
    return (
        <main className={cn("flex-1")}>
            <Space />
            <SectionLine showDecoration />
            <Space />
            <SectionLine />
            <div className={cn("bg-background relative px-6 pt-3.5 pb-5")}>
                <span
                    className={cn(`
                    absolute -top-10.5 left-6
                    font-mono tracking-normal uppercase
                `)}
                >
                    About
                </span>
                <H1 id="about">
                    Hello there! I'm <Bold>Hoang Nhan</Bold>, <br />a{" "}
                    <Bold>Creative Designer</Bold> majoring in{" "}
                    <Highlight>UI & UX Design</Highlight>.
                </H1>
            </div>
            <SectionLine />
            <Divider />
            <SectionLine />
            <div className={cn("bg-background relative px-6 pt-3.5 pb-4")}>
                <Text>
                    However, I came up from{" "}
                    {[
                        "event projects",
                        "short films",
                        "social posts",
                        "publications"
                    ].map((item, index, arr) => (
                        <React.Fragment key={item}>
                            <Bold>{item}</Bold>
                            {index < arr.length - 1 && ", "}
                        </React.Fragment>
                    ))}
                    , or event-type university course projects.
                </Text>
                <br />
                <Text>
                    Also, I love coding, I have some experience with{" "}
                    {[
                        "HTML5",
                        "CSS3",
                        "JavaScript",
                        "TypeScript",
                        "React",
                        "Next.js",
                        "Tailwind CSS",
                        "shadcn/ui",
                        "Tauri"
                    ].map((item, index, arr) => (
                        <React.Fragment key={item}>
                            <Bold>{item}</Bold>
                            {index < arr.length - 1 && ", "}
                        </React.Fragment>
                    ))}
                    , etc. <br />
                    So with UI & UX Design, I can understand{" "}
                    <Highlight>what can be done, and what cannot</Highlight>.
                    <br />
                    From there I can{" "}
                    <Bold>
                        easily work and communicate with related positions
                    </Bold>{" "}
                    such as developers.
                </Text>
            </div>
            <SectionLine />
            <Divider />
            <SectionLine />
            <div className={cn("bg-background flex h-24")}>
                <TooltipProvider>
                    {[
                        { value: "2003", label: "Year of birth" },
                        { value: "45+", label: "Projects" },
                        { value: "4+", label: "Years as Designer" }
                    ].map((item) => (
                        <React.Fragment key={item.label}>
                            <div
                                className={cn(
                                    "bg-highlighted/10 relative grid flex-1 place-items-center"
                                )}
                            >
                                <Highlight
                                    className={cn("text-4xl font-extrabold")}
                                >
                                    {item.value}
                                </Highlight>
                                <div
                                    className={cn(
                                        "bg-background border-stroke-foreground absolute -bottom-5.75 flex rounded-md border px-1 py-0.5"
                                    )}
                                >
                                    <span
                                        className={cn(
                                            "text-xxs font-extrabold tracking-tight uppercase"
                                        )}
                                    >
                                        {item.label}
                                    </span>
                                </div>
                            </div>
                            <ElementLine />
                            <Divider dir="vertical" />
                            <ElementLine />
                        </React.Fragment>
                    ))}
                    <div
                        className={cn(
                            "bg-highlighted/10 relative grid flex-1 place-items-center"
                        )}
                    >
                        <Tooltip>
                            <TooltipTrigger>
                                <Link
                                    href="https://en.wikipedia.org/wiki/Ho_Chi_Minh_City"
                                    openInNewTab
                                    highlight
                                    className={cn("text-4xl")}
                                >
                                    <Highlight
                                        className={cn(
                                            "text-4xl font-extrabold"
                                        )}
                                    >
                                        HCMC
                                    </Highlight>
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent>Hồ Chí Minh City</TooltipContent>
                        </Tooltip>
                        <div
                            className={cn(
                                "bg-background border-stroke-foreground absolute -bottom-5.75 flex rounded-md border px-1 py-0.5"
                            )}
                        >
                            <span
                                className={cn(
                                    "text-xxs font-extrabold tracking-tight uppercase"
                                )}
                            >
                                Location
                            </span>
                        </div>
                    </div>
                    <ElementLine />
                    <Divider dir="vertical" />
                    <ElementLine />
                    <div
                        className={cn(
                            "bg-highlighted/10 relative grid flex-1 place-items-center"
                        )}
                    >
                        <Tooltip>
                            <TooltipTrigger>
                                <Link
                                    href="https://wikipedia.org/wiki/Vietnam"
                                    openInNewTab
                                    className={cn(
                                        "grid h-8 w-12 place-items-center bg-[#DA251D]"
                                    )}
                                >
                                    <Highlight
                                        className={cn(
                                            "sr-only text-4xl font-extrabold"
                                        )}
                                    >
                                        Vietnam
                                    </Highlight>
                                    {/* https://css-shape.com/star/ */}
                                    <div
                                        className={cn(
                                            "aspect-square w-[1.2rem] bg-[#FFFF00] [clip-path:polygon(50%_0,79%_90%,2%_35%,98%_35%,21%_90%)]"
                                        )}
                                    />
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent
                                translate="no"
                                lang="vi-VN"
                                sideOffset={9}
                            >
                                Việt Nam
                            </TooltipContent>
                        </Tooltip>
                        <div
                            className={cn(
                                "bg-background border-stroke-foreground absolute -bottom-5.75 flex rounded-md border px-1 py-0.5"
                            )}
                        >
                            <span
                                className={cn(
                                    "text-xxs font-extrabold tracking-tight uppercase"
                                )}
                            >
                                Native Land
                            </span>
                        </div>
                    </div>
                </TooltipProvider>
            </div>
            <SectionLine />
            <Divider />
            <SectionLine />
            <Space />
            <SectionLine showDecoration />

            <Experiences />
            <SectionLine />

            <Education />
            <SectionLine />

            <Software />
            <SectionLine />

            <Contact />

            <SectionLine />
            <Space />
            <SectionLine showDecoration />

            <Outlines />

            <SectionLine />
            <Space />
            <SectionLine />

            <NoAI />

            <SectionLine />

            <Projects />
        </main>
    )
}
