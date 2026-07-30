import { cn } from "@/lib/utils"

type MarginLineProps = React.ComponentProps<"div"> & {
    className?: string
}

function MarginLine({ className, ...props }: MarginLineProps) {
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
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="none"
                className={cn("absolute inset-0 h-full w-px")}
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
                "pointer-events-none relative z-40 size-1",
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

type SectionLineProps = React.ComponentProps<"hr"> & {
    containerClassName?: string
    showDecoration?: boolean
    fit?: boolean
}

function SectionLine({
    className,
    containerClassName,
    showDecoration = false,
    fit = false,
    ...props
}: SectionLineProps) {
    return (
        <div
            role="separator"
            className={cn(
                "pointer-events-none relative z-40 h-0 w-full",
                showDecoration && "flex items-center justify-between",
                containerClassName
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

type ElementLineProps = React.ComponentProps<"div"> & {
    dir?: "vertical" | "horizontal"
    containerClassName?: string
}

function ElementLine({
    className,
    containerClassName,
    dir = "vertical",
    ...props
}: ElementLineProps) {
    return (
        <div
            className={cn(
                "pointer-events-none relative",
                dir === "vertical" ? "h-full w-0" : "h-0 w-full",
                containerClassName
            )}
            {...props}
        >
            <hr
                className={cn(
                    "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
                    dir === "vertical"
                        ? "h-full border-r border-dashed border-stroke"
                        : "w-full border-b border-dashed border-stroke",
                    className
                )}
            />
        </div>
    )
}

type SvgElementLineProps = React.ComponentProps<"svg"> & {
    dir?: "vertical" | "horizontal"
}

function SvgElementLine({
    className,
    dir = "vertical",
    ...props
}: SvgElementLineProps) {
    return (
        <div
            role="separator"
            className={cn(
                "pointer-events-none relative z-1",
                dir === "vertical" ? "h-full" : "w-full",
                className
            )}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="none"
                className={cn(
                    "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
                    dir === "vertical" ? "h-full w-px" : "h-px w-full"
                )}
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
        </div>
    )
}

export type {
    ElementLineProps,
    MarginLineProps,
    SectionLineProps,
    SvgElementLineProps
}
export { ElementLine, MarginLine, SectionLine, SvgElementLine }
