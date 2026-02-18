"use client"

import { useEffect, useRef, useState } from "react"

import { Divider } from "@/components/layout/divider"
import { SectionLine } from "@/components/layout/line"
import { Button } from "@/components/ui/button"
import { Highlight } from "@/components/ui/typography"
import { cn } from "@/lib/utils"

interface ExpandableWrapperProps {
    children: React.ReactNode
    className?: string
    projectName?: string
}

export function ExpandableWrapper({
    children,
    className,
    projectName
}: ExpandableWrapperProps) {
    const [isExpanded, setIsExpanded] = useState(false)
    const [isOverflowing, setIsOverflowing] = useState(false)
    const contentRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const checkOverflow = () => {
            const el = contentRef.current
            if (!el) return

            if (el.scrollHeight > el.clientHeight) {
                setIsOverflowing(true)
            }
        }

        const timer = setTimeout(checkOverflow, 0)
        return () => {
            clearTimeout(timer)
        }
    }, [])

    const handleShowLess = () => {
        setIsExpanded(false)

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
                    "relative",
                    !isExpanded &&
                        "[clip-path:inset(calc((var(--px)/2)*-1)_-50vw_0_-50vw)]",
                    className
                )}
            >
                <div
                    ref={contentRef}
                    className={cn(
                        "w-full",
                        !isExpanded ? "max-h-700" : "max-h-none"
                    )}
                >
                    {children}
                </div>

                {!isExpanded && isOverflowing && (
                    <div
                        className={cn(
                            "absolute -bottom-6 z-40 flex h-120 w-full flex-col items-center justify-end bg-gradient-to-t from-background from-10% to-transparent pb-11.5"
                        )}
                    >
                        <Button
                            variant="outline"
                            className={cn("gap-2 rounded-full shadow-sm")}
                            onClick={() => {
                                setIsExpanded(true)
                            }}
                        >
                            <span>
                                Continue reading:{" "}
                                <Highlight>{projectName}</Highlight>
                            </span>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                className="size-3"
                            >
                                <path
                                    fill="currentColor"
                                    d="M12.002 1c.741 0 1.263.521 1.263 1.286v14.389l-.093 2.502 3.058-3.418 2.63-2.595c.22-.22.545-.37.892-.37.695 0 1.217.532 1.217 1.24 0 .335-.128.636-.394.914l-7.635 7.646c-.255.255-.59.406-.938.406s-.684-.15-.939-.405L3.43 14.947c-.266-.278-.394-.579-.394-.915 0-.707.51-1.24 1.205-1.24.36 0 .672.151.904.371l2.63 2.595 3.058 3.406-.093-2.49V2.285c0-.764.51-1.285 1.263-1.285Z"
                                />
                            </svg>
                        </Button>
                    </div>
                )}
                {isExpanded && isOverflowing && (
                    <>
                        <SectionLine />
                        <div
                            className={cn(
                                "sticky bottom-0 z-40 grid w-full place-items-center delay-100 will-change-[translate,opacity] transition-[translate,opacity] ease-out duration-250",
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
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    className="size-3"
                                >
                                    <path
                                        fill="currentColor"
                                        d="M11.998 23c-.741 0-1.263-.521-1.263-1.286V7.325l.093-2.502L7.77 8.241l-2.63 2.595c-.22.22-.545.37-.892.37-.695 0-1.217-.532-1.217-1.24 0-.335.128-.636.394-.914l7.635-7.647c.255-.254.59-.405.938-.405s.684.15.939.405l7.634 7.647c.266.278.394.579.394.915 0 .707-.51 1.24-1.205 1.24-.36 0-.672-.151-.904-.371l-2.63-2.595-3.058-3.406.093 2.49v14.39c0 .764-.51 1.285-1.263 1.285Z"
                                    />
                                </svg>
                            </Button>
                        </div>
                    </>
                )}
            </div>
            {!isExpanded && (
                <>
                    <SectionLine />
                    <Divider />
                </>
            )}
        </>
    )
}
