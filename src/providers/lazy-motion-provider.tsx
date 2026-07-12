import { domAnimation, LazyMotion, MotionConfig } from "motion/react"

export function LazyMotionProvider({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <LazyMotion features={domAnimation} strict>
            {/* https://motion.dev/docs/react-accessibility */}
            <MotionConfig reducedMotion="user">{children}</MotionConfig>
        </LazyMotion>
    )
}
