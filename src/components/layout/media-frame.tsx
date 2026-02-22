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
                "sticky top-3.5 z-30 grid h-13 place-items-center",
                containerClassName
            )}
        >
            <Comp
                aria-hidden={as !== "h5"}
                className={cn(
                    "rounded-full bg-background px-3.5 py-1.5 font-mono",
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
        <div className={cn("w-full bg-background", containerClassName)}>
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
                    "grid size-inherit place-items-center overflow-clip"
                )}
            >
                {sectionName && (
                    <div
                        className={cn(
                            "sticky top-16.5 z-30 flex h-0 items-end justify-center"
                        )}
                    >
                        <SectionName
                            as="div"
                            sectionName={sectionName}
                            lowercase={lowercase}
                            className={cn(
                                "bg-transparent text-transparent shadow-sm -outline-offset-px outline-stroke outline"
                            )}
                        />
                    </div>
                )}
                <div
                    className={cn(
                        "relative grid w-full items-start justify-items-center gap-2 overflow-clip bg-stroke p-2 md:grid-cols-1",
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
