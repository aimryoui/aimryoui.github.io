const FILE_EXTENSION_REGEX = /\.[^/.]+$/u

interface BaseMediaMetadata {
    width: number
    height: number
}

interface ParsedMediaData<T extends BaseMediaMetadata> {
    metadata: T
    exactW: number
    exactH: number
    aspectRatio: string
    basePath: string
    fileName: string
}

function getParsedMediaData<T extends BaseMediaMetadata>(
    src: string,
    manifest: Record<string, T | undefined>
): ParsedMediaData<T> | null {
    const normalizedSrc = src.startsWith("/") ? src.slice(1) : src
    const metadata = manifest[normalizedSrc.replace(FILE_EXTENSION_REGEX, "")]

    if (!metadata) {
        console.error(`[Image]: No metadata for "${src}" in manifest.`)
        return null
    }

    const exactW = metadata.width
    const exactH = metadata.height
    const aspectRatio = `${exactW.toString()}/${exactH.toString()}`

    const lastDotIndex = src.lastIndexOf(".")
    const pathWithoutExt = src.slice(0, lastDotIndex)
    const fileName = src.slice(src.lastIndexOf("/") + 1, lastDotIndex)
    const basePath = `/assets/media${pathWithoutExt}`

    return { metadata, exactW, exactH, aspectRatio, basePath, fileName }
}

export type { ParsedMediaData }
export { getParsedMediaData }
