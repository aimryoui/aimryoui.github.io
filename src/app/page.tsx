import NextLink from "next/link"

import { Divider } from "@/components/layout/divider"
import { SectionLine } from "@/components/layout/line"
import { MediaFrame } from "@/components/layout/media-frame"
import { Space } from "@/components/layout/space"
import { ModeToggle } from "@/components/mode-toggle"
import { buttonVariants } from "@/components/ui/button"
import { Image } from "@/components/ui/image"
import { Tooltip } from "@/components/ui/tooltip"
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
                <H1>Nguyễn Hoàng Nhân</H1>
                <Highlight>Creative Designer & UI/UX Designer</Highlight>
            </div>
            <SectionLine />
            <Divider />
            <MediaFrame flex className={cn("h-full")}>
                <Image
                    lightbox={false}
                    placeholderPriority
                    asBackgroundImage
                    src="/hehe.jpg"
                    alt="hehe"
                    rounded
                />
                <NextLink
                    href="/portfolio"
                    className={cn(
                        buttonVariants({ variant: "outline" }),
                        "z-10 light:bg-white dark:text-white",
                        "absolute left-1/2 top-1/2 !-translate-y-1/2 -translate-x-1/2"
                    )}
                >
                    Portfolio
                </NextLink>
            </MediaFrame>
            <SectionLine />
            <Space className="grid place-items-center">
                <Tooltip>
                    <ModeToggle />
                </Tooltip>
            </Space>
            <SectionLine showDecoration />
            <Space />
        </main>
    )
}
