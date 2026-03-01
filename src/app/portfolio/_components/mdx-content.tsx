// biome-ignore lint/performance/noNamespaceImport: https://velite.js.org/guide/using-mdx#rendering-mdx-content
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

    // eslint-disable-next-line react-hooks/static-components
    return <Component components={{ ...sharedComponents, ...components }} />
}
