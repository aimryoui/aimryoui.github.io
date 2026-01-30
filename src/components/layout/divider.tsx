import { cn } from "@/lib/utils"

function Divider({
    dir = "horizontal",
    className
}: React.ComponentProps<"div"> & { dir?: "vertical" | "horizontal" }) {
    return (
        <div
            className={cn(
                dir === "horizontal" ? "h-6 w-full" : "h-full w-6",
                className
            )}
        />
    )
}

export { Divider }
