"use client"

import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"

import { PanelTopClose, PanelTopOpen } from "lucide-react"
import { AnimatePresence } from "motion/react"
import * as m from "motion/react-m"

import { Button } from "@/components/ui/button"
import { TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { TableOfContents } from "@/portfolio/_components/_layout/_toc/toc"
import { useTocItems } from "@/portfolio/_hooks/use-toc-items"
import { usePortfolioModeStore } from "@/stores/portfolio-mode-store"
import { useTocPanelStore } from "@/stores/toc-panel-store"

function MobileTocDrawer() {
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
                        className="fixed inset-0 -z-1 min-h-screen bg-black/80"
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
                            duration: 0.5
                        }}
                        className={cn(
                            "flex h-[80dvh] flex-col overflow-hidden rounded-t-3xl text-2xl",
                            "border border-transparent bg-[linear-gradient(var(--color-background),var(--color-background)),linear-gradient(to_bottom,var(--color-stroke)_0%,var(--color-background)_100%)] bg-origin-border bg-clip-[padding-box,border-box]"
                        )}
                        onClick={handleNavClick}
                    >
                        <TableOfContents mobile mode={mode} items={tocItems} />
                    </m.aside>
                </>
            )}
        </AnimatePresence>
    )
}

function MobileTocButton() {
    const isTocOpen = useTocPanelStore((state) => state.isOpen)
    const toggleTocPanel = useTocPanelStore((state) => state.toggle)

    return (
        <TooltipTrigger
            delay={500}
            disabled={isTocOpen}
            payload={{
                content: <span>Table of Contents</span>
            }}
            render={
                <Button
                    size="icon"
                    variant="outline"
                    className={cn(
                        "size-full rounded-none border-y-0 border-e-0"
                    )}
                    aria-expanded={isTocOpen}
                    data-state={isTocOpen ? "open" : "closed"}
                    onClick={toggleTocPanel}
                >
                    {isTocOpen ? (
                        <PanelTopOpen className="size-8" strokeWidth={1.25} />
                    ) : (
                        <PanelTopClose className="size-8" strokeWidth={1.25} />
                    )}
                    <span className="sr-only">Table of Contents</span>
                </Button>
            }
        />
    )
}

export { MobileTocButton, MobileTocDrawer }
