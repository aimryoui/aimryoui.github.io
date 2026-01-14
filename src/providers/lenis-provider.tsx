"use client"

import { ReactLenis } from "lenis/react"
import { type PropsWithChildren } from "react"

const LenisProvider = ({ children }: PropsWithChildren) => {
    return (
        <ReactLenis
            options={{
                duration: 0.5,
                wheelMultiplier: 0.85,
                touchMultiplier: 0.85
            }}
            root
        >
            {children}
        </ReactLenis>
    )
}

export default LenisProvider
