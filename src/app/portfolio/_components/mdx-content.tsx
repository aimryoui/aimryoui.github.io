import * as runtime from "react/jsx-runtime"

import { SectionLine } from "@/components/layout/line"
import {
    JustifiedColumn,
    MediaFrame,
    MediaFrameContent
} from "@/components/layout/media-frame"
import { Gif } from "@/components/media/gif"
import { Image } from "@/components/media/image"
import { Video } from "@/components/media/video"
import { Carousel, CarouselImage, CarouselItem } from "@/components/ui/carousel"
import { Masonry } from "@/components/ui/masonry"

const sharedComponents = {
    Image,
    Video,
    Gif,
    Carousel,
    CarouselItem,
    CarouselImage,
    Masonry,
    MediaFrame,
    MediaFrameContent,
    JustifiedColumn,
    SectionLine
}

declare global {
    type MDXProvidedComponents = typeof sharedComponents
}

interface MDXModule {
    default: React.ComponentType<{
        components: MDXProvidedComponents & Record<string, React.ElementType>
    }>
}

type MDXFactory = (r: typeof runtime) => MDXModule

const useMDXComponent = (code: string) => {
    const fn = new Function(code) as MDXFactory
    return fn({ ...runtime }).default
}

interface MDXProps {
    code: string
    components?: Record<string, React.ComponentType>
}

export const MDXContent = ({ code, components }: MDXProps) => {
    const Component = useMDXComponent(code)

    // oxlint-disable-next-line react-compiler/static-components
    return <Component components={{ ...sharedComponents, ...components }} />
}
