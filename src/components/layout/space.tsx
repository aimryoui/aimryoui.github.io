import { cn } from "@/lib/utils"

function Space({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            className={cn("h-20 w-full bg-background", className)}
            {...props}
        />
    )
}

export { Space }
