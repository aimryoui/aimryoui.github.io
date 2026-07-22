"use client"

import {
    createContext,
    type KeyboardEvent,
    useContext,
    useEffect,
    useId,
    useRef,
    useState
} from "react"

import Accessibility from "embla-carousel-accessibility"
import useEmblaCarousel, {
    type UseEmblaCarouselType
} from "embla-carousel-react"
import Ssr from "embla-carousel-ssr"
import WheelGestures from "embla-carousel-wheel-gestures"

import { ArrowLeft, ArrowRight, Refresh } from "@/components/icons/icons"
import {
    Image,
    type ImageBorderProps,
    type ImageProps,
    type ImageRoundProps,
    type PngProps
} from "@/components/media/image"
import { Button } from "@/components/ui/button"
import { Lightbox } from "@/components/ui/lightbox"
import { Slider } from "@/components/ui/slider"
import { Spinner } from "@/components/ui/spinner"
import { Tooltip, TooltipTrigger } from "@/components/ui/tooltip"
import { useAccessibility } from "@/hooks/use-accessibility"
import { cn } from "@/lib/utils"

type CarouselApi = UseEmblaCarouselType[1]
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>
type CarouselOptions = UseCarouselParameters[0]
type CarouselPlugin = UseCarouselParameters[1]

interface CarouselProps {
    opts?: CarouselOptions
    slideCount: number
    plugins?: CarouselPlugin
    orientation?: "horizontal" | "vertical"
    setEmblaApi?: (api: CarouselApi) => void
}

type CarouselContextProps = {
    emblaRef: ReturnType<typeof useEmblaCarousel>[0]
    emblaApi: ReturnType<typeof useEmblaCarousel>[1]
    goToPrev: () => void
    goToNext: () => void
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
    const { emblaApi } = useCarousel()
    const [count, setCount] = useState(0)

    const currentRef = useRef<HTMLSpanElement>(null)

    useEffect(() => {
        if (!emblaApi) return

        const updateCarouselState = () => {
            const snapList = emblaApi.snapList()
            const total = snapList.length

            setCount((prev) => (prev === total ? prev : total))

            const engine = emblaApi.internalEngine()
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

            if (currentRef.current) {
                const current = closestIndex + 1
                const displayCurrent =
                    total >= 10 && current < 10
                        ? `0${current}`
                        : String(current)

                if (currentRef.current.textContent !== displayCurrent) {
                    currentRef.current.textContent = displayCurrent
                }
            }
        }

        updateCarouselState()
        emblaApi.on("reinit", updateCarouselState)
        emblaApi.on("select", updateCarouselState)
        emblaApi.on("scroll", updateCarouselState)

        return () => {
            emblaApi.off("reinit", updateCarouselState)
            emblaApi.off("select", updateCarouselState)
            emblaApi.off("scroll", updateCarouselState)
        }
    }, [emblaApi])

    return (
        <div
            data-slot="carousel-indicator"
            className={cn(
                "grid h-9 select-none place-items-center rounded-lg border border-default/15 bg-background px-4 font-mono text-sm",
                (!emblaApi || count === 0) && "opacity-40",
                className
            )}
            {...props}
        >
            {!emblaApi || count === 0 ? (
                <Spinner />
            ) : (
                <p className="truncate">
                    <span ref={currentRef}>{count < 10 ? "1" : "01"}</span> /{" "}
                    {count}
                </p>
            )}
        </div>
    )
}

const TWEEN_FACTOR_BASE = 0.36

const numberWithinRange = (number: number, min: number, max: number): number =>
    Math.min(Math.max(number, min), max)

function Carousel({
    orientation = "horizontal",
    opts,
    slideCount,
    setEmblaApi,
    plugins,
    className,
    children,
    ...props
}: React.ComponentProps<"div"> & CarouselProps) {
    const carouselId = useId()

    const getSlideSizes = (size: number) => Array<number>(slideCount).fill(size)

    const [activePlugins, setActivePlugins] = useState(
        () =>
            plugins ?? [
                WheelGestures({ wheelDraggingClass: "dragging" }),
                Ssr({
                    slideSizes: getSlideSizes(75),
                    breakpoints: {
                        "(max-width: 48rem)": {
                            slideSizes: getSlideSizes(100)
                        }
                    }
                })
            ]
    )

    const [emblaRef, emblaApi, emblaServerApi] = useEmblaCarousel(
        {
            ...opts,
            breakpoints: {
                "(prefers-reduced-motion: reduce)": { duration: 0 }
            },
            containScroll: false,
            skipSnaps: true,
            axis: orientation === "horizontal" ? "x" : "y"
        },
        activePlugins
    )
    useEffect(() => {
        const timer = setTimeout(() => {
            setActivePlugins((prevPlugins) => [
                ...prevPlugins,
                Accessibility({
                    announceChanges: true,
                    rootNode: (emblaRoot) => emblaRoot.parentElement
                })
            ])
        }, 0)

        return () => {
            clearTimeout(timer)
        }
    }, [])
    useAccessibility(emblaApi)
    const renderSsrStyles = !emblaApi

    const tweenFactor = useRef(0)

    const goToPrev = () => {
        emblaApi?.goToPrev()
    }

    const goToNext = () => {
        emblaApi?.goToNext()
    }

    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        if (event.key === "ArrowLeft") {
            event.preventDefault()
            goToPrev()
        } else if (event.key === "ArrowRight") {
            event.preventDefault()
            goToNext()
        }
    }

    // Sync emblaApi to the parent-provided setter whenever it changes.
    // This is intentional: we call the prop setter as a side-effect of
    // the API becoming available, not as a state synchronisation loop.
    useEffect(() => {
        if (emblaApi && setEmblaApi) {
            setEmblaApi(emblaApi)
        }
    }, [emblaApi, setEmblaApi])

    useEffect(() => {
        if (!emblaApi) return

        const setTweenFactor = (emblaApi: CarouselApi) => {
            if (!emblaApi) return
            tweenFactor.current = TWEEN_FACTOR_BASE * emblaApi.snapList().length
        }

        const tweenOpacity = (emblaApi: CarouselApi) => {
            if (!emblaApi) return
            const engine = emblaApi.internalEngine()

            const currentLocation = engine.location.get()
            const realtimeProgress = engine.scrollProgress.get(currentLocation)

            emblaApi.snapList().forEach((scrollSnap, snapIndex) => {
                let diffToTarget = scrollSnap - realtimeProgress
                const slidesInSnap =
                    engine.scrollSnapList.slidesBySnap[snapIndex]

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
                        emblaApi.slideNodes()[slideIndex].style.opacity = "0.4"
                        return
                    }

                    const tweenValue =
                        1 - Math.abs(diffToTarget * tweenFactor.current)
                    const opacity = numberWithinRange(
                        tweenValue,
                        0.4,
                        1
                    ).toString()
                    emblaApi.slideNodes()[slideIndex].style.opacity = opacity
                })
            })
        }

        setTweenFactor(emblaApi)
        tweenOpacity(emblaApi)

        emblaApi.on("reinit", setTweenFactor)
        emblaApi.on("reinit", tweenOpacity)
        emblaApi.on("scroll", tweenOpacity)
        emblaApi.on("slidefocus", tweenOpacity)

        return () => {
            emblaApi.off("reinit", setTweenFactor)
            emblaApi.off("reinit", tweenOpacity)
            emblaApi.off("scroll", tweenOpacity)
            emblaApi.off("slidefocus", tweenOpacity)
        }
    }, [emblaApi])

    const contextValue = {
        emblaRef,
        emblaApi,
        setEmblaApi,
        opts,
        slideCount,
        orientation,
        goToPrev,
        goToNext
    }

    return (
        <>
            {renderSsrStyles && (
                <style>
                    {emblaServerApi
                        .plugins()
                        .ssr?.getStyles(
                            `#${carouselId}`,
                            "[data-slot='carousel-item']"
                        )}
                </style>
            )}
            {/* oxlint-disable-next-line react/jsx-no-constructed-context-values */}
            <CarouselContext.Provider value={contextValue}>
                <div
                    onKeyDownCapture={handleKeyDown}
                    className={cn(
                        "relative flex w-full flex-col gap-2",
                        className
                    )}
                    role="region"
                    aria-roledescription="carousel"
                    data-slot="carousel"
                    {...props}
                >
                    <CarouselContent id={carouselId}>
                        {children}
                    </CarouselContent>
                    <div
                        className={cn(
                            "grid w-full items-center gap-2",
                            "grid-cols-[1fr_75%_1fr]",
                            {
                                "2xl": "grid-cols-6",
                                xl: "grid-cols-4",
                                md: "grid-cols-3",
                                sm: "grid-cols-2"
                            }
                        )}
                    >
                        <Tooltip>
                            <div className="flex w-full justify-start gap-2">
                                <CarouselReplay />
                                <CarouselIndicator className="flex-1" />
                            </div>

                            <CarouselScrollbar
                                className={cn("flex-1", {
                                    "2xl": "col-span-4",
                                    xl: "order-first col-span-4 my-2",
                                    md: "col-span-3",
                                    sm: "col-span-2"
                                })}
                            />

                            <div
                                className={cn("flex w-full justify-end gap-2", {
                                    xl: "col-start-4",
                                    md: "col-start-3",
                                    sm: "col-start-2"
                                })}
                            >
                                <CarouselPrevious className="flex-1" />
                                <CarouselNext className="flex-1" />
                            </div>
                        </Tooltip>
                    </div>
                    <div data-slot="carousel-live-region" className="sr-only" />
                </div>
            </CarouselContext.Provider>
        </>
    )
}

function CarouselContent({
    className,
    children,
    ...props
}: React.ComponentProps<"div">) {
    const { emblaRef, orientation } = useCarousel()

    return (
        <div
            ref={emblaRef}
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
            >
                <Lightbox>{children}</Lightbox>
            </div>
        </div>
    )
}

function CarouselItem({
    gap = 2,
    className,
    ...props
}: React.ComponentProps<"div"> & { gap?: number }) {
    const { orientation } = useCarousel()

    const gapToRem = `${gap / 4}rem`

    return (
        <div
            role="group"
            aria-roledescription="slide"
            data-slot="carousel-item"
            className={cn(
                "min-w-0 shrink-0 grow-0 basis-3/4",
                "[&>div:active]:cursor-grabbing",
                orientation === "horizontal"
                    ? "first-of-type:!pl-2"
                    : "first-of-type:!pt-2",
                {
                    md: "basis-full"
                },
                className
            )}
            style={
                orientation === "horizontal"
                    ? {
                          paddingLeft: gapToRem
                      }
                    : {
                          paddingTop: gapToRem
                      }
            }
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
    const { orientation, emblaApi } = useCarousel()

    const [canGoToPrev, setCanGoToPrev] = useState(false)

    const scrollStart = () => {
        emblaApi?.goTo(0)
    }

    useEffect(() => {
        if (!emblaApi) return
        const updateState = () => {
            setCanGoToPrev(emblaApi.canGoToPrev())
        }
        updateState()
        emblaApi.on("reinit", updateState)
        emblaApi.on("select", updateState)
        return () => {
            emblaApi.off("reinit", updateState)
            emblaApi.off("select", updateState)
        }
    }, [emblaApi])

    return (
        <TooltipTrigger
            payload={{
                content: <span>Go to first Slide</span>
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
                    disabled={!canGoToPrev}
                    onClick={scrollStart}
                    {...props}
                >
                    <Refresh className="size-5" />
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
    const { orientation, goToPrev, emblaApi } = useCarousel()

    const [canGoToPrev, setCanGoToPrev] = useState(false)

    useEffect(() => {
        if (!emblaApi) return
        const updateState = () => {
            setCanGoToPrev(emblaApi.canGoToPrev())
        }
        updateState()
        emblaApi.on("reinit", updateState)
        emblaApi.on("select", updateState)
        return () => {
            emblaApi.off("reinit", updateState)
            emblaApi.off("select", updateState)
        }
    }, [emblaApi])

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
                    disabled={!canGoToPrev}
                    onClick={goToPrev}
                    {...props}
                >
                    <ArrowLeft />
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
    const { orientation, goToNext, emblaApi } = useCarousel()

    const [canGoToNext, setCanGoToNext] = useState(false)

    useEffect(() => {
        if (!emblaApi) return
        const updateState = () => {
            setCanGoToNext(emblaApi.canGoToNext())
        }
        updateState()
        emblaApi.on("reinit", updateState)
        emblaApi.on("select", updateState)
        return () => {
            emblaApi.off("reinit", updateState)
            emblaApi.off("select", updateState)
        }
    }, [emblaApi])

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
                    disabled={!canGoToNext}
                    onClick={goToNext}
                    {...props}
                >
                    <ArrowRight />
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
    const { emblaApi } = useCarousel()
    const [value, setValue] = useState(0)

    const [snapCount, setSnapCount] = useState(0)

    const isDragging = useRef(false)
    const latestValue = useRef(0)

    const onScrollBarChange = (val: number | readonly number[]) => {
        if (!emblaApi) return
        isDragging.current = true

        const newProgress = val as number
        latestValue.current = newProgress
        setValue(newProgress)

        const engine = emblaApi.internalEngine()
        engine.animation.stop()

        const targetPosition =
            engine.limit.max - newProgress * engine.limit.length
        engine.location.set(targetPosition)
        engine.target.set(targetPosition)
        engine.translate.to(targetPosition)

        emblaApi.createEvent("scroll", { isDragging: true }).emit()
    }

    const onScrollBarRelease = (val: number | readonly number[]) => {
        if (!emblaApi) return
        isDragging.current = false

        const finalValue = val as number
        const count = emblaApi.snapList().length
        const closestIndex = Math.round(finalValue * (count - 1))

        emblaApi.goTo(closestIndex)
    }

    useEffect(() => {
        if (!emblaApi) return
        const updateScroll = () => {
            if (isDragging.current) return
            setValue(Math.max(0, Math.min(1, emblaApi.scrollProgress())))
        }

        const updateSnapCount = () => {
            setSnapCount(emblaApi.snapList().length)
        }

        updateScroll()
        updateSnapCount()

        emblaApi.on("scroll", updateScroll)
        emblaApi.on("resize", updateScroll)
        emblaApi.on("reinit", updateScroll)
        emblaApi.on("reinit", updateSnapCount)

        return () => {
            emblaApi.off("scroll", updateScroll)
            emblaApi.off("resize", updateScroll)
            emblaApi.off("reinit", updateScroll)
            emblaApi.off("reinit", updateSnapCount)
        }
    }, [emblaApi])

    return (
        <Slider
            data-slot="carousel-scrollbar"
            min={0}
            max={1}
            step={0.001}
            value={value}
            snapCount={snapCount}
            disabled={!emblaApi || snapCount <= 1}
            onValueChange={onScrollBarChange}
            onValueCommitted={onScrollBarRelease}
            onPointerUp={() => {
                if (isDragging.current) {
                    onScrollBarRelease(latestValue.current)
                }
            }}
            label="Slide scrollbar"
            className={className}
            {...props}
        />
    )
}

const PATTERN_SRC_REGEX = /\{(\d+)(?:-(\d+))?\}/u

function CarouselImage({
    srcPattern,
    gap,
    ...props
}: Omit<ImageProps, "src"> &
    ImageRoundProps &
    PngProps &
    ImageBorderProps & {
        srcPattern: string
        gap?: number
    }) {
    const isPatternSrc = PATTERN_SRC_REGEX.exec(srcPattern)

    let spreadImages = [srcPattern]

    if (isPatternSrc) {
        const start = parseInt(isPatternSrc[1], 10)
        const end = isPatternSrc[2] ? parseInt(isPatternSrc[2], 10) : start
        const padLength = isPatternSrc[1].length

        const result = []
        for (let i = Math.min(start, end); i <= Math.max(start, end); i++) {
            const numStr = String(i).padStart(padLength, "0")
            result.push(srcPattern.replace(isPatternSrc[0], numStr))
        }
        spreadImages = result
    }

    return spreadImages.map((src) => (
        <CarouselItem key={src} gap={gap}>
            <Image {...props} data-slot="carousel-image" src={src} />
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
