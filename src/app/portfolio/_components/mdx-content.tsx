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
    /**
     * @see {@link https://github.com/mdx-js/mdx-analyzer#mdxprovidedcomponents}
     * alternative way.
     */
    type MDXProvidedComponents = typeof sharedComponents
}

const useMDXComponent = (code: string) => {
    const fn = new Function(code)
    return fn({ ...runtime }).default
}

interface MDXProps {
    code: string
    components?: Record<string, React.ComponentType>
}

export const MDXContent = ({ code, components }: MDXProps) => {
    const Component = useMDXComponent(code)
    return <Component components={{ ...sharedComponents, ...components }} />
}
