import * as runtime from "react/jsx-runtime"

import { ProjectSectionDivider } from "@/components/layout/divider"
import { SectionLine } from "@/components/layout/line"
import { MediaFrame } from "@/components/layout/media-frame"
import { Image } from "@/components/ui/image"
import { cn } from "@/lib/utils"

const sharedComponents = {
    cn,
    Image,
    MediaFrame,
    ProjectSectionDivider,
    SectionLine
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
