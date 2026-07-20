const DIACRITICS_REGEX = /[\u0300-\u036F]/gu // Remove diacritic characters
const VIETNAMESE_D_REGEX = /[đĐ]/gu // Replace đ and Đ with d
const SPACES_UNDERSCORES_DOTS_REGEX = /[\s_.]+/gu // Replace spaces, underscores, and dots with hyphens
const NON_WORD_CHARS_REGEX = /[^\w-]+/gu // Remove all characters that are not letters, numbers, or hyphens
const CONSECUTIVE_HYPHENS_REGEX = /--+/gu // Replace multiple consecutive hyphens with one
const LEADING_HYPHENS_REGEX = /^-+/u // Remove leading hyphens
const TRAILING_HYPHENS_REGEX = /-+$/u // Remove trailing hyphens

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
        .replaceAll(NON_WORD_CHARS_REGEX, "")
        .replaceAll(CONSECUTIVE_HYPHENS_REGEX, "-")
        .replace(LEADING_HYPHENS_REGEX, "")
        .replace(TRAILING_HYPHENS_REGEX, "")
}
