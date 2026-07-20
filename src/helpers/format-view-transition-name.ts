const DIACRITICS_REGEX = /[\u0300-\u036f]/gu
const VIETNAMESE_D_REGEX = /[đĐ]/gu
const NON_ALPHANUMERIC_REGEX = /[^a-zA-Z0-9]/gu
const CONSECUTIVE_HYPHENS_REGEX = /-+/gu
const LEADING_TRAILING_HYPHENS_REGEX = /^-|-$/gu

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
