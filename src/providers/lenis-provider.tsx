"use client"

import { ReactLenis } from "lenis/react"
import { type PropsWithChildren } from "react"

const LenisProvider = ({ children }: PropsWithChildren) => {
    return (
        <ReactLenis
            options={{
                duration: 0.5,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                wheelMultiplier: 0.75,
                touchMultiplier: 0.75
            }}
            root
        >
            {children}
        </ReactLenis>
    )
}

export default LenisProvider
