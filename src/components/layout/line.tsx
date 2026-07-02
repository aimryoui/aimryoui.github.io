import { cn } from "@/lib/utils"

function MarginLine({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div className={cn("sticky top-0 h-dvh w-px", className)} {...props}>
            <hr
                className={cn(
                    "sticky top-0 h-full border-r border-dashed border-stroke",
                    {
                        md: "border-r-[1px]"
                    }
                )}
            />
        </div>
    )
}

function Plus({ position }: { position?: "left" | "right" }) {
    return (
        <div
            className={cn(
                "relative z-1 size-1",
                {
                    before: "absolute left-1/2 top-1/2 h-6 w-1 -translate-x-1/2 -translate-y-1/2 bg-highlighted",
                    after: "absolute left-1/2 top-1/2 h-1 w-6 -translate-x-1/2 -translate-y-1/2 bg-highlighted"
                },
                position === "left" && "-ml-[.171875rem]",
                position === "right" && "-mr-[.171875rem]"
            )}
            role="presentation"
        />
    )
}

function SectionLine({
    className,
    showDecoration = false,
    fit = false,
    ...props
}: React.ComponentProps<"hr"> & {
    showDecoration?: boolean
    fit?: boolean
}) {
    return (
        <div
            className={cn(
                "relative z-10 h-0 w-full",
                showDecoration && "flex items-center justify-between"
            )}
        >
            {showDecoration && <Plus position="left" />}
            <hr
                className={cn(
                    "absolute top-1/2 -translate-y-1/2 border-b border-dashed border-stroke bg-background",
                    fit ? "left-1/2 w-full -translate-x-1/2" : "-right-6 w-dvw",
                    className
                )}
                {...props}
            />
            {showDecoration && <Plus position="right" />}
        </div>
    )
}

function ElementLine({
    className,
    dir = "vertical"
}: React.ComponentProps<"hr"> & {
    dir?: "vertical" | "horizontal"
}) {
    return (
        <hr
            className={cn(
                dir === "vertical"
                    ? "h-full border-r border-dashed border-stroke md:border-r-[1px]"
                    : "w-full border-b border-dashed border-stroke",
                className
            )}
        />
    )
}

export { ElementLine, MarginLine, SectionLine }
