import { SectionLine } from "@/components/layout/line"
import { cn } from "@/lib/utils"

function ProjectSectionDivider({
    className,
    sectionName,
    as
}: {
    className?: string
    sectionName: string
    as?: "div"
}) {
    const Comp = as ?? "h5"
    return (
        <div className={cn("sticky top-3.5 z-10 grid h-13 place-items-center")}>
            <Comp
                aria-hidden={as === "div"}
                className={cn(
                    "bg-background rounded-full px-3.5 py-1.5 font-mono uppercase",
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
    className,
    children
}: {
    sectionName?: string
    className?: string
    children: React.ReactNode
}) {
    return (
        <div className={cn("bg-background")}>
            {sectionName ? (
                <>
                    <SectionLine />
                    <ProjectSectionDivider sectionName={sectionName} />
                    <SectionLine />
                </>
            ) : (
                <SectionLine />
            )}
            <div className={cn("overflow-clip")}>
                {sectionName && (
                    <div
                        className={cn(
                            "sticky top-16.5 z-10 flex h-0 items-end justify-center"
                        )}
                    >
                        <ProjectSectionDivider
                            as="div"
                            sectionName={sectionName}
                            className={cn(
                                "border-stroke-foreground border bg-transparent text-transparent shadow-sm"
                            )}
                        />
                    </div>
                )}
                <div
                    className={cn(
                        "bg-stroke-foreground relative flex w-full items-center justify-center gap-2 overflow-clip p-2 [overflow-clip-margin:content-box]",
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
