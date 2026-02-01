import imageManifestRaw from "@/lib/image-manifest.json"
import { cn } from "@/lib/utils"
import { GRID_COLS, GRID_ROWS } from "@/scripts/process-images"

const imageManifest = imageManifestRaw as Record<
    string,
    { width: number; height: number }
>

function Image({
    src,
    alt,
    className,
    placeholderPriority = false,
    asBackgroundImage = false,
    objectFit = "cover"
}: React.ComponentProps<"img"> & {
    src: string
    placeholderPriority?: boolean
    asBackgroundImage?: boolean
    objectFit?: "fill" | "contain" | "cover" | "none" | "scale-down"
}) {
    const normalizedSrc = src.startsWith("/") ? src.slice(1) : src
    const metadata = imageManifest[normalizedSrc.replace(/\.[^/.]+$/, "")]

    // Parse path
    const lastDotIndex = src.lastIndexOf(".")
    const pathWithoutExt = src.substring(0, lastDotIndex)
    const fileName = src.substring(src.lastIndexOf("/") + 1, lastDotIndex)
    const basePath = `/assets/images${pathWithoutExt}`

    const ROWS = GRID_ROWS
    const COLS = GRID_COLS

    return (
        // Represent <img> tag or background-image property
        <div
            className={cn(
                "bg-background relative grid size-full place-items-center overflow-clip",
                "after:outline-inverted/8 after:-outline-offset-px after:rounded-inherit after:pointer-events-none after:absolute after:inset-0 after:outline",
                className
            )}
        >
            {/* Represent image from `src` attribute or url() function */}
            <div
                className={cn(
                    "max-h-inherit max-w-inherit grid grid-cols-3 grid-rows-3 select-none",
                    asBackgroundImage && "absolute",
                    objectFit === "fill" && "size-full",
                    objectFit === "contain" &&
                        "size-auto max-h-full max-w-full",
                    objectFit === "cover" && "size-auto min-h-full min-w-full"
                )}
                style={{
                    aspectRatio: `${metadata.width.toString()}/${metadata.height.toString()}`
                }}
            >
                {/* SEO & Preview Layer */}
                <img
                    src={`${basePath}/${fileName}_preview.webp`}
                    alt={alt}
                    className="absolute inset-0 -z-10 size-full object-cover"
                    loading={placeholderPriority ? "eager" : "lazy"}
                />
                <noscript>
                    <img
                        src={`${basePath}/${fileName}_preview.webp`}
                        alt={alt}
                        decoding="async"
                    />
                </noscript>

                {Array.from({ length: ROWS * COLS }).map((_, index) => {
                    const r = Math.floor(index / COLS)
                    const c = index % COLS
                    const position = `${(r + 1).toString()}-${(c + 1).toString()}`

                    return (
                        <img
                            key={position}
                            src={`${basePath}/${fileName}_${position}.webp`}
                            alt=""
                            decoding="async"
                            draggable={false}
                            loading="lazy"
                            role="presentation"
                            className="size-full"
                        />
                    )
                })}
            </div>
        </div>
    )
}

export { Image }
