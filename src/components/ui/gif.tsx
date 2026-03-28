import { AnimatedMedia } from "@/components/ui/animated-media"

interface GifProps {
    src: string
    alt: string
    className?: string
}

export function Gif({ src, alt, className }: GifProps) {
    return (
        <AnimatedMedia
            src={src}
            alt={alt}
            className={className}
            autoplay={true}
            autoPlay={true}
            loop={true}
            muted={true}
            mute={true}
            controls={false}
        />
    )
}
