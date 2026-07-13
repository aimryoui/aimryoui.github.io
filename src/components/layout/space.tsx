import { cn } from "@/lib/utils"

type SpaceProps<T extends React.ElementType> = {
    as?: T
    className?: string
} & Omit<React.ComponentPropsWithRef<T>, "as" | "className">

function Space<T extends React.ElementType = "div">({
    className,
    as,
    ...props
}: SpaceProps<T>) {
    const Comp = as ?? "div"

    return (
        <Comp
            className={cn("h-20 w-full bg-background", className)}
            {...props}
        />
    )
}

export { Space }
