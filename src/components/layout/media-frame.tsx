import { SectionLine } from "@/components/layout/line"
import { cn } from "@/lib/utils"

export function SectionName({
    as = "h4",
    lowercase = false,
    className,
    containerClassName,
    sectionName
}: {
    as?: React.ElementType
    lowercase?: boolean
    className?: string
    containerClassName?: string
    sectionName: string
}) {
    const Comp = as
    const ContainerComp = as === "h4" ? "figcaption" : "div"
    return (
        <ContainerComp
            className={cn(
                "sticky top-3.5 z-30 grid h-13 place-items-center",
                containerClassName
            )}
        >
            <Comp
                aria-hidden={as === "h4" ? undefined : "true"}
                className={cn(
                    "rounded-full bg-background px-3.5 py-1.5 font-mono",
                    !lowercase && "uppercase",
                    className
                )}
            >
                {sectionName}
            </Comp>
        </ContainerComp>
    )
}

function MediaFrame({
    sectionName,
    lowercase,
    flex,
    className,
    children
}: {
    sectionName?: string
    lowercase?: boolean
    flex?: boolean
    className?: string
    children: React.ReactNode
}) {
    return (
        <>
            {sectionName && <SectionLine />}
            <figure
                className={cn("w-full bg-background", flex && "h-full flex-1")}
            >
                {sectionName ? (
                    <>
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
            </figure>
        </>
    )
}

export { MediaFrame }
