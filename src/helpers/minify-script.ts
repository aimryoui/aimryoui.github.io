function minifyScript(script: string) {
    return script
        .split("\n")
        .map((line) => {
            const commentIndex = line.indexOf("//")
            const cleanLine =
                commentIndex === -1 ? line : line.slice(0, commentIndex)
            return cleanLine.trim()
        })
        .filter(Boolean)
        .join("\n")
}

export { minifyScript }
