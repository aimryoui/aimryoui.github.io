import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
    return (
        <input
            type={type}
            data-slot="input"
            className={cn(
                "file:text-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium",
                "placeholder:text-muted-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-lg border bg-transparent px-3 pt-1 pb-1.5 text-base transition-none md:text-sm",
                "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
                "focus-visible:border-ring focus-visible:outline-highlighted/30 focus-visible:outline-4 focus-visible:transition-[color,outline-color,outline-width] focus-visible:ease-out dark:focus-visible:hover:bg-input/30 outline-40 outline-transparent will-change-[outline,border,color] focus-visible:hover:bg-transparent",
                "aria-invalid:ring-destructive/20 aria-invalid:border-destructive dark:aria-invalid:ring-destructive/40",
                className
            )}
            {...props}
        />
    )
}

export { Input }
