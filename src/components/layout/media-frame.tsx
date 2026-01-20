import { cn } from "@/lib/utils"

function MediaFrame({
    className,
    children
}: {
    className?: string
    children: React.ReactNode
}) {
    return (
        <div
            className={cn(
                "bg-stroke-foreground relative flex w-full items-center justify-center gap-2 overflow-clip p-2 [overflow-clip-margin:content-box]",
                className
            )}
        >
            {children}
        </div>
    )
}

export { MediaFrame }
