import { cn } from "@/lib/utils"

type SpinnerProps = React.ComponentProps<"svg">

function Spinner({ className, ...props }: SpinnerProps) {
    const lines = 8
    const duration = 1000

    return (
        <svg
            data-slot="spinner"
            viewBox="0 0 30 30"
            aria-hidden={true}
            className={cn("size-5", className)}
            {...props}
        >
            {Array.from({ length: lines }).map((_, index) => {
                const angle =
                    (360 / lines) * index + (index < lines / 2 ? 180 : -180)

                return (
                    <line
                        key={index}
                        y1="7"
                        y2="13"
                        stroke="currentColor"
                        strokeWidth="4"
                        strokeLinecap="round"
                        transform={`translate(15, 15) rotate(${angle.toString()})`}
                        className="animate-spinner repeat-infinite"
                        style={{
                            animationDelay: `${((duration * index) / lines - duration).toString()}ms`,
                            animationDuration: `${duration.toString()}ms`
                        }}
                    />
                )
            })}
        </svg>
    )
}

export type { SpinnerProps }
export { Spinner }
