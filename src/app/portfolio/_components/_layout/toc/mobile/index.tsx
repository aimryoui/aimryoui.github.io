"use client"

import dynamic from "next/dynamic"

import { ListUpMinimalisticBoldDuotoneIcon } from "@solar-icons/react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export { useMobileTocStore } from "@/portfolio/_components/_layout/toc/mobile/mobile-toc-store"

const MobileToc = dynamic(() => import("./mobile-toc"), {
    ssr: false,
    loading: () => (
        <Button
            size="icon"
            variant="outline"
            haptic={undefined}
            isDisabled={true}
            className={cn("!size-full !rounded-none border-0")}
            aria-expanded={false}
            data-state="closed"
        >
            <ListUpMinimalisticBoldDuotoneIcon className="size-8" />
            <span className="sr-only">Table of Contents</span>
        </Button>
    )
})

function MobileTocButton() {
    return <MobileToc />
}

export { MobileTocButton }
