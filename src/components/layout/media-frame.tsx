import { SectionLine } from "@/components/layout/line"
import { cn } from "@/lib/utils"

interface SectionNameProps extends React.ComponentProps<"div"> {
    as?: React.ElementType
    sectionName: string
    lowercase?: boolean
    containerClassName?: string
}

export function SectionName({
    as = "h4",
    lowercase = false,
    sectionName,
    className,
    containerClassName,
    ...props
}: SectionNameProps) {
    const Comp = as
    const ContainerComp = as === "h4" ? "figcaption" : "div"
    return (
        <ContainerComp
            className={cn(
                as === "h4" && "pointer-events-none sticky top-3.5 z-30",
                "grid h-13 place-items-center",
                containerClassName
            )}
            {...props}
        >
            <Comp
                aria-hidden={as === "h4" ? undefined : "true"}
                className={cn(
                    "pointer-events-auto rounded-full bg-background px-3.5 py-1.5 font-mono",
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
    continuous,
    className,
    children
}: {
    sectionName?: string
    lowercase?: boolean
    flex?: boolean
    continuous?: boolean
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
                    !continuous && <SectionLine />
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
