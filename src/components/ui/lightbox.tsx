import "@/portfolio/_styles/photoswipe.css"

import {
    Gallery,
    type GalleryProps,
    Item,
    type ItemProps
} from "react-photoswipe-gallery"

import { useMediaQuery } from "@/hooks/use-media-query"

interface CustomItemData {
    placeholderAspectRatio: string
    rounded?: boolean
    percentageRounded?: number
    noBorder?: boolean
    pngBorder?: boolean
    pngAntiBleed?: boolean
}

const SCALE_3D_REGEX = /scale3d\(([^,]+)/u
const MATRIX_REGEX = /^matrix(?:3d)?\(([^,]+),\s*([^,]+)/u

const FPS = 24
const FPS_INTERVAL = 1000 / FPS

const getInlineScale = (el: HTMLElement) => {
    const match = SCALE_3D_REGEX.exec(el.style.transform)
    return match ? parseFloat(match[1]) : 1
}

const getTransitionScale = (el: HTMLElement) => {
    const matrix = window.getComputedStyle(el).transform

    if (matrix !== "none") {
        const matrixMatch = MATRIX_REGEX.exec(matrix)
        if (matrixMatch) {
            const a = parseFloat(matrixMatch[1])
            const b = parseFloat(matrixMatch[2])

            return Math.sqrt(a * a + b * b)
        }
    }

    return 1
}

const isOriginalInViewport = (el: Element) => {
    const rect = el.getBoundingClientRect()
    return (
        rect.top < window.innerHeight &&
        rect.bottom > 0 &&
        rect.left < window.innerWidth &&
        rect.right > 0
    )
}

function Lightbox({ options, onBeforeOpen, ...props }: GalleryProps) {
    const isMobilePortrait = useMediaQuery(
        "(max-width: 48rem) and (orientation: portrait)"
    )

    return (
        <Gallery
            data-slot="lightbox"
            options={{
                showHideAnimationType: "zoom",
                wheelToZoom: true,
                secondaryZoomLevel: isMobilePortrait ? 0.75 : 2,
                loop: false,
                preloaderDelay: 500,
                bgOpacity: 1,
                spacing: 0.05,
                showAnimationDuration: 250,
                hideAnimationDuration: 250,
                imageClickAction: "zoom",
                clickToCloseNonZoomable: false,
                ...options
            }}
            onBeforeOpen={(lightbox) => {
                // Force show/hide animation
                lightbox.addFilter("useContentPlaceholder", () => true)
                // Force zoomable
                lightbox.addFilter("isContentZoomable", () => true)
                // Force using image as placholder for all images in gallery
                lightbox.addFilter(
                    "placeholderSrc",
                    (_, content) => content.data.msrc ?? false
                )

                const getElements = (
                    targetSlide?: typeof lightbox.currSlide
                ) => {
                    const slide = targetSlide ?? lightbox.currSlide

                    return {
                        get placeholder() {
                            return slide?.getPlaceholderElement()
                        },
                        get zoomWrap() {
                            return slide?.container
                        },
                        get original() {
                            return slide?.data.element
                        },
                        get content() {
                            return slide?.content.element?.firstElementChild
                        }
                    }
                }

                // Lift-off effect (hide original element)
                let liftedOffEl: HTMLElement | null = null
                const hideOriginal = (slide?: typeof lightbox.currSlide) => {
                    if (!slide || !slide.data.element) return
                    const currentEl = slide.data.element

                    if (liftedOffEl && liftedOffEl !== currentEl) {
                        liftedOffEl.style.removeProperty("opacity")
                    }

                    liftedOffEl = currentEl
                    liftedOffEl.style.opacity = "0"
                }
                const showOriginal = () => {
                    if (liftedOffEl) {
                        liftedOffEl.style.removeProperty("opacity")
                        liftedOffEl = null
                    }
                }
                lightbox.on("change", () => {
                    // Prevent `change` event during initialization
                    // that will hide the original element too soon
                    if (lightbox.opener.isOpening) return
                    hideOriginal(lightbox.currSlide)
                })

                // Force append heavy and `isOpen` state to keep Image during open animation
                const forceAppendHeavy = (slide: typeof lightbox.currSlide) => {
                    if (!slide || slide.heavyAppended) return
                    const wasOpen = lightbox.opener.isOpen

                    lightbox.opener.isOpen = true
                    slide.appendHeavy()
                    lightbox.opener.isOpen = wasOpen
                }

                let isCloseHijacked = false
                // Force dispatch `close` event to keep Image during close animation
                // only when original element is in viewport
                const originalDispatch = lightbox.dispatch.bind(lightbox)
                lightbox.dispatch = (name, details) => {
                    if (name === "close") {
                        const { original } = getElements()

                        const isVisible = original
                            ? isOriginalInViewport(original)
                            : true

                        if (isVisible) {
                            isCloseHijacked = true
                            return {
                                type: "close",
                                defaultPrevented: false,
                                preventDefault: () => {}
                            } as never
                        }
                        isCloseHijacked = false
                    }
                    return originalDispatch(name, details)
                }
                lightbox.on("destroy", () => {
                    showOriginal()
                    // Restore original close event after destroy
                    // only when original element is in viewport
                    if (isCloseHijacked) {
                        originalDispatch("close")
                    }
                    lightbox.dispatch = originalDispatch
                })

                const setPlaceholder = (slide: typeof lightbox.currSlide) => {
                    if (!slide) return

                    const { placeholder } = getElements(slide)
                    const data = slide.data as CustomItemData

                    if (!placeholder || placeholder.dataset.styled) return
                    placeholder.dataset.styled = "true"

                    placeholder.style.aspectRatio = data.placeholderAspectRatio

                    if (data.rounded || data.percentageRounded) {
                        placeholder.classList.add("corner-superellipse")
                    }
                    if (data.rounded) {
                        placeholder.style.borderRadius =
                            "calc(var(--radius-media) / (var(--nhn-wrap-scale, 1) * var(--nhn-ph-scale, 1)))"
                    } else if (data.percentageRounded) {
                        placeholder.style.borderRadius = `calc(${data.percentageRounded.toString()}% * var(--nhn-radius-offset-factor)) / calc(${data.percentageRounded.toString()}% * ${data.placeholderAspectRatio} * var(--nhn-radius-offset-factor))`
                    }

                    if (data.pngAntiBleed || data.pngBorder) {
                        placeholder.classList.add(
                            "blink:[filter:url(#png-anti-bleed)]"
                        )
                    }

                    if (!data.noBorder && !data.pngBorder) {
                        placeholder.classList.add(
                            "outline-white/15",
                            "outline-solid"
                        )
                        placeholder.style.outlineWidth =
                            "calc(var(--px) / (var(--nhn-wrap-scale, 1) * var(--nhn-ph-scale, 1)))"
                        placeholder.style.outlineOffset =
                            "calc((var(--px) / (var(--nhn-wrap-scale, 1) * var(--nhn-ph-scale, 1))) * -1)"
                    }
                }

                let rAF_ID: number
                let lastTime = 0
                const startAFSync = () => {
                    const currentTime = performance.now()
                    const deltaTime = currentTime - lastTime

                    if (deltaTime >= FPS_INTERVAL) {
                        lastTime = currentTime - (deltaTime % FPS_INTERVAL)

                        const { placeholder, zoomWrap } = getElements()
                        if (!placeholder || !zoomWrap) return

                        zoomWrap.style.setProperty(
                            "--nhn-wrap-scale",
                            getTransitionScale(zoomWrap).toString()
                        )
                        zoomWrap.style.setProperty(
                            "--nhn-ph-scale",
                            getInlineScale(placeholder).toString()
                        )
                    }

                    rAF_ID = requestAnimationFrame(startAFSync)
                }
                const stopAFSync = () => {
                    cancelAnimationFrame(rAF_ID)
                }

                lightbox.on("afterSetContent", (e) => {
                    const slide = e.slide
                    const { placeholder, zoomWrap } = getElements(slide)

                    if (placeholder && zoomWrap) {
                        zoomWrap.style.setProperty(
                            "--nhn-wrap-scale",
                            getInlineScale(zoomWrap).toString()
                        )
                        zoomWrap.style.setProperty(
                            "--nhn-ph-scale",
                            getInlineScale(placeholder).toString()
                        )

                        setPlaceholder(slide)
                    }

                    document.body.style.setProperty(
                        "--color-svg-filter",
                        "var(--color-white)"
                    )

                    forceAppendHeavy(slide)
                })

                lightbox.on("openingAnimationStart", () => {
                    const currentSlide = lightbox.currSlide
                    setPlaceholder(currentSlide)
                    hideOriginal(currentSlide)

                    startAFSync()

                    const { content } = getElements()
                    if (content) {
                        content.classList.remove("after:border-default/15")
                        content.classList.add("after:border-white/15")
                    }
                })

                lightbox.on("openingAnimationEnd", () => {
                    stopAFSync()

                    const { zoomWrap } = getElements()
                    if (!zoomWrap) return

                    zoomWrap.style.setProperty("--nhn-wrap-scale", "1")
                })

                lightbox.on("closingAnimationStart", () => {
                    startAFSync()

                    const { content } = getElements()
                    if (content) {
                        content.classList.remove("after:border-white/15")
                        content.classList.add("after:border-default/15")
                    }

                    document.body.style.removeProperty("--color-svg-filter")
                })
                lightbox.on("closingAnimationEnd", stopAFSync)

                lightbox.on("zoomPanUpdate", (e) => {
                    const { placeholder } = getElements(e.slide)
                    if (!placeholder) return

                    placeholder.style.setProperty(
                        "--nhn-ph-scale",
                        getInlineScale(placeholder).toString()
                    )
                })

                onBeforeOpen?.(lightbox)
            }}
            {...props}
        />
    )
}

function LightboxItem({ ...props }: ItemProps<HTMLElement> & CustomItemData) {
    return <Item data-slot="lightbox-item" {...props} />
}

export { Lightbox, LightboxItem }
