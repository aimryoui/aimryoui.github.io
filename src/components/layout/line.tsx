import { cn } from "@/lib/utils"

function MarginLine({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            role="separator"
            className={cn(
                "pointer-events-none sticky top-0 z-30 h-dvh w-px",
                className
            )}
            {...props}
        >
            <svg
                className="size-full"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="none"
            >
                <line
                    x1="50%"
                    y1="0"
                    x2="50%"
                    y2="100%"
                    className="stroke-stroke stroke-px stroke-dashed"
                />
            </svg>
        </div>
    )
}

function Plus({ position }: { position?: "left" | "right" }) {
    return (
        <div
            role="presentation"
            className={cn(
                "pointer-events-none relative z-1 size-1",
                {
                    before: "absolute left-1/2 top-1/2 h-6 w-1 -translate-x-1/2 -translate-y-1/2 bg-highlighted",
                    after: "absolute left-1/2 top-1/2 h-1 w-6 -translate-x-1/2 -translate-y-1/2 bg-highlighted"
                },
                position === "left" && "-ml-[.171875rem]",
                position === "right" && "-mr-[.171875rem]"
            )}
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
            role="separator"
            className={cn(
                "pointer-events-none relative z-40 h-0 w-full",
                showDecoration && "flex items-center justify-between"
            )}
        >
            {showDecoration && <Plus position="left" />}
            <hr
                className={cn(
                    "absolute top-1/2 -translate-y-1/2 border-b border-dashed border-stroke bg-background",
                    fit
                        ? "left-1/2 w-full -translate-x-1/2"
                        : [
                              "-right-6 w-screen group-data-[sidebar-position=right]/html:-left-6"
                          ],
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
                "pointer-events-none",
                dir === "vertical"
                    ? "h-full border-r border-dashed border-stroke webkit:border-r-[1px]"
                    : "w-full border-b border-dashed border-stroke",
                className
            )}
        />
    )
}

function SvgElementLine({
    className,
    dir = "vertical",
    ...props
}: React.ComponentProps<"svg"> & {
    dir?: "vertical" | "horizontal"
}) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            className={cn("pointer-events-none size-full", className)}
            {...props}
        >
            <line
                x1={dir === "vertical" ? "50%" : "0"}
                y1={dir === "vertical" ? "0" : "50%"}
                x2={dir === "vertical" ? "50%" : "100%"}
                y2={dir === "vertical" ? "100%" : "50%"}
                className="stroke-stroke stroke-px stroke-dashed"
            />
        </svg>
    )
}

export { ElementLine, MarginLine, SectionLine, SvgElementLine }
