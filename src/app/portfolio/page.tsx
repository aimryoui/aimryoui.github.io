import { Fragment } from "react"

import { Divider } from "@/components/layout/divider"
import { ElementLine, SectionLine } from "@/components/layout/line"
import { Space } from "@/components/layout/space"
import { TooltipTrigger } from "@/components/ui/tooltip"
import { Bold, H1, Highlight, Link, Text } from "@/components/ui/typography"
import { cn } from "@/lib/utils"
import FlashOverlay from "@/portfolio/_components/flash-overlay"
import { AnchorPolyfill } from "@/portfolio/_providers/anchor-polyfill"
import Contact from "@/portfolio/_sections/contact"
import Education from "@/portfolio/_sections/education"
import Experience from "@/portfolio/_sections/experience"
import Footer from "@/portfolio/_sections/footer"
import { NoAIOverlay, NoAIPlaceholder } from "@/portfolio/_sections/no-ai"
import Outlines from "@/portfolio/_sections/outlines"
import Projects from "@/portfolio/_sections/projects"
import Software from "@/portfolio/_sections/software"

export default function Portfolio() {
    return (
        <>
            <AnchorPolyfill />
            <NoAIOverlay />
            {/* <ViewTransition name="main"> */}
            <main className={cn("relative flex-1")}>
                <FlashOverlay />
                <Space />
                <SectionLine showDecoration />
                <Space />
                <SectionLine />
                <div className={cn("relative bg-background px-6 pb-5 pt-3.5")}>
                    <span
                        className={cn(
                            "absolute -top-9.5 left-6 font-mono uppercase tracking-normal"
                        )}
                    >
                        About
                    </span>
                    <H1 id="about">
                        Hello there! I&#39;m <Bold>Hoang Nhan</Bold>, <br />a{" "}
                        <Bold>Creative Designer</Bold> majoring in{" "}
                        <Highlight>UI & UX Design</Highlight>.
                    </H1>
                </div>
                <SectionLine />
                <Divider />
                <SectionLine />
                <div className={cn("relative bg-background px-6 pb-4 pt-3.25")}>
                    <Text>
                        However, I came up from{" "}
                        {[
                            "event projects",
                            "short films",
                            "social posts",
                            "publications"
                        ].map((item, index, arr) => (
                            <Fragment key={item}>
                                <Bold>{item}</Bold>
                                {index < arr.length - 1 && ", "}
                            </Fragment>
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
                            <Fragment key={item}>
                                <Bold>{item}</Bold>
                                {index < arr.length - 1 && ", "}
                            </Fragment>
                        ))}
                        , etc. <br />
                        So with UI & UX Design, I can understand{" "}
                        <Highlight>what can be done, and what cannot</Highlight>
                        .
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
                <div className={cn("flex h-24 bg-background")}>
                    {[
                        { value: "2003", label: "Year of birth" },
                        { value: "45+", label: "Projects" },
                        { value: "4+", label: "Years as Designer" }
                    ].map((item) => (
                        <Fragment key={item.label}>
                            <div
                                className={cn(
                                    "relative grid flex-1 place-items-center bg-highlighted/10"
                                )}
                            >
                                <Highlight
                                    className={cn("text-4xl font-extrabold")}
                                >
                                    {item.value}
                                </Highlight>
                                <div
                                    className={cn(
                                        "absolute -bottom-5.25 flex rounded-md border border-stroke bg-background px-1 py-0.5"
                                    )}
                                >
                                    <span
                                        className={cn(
                                            "text-xxs font-extrabold uppercase tracking-tight"
                                        )}
                                    >
                                        {item.label}
                                    </span>
                                </div>
                            </div>
                            <ElementLine />
                            <Divider dir="vertical" />
                            <ElementLine />
                        </Fragment>
                    ))}
                    <div
                        className={cn(
                            "relative grid flex-1 place-items-center bg-highlighted/10"
                        )}
                    >
                        <TooltipTrigger
                            payload="Hồ Chí Minh City"
                            render={
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
                            }
                        />
                        <div
                            className={cn(
                                "absolute -bottom-5.25 flex rounded-md border border-stroke bg-background px-1 py-0.5"
                            )}
                        >
                            <span
                                className={cn(
                                    "text-xxs font-extrabold uppercase tracking-tight"
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
                            "relative grid flex-1 place-items-center bg-highlighted/10"
                        )}
                    >
                        <TooltipTrigger
                            payload={{
                                content: "Việt Nam",
                                sideOffset: 19
                            }}
                            render={
                                <Link
                                    href="https://wikipedia.org/wiki/Vietnam"
                                    openInNewTab
                                    className={cn(
                                        "grid aspect-3/2 w-[--w] place-items-center bg-[#da251d] [--w:calc(var(--spacing)*12)]"
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
                                            "aspect-square w-[calc(var(--w)/5*2)] bg-[#ffff00] clip-star"
                                        )}
                                    />
                                </Link>
                            }
                        />
                        {/* <TooltipContent
                                translate="no"
                                lang="vi-VN"
                                sideOffset={19}
                            >
                                Việt Nam
                            </TooltipContent> */}
                        <div
                            className={cn(
                                "absolute -bottom-5.25 flex rounded-md border border-stroke bg-background px-1 py-0.5"
                            )}
                        >
                            <span
                                className={cn(
                                    "text-xxs font-extrabold uppercase tracking-tight"
                                )}
                            >
                                Native Land
                            </span>
                        </div>
                    </div>
                </div>
                <SectionLine />
                <Divider />
                <SectionLine />
                <Space />
                <SectionLine showDecoration />

                <Experience />
                <SectionLine />

                <Education />
                <SectionLine />

                <Software />
                <SectionLine />

                <Contact />
                <SectionLine />
                <Divider />

                <NoAIPlaceholder />
                <Divider />
                <SectionLine />

                <Outlines />

                <Projects />

                <SectionLine />

                <Footer />
            </main>
            {/* </ViewTransition> */}
        </>
    )
}
