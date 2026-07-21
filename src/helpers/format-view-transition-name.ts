import {
    CONSECUTIVE_HYPHENS_REGEX,
    DIACRITICS_REGEX,
    LEADING_TRAILING_HYPHENS_REGEX,
    NON_ALPHANUMERIC_REGEX,
    VIETNAMESE_D_REGEX
} from "@/helpers/character-regexes"

export function formatViewTransitionName(value: string): string {
    return value
        .normalize("NFD")
        .replace(DIACRITICS_REGEX, "")
        .replaceAll(VIETNAMESE_D_REGEX, "d")
        .replace(NON_ALPHANUMERIC_REGEX, "-")
        .replace(CONSECUTIVE_HYPHENS_REGEX, "-")
        .replace(LEADING_TRAILING_HYPHENS_REGEX, "")
        .toLowerCase()
}
