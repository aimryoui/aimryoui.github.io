import { type ClassValue, clsx } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

type AdditionalThemeGroupIDs = ""
type AdditionalClassGroupIDs = ""

const twMerge = extendTailwindMerge<
    AdditionalClassGroupIDs,
    AdditionalThemeGroupIDs
>({
    extend: {
        classGroups: {
            /** @see https://github.com/dcastil/tailwind-merge/blob/main/src/lib/default-config.ts */
            "outline-offset": ["outline-offset-px"]
        },
        theme: {
            /** @see https://github.com/dcastil/tailwind-merge/blob/main/docs/configuration.md#theme */
            text: ["xxs"],
            spacing: ["body-padding"]
        }
    }
})

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}
