"use client"

import { Highlight } from "@/components/ui/typography"
import { useQueryStore } from "@/stores/query-store"

function Role() {
    const role = useQueryStore((s) => s.role)

    return (
        <Highlight className="text-center">
            {role === "cd"
                ? "Creative Designer"
                : "Product Designer - UI/UX Designer"}
        </Highlight>
    )
}

export { Role }
