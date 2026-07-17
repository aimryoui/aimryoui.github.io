import {
    AnimatedMedia,
    type AnimatedMediaProps
} from "@/components/ui/animated-media"

export function Video(props: AnimatedMediaProps) {
    return <AnimatedMedia {...props} data-slot="video" />
}
