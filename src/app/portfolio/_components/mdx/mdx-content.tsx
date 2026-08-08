import * as runtime from "react/jsx-runtime"

import { SectionLine } from "@/components/layout/line"
import {
    JustifiedColumn,
    MediaFrame,
    MediaFrameContent,
    type MediaFrameProps
} from "@/components/layout/media-frame"
import { Note } from "@/components/layout/note"
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
    Note,
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

function useMDXComponent(code: string) {
    const fn = new Function(code) as MDXFactory
    return fn({ ...runtime }).default
}

interface MDXProps {
    code: string
    components?: Record<string, React.ComponentType>
    hasSocialLinks?: MediaFrameProps["hasSocialLinks"]
}

function MDXContent({ code, components, hasSocialLinks }: MDXProps) {
    const Component = useMDXComponent(code)

    const customComponents = {
        ...sharedComponents,
        ...(hasSocialLinks && {
            MediaFrame: (props: React.ComponentProps<typeof MediaFrame>) => (
                <MediaFrame {...props} hasSocialLinks={hasSocialLinks} />
            )
        }),
        ...components
    }

    // oxlint-disable-next-line react-compiler/static-components
    return <Component components={customComponents} />
}

export { MDXContent }
