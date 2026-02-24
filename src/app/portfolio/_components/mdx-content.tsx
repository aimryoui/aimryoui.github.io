import * as runtime from "react/jsx-runtime"

import { SectionLine } from "@/components/layout/line"
import { MediaFrame } from "@/components/layout/media-frame"
import { Image } from "@/components/ui/image"
import { Masonry } from "@/components/ui/masonry"

const sharedComponents = {
    Image,
    Masonry,
    MediaFrame,
    SectionLine
}

declare global {
    type MDXProvidedComponents = typeof sharedComponents
}

interface MDXProps {
    code: string
    components?: Record<string, React.ElementType>
}

interface MDXModule {
    default: React.ComponentType<{
        components: MDXProvidedComponents & Record<string, React.ElementType>
    }>
}

type MDXFactory = (r: typeof runtime) => MDXModule

const getMDXComponent = (code: string) => {
    const fn = Reflect.construct(Function, [code]) as MDXFactory
    return fn({ ...runtime }).default
}

export const MDXContent = ({ code, components }: MDXProps) => {
    const Component = getMDXComponent(code)

    return <Component components={{ ...sharedComponents, ...components }} />
}
