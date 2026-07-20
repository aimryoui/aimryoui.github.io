/**
 * Checks if the given href points to the exact same URL as the current window location.
 *
 * @param {string} href - The target URL to check
 * @returns {boolean} True if the href matches the current window location
 */
export function isSameUrl(href: string): boolean {
    if (typeof window === "undefined") return false

    try {
        const targetUrl = new URL(href, window.location.href)
        const targetSearch = targetUrl.search.startsWith("?")
            ? targetUrl.search.slice(1)
            : targetUrl.search

        const currentSearch = window.location.search.startsWith("?")
            ? window.location.search.slice(1)
            : window.location.search

        return (
            window.location.pathname === targetUrl.pathname &&
            currentSearch === targetSearch &&
            window.location.hash === targetUrl.hash
        )
    } catch {
        return false
    }
}
