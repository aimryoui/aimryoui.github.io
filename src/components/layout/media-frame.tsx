import { SectionLine } from "@/components/layout/line"
import { cn } from "@/lib/utils"

export function SectionName({
    as,
    lowercase = false,
    containerClassName,
    className,
    sectionName
}: {
    as?: React.ElementType
    lowercase?: boolean
    containerClassName?: string
    className?: string
    sectionName: string
}) {
    const Comp = as ?? "h5"
    return (
        <div
            className={cn(
                "sticky top-3.5 z-10 grid h-13 place-items-center",
                containerClassName
            )}
        >
            <Comp
                aria-hidden={as === "div"}
                className={cn(
                    "bg-background rounded-full px-3.5 py-1.5 font-mono",
                    !lowercase && "uppercase",
                    className
                )}
            >
                {sectionName}
            </Comp>
        </div>
    )
}

function MediaFrame({
    sectionName,
    lowercase,
    containerClassName,
    className,
    children
}: {
    sectionName?: string
    lowercase?: boolean
    containerClassName?: string
    className?: string
    children: React.ReactNode
}) {
    return (
        <div className={cn("bg-background w-full", containerClassName)}>
            {sectionName ? (
                <>
                    <SectionLine />
                    <SectionName
                        sectionName={sectionName}
                        lowercase={lowercase}
                    />
                    <SectionLine />
                </>
            ) : (
                <SectionLine />
            )}
            <div
                className={cn(
                    "size-inherit grid place-items-center overflow-clip"
                )}
            >
                {sectionName && (
                    <div
                        className={cn(
                            "sticky top-16.5 z-10 flex h-0 items-end justify-center"
                        )}
                    >
                        <SectionName
                            as="div"
                            sectionName={sectionName}
                            lowercase={lowercase}
                            className={cn(
                                "outline-stroke-foreground -outline-offset-px bg-transparent text-transparent shadow-sm outline"
                            )}
                        />
                    </div>
                )}
                <div
                    className={cn(
                        "bg-stroke-foreground relative grid w-full items-start justify-items-center gap-2 overflow-clip p-2 [overflow-clip-margin:content-box] md:grid-cols-1",
                        className
                    )}
                >
                    {children}
                </div>
            </div>
        </div>
    )
}

export { MediaFrame }
