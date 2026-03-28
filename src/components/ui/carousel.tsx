"use client"

import {
    type ComponentProps,
    createContext,
    forwardRef,
    type HTMLAttributes,
    type KeyboardEvent,
    useCallback,
    useContext,
    useEffect,
    useState
} from "react"

import useEmblaCarousel, {
    type UseEmblaCarouselType
} from "embla-carousel-react"
import WheelGesturesPlugin from "embla-carousel-wheel-gestures"

import { Button } from "@/components/ui/button"
import { Image } from "@/components/ui/image"
import { cn } from "@/lib/utils"

type CarouselApi = UseEmblaCarouselType[1]
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>
type CarouselOptions = UseCarouselParameters[0]
type CarouselPlugin = UseCarouselParameters[1]

interface CarouselProps {
    opts?: CarouselOptions
    plugins?: CarouselPlugin
    orientation?: "horizontal" | "vertical"
    setApi?: (api: CarouselApi) => void
}

type CarouselContextProps = {
    carouselRef: ReturnType<typeof useEmblaCarousel>[0]
    api: ReturnType<typeof useEmblaCarousel>[1]
    scrollPrev: () => void
    scrollNext: () => void
    canScrollPrev: boolean
    canScrollNext: boolean
} & CarouselProps

const CarouselContext = createContext<CarouselContextProps | null>(null)

function useCarousel() {
    const context = useContext(CarouselContext)

    if (!context) {
        throw new Error("useCarousel must be used within a <Carousel />")
    }

    return context
}

const Carousel = forwardRef<
    HTMLDivElement,
    HTMLAttributes<HTMLDivElement> & CarouselProps
>(
    (
        {
            orientation = "horizontal",
            opts,
            setApi,
            plugins = [
                WheelGesturesPlugin({
                    wheelDraggingClass: "dragging"
                })
            ],
            className,
            children,
            ...props
        },
        ref
    ) => {
        const [carouselRef, api] = useEmblaCarousel(
            {
                ...opts,
                containScroll: opts?.containScroll ?? false,
                axis: orientation === "horizontal" ? "x" : "y"
            },
            plugins
        )
        const [canScrollPrev, setCanScrollPrev] = useState(false)
        const [canScrollNext, setCanScrollNext] = useState(false)

        const [current, setCurrent] = useState(0)
        const [count, setCount] = useState(0)

        const onSelect = useCallback((api: CarouselApi) => {
            if (!api) {
                return
            }

            setCanScrollPrev(api.canScrollPrev())
            setCanScrollNext(api.canScrollNext())
        }, [])

        const scrollPrev = useCallback(() => {
            api?.scrollPrev()
        }, [api])

        const scrollNext = useCallback(() => {
            api?.scrollNext()
        }, [api])

        const handleKeyDown = useCallback(
            (event: KeyboardEvent<HTMLDivElement>) => {
                if (event.key === "ArrowLeft") {
                    event.preventDefault()
                    scrollPrev()
                } else if (event.key === "ArrowRight") {
                    event.preventDefault()
                    scrollNext()
                }
            },
            [scrollPrev, scrollNext]
        )

        useEffect(() => {
            if (!api || !setApi) {
                return
            }

            setApi(api)
        }, [api, setApi])

        useEffect(() => {
            if (!api) {
                return
            }

            onSelect(api)
            api.on("reInit", onSelect)
            api.on("select", onSelect)

            return () => {
                api.off("reInit", onSelect)
                api.off("select", onSelect)
            }
        }, [api, onSelect])

        useEffect(() => {
            if (!api) {
                return
            }

            const updateCarouselState = () => {
                setCount(api.scrollSnapList().length)
                setCurrent(api.selectedScrollSnap() + 1)
            }

            updateCarouselState()
            api.on("reInit", updateCarouselState)
            api.on("select", updateCarouselState)

            return () => {
                api.off("reInit", updateCarouselState)
                api.off("select", updateCarouselState)
            }
        }, [api])

        return (
            <CarouselContext.Provider
                value={{
                    carouselRef,
                    api: api,
                    setApi,
                    opts,
                    orientation:
                        orientation ||
                        (opts?.axis === "y" ? "vertical" : "horizontal"),
                    scrollPrev,
                    scrollNext,
                    canScrollPrev,
                    canScrollNext
                }}
            >
                <div
                    ref={ref}
                    onKeyDownCapture={handleKeyDown}
                    className={cn(
                        "relative flex w-full flex-col gap-2",
                        className
                    )}
                    role="region"
                    aria-roledescription="carousel"
                    {...props}
                >
                    <CarouselContent>{children}</CarouselContent>
                    <div
                        className={cn(
                            "flex w-full items-center justify-between gap-2"
                        )}
                    >
                        <div
                            className={cn(
                                "grid h-9 select-none place-items-center rounded-lg border border-default/15 bg-background px-4 font-mono text-sm"
                            )}
                        >
                            {current} / {count}
                        </div>
                        <div className={cn("flex gap-2")}>
                            <CarouselPrevious />
                            <CarouselNext />
                        </div>
                    </div>
                </div>
            </CarouselContext.Provider>
        )
    }
)
Carousel.displayName = "Carousel"

const CarouselContent = forwardRef<
    HTMLDivElement,
    HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
    const { carouselRef, orientation } = useCarousel()

    return (
        <div ref={carouselRef} className="flex-1 overflow-hidden">
            <div
                ref={ref}
                className={cn(
                    "flex",
                    orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col",
                    className
                )}
                {...props}
            />
        </div>
    )
})
CarouselContent.displayName = "CarouselContent"

const CarouselItem = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => {
        const { orientation } = useCarousel()

        return (
            <div
                ref={ref}
                role="group"
                aria-roledescription="slide"
                className={cn(
                    "min-w-0 shrink-0 grow-0 basis-3/4",
                    orientation === "horizontal" ? "pl-2" : "pt-2",
                    className
                )}
                {...props}
            />
        )
    }
)
CarouselItem.displayName = "CarouselItem"

const CarouselPrevious = forwardRef<
    HTMLButtonElement,
    ComponentProps<typeof Button>
>(({ className, variant = "outline", size = "icon", ...props }, ref) => {
    const { orientation, scrollPrev, canScrollPrev } = useCarousel()

    return (
        <Button
            ref={ref}
            variant={variant}
            size={size}
            className={cn(
                "border-default/15",
                orientation === "horizontal" ? "" : "rotate-90",
                className
            )}
            disabled={!canScrollPrev}
            onClick={scrollPrev}
            {...props}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="size-4"
            >
                <path
                    fill="currentColor"
                    d="M23 11.997c0 .741-.521 1.263-1.286 1.263H7.325l-2.502-.093 3.418 3.058 2.595 2.63c.22.22.37.545.37.892 0 .695-.532 1.217-1.24 1.217-.335 0-.636-.128-.914-.394l-7.646-7.635A1.34 1.34 0 0 1 1 11.997c0-.348.15-.684.405-.939l7.648-7.633c.278-.266.579-.394.915-.394.707 0 1.24.51 1.24 1.205 0 .36-.151.672-.371.904L8.242 7.77l-3.406 3.058 2.49-.093h14.389c.764 0 1.285.51 1.285 1.263"
                />
            </svg>
            <span className="sr-only">Previous slide</span>
        </Button>
    )
})
CarouselPrevious.displayName = "CarouselPrevious"

const CarouselNext = forwardRef<
    HTMLButtonElement,
    ComponentProps<typeof Button>
>(({ className, variant = "outline", size = "icon", ...props }, ref) => {
    const { orientation, scrollNext, canScrollNext } = useCarousel()

    return (
        <Button
            ref={ref}
            variant={variant}
            size={size}
            className={cn(
                "border-default/15",
                orientation === "horizontal" ? "" : "rotate-90",
                className
            )}
            disabled={!canScrollNext}
            onClick={scrollNext}
            {...props}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="size-4"
            >
                <path
                    fill="currentColor"
                    d="M1 11.995c0-.741.521-1.263 1.286-1.263h14.389l2.502.093-3.418-3.058-2.595-2.63a1.28 1.28 0 0 1-.37-.892c0-.695.532-1.217 1.24-1.217.335 0 .636.128.914.394l7.646 7.635c.255.255.406.59.406.938s-.15.684-.405.939l-7.648 7.633c-.278.266-.579.394-.915.394-.707 0-1.24-.51-1.24-1.205 0-.36.151-.672.371-.904l2.595-2.63 3.406-3.058-2.49.093H2.285c-.764 0-1.285-.51-1.285-1.263"
                />
            </svg>
            <span className="sr-only">Next slide</span>
        </Button>
    )
})
CarouselNext.displayName = "CarouselNext"

// interface ThumbProps {
//     selected: boolean
//     index: number
//     onClick: () => void
// }

// const CarouselThumbButton = forwardRef<
//     HTMLDivElement,
//     HTMLAttributes<HTMLDivElement> & ThumbProps
// >(({ selected, index, onClick, className, ...props }, ref) => {
//     return (
//         <div ref={ref} className={cn(selected && "active")}>
//             <button onClick={onClick} type="button">
//                 {index + 1}
//             </button>
//         </div>
//     )
// })
// CarouselThumbButton.displayName = "CarouselThumbButton"

interface CarouselImageProps {
    srcPattern: string
    alt: string
    className?: string
}

const CarouselImage = forwardRef<
    HTMLDivElement,
    HTMLAttributes<HTMLDivElement> & CarouselImageProps & CarouselProps
>(({ srcPattern, alt, className }, ref) => {
    const match = /\{(\d+)(?:-(\d+))?\}/.exec(srcPattern)

    let generatedImages = [srcPattern]

    if (match) {
        const start = parseInt(match[1], 10)
        const end = match[2] ? parseInt(match[2], 10) : start
        const padLength = match[1].length

        const result = []
        for (let i = Math.min(start, end); i <= Math.max(start, end); i++) {
            const numStr = String(i).padStart(padLength, "0")
            result.push(srcPattern.replace(match[0], numStr))
        }
        generatedImages = result
    }

    return generatedImages.map((src) => (
        <CarouselItem ref={ref} key={src}>
            <Image src={src} alt={alt} className={className} />
        </CarouselItem>
    ))
})
CarouselImage.displayName = "CarouselImage"

export {
    Carousel,
    type CarouselApi,
    CarouselContent,
    CarouselImage,
    CarouselItem,
    CarouselNext,
    CarouselPrevious
}
