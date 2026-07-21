import { Fragment } from "react"

import {
    DIGIT_REGEX,
    ORDINAL_AFTER_DIGIT_REGEX,
    ORDINAL_START_OR_AFTER_DIGIT_REGEX
} from "@/helpers/character-regexes"
import { removeDiacritics } from "@/helpers/remove-diacritics"
import { cn } from "@/lib/utils"

/**
 * Parses a string segment and formats English ordinal suffixes (st, nd, rd, th)
 * by wrapping them in HTML `<sup>` tags.
 *
 * The regex applied depends on whether the segment immediately follows a digit
 * from a previous segment, preventing improper wrapping of letters in normal
 * words.
 *
 * @param {string} string - The text segment to process.
 * @param {boolean} isAfterDigit - Indicates if the preceding character in the
 *   full text was a number.
 * @returns {React.ReactNode} The original string, or an array of strings and
 *   `<sup>` elements.
 */
function formatHighlightedOrdinals(
    string: string,
    isAfterDigit: boolean
): React.ReactNode {
    const ordinalRegex = isAfterDigit
        ? ORDINAL_START_OR_AFTER_DIGIT_REGEX
        : ORDINAL_AFTER_DIGIT_REGEX
    const segments = string.split(ordinalRegex)

    if (segments.length === 1) return string

    return segments.map((seg, index) => {
        if (index % 2 === 1) return <sup key={`sup-${index}`}>{seg}</sup>
        return seg
    })
}

const ESCAPE_REGEX = /[.*+?^${}()|[\]\\]/gu

/**
 * Splits `text` into segments and wraps each match of `query` in a highlighted
 * `<mark>` span. Case-insensitive, TRULY diacritic-aware. Formats ordinal
 * suffixes (st, nd, rd, th) into `<sup>`.
 *
 * @param {string} text - Text to highlight
 * @param {string} query - Query to highlight
 * @returns {React.ReactNode | null} - React node with highlighted query or
 *   `null` if the query is empty or there is no match.
 */
function highlightQuery(text: string, query: string): React.ReactNode | null {
    const trimmedQuery = query.trim()
    if (!trimmedQuery) return null

    const normalizedText = removeDiacritics(text)
    const normalizedQuery = removeDiacritics(trimmedQuery)

    const escaped = normalizedQuery.replace(ESCAPE_REGEX, "\\$&")
    const regex = new RegExp(`(${escaped})`, "giu")

    const matches = [...normalizedText.matchAll(regex)]

    if (matches.length === 0) return null

    const parts: { text: string; isMatch: boolean }[] = []
    let lastIndex = 0

    for (const match of matches) {
        const start = match.index
        const end = start + match[0].length

        if (start > lastIndex) {
            parts.push({ text: text.slice(lastIndex, start), isMatch: false })
        }

        parts.push({ text: text.slice(start, end), isMatch: true })
        lastIndex = end
    }

    if (lastIndex < text.length) {
        parts.push({ text: text.slice(lastIndex), isMatch: false })
    }

    return parts.map((part, index) => {
        if (!part.text) return null

        const prevChar = index > 0 ? parts[index - 1].text.slice(-1) : ""
        const isAfterDigit = DIGIT_REGEX.test(prevChar)

        const formattedContent = formatHighlightedOrdinals(
            part.text,
            isAfterDigit
        )

        if (part.isMatch) {
            return (
                <mark
                    key={`mark-${index}`}
                    className={cn(
                        "relative rounded-[2px] bg-transparent text-default",
                        {
                            before: [
                                "absolute inset-0 -z-1 rounded-xs bg-highlighted/20",
                                {
                                    dark: "z-1 bg-highlighted/30",
                                    "has-[sub]": "-bottom-[0.2em]",
                                    "has-[sup]": "-top-[0.2em]"
                                }
                            ]
                        }
                    )}
                >
                    {formattedContent}
                </mark>
            )
        }

        return <Fragment key={`text-${index}`}>{formattedContent}</Fragment>
    })
}

export { highlightQuery }
