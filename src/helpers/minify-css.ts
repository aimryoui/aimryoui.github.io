const cache = new Map<string, string>()

const REMOVE_COMMENTS_REGEX = /\/\*[\s\S]*?\*\//gu
const COLLAPSE_WHITESPACE_REGEX = /\s+/gu
const REMOVE_SEPARATOR_SPACES_REGEX = / ?([{};,]) ?/gu

function minifyCss(css: string) {
    if (cache.has(css)) {
        return cache.get(css) ?? ""
    }

    const minified = css
        .replace(REMOVE_COMMENTS_REGEX, "")
        .replace(COLLAPSE_WHITESPACE_REGEX, " ")
        .replace(REMOVE_SEPARATOR_SPACES_REGEX, "$1")
        .trim()

    cache.set(css, minified)
    return minified
}

export { minifyCss }
