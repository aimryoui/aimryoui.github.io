import {
    Layer,
    Line,
    Plus
} from "@/portfolio/[category]/_components/og/og-components"

function CornerBackgroundLayer() {
    return (
        <Layer>
            <div
                tw="absolute start-0 top-0"
                style={{
                    width: "88px",
                    height: "80px",
                    backgroundColor: "var(--background)"
                }}
            />
            <div
                tw="absolute end-0 top-0"
                style={{
                    width: "88px",
                    height: "80px",
                    backgroundColor: "var(--background)"
                }}
            />
            <div
                tw="absolute bottom-0 start-0"
                style={{
                    width: "88px",
                    height: "80px",
                    backgroundColor: "var(--background)"
                }}
            />
            <div
                tw="absolute bottom-0 end-0"
                style={{
                    width: "88px",
                    height: "80px",
                    backgroundColor: "var(--background)"
                }}
            />
            <div
                tw="absolute"
                style={{
                    top: "80px",
                    bottom: "80px",
                    left: "88px",
                    right: "88px",
                    backgroundColor: "var(--background)"
                }}
            />
        </Layer>
    )
}

function LineLayer() {
    return (
        <Layer>
            {/* Horizontal */}
            <Line
                tw="absolute"
                style={{
                    top: "80px",
                    left: "0px",
                    right: "0px"
                }}
            />
            <Line
                tw="absolute"
                style={{
                    bottom: "80px",
                    left: "0px",
                    right: "0px"
                }}
            />
            {/* Vertical */}
            <Line
                orientation="vertical"
                tw="absolute"
                style={{
                    left: "88px",
                    top: "0px",
                    bottom: "0px"
                }}
            />
            <Line
                orientation="vertical"
                tw="absolute"
                style={{
                    right: "88px",
                    top: "0px",
                    bottom: "0px"
                }}
            />
        </Layer>
    )
}

function DecorationLayer() {
    return (
        <Layer>
            {/* Above */}
            <Plus
                tw="absolute"
                style={{
                    top: "80px",
                    left: "88px"
                }}
            />
            <Plus
                tw="absolute"
                style={{
                    top: "80px",
                    right: "88px"
                }}
            />
            {/* Below */}
            <Plus
                tw="absolute"
                style={{
                    bottom: "80px",
                    right: "88px"
                }}
            />
            <Plus
                tw="absolute"
                style={{
                    bottom: "80px",
                    left: "88px"
                }}
            />
        </Layer>
    )
}

function LogoLayer({ color }: { color: string }) {
    return (
        <Layer>
            <div
                tw="absolute flex"
                style={{
                    top: "111px",
                    left: "123px"
                }}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="64"
                    height="61"
                    fill="none"
                    viewBox="0 0 64 61"
                >
                    <path
                        fill={color}
                        d="M54.141 38.253c-4.157-.202-6.236-.303-6.985.979-.748 1.282.373 3.021 2.616 6.5l2.543 3.942c1.312 2.035 1.968 3.053 1.712 4.07s-1.318 1.608-3.441 2.791L45.3 59.481c-2.082 1.16-3.122 1.739-4.12 1.442-.996-.297-1.543-1.35-2.637-3.454l-2.183-4.2c-1.902-3.66-2.853-5.49-4.345-5.492-1.49-.003-2.448 1.825-4.361 5.48l-2.18 4.163c-1.11 2.122-1.666 3.183-2.672 3.474-1.007.29-2.05-.31-4.135-1.508l-5.344-3.073c-2.085-1.2-3.128-1.799-3.374-2.81s.406-2.017 1.71-4.028l2.557-3.946c2.245-3.464 3.368-5.196 2.624-6.479-.743-1.282-2.816-1.191-6.964-1.01l-4.733.208c-2.395.105-3.592.158-4.348-.557s-.76-1.904-.77-4.283l-.023-5.982c-.01-2.4-.014-3.6.745-4.323.76-.722 1.969-.665 4.386-.553l4.717.22c4.14.192 6.209.288 6.956-.99.747-1.28-.366-3.013-2.592-6.48l-2.537-3.953c-1.3-2.025-1.95-3.038-1.696-4.05s1.306-1.606 3.41-2.791l5.278-2.973c2.07-1.166 3.105-1.75 4.101-1.46.997.29 1.55 1.336 2.658 3.426l2.218 4.187c1.916 3.617 2.874 5.426 4.36 5.422 1.484-.004 2.433-1.817 4.33-5.445l2.133-4.08C39.58 1.46 40.135.398 41.142.107s2.05.309 4.136 1.509l5.34 3.07c2.086 1.2 3.13 1.8 3.375 2.811.246 1.012-.406 2.018-1.711 4.03l-2.508 3.864c-2.23 3.436-3.344 5.154-2.609 6.435s2.793 1.206 6.909 1.057l4.788-.172c2.368-.086 3.553-.129 4.301.581s.758 1.885.779 4.237l.052 6.054c.02 2.416.031 3.624-.73 4.35-.763.726-1.98.667-4.411.55z"
                    />
                </svg>
            </div>
        </Layer>
    )
}

export { CornerBackgroundLayer, DecorationLayer, LineLayer, LogoLayer }
