import Link from "next/link"

import { Divider } from "@/components/layout/divider"
import { SectionLine } from "@/components/layout/line"
import { MediaFrame } from "@/components/layout/media-frame"
import { Space } from "@/components/layout/space"
import { Button } from "@/components/ui/button"
import { Image } from "@/components/ui/image"
import { H1, Highlight } from "@/components/ui/typography"
import { cn } from "@/lib/utils"

export default function Home() {
    return (
        <main className={cn("flex w-full flex-col")}>
            <Space />
            <SectionLine showDecoration />
            <div
                className={cn(
                    "bg-background flex w-full flex-col items-center justify-center gap-2 p-6"
                )}
            >
                <H1>Nguyễn Hoàng Nhân</H1>
                <Highlight>Creative Designer & UI/UX Designer</Highlight>
            </div>
            <SectionLine />
            <Divider />
            <MediaFrame
                containerClassName={cn("h-full flex-1")}
                className={cn("h-full")}
            >
                <Image
                    placeholderPriority
                    asBackgroundImage
                    src="hehe.jpg"
                    alt="hehe"
                    className={cn("rounded-2xl")}
                />
                <Button
                    asChild
                    variant="outline"
                    className={cn(
                        "light:bg-white dark:text-white",
                        "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                    )}
                >
                    <Link href="/portfolio">Portfolio</Link>
                </Button>
            </MediaFrame>
            <SectionLine />
            <Space />
            <SectionLine showDecoration />
            <Space />
        </main>
    )
}
