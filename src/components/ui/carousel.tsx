"use client"

import {
    createContext,
    type KeyboardEvent,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState
} from "react"

import useEmblaCarousel, {
    type UseEmblaCarouselType
} from "embla-carousel-react"
import WheelGesturesPlugin from "embla-carousel-wheel-gestures"

import { Button } from "@/components/ui/button"
import { Image } from "@/components/ui/image"
import { Slider } from "@/components/ui/slider"
import { Spinner } from "@/components/ui/spinner"
import { TooltipTrigger } from "@/components/ui/tooltip"
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
} & CarouselProps

const CarouselContext = createContext<CarouselContextProps | null>(null)

function useCarousel() {
    const context = useContext(CarouselContext)

    if (!context) {
        throw new Error("useCarousel must be used within a <Carousel />")
    }

    return context
}

function CarouselIndicator({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const { api } = useCarousel()
    const [current, setCurrent] = useState(0)
    const [count, setCount] = useState(0)

    useEffect(() => {
        if (!api) return

        const updateCarouselState = () => {
            const snapList = api.scrollSnapList()
            setCount(snapList.length)

            const engine = api.internalEngine()
            const currentLocation = engine.location.get()

            const realtimeProgress = engine.scrollProgress.get(currentLocation)

            let closestIndex = 0
            let minDiff = Infinity

            for (let i = 0; i < snapList.length; i++) {
                const diff = Math.abs(snapList[i] - realtimeProgress)
                if (diff < minDiff) {
                    minDiff = diff
                    closestIndex = i
                }
            }

            setCurrent(closestIndex + 1)
        }

        updateCarouselState()
        api.on("reInit", updateCarouselState)
        api.on("select", updateCarouselState)
        api.on("scroll", updateCarouselState)

        return () => {
            api.off("reInit", updateCarouselState)
            api.off("select", updateCarouselState)
            api.off("scroll", updateCarouselState)
        }
    }, [api])

    const padLength = String(count).length
    const displayCurrent = String(current).padStart(padLength, "0")

    return (
        <div
            data-slot="carousel-indicator"
            className={cn(
                "grid h-9 select-none place-items-center rounded-lg border border-default/15 bg-background px-4 font-mono text-sm",
                (!api || count === 0) && "opacity-40",
                className
            )}
            {...props}
        >
            {!api || count === 0 ? <Spinner /> : `${displayCurrent} / ${count}`}
        </div>
    )
}

const TWEEN_FACTOR_BASE = 0.36

const numberWithinRange = (number: number, min: number, max: number): number =>
    Math.min(Math.max(number, min), max)

function Carousel({
    orientation = "horizontal",
    opts,
    setApi,
    plugins,
    className,
    children,
    ...props
}: React.ComponentProps<"div"> & CarouselProps) {
    const [defaultPlugins] = useState(() => [
        WheelGesturesPlugin({
            wheelDraggingClass: "dragging"
        })
    ])

    const [carouselRef, api] = useEmblaCarousel(
        {
            ...opts,
            containScroll: false,
            skipSnaps: true,
            axis: orientation === "horizontal" ? "x" : "y"
        },
        plugins ?? defaultPlugins
    )

    const tweenFactor = useRef(0)

    const setTweenFactor = useCallback((api: CarouselApi) => {
        if (!api) return
        tweenFactor.current = TWEEN_FACTOR_BASE * api.scrollSnapList().length
    }, [])

    const tweenOpacity = useCallback((api: CarouselApi) => {
        if (!api) return
        const engine = api.internalEngine()

        const currentLocation = engine.location.get()
        const realtimeProgress = engine.scrollProgress.get(currentLocation)

        api.scrollSnapList().forEach((scrollSnap, snapIndex) => {
            let diffToTarget = scrollSnap - realtimeProgress
            const slidesInSnap = engine.slideRegistry[snapIndex]

            slidesInSnap.forEach((slideIndex) => {
                if (engine.options.loop) {
                    engine.slideLooper.loopPoints.forEach((loopItem) => {
                        const target = loopItem.target()
                        if (slideIndex === loopItem.index && target !== 0) {
                            const sign = Math.sign(target)
                            if (sign === -1)
                                diffToTarget =
                                    scrollSnap - (1 + realtimeProgress)
                            if (sign === 1)
                                diffToTarget =
                                    scrollSnap + (1 - realtimeProgress)
                        }
                    })
                }

                if (Math.abs(diffToTarget) > 2) {
                    api.slideNodes()[slideIndex].style.opacity = "0.4"
                    return
                }

                const tweenValue =
                    1 - Math.abs(diffToTarget * tweenFactor.current)
                const opacity = numberWithinRange(tweenValue, 0.4, 1).toString()
                api.slideNodes()[slideIndex].style.opacity = opacity
            })
        })
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
        if (!api) return

        setTweenFactor(api)
        tweenOpacity(api)

        api.on("reInit", setTweenFactor)
            .on("reInit", tweenOpacity)
            .on("scroll", tweenOpacity)
            .on("slideFocus", tweenOpacity)

        return () => {
            api.off("reInit", setTweenFactor)
                .off("reInit", tweenOpacity)
                .off("scroll", tweenOpacity)
                .off("slideFocus", tweenOpacity)
        }
    }, [api, setTweenFactor, tweenOpacity])

    const contextValue = useMemo(
        () => ({
            carouselRef,
            api,
            setApi,
            opts,
            orientation,
            scrollPrev,
            scrollNext
        }),
        [carouselRef, api, setApi, opts, orientation, scrollPrev, scrollNext]
    )

    return (
        <CarouselContext.Provider value={contextValue}>
            <div
                onKeyDownCapture={handleKeyDown}
                className={cn("relative flex w-full flex-col gap-2", className)}
                role="region"
                aria-roledescription="carousel"
                data-slot="carousel"
                {...props}
            >
                <CarouselContent>{children}</CarouselContent>
                <div
                    className={cn(
                        "grid w-full items-center gap-2",
                        "grid-cols-[1fr_75%_1fr]"
                    )}
                >
                    <div className="flex w-full justify-start gap-2">
                        <CarouselReplay />
                        <CarouselIndicator className="flex-1" />
                    </div>

                    <CarouselScrollbar className="flex-1" />

                    <div className="flex w-full justify-end gap-2">
                        <CarouselPrevious className="flex-1" />
                        <CarouselNext className="flex-1" />
                    </div>
                </div>
            </div>
        </CarouselContext.Provider>
    )
}

function CarouselContent({ className, ...props }: React.ComponentProps<"div">) {
    const { carouselRef, orientation } = useCarousel()

    return (
        <div
            ref={carouselRef}
            className="flex-1 overflow-hidden"
            data-slot="carousel-content"
        >
            <div
                className={cn(
                    "flex",
                    orientation === "horizontal" ? "-ml-2" : "-mt-2 flex-col",
                    className
                )}
                {...props}
            />
        </div>
    )
}

function CarouselItem({ className, ...props }: React.ComponentProps<"div">) {
    const { orientation } = useCarousel()

    return (
        <div
            role="group"
            aria-roledescription="slide"
            data-slot="carousel-item"
            className={cn(
                "min-w-0 shrink-0 grow-0 basis-3/4 will-change-[opacity]",
                orientation === "horizontal" ? "pl-2" : "pt-2",
                className
            )}
            {...props}
        />
    )
}

function CarouselReplay({
    className,
    variant = "outline",
    size = "icon",
    ...props
}: React.ComponentProps<typeof Button>) {
    const { orientation, api } = useCarousel()

    const [canScrollPrev, setCanScrollPrev] = useState(false)

    const scrollStart = useCallback(() => {
        api?.scrollTo(0)
    }, [api])

    useEffect(() => {
        if (!api) return
        const updateState = () => {
            setCanScrollPrev(api.canScrollPrev())
        }
        updateState()
        api.on("reInit", updateState)
        api.on("select", updateState)
        return () => {
            api.off("reInit", updateState)
            api.off("select", updateState)
        }
    }, [api])

    return (
        <TooltipTrigger
            payload={{
                content: <span>Scroll to start</span>
            }}
            render={
                <Button
                    data-slot="carousel-replay"
                    variant={variant}
                    size={size}
                    className={cn(
                        "border-default/15",
                        orientation === "horizontal" ? "" : "rotate-90",
                        className
                    )}
                    disabled={!canScrollPrev}
                    onClick={scrollStart}
                    {...props}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        className="size-5"
                    >
                        <path
                            fill="currentColor"
                            d="M20.357 12.006A8.35 8.35 0 0 1 12 20.363a8.36 8.36 0 0 1-8.357-8.357c0-.64.436-1.077 1.059-1.077.594 0 1.002.437 1.002 1.068a6.295 6.295 0 1 0 12.591 0A6.29 6.29 0 0 0 12 5.701c-.501 0-.975.037-1.365.121l2.303 2.284a.9.9 0 0 1 .288.678.99.99 0 0 1-1.003 1.012 1 1 0 0 1-.706-.278L7.71 5.683c-.214-.223-.325-.474-.325-.762 0-.278.12-.538.325-.752L11.517.306A.9.9 0 0 1 12.223 0c.566 0 1.003.464 1.003 1.03 0 .28-.102.511-.279.697l-2.08 2.024A6 6 0 0 1 12 3.64a8.354 8.354 0 0 1 8.357 8.366"
                        />
                    </svg>
                    <span className="sr-only">Scroll to start</span>
                </Button>
            }
        />
    )
}

function CarouselPrevious({
    className,
    variant = "outline",
    size = "icon",
    ...props
}: React.ComponentProps<typeof Button>) {
    const { orientation, scrollPrev, api } = useCarousel()

    const [canScrollPrev, setCanScrollPrev] = useState(false)

    useEffect(() => {
        if (!api) return
        const updateState = () => {
            setCanScrollPrev(api.canScrollPrev())
        }
        updateState()
        api.on("reInit", updateState)
        api.on("select", updateState)
        return () => {
            api.off("reInit", updateState)
            api.off("select", updateState)
        }
    }, [api])

    return (
        <TooltipTrigger
            delay={500}
            payload={{
                content: <span>Previous slide</span>
            }}
            render={
                <Button
                    data-slot="carousel-previous"
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
            }
        />
    )
}

function CarouselNext({
    className,
    variant = "outline",
    size = "icon",
    ...props
}: React.ComponentProps<typeof Button>) {
    const { orientation, scrollNext, api } = useCarousel()

    const [canScrollNext, setCanScrollNext] = useState(false)

    useEffect(() => {
        if (!api) return
        const updateState = () => {
            setCanScrollNext(api.canScrollNext())
        }
        updateState()
        api.on("reInit", updateState)
        api.on("select", updateState)
        return () => {
            api.off("reInit", updateState)
            api.off("select", updateState)
        }
    }, [api])

    return (
        <TooltipTrigger
            delay={500}
            payload={{
                content: <span>Next slide</span>
            }}
            render={
                <Button
                    data-slot="carousel-next"
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
            }
        />
    )
}

function CarouselScrollbar({
    className,
    ...props
}: React.ComponentProps<typeof Slider>) {
    const { api } = useCarousel()
    const [value, setValue] = useState(0)

    const [snapCount, setSnapCount] = useState(0)

    const isDragging = useRef(false)

    const onScrollBarChange = useCallback(
        (val: number | readonly number[]) => {
            if (!api) return
            isDragging.current = true

            const newProgress = val as number
            setValue(newProgress)

            const engine = api.internalEngine()
            engine.animation.stop()

            const targetPosition =
                engine.limit.max - newProgress * engine.limit.length
            engine.location.set(targetPosition)
            engine.target.set(targetPosition)
            engine.translate.to(targetPosition)

            api.emit("scroll")
        },
        [api]
    )

    const onScrollBarRelease = useCallback(
        (val: number | readonly number[]) => {
            if (!api) return
            isDragging.current = false

            const finalValue = val as number
            const count = api.scrollSnapList().length
            const closestIndex = Math.round(finalValue * (count - 1))

            api.scrollTo(closestIndex)
        },
        [api]
    )

    useEffect(() => {
        if (!api) return
        const updateScroll = () => {
            if (isDragging.current) return
            setValue(Math.max(0, Math.min(1, api.scrollProgress())))
        }

        const updateSnapCount = () => {
            setSnapCount(api.scrollSnapList().length)
        }

        updateScroll()
        updateSnapCount()

        api.on("scroll", updateScroll)
        api.on("reInit", updateScroll)
        api.on("reInit", updateSnapCount)

        return () => {
            api.off("scroll", updateScroll)
            api.off("reInit", updateScroll)
            api.off("reInit", updateSnapCount)
        }
    }, [api])

    return (
        <Slider
            data-slot="carousel-scrollbar"
            min={0}
            max={1}
            step={0.001}
            value={value}
            snapCount={snapCount}
            disabled={!api}
            onValueChange={onScrollBarChange}
            onValueCommitted={onScrollBarRelease}
            label="Slide scrollbar"
            className={className}
            {...props}
        />
    )
}

function CarouselImage({
    srcPattern,
    alt,
    className
}: React.ComponentProps<"div"> &
    CarouselProps & {
        srcPattern: string
        alt: string
        className?: string
    }) {
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
        <CarouselItem key={src}>
            <Image src={src} alt={alt} className={className} />
        </CarouselItem>
    ))
}

export {
    Carousel,
    type CarouselApi,
    CarouselContent,
    CarouselImage,
    CarouselIndicator,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    CarouselReplay,
    CarouselScrollbar
}
