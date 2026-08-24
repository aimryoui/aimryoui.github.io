"use client"

import { Bold, Highlight } from "@/components/ui/typography"
import { useQueryStore } from "@/stores/query-store"

function Role() {
    const role = useQueryStore((s) => s.role)

    if (role === "cd") {
        return (
            <span className="flex flex-wrap gap-x-[.2em]">
                <span className="block">
                    a{" "}
                    <Highlight className="font-wght-[625] md:text-3xl sm:text-2xl">
                        Creative Designer
                    </Highlight>
                </span>{" "}
                specializing in{" "}
                <span className="block">
                    <Bold className="font-wght-[625] md:text-3xl sm:text-2xl">
                        Visual Design
                    </Bold>
                    .
                </span>
            </span>
        )
    }

    return (
        <span className="flex flex-wrap gap-x-[.2em]">
            <span className="block">
                a{" "}
                <Highlight className="font-wght-[625] md:text-3xl sm:text-2xl">
                    Product Designer
                </Highlight>
            </span>{" "}
            specializing in{" "}
            <span className="block">
                <Bold className="font-wght-[625] md:text-3xl sm:text-2xl">
                    UI/UX Design
                </Bold>
                .
            </span>
        </span>
    )
}

export { Role }
