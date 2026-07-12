"use client"

import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"

import { AnimatePresence } from "motion/react"
import * as m from "motion/react-m"

import { cn } from "@/lib/utils"
import { useTocItems } from "@/portfolio/_components/_layout/_toc/use-toc-items"
import { TableOfContents } from "@/portfolio/_components/_layout/table-of-contents"
import { usePortfolioModeStore } from "@/stores/portfolio-mode-store"
import { useTocPanelStore } from "@/stores/toc-panel-store"

function MobileTocPanel() {
    const mode = usePortfolioModeStore((state) => state.mode)
    const isOpen = useTocPanelStore((state) => state.isOpen)
    const close = useTocPanelStore((state) => state.close)
    const tocItems = useTocItems(mode)

    const pathname = usePathname()
    const prevPathnameRef = useRef(pathname)

    // Auto-close when route changes (pages mode navigation)
    useEffect(() => {
        if (prevPathnameRef.current !== pathname && isOpen) {
            close()
        }
        prevPathnameRef.current = pathname
    }, [pathname, isOpen, close])

    // Auto-close when an anchor link is clicked (spread mode)
    const handleNavClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const target = (e.target as HTMLElement).closest("a")
        if (target) {
            close()
        }
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <m.div
                        key="backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 -z-1 bg-black/80"
                        onClick={close}
                    />
                    {/* TOC */}
                    <m.aside
                        key="toc-panel"
                        initial={{ y: "150%", filter: "none" }}
                        animate={{
                            y: 0,
                            filter: [
                                "drop-shadow(0px 0px 25px rgba(0,0,0,0.16)) drop-shadow(0px 0px 2px rgba(0,0,0,0.10))"
                            ]
                        }}
                        exit={{ y: "150%", filter: "none" }}
                        transition={{
                            type: "spring",
                            bounce: 0,
                            duration: 0.7
                        }}
                        className={cn(
                            "flex h-[70dvh] flex-col overflow-hidden rounded-t-3xl !text-base",
                            "border border-transparent bg-[linear-gradient(var(--color-background),var(--color-background)),linear-gradient(to_bottom,var(--color-stroke)_0%,var(--color-background)_100%)] bg-origin-border bg-clip-[padding-box,border-box]"
                        )}
                        onClick={handleNavClick}
                    >
                        <TableOfContents mode={mode} items={tocItems} />
                    </m.aside>
                </>
            )}
        </AnimatePresence>
    )
}

export { MobileTocPanel }
