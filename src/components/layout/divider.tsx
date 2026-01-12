import { cn } from "@/lib/utils"

function Divider({ dir = "horizontal" }: { dir?: "vertical" | "horizontal" }) {
    return (
        <div
            className={cn(dir === "horizontal" ? "h-6 w-full" : "h-full w-6")}
        />
    )
}

export { Divider }
