import "@/portfolio/_styles/photoswipe.css"

import {
    Gallery,
    type GalleryProps,
    Item,
    type ItemProps
} from "react-photoswipe-gallery"

import { useBrowserEngine } from "@/hooks/use-browser-engine"
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

function getInlineScale(el: HTMLElement) {
    const match = SCALE_3D_REGEX.exec(el.style.transform)
    return match ? parseFloat(match[1]) : 1
}

function getTransitionScale(el: HTMLElement) {
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

function isOriginalInViewport(el: Element) {
    const rect = el.getBoundingClientRect()
    return (
        rect.top < window.innerHeight &&
        rect.bottom > 0 &&
        rect.left < window.innerWidth &&
        rect.right > 0
    )
}

const ANIMATION_DURATION = 350

function Lightbox({ options, onBeforeOpen, ...props }: GalleryProps) {
    const isMobilePortrait = useMediaQuery(
        "(max-width: 48rem) and (orientation: portrait)"
    )

    const { isWebkit } = useBrowserEngine()

    return (
        <Gallery
            data-slot="lightbox"
            data-cursor="ignore"
            options={{
                showHideAnimationType: "zoom",
                wheelToZoom: true,
                secondaryZoomLevel: isMobilePortrait ? 0.75 : 2,
                easing: isWebkit
                    ? "cubic-bezier(0.25, 0.1, 0.25, 1)"
                    : "cubic-bezier(0.20, 1, 0.36, 1)",
                loop: false,
                preloaderDelay: 500,
                bgOpacity: 1,
                spacing: isMobilePortrait ? 0.1 : 0.05,
                showAnimationDuration: isWebkit ? 250 : ANIMATION_DURATION,
                hideAnimationDuration: isWebkit ? 250 : ANIMATION_DURATION,
                imageClickAction: "zoom",
                clickToCloseNonZoomable: false,
                ...options
            }}
            onBeforeOpen={(lightbox) => {
                const onEvent = lightbox.on.bind(lightbox)

                onEvent("afterInit", () => {
                    const pswpElement = document.querySelector(".pswp")
                    const pswpItemElement =
                        document.querySelector(".pswp__item")
                    if (pswpElement) {
                        pswpElement.setAttribute("data-slot", "lightbox")
                        pswpElement.setAttribute("data-cursor", "ignore")
                    }
                    if (pswpItemElement) {
                        pswpItemElement.setAttribute(
                            "data-slot",
                            "lightbox-item"
                        )
                    }
                })
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
                        placeholder: () => slide?.getPlaceholderElement(),
                        zoomWrap: () => slide?.container,
                        original: () => slide?.data.element,
                        content: () => slide?.content.element?.firstElementChild
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
                onEvent("change", () => {
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
                        const original = getElements().original()

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
                onEvent("destroy", () => {
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

                    const placeholder = getElements(slide).placeholder()
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

                        const el = getElements()
                        const placeholder = el.placeholder()
                        const zoomWrap = el.zoomWrap()
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

                onEvent("afterSetContent", (e) => {
                    const slide = e.slide
                    const el = getElements(slide)
                    const placeholder = el.placeholder()
                    const zoomWrap = el.zoomWrap()

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

                onEvent("openingAnimationStart", () => {
                    const currentSlide = lightbox.currSlide
                    setPlaceholder(currentSlide)
                    hideOriginal(currentSlide)

                    startAFSync()

                    const content = getElements().content()
                    if (content) {
                        content.classList.remove("after:border-default/15")
                        content.classList.add("after:border-white/15")
                    }
                })

                onEvent("openingAnimationEnd", () => {
                    stopAFSync()

                    const zoomWrap = getElements().zoomWrap()
                    if (!zoomWrap) return

                    zoomWrap.style.setProperty("--nhn-wrap-scale", "1")
                })

                onEvent("closingAnimationStart", () => {
                    startAFSync()

                    const content = getElements().content()
                    if (content) {
                        content.classList.remove("after:border-white/15")
                        content.classList.add("after:border-default/15")
                    }

                    document.body.style.removeProperty("--color-svg-filter")
                })
                onEvent("closingAnimationEnd", stopAFSync)

                onEvent("zoomPanUpdate", (e) => {
                    const placeholder = getElements(e.slide).placeholder()
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
