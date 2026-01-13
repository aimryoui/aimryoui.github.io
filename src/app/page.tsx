import Link from "next/link"

import { Divider } from "@/components/layout/divider"
import { ElementLine, SectionLine } from "@/components/layout/line"
import { Space } from "@/components/layout/space"
import { Button } from "@/components/ui/button"
import { H1, H3, Highlight } from "@/components/ui/typography"
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
            <SectionLine />
            <div
                className={cn(
                    "bg-background grid w-full flex-1 place-items-center bg-[url(/images/hehe.webp)] bg-cover bg-center bg-no-repeat"
                )}
            >
                <Button
                    asChild
                    variant="outline"
                    className={cn("light:bg-white dark:text-white")}
                >
                    <Link href="/portfolio">Portfolio</Link>
                </Button>
            </div>
            <SectionLine />
            <Space />
            <SectionLine showDecoration />
            <Space />
        </main>
    )
}
