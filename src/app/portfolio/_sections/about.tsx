import { Divider } from "@/components/layout/divider"
import { SectionLine } from "@/components/layout/line"
import { Space } from "@/components/layout/space"
import { Bold, H1, Highlight, Link, Text } from "@/components/ui/typography"
import { cn } from "@/lib/utils"
import { Blocks as AboutBlocks } from "@/portfolio/_sections/components/about/blocks"
import { Details as AboutDetails } from "@/portfolio/_sections/components/about/details"

function About() {
    return (
        <>
            <section
                id="about"
                className={cn(
                    "relative scroll-mt-[9999px] bg-background px-safe-zone py-safe-zone-vertical"
                )}
            >
                <span
                    className={cn(
                        "absolute bottom-full start-0 px-safe-zone pb-4 font-mono uppercase leading-normal",
                        {
                            md: "pb-3 text-sm"
                        }
                    )}
                >
                    About
                </span>
                <H1 className="flex flex-wrap gap-x-[.2em] leading-[2.75rem] sm:text-2xl">
                    Hello there!{" "}
                    <span className="block">
                        I&#39;m{" "}
                        <Bold className="font-wght-[625] md:text-3xl sm:text-2xl">
                            Hoàng Nhân
                        </Bold>
                        ,
                    </span>{" "}
                    <span className="flex flex-wrap gap-x-[.2em]">
                        <span className="block">
                            a{" "}
                            <Highlight className="font-wght-[625] md:text-3xl sm:text-2xl">
                                Product Designer
                            </Highlight>
                        </span>{" "}
                        specializing in{" "}
                        <span className="block">
                            <Bold className="font-wght-[625] md:text-3xl sm:text-2xl">
                                UI/UX Design
                            </Bold>
                            .
                        </span>
                    </span>
                </H1>
            </section>
            <SectionLine />
            <Divider />

            <SectionLine />
            <AboutDetails />
            <SectionLine />

            <Divider />

            <SectionLine />
            <AboutBlocks />
            <SectionLine />

            <Divider />
            <SectionLine />
            <Space
                className={cn(
                    "hidden h-auto min-h-space flex-col gap-0.5 px-safe-zone py-safe-zone-vertical",
                    {
                        lg: "py-safe-zone-vertical",
                        md: "flex",
                        sm: "gap-2"
                    }
                )}
            >
                <Text>
                    Currently I&#39;m living in{" "}
                    <Link
                        href="https://en.wikipedia.org/wiki/Ho_Chi_Minh_City"
                        openInNewTab
                        className="inline font-wght-600"
                    >
                        Hồ Chí Minh City
                    </Link>
                    , based in{" "}
                    <Link
                        href="https://wikipedia.org/wiki/Vietnam"
                        openInNewTab
                        className="inline-flex items-center gap-1 font-wght-600"
                    >
                        <span
                            className={cn(
                                "grid aspect-3/2 h-fit w-[--w] translate-y-[.05em] place-items-center bg-[#da251d] [--w:calc(var(--spacing)*6)]"
                            )}
                        >
                            <span
                                className={cn(
                                    "aspect-square w-[calc(var(--w)/5*2)] bg-[#ffff00] clip-star"
                                )}
                            />
                        </span>
                        Việt Nam
                    </Link>
                    .
                </Text>
                <Text>
                    I&#39;m <Bold>comfortable</Bold> with remote setups,
                    experienced in and <Bold>prefer working remotely</Bold>.
                </Text>
            </Space>
        </>
    )
}

export default About
