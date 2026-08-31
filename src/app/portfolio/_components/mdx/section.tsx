import { Divider } from "@/components/layout/divider"
import { SectionLine, SvgElementLine } from "@/components/layout/line"
import { Highlight } from "@/components/ui/typography"
import { slugify } from "@/helpers/slugify"
import { cn } from "@/lib/utils"
import SectionTitlePrimitive, {
    type SectionTitleProps
} from "@/portfolio/_components/section-title"

interface SectionProps extends React.ComponentProps<"div"> {
    order: number
    title?: string
    note?: string
    titleProps?: Omit<SectionTitleProps, "title" | "note" | "id">
}

function Section({
    className,
    order,
    id,
    title,
    note,
    titleProps,
    children,
    ...props
}: SectionProps) {
    const slug = id ?? (title ? slugify(title) : undefined)

    return (
        <>
            <div className="flex" id={slug}>
                <div className="sticky top-0 z-50 grid h-space min-w-space place-items-center bg-background px-safe-zone md:hidden">
                    <Highlight
                        mono
                        className="text-nowrap text-2xl tracking-wider md:text-2xl"
                    >
                        {String(order).padStart(2, "0")}
                    </Highlight>
                    <SectionLine fit containerClassName="absolute bottom-0" />
                </div>
                <SvgElementLine className="z-55 md:hidden" />
                <div
                    className={cn("flex flex-1 flex-col", className)}
                    {...props}
                >
                    {title && (
                        <SectionTitle
                            order={order}
                            title={title}
                            note={note}
                            {...titleProps}
                        />
                    )}
                    {children}
                </div>
            </div>
            <SectionLine center />
            <Divider />
            <SectionLine containerClassName="z-55" center />
        </>
    )
}

function SectionHeading({
    className,
    title,
    ...props
}: Pick<SectionTitleProps, "className" | "title">) {
    const slug = slugify(title)

    return (
        <>
            <SectionTitlePrimitive
                id={slug}
                title={title}
                sticky={false}
                titleId={slug}
                titleClassName="text-2xl md:text-2xl my-0.75 text-highlighted"
                titleContainerClassName="bg-highlighted/10"
                className={cn(className)}
                {...props}
                headingLevel="3"
                link="hash"
                sectionLineCenter
            />
            <SectionLine center />
            <Divider />
            <SectionLine containerClassName="z-55" center />
        </>
    )
}

function SectionTitle({
    className,
    order,
    title,
    note,
    ...props
}: Pick<SectionTitleProps, "className" | "order" | "title" | "note">) {
    const slug = slugify(title)

    return (
        <SectionTitlePrimitive
            id={slug}
            order={order}
            title={title}
            note={note}
            sectionLineFit
            titleClassName="text-2xl md:text-2xl my-0.75 font-wght-[625]"
            className={cn("2xl:relative lg:sticky", className)}
            {...props}
            headingLevel="4"
            link="hash"
        />
    )
}

function SectionContent({
    className,
    spaceAround = false,
    ...props
}: React.ComponentProps<"div"> & { spaceAround?: boolean }) {
    return (
        <>
            <div
                className={cn(
                    "flex flex-col gap-2.5 text-pretty bg-background px-safe-zone py-safe-zone-vertical leading-normal",
                    {
                        "[&_a]": "text-highlighted",
                        "[&_strong]":
                            "text-foreground font-wght-600 dark:font-wght-450",
                        "[&_blockquote]":
                            "mb-1 mt-1.5 space-y-2.5 border-s-3 border-highlighted pb-1.5 ps-4 pt-1",
                        "[&_blockquote_h5]": "text-highlighted font-wght-600"
                    },
                    className
                )}
                {...props}
            />
            {spaceAround && (
                <>
                    <SectionLine center />
                    <Divider />
                    <SectionLine containerClassName="z-55" center />
                </>
            )}
        </>
    )
}

export type { SectionProps }
export { Section, SectionContent, SectionHeading, SectionTitle }
