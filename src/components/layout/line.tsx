import { cn } from "@/lib/utils"

// https://stackoverflow.com/a/18064496
function MarginLine() {
    return (
        <hr
            className={cn(`
                sticky top-0 h-dvh w-px
                bg-[linear-gradient(to_bottom,var(--stroke-foreground)_50%,transparent_0)]
                bg-size-[1px_16px] bg-left bg-repeat-y
            `)}
        />
    )
}

function Plus({ position }: { position?: "left" | "right" }) {
    return (
        <div
            className={cn(
                `
                before:bg-highlighted before:absolute
                before:top-1/2 before:left-1/2 before:h-6 before:w-1 before:-translate-x-1/2 before:-translate-y-1/2
                after:bg-highlighted after:absolute
                after:top-1/2 after:left-1/2 after:h-1 after:w-6 after:-translate-x-1/2 after:-translate-y-1/2
                relative z-1 size-1
            `,
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
    fit = false
}: {
    containerClassName?: string
    className?: string
    showDecoration?: boolean
    fit?: boolean
}) {
    return (
        <div
            className={cn(
                "relative flex h-px w-full items-center justify-between",
                containerClassName
            )}
        >
            {showDecoration && <Plus position="left" />}
            <hr
                className={cn(
                    `
                    bg-background border-stroke-foreground absolute top-1/2 -translate-y-1/2 border-b border-dashed
                `,
                    fit ? "left-1/2 w-full -translate-x-1/2" : "right-0 w-dvw",
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
                    ? `
                w-px
                bg-[linear-gradient(to_bottom,var(--stroke-foreground)_50%,transparent_0)]
                bg-size-[1px_16px] bg-left bg-repeat-y
            `
                    : `
                h-px w-full
                bg-[linear-gradient(to_right,var(--stroke-foreground)_50%,transparent_0)]
                bg-size-[16px_1px] bg-top bg-repeat-x
            `
            )}
        />
    )
}

export { ElementLine, MarginLine, SectionLine }
