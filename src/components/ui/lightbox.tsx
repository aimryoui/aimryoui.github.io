import "@/portfolio/_styles/photoswipe.css"

import {
    Gallery,
    type GalleryProps,
    Item,
    type ItemProps
} from "react-photoswipe-gallery"

import {
    type ImageProps,
    type PngProps,
    type RoundedImageProps
} from "@/components/ui/image"

type ImageCoreProps = ImageProps & RoundedImageProps & PngProps

const SCALE_3D_REGEX = /scale3d\(([^,]+)/u
const MATRIX_REGEX = /^matrix(?:3d)?\(([^,]+),\s*([^,]+)/u

function Lightbox({ ...props }: GalleryProps & ImageCoreProps) {
    return (
        <Gallery
            data-slot="lightbox"
            options={{
                showHideAnimationType: "zoom",
                wheelToZoom: true,
                secondaryZoomLevel: 2
            }}
            onBeforeOpen={(lightbox) => {
                // Force show/hide animation
                lightbox.addFilter("useContentPlaceholder", () => true)
                // Force zoomable
                lightbox.addFilter("isContentZoomable", () => true)

                let rAF_ID: number

                const getElements = () => {
                    const placeholder =
                        lightbox.currSlide?.getPlaceholderElement()
                    const zoomWrap = lightbox.currSlide?.container
                    return { placeholder, zoomWrap }
                }

                const getPhScale = (placeholder: HTMLElement) => {
                    const match = SCALE_3D_REGEX.exec(
                        placeholder.style.transform
                    )
                    return match ? parseFloat(match[1]) : 1
                }

                const getWrapScale = (zoomWrap: HTMLElement) => {
                    const matrix = window.getComputedStyle(zoomWrap).transform

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

                const startAFSync = () => {
                    const { placeholder, zoomWrap } = getElements()
                    if (!placeholder || !zoomWrap) return

                    zoomWrap.style.setProperty(
                        "--nhn-wrap-scale",
                        getWrapScale(zoomWrap).toString()
                    )
                    zoomWrap.style.setProperty(
                        "--nhn-ph-scale",
                        getPhScale(placeholder).toString()
                    )

                    rAF_ID = requestAnimationFrame(startAFSync)
                }
                const stopAFSync = () => {
                    cancelAnimationFrame(rAF_ID)
                }

                lightbox.on("openingAnimationStart", () => {
                    const { placeholder } = getElements()

                    const aspectRatio = lightbox.currSlide?.data
                        .placeholderAspectRatio as string

                    if (placeholder) {
                        placeholder.style.aspectRatio = aspectRatio

                        if (props.rounded || props.percentageRounded) {
                            placeholder.classList.add("corner-superellipse")
                        }
                        if (props.percentageRounded) {
                            placeholder.style.borderRadius = `calc(${props.percentageRounded.toString()}% * var(--nhn-offset-factor)) / calc(${props.percentageRounded.toString()}% * ${aspectRatio} * var(--nhn-offset-factor))`
                        }
                        if (props.pngAntiBleed || props.pngBorder) {
                            placeholder.classList.add(
                                "[filter:url(#png-anti-bleed)]"
                            )
                        }

                        if (props.rounded) {
                            placeholder.style.borderRadius =
                                "calc(var(--radius-media) / (var(--nhn-wrap-scale) * var(--nhn-ph-scale)))"
                        }
                        if (!props.noBorder) {
                            placeholder.classList.add(
                                "outline-default/15",
                                "outline-solid"
                            )
                            placeholder.style.outlineWidth =
                                "calc(var(--px) / (var(--nhn-wrap-scale) * var(--nhn-ph-scale)))"
                            placeholder.style.outlineOffset =
                                "calc((var(--px) / (var(--nhn-wrap-scale) * var(--nhn-ph-scale))) * -1)"
                        }
                    }

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

                lightbox.on("zoomPanUpdate", () => {
                    const { placeholder } = getElements()
                    if (!placeholder) return

                    placeholder.style.setProperty(
                        "--nhn-ph-scale",
                        getPhScale(placeholder).toString()
                    )
                })
            }}
            {...props}
        />
    )
}

function LightboxItem({
    ...props
}: ItemProps<HTMLElement> & { placeholderAspectRatio?: string }) {
    return <Item data-slot="lightbox-item" {...props} />
}

export { Lightbox, LightboxItem }
