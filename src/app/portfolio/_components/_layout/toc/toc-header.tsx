"use client"

import NextLink from "next/link"
import { usePathname } from "next/navigation"

import { ArrowLeft } from "@/components/icons/icons"
import { buttonVariants } from "@/components/ui/button"
import { Tooltip, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import {
    TocSearch,
    type TocSearchProps
} from "@/portfolio/_components/_layout/toc/toc-search"
import { usePortfolioModeStore } from "@/stores/portfolio-mode-store"

function TocHeader({
    value,
    onChange,
    onClear,
    cursorTarget,
    ref,
    ...props
}: TocSearchProps) {
    const pathname = usePathname()
    const mode = usePortfolioModeStore((state) => state.mode)

    return (
        <div
            className={cn("flex gap-3 bg-background px-6 py-5.5", {
                lg: "gap-4"
            })}
            // style={{
            //     viewTransitionName: "header"
            // }}
        >
            <Tooltip>
                {mode === "pages" && pathname !== "/portfolio" && (
                    <TooltipTrigger
                        delay={500}
                        payload={{
                            content: (
                                <span className="flex items-center gap-1">
                                    Back to Portfolio
                                </span>
                            ),
                            side: "bottom"
                        }}
                        render={
                            <NextLink
                                href="/portfolio#projects"
                                prefetch={false}
                                draggable={false}
                                {...(cursorTarget && {
                                    "data-cursor": "target"
                                })}
                                className={cn(
                                    "pointer-events-auto",
                                    buttonVariants({
                                        variant: "outline",
                                        size: "icon"
                                    }),
                                    {
                                        dark: "bg-input/25",
                                        lg: "size-[36px]"
                                    }
                                )}
                            >
                                <ArrowLeft className="size-4 lg:size-5" />
                                <span className="sr-only">
                                    Back to Portfolio
                                </span>
                            </NextLink>
                        }
                    />
                )}
                <TocSearch
                    ref={ref}
                    value={value}
                    onChange={onChange}
                    onClear={onClear}
                    cursorTarget={cursorTarget}
                    {...props}
                />
            </Tooltip>
        </div>
    )
}

export { TocHeader }
