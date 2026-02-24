import { cn } from "@/lib/utils"

function MarginLine({ className, ...props }: React.ComponentProps<"hr">) {
    return (
        <hr
            className={cn(
                "sticky top-0 h-dvh border-r border-dashed border-stroke",
                className
            )}
            role="separator"
            {...props}
        />
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
        />
    )
}

function SectionLine({
    containerClassName,
    className,
    showDecoration = false,
    fit = false,
    ref,
    ...props
}: React.ComponentProps<"div"> & {
    containerClassName?: string
    showDecoration?: boolean
    fit?: boolean
}) {
    return (
        <div
            className={cn(
                "relative z-10 h-0 w-full",
                showDecoration && "flex items-center justify-between",
                containerClassName
            )}
            role="separator"
            {...props}
            ref={ref}
        >
            {showDecoration && <Plus position="left" />}
            <hr
                className={cn(
                    "absolute top-1/2 -translate-y-1/2 border-b border-dashed border-stroke bg-background",
                    fit
                        ? "left-1/2 w-full -translate-x-1/2"
                        : "-right-6.5 w-dvw",
                    className
                )}
            />
            {showDecoration && <Plus position="right" />}
        </div>
    )
}

function ElementLine({
    dir = "vertical"
}: {
    dir?: "vertical" | "horizontal"
}) {
    return (
        <hr
            className={cn(
                dir === "vertical"
                    ? "border-r border-dashed border-stroke"
                    : "w-full border-b border-dashed border-stroke"
            )}
            role="separator"
        />
    )
}

export { ElementLine, MarginLine, SectionLine }
