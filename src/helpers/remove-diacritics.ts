import {
    DIACRITICS_REGEX,
    VIETNAMESE_D_LOWERCASE_REGEX,
    VIETNAMESE_D_UPPERCASE_REGEX
} from "@/helpers/character-regexes"

/**
 * Normalizes a string by removing Vietnamese diacritics and converting special
 * characters. Ensures the output string length perfectly matches the input
 * string length for precise index mapping.
 *
 * @param {string} str - The original string with diacritics.
 * @returns {string} The normalized string without diacritics.
 */
export function removeDiacritics(str: string): string {
    return str
        .normalize("NFD")
        .replace(DIACRITICS_REGEX, "")
        .replace(VIETNAMESE_D_LOWERCASE_REGEX, "d")
        .replace(VIETNAMESE_D_UPPERCASE_REGEX, "D")
}
