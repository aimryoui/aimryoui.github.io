"use client"

import { usePathname } from "next/navigation"

import { ArrowLeft } from "@/components/icons/icons"
import { LinkButton } from "@/components/ui/button"
import { Tooltip, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { useMobileTocStore } from "@/portfolio/_components/_layout/toc/stores/mobile-toc-store"
import {
    TocSearch,
    type TocSearchProps
} from "@/portfolio/_components/_layout/toc/toc-search"

function TocHeader({
    containerClassName,
    value,
    onChange,
    onClear,
    ref,
    ...props
}: TocSearchProps & {
    containerClassName?: string
}) {
    const pathname = usePathname()

    return (
        <div
            className={cn(
                "flex gap-3 bg-background px-safe-zone py-[calc(var(--spacing-safe-zone)-var(--spacing)*.5)]",
                containerClassName
            )}
            // style={{
            //     viewTransitionName: "header"
            // }}
        >
            <Tooltip>
                {pathname !== "/portfolio" && (
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
                            <LinkButton
                                href="/portfolio#selected-works"
                                variant="outline"
                                size="icon"
                                prefetch={false}
                                scroll={false}
                                className={cn("pointer-events-auto", {
                                    dark: "bg-input/25"
                                })}
                                tracking={{
                                    eventName: "button_click",
                                    eventParams: {
                                        button_name: "TOC Header - Back"
                                    }
                                }}
                                onPress={() => {
                                    useMobileTocStore
                                        .getState()
                                        .setIsTocOpen(false)
                                }}
                            >
                                <ArrowLeft className="size-4 rtl:rotate-180" />
                            </LinkButton>
                        }
                    />
                )}
                <TocSearch
                    ref={ref}
                    value={value}
                    onChange={onChange}
                    onClear={onClear}
                    {...props}
                />
            </Tooltip>
        </div>
    )
}

export { TocHeader }
