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

function ProjectSectionDivider({ sectionName }: { sectionName: string }) {
    return (
        <h5
            className={cn(
                "bg-background w-full p-3 text-center font-mono uppercase"
            )}
        >
            {sectionName}
        </h5>
    )
}

export { Divider, ProjectSectionDivider }
