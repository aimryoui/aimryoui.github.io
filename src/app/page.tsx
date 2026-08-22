import { ArrowUpRight } from "lucide-react"

import { RootPreferencesButton } from "@/_components/toolbar/root-preferences-button"
import { AudioToggle } from "@/components/audio/audio"
import { Divider } from "@/components/layout/divider"
import { SectionLine } from "@/components/layout/line"
import { MediaFrame } from "@/components/layout/media-frame"
import { Space } from "@/components/layout/space"
import { ModeToggle } from "@/components/layout/toolbar/mode-toggle"
import { Image } from "@/components/media/image"
import { LinkButton } from "@/components/ui/button"
import { Tooltip, TooltipTrigger } from "@/components/ui/tooltip"
import { H1, Highlight } from "@/components/ui/typography"
import { cn } from "@/lib/utils"

export default function Home() {
    return (
        <main className={cn("flex w-full flex-col")}>
            <Space />
            <SectionLine showDecoration />
            <div
                className={cn(
                    "flex w-full flex-col items-center justify-center gap-2 bg-background p-6"
                )}
            >
                <H1 className="text-center">Nguyễn Hoàng Nhân</H1>
                <Highlight className="text-center">
                    Product Designer - UI/UX Designer
                </Highlight>
            </div>
            <SectionLine />
            <Divider />
            <MediaFrame
                data-cursor={null}
                flex
                className={cn("h-full min-h-32")}
            >
                <Image
                    dim
                    lightbox={false}
                    placeholderPriority
                    asBackgroundImage
                    src="/hehe.jpg"
                    alt="hehe"
                    rounded
                />
                <LinkButton
                    href="/portfolio"
                    variant="outline"
                    scroll={false}
                    className={cn(
                        "z-10 light:bg-white dark:text-white",
                        "absolute start-1/2 top-1/2 !-translate-y-1/2 -translate-x-1/2",
                        "active:scale-95 rtl:translate-x-1/2"
                    )}
                >
                    Portfolio
                </LinkButton>
            </MediaFrame>
            <SectionLine />
            <Space as="menu" className="flex items-center justify-center gap-3">
                <Tooltip>
                    <li>
                        <AudioToggle />
                    </li>
                    <li>
                        <ModeToggle />
                    </li>
                    <li className="xs:hidden">
                        <TooltipTrigger
                            delay={500}
                            payload={{
                                content: <span>Download my Resume</span>
                            }}
                            render={
                                <LinkButton
                                    href="/Resume_Product-Designer_Nguyen-Hoang-Nhan.pdf"
                                    variant="outline"
                                    className="dark:bg-input/25"
                                >
                                    Resume
                                    <ArrowUpRight className="-me-1 rtl:-scale-x-100" />
                                </LinkButton>
                            }
                        />
                    </li>
                    <li>
                        <RootPreferencesButton />
                    </li>
                </Tooltip>
            </Space>
            <SectionLine showDecoration />
            <Space
                className={cn({
                    lg: {
                        after: "pointer-events-none absolute bottom-0 start-1/2 z-40 h-space w-screen -translate-x-1/2 bg-gradient-to-t from-background to-transparent"
                    }
                })}
            />
        </main>
    )
}
