import "@/portfolio/_styles/photoswipe.css"

import {
    Gallery,
    type GalleryProps,
    Item,
    type ItemProps
} from "react-photoswipe-gallery"

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

function Lightbox({ options, onBeforeOpen, ...props }: GalleryProps) {
    return (
        <Gallery
            data-slot="lightbox"
            options={{
                showHideAnimationType: "zoom",
                wheelToZoom: true,
                secondaryZoomLevel: 2,
                loop: false,
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

                // Force append heavy and isOpen state to keep Image during open animation
                const forceAppendHeavy = (slide: typeof lightbox.currSlide) => {
                    if (!slide || slide.heavyAppended) return
                    const wasOpen = lightbox.opener.isOpen

                    lightbox.opener.isOpen = true
                    slide.appendHeavy()
                    lightbox.opener.isOpen = wasOpen
                }

                // Force dispatch close event to keep Image during close animation
                const originalDispatch = lightbox.dispatch.bind(lightbox)
                lightbox.dispatch = (name, details) =>
                    name === "close"
                        ? ({
                              type: "close",
                              defaultPrevented: false,
                              preventDefault: () => {}
                          } as never)
                        : originalDispatch(name, details)
                // Restore original close event after destroy
                lightbox.on("destroy", () => {
                    originalDispatch("close")
                    lightbox.dispatch = originalDispatch
                })

                const setPlaceholder = (slide: typeof lightbox.currSlide) => {
                    if (!slide) return

                    const placeholder = slide.getPlaceholderElement()
                    const data = slide.data as CustomItemData

                    if (!placeholder || placeholder.dataset.styled) return
                    placeholder.dataset.styled = "true"

                    placeholder.style.aspectRatio = data.placeholderAspectRatio

                    if (data.rounded || data.percentageRounded) {
                        placeholder.classList.add("corner-superellipse")
                    }
                    if (data.percentageRounded) {
                        placeholder.style.borderRadius = `calc(${data.percentageRounded.toString()}% * var(--nhn-offset-factor)) / calc(${data.percentageRounded.toString()}% * ${data.placeholderAspectRatio} * var(--nhn-offset-factor))`
                    }
                    if (data.pngAntiBleed || data.pngBorder) {
                        placeholder.classList.add(
                            "[filter:url(#png-anti-bleed)]"
                        )
                    }

                    if (data.rounded) {
                        placeholder.style.borderRadius =
                            "calc(var(--radius-media) / (var(--nhn-wrap-scale, 1) * var(--nhn-ph-scale, 1)))"
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

                const getElements = (
                    targetSlide?: typeof lightbox.currSlide
                ) => {
                    const slide = targetSlide ?? lightbox.currSlide
                    const placeholder = slide?.getPlaceholderElement()
                    const zoomWrap = slide?.container
                    return { placeholder, zoomWrap }
                }

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

                let rAF_ID: number
                const startAFSync = () => {
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

                    forceAppendHeavy(slide)
                })

                lightbox.on("openingAnimationStart", () => {
                    setPlaceholder(lightbox.currSlide)
                    startAFSync()
                })

                lightbox.on("openingAnimationEnd", () => {
                    stopAFSync()

                    const { zoomWrap } = getElements()
                    if (!zoomWrap) return

                    zoomWrap.style.setProperty("--nhn-wrap-scale", "1")
                })

                lightbox.on("closingAnimationStart", startAFSync)
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
