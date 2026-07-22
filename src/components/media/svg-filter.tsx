function PngAntiBleed() {
    return (
        <svg aria-hidden={true} className="absolute size-0">
            <filter id="png-anti-bleed" colorInterpolationFilters="sRGB">
                <feGaussianBlur
                    in="SourceAlpha"
                    stdDeviation="1.5"
                    result="SMOOTH_ALPHA"
                />

                <feComponentTransfer in="SMOOTH_ALPHA" result="SHRUNKEN_ALPHA">
                    <feFuncA type="linear" slope="12" intercept="-7" />
                </feComponentTransfer>

                <feComposite
                    in="SourceGraphic"
                    in2="SHRUNKEN_ALPHA"
                    operator="in"
                />
            </filter>
        </svg>
    )
}

function PngBorder() {
    return (
        <svg aria-hidden={true} className="absolute size-0">
            <filter id="png-border" colorInterpolationFilters="sRGB">
                <feOffset in="SourceAlpha" dx="0" dy="-1.5" result="O_N" />
                <feOffset in="SourceAlpha" dx="0" dy="1.5" result="O_S" />
                <feOffset in="SourceAlpha" dx="-1.5" dy="0" result="O_W" />
                <feOffset in="SourceAlpha" dx="1.5" dy="0" result="O_E" />

                <feOffset
                    in="SourceAlpha"
                    dx="-1.06"
                    dy="-1.06"
                    result="O_NW"
                />
                <feOffset in="SourceAlpha" dx="1.06" dy="-1.06" result="O_NE" />
                <feOffset in="SourceAlpha" dx="-1.06" dy="1.06" result="O_SW" />
                <feOffset in="SourceAlpha" dx="1.06" dy="1.06" result="O_SE" />

                <feComposite in="O_N" in2="O_S" operator="in" result="C1" />
                <feComposite in="C1" in2="O_W" operator="in" result="C2" />
                <feComposite in="C2" in2="O_E" operator="in" result="C3" />
                <feComposite in="C3" in2="O_NW" operator="in" result="C4" />
                <feComposite in="C4" in2="O_NE" operator="in" result="C5" />
                <feComposite in="C5" in2="O_SW" operator="in" result="C6" />
                <feComposite
                    in="C6"
                    in2="O_SE"
                    operator="in"
                    result="RAW_CORE"
                />

                <feGaussianBlur
                    in="SourceAlpha"
                    stdDeviation="2"
                    result="BLUR"
                />
                <feComponentTransfer in="BLUR" result="DEEP_INSIDE_MASK">
                    <feFuncA type="linear" slope="20" intercept="-17" />
                </feComponentTransfer>
                <feComposite
                    in="RAW_CORE"
                    in2="DEEP_INSIDE_MASK"
                    operator="over"
                    result="SOLID_CORE"
                />

                <feComponentTransfer in="SOLID_CORE" result="SHARP_CORE">
                    <feFuncA type="linear" slope="8" intercept="-3.5" />
                </feComponentTransfer>

                <feComposite
                    in="SourceAlpha"
                    in2="SHARP_CORE"
                    operator="out"
                    result="INSET_ALPHA"
                />

                <feFlood
                    floodColor="var(--color-svg-filter)"
                    floodOpacity="0.15"
                    result="COLOR"
                />
                <feComposite
                    in="COLOR"
                    in2="INSET_ALPHA"
                    operator="in"
                    result="INSET_BORDER"
                />

                <feMerge>
                    <feMergeNode in="SourceGraphic" />
                    <feMergeNode in="INSET_BORDER" />
                </feMerge>
            </filter>
        </svg>
    )
}

function MetaBall() {
    return (
        <svg aria-hidden={true} className="absolute size-0">
            <defs>
                <filter id="metaball">
                    <feGaussianBlur
                        in="SourceGraphic"
                        stdDeviation="4"
                        result="blur"
                    />
                    <feColorMatrix
                        in="blur"
                        mode="matrix"
                        values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -8"
                        result="goo"
                    />
                    <feComposite in="SourceGraphic" in2="goo" operator="atop" />
                </filter>
            </defs>
        </svg>
    )
}

export { MetaBall, PngAntiBleed, PngBorder }
