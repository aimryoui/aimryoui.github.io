"use client"

import { usePathname } from "next/navigation"

import { ArrowLeft } from "@/components/icons/icons"
import { LinkButton } from "@/components/ui/button"
import { Tooltip, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
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
                                href="/portfolio#design-projects"
                                variant="outline"
                                size="icon"
                                prefetch={false}
                                scroll={false}
                                className={cn("pointer-events-auto", {
                                    dark: "bg-input/25"
                                })}
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
