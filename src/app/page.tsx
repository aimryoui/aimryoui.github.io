import { AudioButton } from "@/_components/toolbar/audio-button"
import { SettingButton } from "@/_components/toolbar/settings-button"
import { Divider } from "@/components/layout/divider"
import { SectionLine } from "@/components/layout/line"
import { MediaFrame } from "@/components/layout/media-frame"
import { Space } from "@/components/layout/space"
import { ModeToggle } from "@/components/layout/toolbar/mode-toggle"
import { Image } from "@/components/media/image"
import { LinkButton } from "@/components/ui/button"
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
            <MediaFrame
                data-cursor={false}
                flex
                className={cn("h-full min-h-32")}
            >
                <Image
                    lightbox={false}
                    placeholderPriority
                    asBackgroundImage
                    src="/hehe.jpg"
                    alt="hehe"
                    rounded
                />
                <LinkButton
                    href="/portfolio"
                    data-cursor="target"
                    variant="outline"
                    scroll={false}
                    className={cn(
                        "z-10 light:bg-white dark:text-white",
                        "absolute left-1/2 top-1/2 !-translate-y-1/2 -translate-x-1/2",
                        "active:scale-95"
                    )}
                >
                    Portfolio
                </LinkButton>
            </MediaFrame>
            <SectionLine />
            <Space as="menu" className="flex items-center justify-center gap-3">
                <Tooltip>
                    <AudioButton />
                    <li>
                        <ModeToggle />
                    </li>
                    <li>
                        <SettingButton />
                    </li>
                </Tooltip>
            </Space>
            <SectionLine showDecoration />
            <Space />
        </main>
    )
}
