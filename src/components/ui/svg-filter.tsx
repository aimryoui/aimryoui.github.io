function PngBorder() {
    return (
        <svg className="absolute size-0" aria-hidden={true}>
            <filter id="png-border">
                <feMorphology
                    in="SourceAlpha"
                    operator="dilate"
                    radius="1.5"
                    result="DILATED"
                />

                <feGaussianBlur
                    in="DILATED"
                    stdDeviation="0.4"
                    result="BLURRED"
                />

                <feComponentTransfer in="BLURRED" result="SHARP_SMOOTH">
                    <feFuncA type="linear" slope="6" intercept="-2.5" />
                </feComponentTransfer>

                <feFlood
                    floodColor="var(--default)"
                    floodOpacity="0.15"
                    result="COLOR"
                />

                <feComposite
                    in="COLOR"
                    in2="SHARP_SMOOTH"
                    operator="in"
                    result="OUTLINE"
                />

                <feMerge>
                    <feMergeNode in="OUTLINE" />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>
        </svg>
    )
}

function PngAntiBleed() {
    return (
        <svg className="absolute size-0" aria-hidden={true}>
            <filter id="png-anti-bleed" colorInterpolationFilters="sRGB">
                <feMorphology
                    in="SourceAlpha"
                    operator="erode"
                    radius="3"
                    result="DEEP_ERODE"
                />

                <feMorphology
                    in="DEEP_ERODE"
                    operator="dilate"
                    radius="2.5"
                    result="RESTORED_ALPHA"
                />

                <feGaussianBlur
                    in="RESTORED_ALPHA"
                    stdDeviation="0.15"
                    result="BLURRED"
                />

                <feComponentTransfer in="BLURRED" result="SHARP">
                    <feFuncA type="linear" slope="10" intercept="-4.5" />
                </feComponentTransfer>

                <feComposite in="SourceGraphic" in2="SHARP" operator="in" />
            </filter>
        </svg>
    )
}

export { PngAntiBleed, PngBorder }
