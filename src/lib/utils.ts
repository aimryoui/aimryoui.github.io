import { type ClassValue, clsx } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

type AdditionalClassGroupIDs = "scrollbar-width" | "bg-clip"
type AdditionalThemeGroupIDs = ""

const twMerge = extendTailwindMerge<
    AdditionalClassGroupIDs,
    AdditionalThemeGroupIDs
>({
    extend: {
        classGroups: {
            /** @see https://github.com/dcastil/tailwind-merge/blob/main/src/lib/default-config.ts */
            "outline-offset": ["outline-offset-px"],
            "scrollbar-width": [
                "scrollbar-auto",
                "scrollbar-thin",
                "scrollbar-none"
            ],
            "bg-clip": ["bg-clip-*"]
        },
        theme: {
            /** @see https://github.com/dcastil/tailwind-merge/blob/main/docs/configuration.md#theme */
            text: ["xxs"],
            spacing: ["inherit"],
            radius: ["inherit"]
        }
    }
})

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}
