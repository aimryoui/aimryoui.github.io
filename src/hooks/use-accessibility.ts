import { useEffect } from "react"

import { type EmblaCarouselType } from "embla-carousel"

function setupAccessibility(emblaApi: EmblaCarouselType) {
    const accessibility = emblaApi.plugins().accessibility
    if (!accessibility) return

    accessibility.setupLiveRegion("[data-slot='carousel-live-region']")
    accessibility.setupDotButtons("[data-slot='carousel-dots']")
    accessibility.setupPrevAndNextButtons(
        "[data-slot='carousel-previous']",
        "[data-slot='carousel-next']"
    )
}

function useAccessibility(emblaApi: EmblaCarouselType | undefined): void {
    useEffect(() => {
        if (!emblaApi) return

        emblaApi.on("reinit", setupAccessibility)
        setupAccessibility(emblaApi)

        return () => {
            emblaApi.off("reinit", setupAccessibility)
        }
    }, [emblaApi])
}

export { useAccessibility }
