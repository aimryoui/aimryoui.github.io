import {
    AnimatedMedia,
    type AnimatedMediaProps
} from "@/components/ui/animated-media"

export function Gif({
    src,
    alt,
    rounded,
    className
}: Pick<AnimatedMediaProps, "src" | "alt" | "rounded" | "className">) {
    return (
        <AnimatedMedia
            src={src}
            alt={alt}
            className={className}
            rounded={rounded}
            autoplay={true}
            autoPlay={true}
            loop={true}
            muted={true}
            mute={true}
            controls={false}
        />
    )
}
