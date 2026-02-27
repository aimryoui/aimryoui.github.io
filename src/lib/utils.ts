import { extendTailwindMerge, validators } from "tailwind-merge"
import { type ClassValue, twg } from "twg"

type AdditionalClassGroupIDs = "scrollbar-width"
type AdditionalThemeGroupIDs = "transitionBehavior"

const twMerge = extendTailwindMerge<
    AdditionalClassGroupIDs,
    AdditionalThemeGroupIDs
>({
    extend: {
        classGroups: {
            /** @see https://github.com/dcastil/tailwind-merge/blob/v2.6.1/src/lib/default-config.ts */
            "font-size": ["text-xxs"],
            "outline-offset": ["outline-offset-px"],
            "scrollbar-width": [
                "scrollbar-auto",
                "scrollbar-thin",
                "scrollbar-none"
            ],
            transition: ["transition-normal", "transition-discrete"],
            ease: ["spring"],
            /** @see {@link https://github.com/dcastil/tailwind-merge/blob/v2.6.1/docs/api-reference.md#validators} */
            "bg-clip": [{ "bg-clip": [validators.isArbitraryValue] }],
            "bg-position": [{ "bg-position": [validators.isArbitraryValue] }],
            "bg-size": [{ "bg-size": [validators.isArbitraryValue] }],
            duration: [{ duration: [validators.isNumber] }]
        },
        theme: {
            /** @see https://github.com/dcastil/tailwind-merge/blob/v2.6.1/docs/configuration.md#theme */
            spacing: ["inherit"],
            borderRadius: ["inherit"],
            transitionBehavior: ["normal", "discrete"]
        }
    }
})

export function cn(...inputs: ClassValue[]) {
    return twMerge(twg(inputs))
}
