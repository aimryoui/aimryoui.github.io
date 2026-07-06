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

function PngAntiBleedWithBorder() {
    return (
        <svg className="absolute size-0" aria-hidden={true}>
            <filter
                id="png-border"
                colorInterpolationFilters="sRGB"
                x="-20%"
                y="-20%"
                width="140%"
                height="140%"
            >
                <feGaussianBlur
                    in="SourceAlpha"
                    stdDeviation="1.0"
                    result="PRE_BLUR"
                />
                <feComponentTransfer in="PRE_BLUR" result="CLEAN_ALPHA">
                    <feFuncA type="linear" slope="10" intercept="-6" />
                </feComponentTransfer>
                <feComposite
                    in="SourceGraphic"
                    in2="CLEAN_ALPHA"
                    operator="in"
                    result="CLEAN_GRAPHIC"
                />

                <feMorphology
                    in="CLEAN_ALPHA"
                    operator="dilate"
                    radius="0.75"
                    result="BORDER_BASE"
                />

                <feGaussianBlur
                    in="BORDER_BASE"
                    stdDeviation="2.0"
                    result="BORDER_BLUR"
                />

                <feComponentTransfer in="BORDER_BLUR" result="PERFECT_BORDER">
                    <feFuncA type="linear" slope="10" intercept="-1.4" />
                </feComponentTransfer>

                <feFlood
                    floodColor="var(--default)"
                    floodOpacity="0.15"
                    result="COLOR"
                />
                <feComposite
                    in="COLOR"
                    in2="PERFECT_BORDER"
                    operator="in"
                    result="OUTLINE"
                />

                <feMerge>
                    <feMergeNode in="OUTLINE" />
                    <feMergeNode in="CLEAN_GRAPHIC" />
                </feMerge>
            </filter>
        </svg>
    )
}

export { PngAntiBleed, PngAntiBleedWithBorder }
