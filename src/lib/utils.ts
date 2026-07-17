import { extendTailwindMerge, validators } from "tailwind-merge"
import { type ClassValue, twg } from "twg"

type AdditionalClassGroupIDs =
    | "mask"
    | "scrollbar-width"
    | "font-wght"
    | "font-slnt"
    | "font-ital"
    | "font-rond"
    | "font-grad"
type AdditionalThemeGroupIDs = "transitionBehavior"

const twMerge = extendTailwindMerge<
    AdditionalClassGroupIDs,
    AdditionalThemeGroupIDs
>({
    extend: {
        classGroups: {
            /** @see https://github.com/dcastil/tailwind-merge/blob/v2.6.1/src/lib/default-config.ts */
            "font-size": ["text-xxs"],
            "font-wght": [
                {
                    "font-wght": [
                        validators.isNumber,
                        validators.isArbitraryNumber
                    ]
                }
            ],
            "font-slnt": [
                {
                    "font-slnt": [
                        validators.isInteger,
                        validators.isArbitraryNumber
                    ]
                }
            ],
            "font-ital": [
                {
                    "font-ital": [
                        validators.isNumber,
                        validators.isArbitraryNumber
                    ]
                }
            ],
            "font-rond": [
                {
                    "font-rond": [
                        validators.isInteger,
                        validators.isArbitraryNumber
                    ]
                }
            ],
            "font-grad": [
                {
                    "font-grad": [
                        validators.isInteger,
                        validators.isArbitraryNumber
                    ]
                }
            ],
            "outline-offset": ["outline-offset-px"],
            "scrollbar-width": [
                "scrollbar-auto",
                "scrollbar-thin",
                "scrollbar-none"
            ],
            transition: ["transition-normal", "transition-discrete"],
            ease: ["ease-spring"],
            /** @see {@link https://github.com/dcastil/tailwind-merge/blob/v2.6.1/docs/api-reference.md#validators} */
            "bg-clip": [{ "bg-clip": [validators.isArbitraryValue] }],
            duration: [{ duration: [validators.isNumber] }],
            mask: [
                {
                    mask: [
                        "add",
                        "subtract",
                        "intersect",
                        "exclude",
                        validators.isArbitraryValue
                    ]
                }
            ]
        },
        theme: {
            /** @see https://github.com/dcastil/tailwind-merge/blob/v2.6.1/docs/configuration.md#theme */
            spacing: ["inherit"],
            borderRadius: ["inherit"],
            transitionBehavior: ["normal", "discrete"],
            borderWidth: ["media"]
        }
    }
})

export function cn(...inputs: ClassValue[]) {
    return twMerge(twg(inputs))
}
