import { cn } from "@/lib/utils"

function Space({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            className={cn("bg-background h-20 w-full", className)}
            {...props}
        />
    )
}

export { Space }
