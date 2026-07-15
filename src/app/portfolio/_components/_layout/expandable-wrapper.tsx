"use client"

import { useEffect, useRef, useState } from "react"

import { ArrowDown, ArrowUp } from "@/components/icons/icons"
import { Divider } from "@/components/layout/divider"
import { SectionLine } from "@/components/layout/line"
import { Button } from "@/components/ui/button"
import { Highlight } from "@/components/ui/typography"
import { cn } from "@/lib/utils"

interface ExpandableWrapperProps {
    children: React.ReactNode
    className?: string
    projectName?: string
    forceExpand: boolean
}

export function ExpandableWrapper({
    children,
    className,
    projectName,
    forceExpand
}: ExpandableWrapperProps) {
    const [userExpanded, setUserExpanded] = useState(false)
    const [isOverflowing, setIsOverflowing] = useState(true)
    const contentRef = useRef<HTMLDivElement>(null)

    const isExpanded = forceExpand || userExpanded

    useEffect(() => {
        if (forceExpand) return

        const checkOverflow = () => {
            const el = contentRef.current
            if (!el) return

            if (el.scrollHeight <= el.clientHeight) {
                setIsOverflowing(false)
            }
        }

        const timer = setTimeout(checkOverflow, 0)
        return () => {
            clearTimeout(timer)
        }
    }, [forceExpand])

    const handleShowLess = () => {
        setUserExpanded(false)

        requestAnimationFrame(() => {
            if (contentRef.current) {
                contentRef.current.scrollIntoView({
                    behavior: "instant",
                    block: "nearest"
                })
            }
        })
    }

    return (
        <>
            <div
                className={cn(
                    "relative overflow-y-clip clip-inset-[0_-50vw]",
                    className
                )}
            >
                <div
                    ref={contentRef}
                    className={cn("w-full", !isExpanded && "max-h-700")}
                >
                    {children}
                </div>

                {!isExpanded && isOverflowing && (
                    <div
                        className={cn(
                            "pointer-events-none absolute -bottom-6 z-40 flex h-120 w-full flex-col items-center justify-end bg-gradient-to-t from-background from-10% to-transparent pb-11.5"
                        )}
                    >
                        <Button
                            variant="outline"
                            className={cn(
                                "pointer-events-auto gap-2 rounded-full shadow-sm"
                            )}
                            onClick={() => {
                                setUserExpanded(true)
                            }}
                        >
                            <span>
                                Continue reading:{" "}
                                <Highlight>{projectName}</Highlight>
                            </span>
                            <ArrowDown className={cn("size-3")} />
                        </Button>
                    </div>
                )}
                {isExpanded && isOverflowing && !forceExpand && (
                    <>
                        <SectionLine />
                        <div
                            className={cn(
                                "sticky bottom-0 z-40 grid w-full place-items-center will-change-transform transition-[transform,opacity] ease-out duration-250 delay-100",
                                {
                                    starting: "translate-y-12 opacity-0"
                                }
                            )}
                        >
                            <Button
                                variant="outline"
                                className={cn(
                                    "my-5.5 gap-2 rounded-full shadow-sm"
                                )}
                                onClick={handleShowLess}
                            >
                                Show Less
                                <ArrowUp className={cn("size-3")} />
                            </Button>
                        </div>
                    </>
                )}
            </div>
            {(!isExpanded || forceExpand) && (
                <>
                    <SectionLine />
                    <Divider />
                </>
            )}
        </>
    )
}
