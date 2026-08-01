import { cn } from "@/lib/utils"

function Divider({
    dir = "horizontal",
    className,
    ...props
}: React.ComponentProps<"div"> & { dir?: "vertical" | "horizontal" }) {
    return (
        <div
            className={cn(
                dir === "horizontal"
                    ? "h-safe-zone w-full"
                    : "h-full w-safe-zone",
                className
            )}
            {...props}
        />
    )
}

export { Divider }
