import {
    AnimatedMedia,
    type AnimatedMediaProps
} from "@/components/media/animated-media"
import { getParsedMediaData } from "@/helpers/get-parsed-media-data"
import videoManifestRaw from "@/lib/video-manifest.json"
import { type VideoManifest } from "@/scripts/process-videos"
import { useMediaStore } from "@/stores/media-store"

const videoManifest = videoManifestRaw as VideoManifest

interface VideoProps extends Omit<AnimatedMediaProps, "parsedData"> {
    src: string
}

function Video({ ...props }: VideoProps) {
    const parsedData = getParsedMediaData(props.src, videoManifest)

    const autoplayTypes = useMediaStore((state) => state.autoplayTypes)

    if (!parsedData) return null

    return (
        <AnimatedMedia
            parsedData={parsedData}
            {...props}
            data-slot="video"
            autoPlay={autoplayTypes.includes("videos")}
        />
    )
}

export { Video }
