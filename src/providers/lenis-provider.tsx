"use client"

import { type PropsWithChildren } from "react"

import { ReactLenis } from "lenis/react"

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
