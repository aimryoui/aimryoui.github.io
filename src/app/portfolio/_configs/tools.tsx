import {
    AdobeAfterEffects,
    AdobeDimension,
    AdobeDreamweaver,
    AdobeIllustrator,
    AdobeIndesign,
    AdobePhotoshop,
    AdobePremierePro,
    AdobeXD,
    Blender,
    Bootstrap,
    Figma,
    VSCode
} from "@/app/portfolio/_components/_icons/tool-icons"
import { cn } from "@/lib/utils"

const TOOL_ICONS = ({ size = "md" }: { size?: "md" | "sm" } = {}) => ({
    figma: {
        icon: <Figma className={cn(size === "sm" ? "size-6" : "size-8")} />,
        label: "Figma",
        url: "https://www.figma.com/"
    },
    photoshop: {
        icon: (
            <AdobePhotoshop
                className={cn(size === "sm" ? "size-6" : "size-8")}
            />
        ),
        label: "Adobe Photoshop",
        url: "https://www.adobe.com/in/products/photoshop.html"
    },
    illustrator: {
        icon: (
            <AdobeIllustrator
                className={cn(size === "sm" ? "size-6" : "size-8")}
            />
        ),
        label: "Adobe Illustrator",
        url: "https://www.adobe.com/in/products/illustrator.html"
    },
    inDesign: {
        icon: (
            <AdobeIndesign
                className={cn(size === "sm" ? "size-6" : "size-8")}
            />
        ),
        label: "Adobe InDesign",
        url: "https://www.adobe.com/in/products/indesign.html"
    },
    afterEffects: {
        icon: (
            <AdobeAfterEffects
                className={cn(size === "sm" ? "size-6" : "size-8")}
            />
        ),
        label: "Adobe After Effects",
        url: "https://www.adobe.com/in/products/aftereffects.html"
    },
    premierePro: {
        icon: (
            <AdobePremierePro
                className={cn(size === "sm" ? "size-6" : "size-8")}
            />
        ),
        label: "Adobe Premiere Pro",
        url: "https://www.adobe.com/in/products/premiere.html"
    },
    dreamweaver: {
        icon: (
            <AdobeDreamweaver
                className={cn(size === "sm" ? "size-6" : "size-8")}
            />
        ),
        label: "Adobe Dreamweaver",
        url: "https://www.adobe.com/in/products/dreamweaver.html"
    },
    xd: {
        icon: <AdobeXD className={cn(size === "sm" ? "size-6" : "size-8")} />,
        label: "Adobe XD",
        url: "https://www.adobe.com/in/products/xd.html"
    },
    dimension: {
        icon: (
            <AdobeDimension
                className={cn(size === "sm" ? "size-6" : "size-8")}
            />
        ),
        label: "Adobe Dimension",
        url: "https://www.adobe.com/in/products/dimension.html"
    },
    blender: {
        icon: <Blender className={cn(size === "sm" ? "size-6" : "size-8")} />,
        label: "Blender",
        url: "https://www.blender.org/"
    },
    vsCode: {
        icon: <VSCode className={cn(size === "sm" ? "size-6" : "size-8")} />,
        label: "VS Code",
        url: "https://code.visualstudio.com"
    },
    bootstrap: {
        icon: <Bootstrap className={cn(size === "sm" ? "h-6" : "h-8")} />,
        label: "Bootstrap",
        url: "https://getbootstrap.com"
    }
})

type ToolMap = ReturnType<typeof TOOL_ICONS>
type ToolProps = ToolMap[ToolKey]
type ToolKey = keyof ToolMap

export { TOOL_ICONS }
export type { ToolKey, ToolProps }
