"use client"

import { useEffect, useRef } from "react"

import { SectionLine } from "@/components/layout/line"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage
} from "@/components/ui/breadcrumb"
import { getCategoryPath } from "@/lib/project-sort"
import { cn } from "@/lib/utils"

interface ProjectBreadcrumbProps {
    category: string
    categoryTitle: string
    projectName?: string
}

function PortfolioBreadcrumb({
    category,
    categoryTitle,
    projectName
}: ProjectBreadcrumbProps) {
    const listRef = useRef<HTMLOListElement>(null)

    useEffect(() => {
        const rafId = requestAnimationFrame(() => {
            listRef.current?.scroll({
                left: listRef.current.scrollWidth,
                behavior: "smooth"
            })
        })
        return () => {
            cancelAnimationFrame(rafId)
        }
    }, [category, categoryTitle, projectName])

    return (
        <Breadcrumb
            className={cn({
                md: "fixed inset-x-0 bottom-20 z-50 h-auto w-full bg-background"
            })}
        >
            <SectionLine
                fit
                containerClassName={cn({
                    md: "absolute inset-x-0 top-0"
                })}
            />
            <BreadcrumbList
                ref={listRef}
                className={cn({
                    md: "overflow-x-scroll px-6 scroll-fade-x scroll-fade-24 scrollbar-thin"
                })}
            >
                <BreadcrumbItem>
                    <BreadcrumbLink href="/portfolio">Portfolio</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbItem>
                    <BreadcrumbLink href="/portfolio#projects">
                        Projects
                    </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbItem>
                    {projectName ? (
                        <BreadcrumbLink href={getCategoryPath(category)}>
                            {categoryTitle}
                        </BreadcrumbLink>
                    ) : (
                        <BreadcrumbPage>{categoryTitle}</BreadcrumbPage>
                    )}
                </BreadcrumbItem>
                {projectName && (
                    <BreadcrumbItem>
                        <BreadcrumbPage>{projectName}</BreadcrumbPage>
                    </BreadcrumbItem>
                )}
            </BreadcrumbList>
        </Breadcrumb>
    )
}

export { PortfolioBreadcrumb }
