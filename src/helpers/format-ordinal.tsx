const formatOrdinal = (text: string) => {
    if (!text) return ""

    return text.split(/(?<=\d)(st|nd|rd|th)/g).map((part, index) => {
        if (index % 2 === 1) {
            return <sup key={index}>{part}</sup>
        }
        return part
    })
}

export { formatOrdinal }
