"use client"

import { Undo2 } from "lucide-react"

import { ArrowRight } from "@/components/icons/icons"
import { toast } from "@/components/ui/toast"
import { Bold } from "@/components/ui/typography"

function showMenuToast(
    label: string,
    oldState: string,
    newState: string,
    onUndo?: () => void
) {
    const id = toast.add({
        type: "success" as const,
        description: (
            <span className="flex items-center gap-1.5">
                <Bold>{label}:</Bold>
                <span className="text-muted-foreground line-through decoration-current decoration-solid decoration-[.03125rem] dark:decoration-1">
                    {oldState}
                </span>
                <ArrowRight className="size-3 text-muted-foreground rtl:rotate-180" />
                <Bold className="text-foreground">{newState}</Bold>
            </span>
        ),
        actionProps: onUndo
            ? {
                  className: "-me-1.5 ms-1.5 border-s border-input",
                  children: (
                      <Undo2 className="-translate-y-[.5px] rtl:-scale-x-100" />
                  ),
                  onClick: () => {
                      onUndo()
                      toast.close(id)
                  },
                  "aria-label": "Undo change"
              }
            : undefined
    })

    return id
}

export { showMenuToast }
