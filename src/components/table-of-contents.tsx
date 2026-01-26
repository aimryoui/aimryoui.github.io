"use client"

import Link from "next/link"

import { useScrollSpy } from "@/hooks/use-scroll-spy"
import { cn } from "@/lib/utils"

import { SectionLine } from "./layout/line"

export function TableOfContents() {
    const spy = useScrollSpy({
        selector: ":is(h1, h2, h3)"
    })

    const headings = spy.data.map((heading, index) => (
        <li
            key={heading.id}
            className={cn(
                heading.depth === 3
                    ? "border-muted-foreground/20 border-s-1 ps-3.5"
                    : "mb-2",
                "box-content h-fit list-inside",
                heading.depth === 3 &&
                    index === spy.active &&
                    "border-highlighted"
            )}
        >
            {!(heading.depth === 3) && (
                <SectionLine fit parentClassName={cn("my-4")} />
            )}
            <Link
                href={`#${heading.id}`}
                onClick={(e) => {
                    e.preventDefault()
                    const targetId = heading.id
                    const el = document.getElementById(targetId)
                    if (el) {
                        el.scrollIntoView({
                            behavior: "smooth",
                            block: "start"
                        })
                    }
                    window.history.pushState(null, "", `#${targetId}`)
                }}
                className={cn(
                    index === spy.active
                        ? "text-highlighted"
                        : "hover:text-foreground",
                    "inline-block w-full",
                    heading.depth === 3 ? "py-1" : "font-bold"
                )}
            >
                {heading.depth === 1
                    ? "About"
                    : heading.value
                          .replace(/^\d+\.\s*/, "")
                          .replace(/\.$/, (match) => {
                              const text = heading.value
                                  .replace(/^\d+\.\s*/, "")
                                  .slice(0, -1)
                                  .toLowerCase()
                              return /^(mr|ms|mrs|dr|jr)$/.test(text)
                                  ? match
                                  : ""
                          })}
            </Link>
        </li>
    ))

    return (
        <nav className="bg-background fixed top-0 z-50 h-full w-72 px-6 pt-3.5 pb-4">
            <h4 className="mb-4 text-sm font-bold">On this page</h4>
            <ul className="text-sm">{headings}</ul>
        </nav>
    )
}
