import { useEffect } from "react"

import { type EmblaCarouselType } from "embla-carousel"

const useAccessibility = (emblaApi: EmblaCarouselType | undefined): void => {
    const setupAccessibility = (emblaApi: EmblaCarouselType) => {
        const accessibility = emblaApi.plugins().accessibility

        accessibility.setupLiveRegion("[data-slot='carousel-live-region']")
        accessibility.setupDotButtons("[data-slot='carousel-dots']")
        accessibility.setupPrevAndNextButtons(
            "[data-slot='carousel-previous']",
            "[data-slot='carousel-next']"
        )
    }

    useEffect(() => {
        if (!emblaApi) return

        emblaApi.on("reinit", setupAccessibility)
        setupAccessibility(emblaApi)
    }, [emblaApi])
}

export { useAccessibility }
