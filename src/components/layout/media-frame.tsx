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
                "bg-stroke-foreground flex size-full items-center justify-center overflow-clip p-2 [overflow-clip-margin:content-box]",
                className
            )}
        >
            {children}
        </div>
    )
}

export { MediaFrame }
