import {
    CONSECUTIVE_HYPHENS_REGEX,
    DIACRITICS_REGEX,
    LEADING_HYPHENS_REGEX,
    NON_WORD_CHARACTERS_REGEX,
    SPACES_UNDERSCORES_DOTS_REGEX,
    TRAILING_HYPHENS_REGEX,
    VIETNAMESE_D_REGEX
} from "@/helpers/character-regexes"

/**
 * Slugify a string
 *
 * @param {string} str Input string
 * @returns {string} Slugified string
 */
export function slugify(str: string): string {
    if (!str) return ""

    return str
        .toLowerCase()
        .trim()
        .normalize("NFD") // Separate combined characters (e.g., 'á' -> 'a' + '´')
        .replaceAll(DIACRITICS_REGEX, "")
        .replaceAll(VIETNAMESE_D_REGEX, "d")
        .replaceAll(SPACES_UNDERSCORES_DOTS_REGEX, "-")
        .replaceAll(NON_WORD_CHARACTERS_REGEX, "")
        .replaceAll(CONSECUTIVE_HYPHENS_REGEX, "-")
        .replace(LEADING_HYPHENS_REGEX, "")
        .replace(TRAILING_HYPHENS_REGEX, "")
}
