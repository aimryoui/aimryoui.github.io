import { ORDINAL_AFTER_DIGIT_REGEX } from "@/helpers/character-regexes"

const formatOrdinals = (text: string) => {
    if (!text) return ""

    return text.split(ORDINAL_AFTER_DIGIT_REGEX).map((part, index) => {
        if (index % 2 === 1) {
            return <sup key={`${part}-${index.toString()}`}>{part}</sup>
        }
        return part
    })
}

export { formatOrdinals }
