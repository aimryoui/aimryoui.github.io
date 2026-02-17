/**
 * CSS Grid Lanes Polyfill (TypeScript Version)
 *
 * Polyfills the new `display: grid-lanes` CSS feature for browsers that don't
 * support it natively. Based on the WebKit implementation described at:
 * https://webkit.org/blog/17660/introducing-css-grid-lanes/
 *
 * Features supported:
 *
 * - Display: grid-lanes
 * - Grid-template-columns / grid-template-rows for lane definition
 * - Gap, column-gap, row-gap
 * - Flow-tolerance for placement sensitivity
 * - Spanning items (grid-column: span N)
 * - Explicit placement (grid-column: N / M)
 * - Responsive auto-fill/auto-fit with minmax()
 * - Both waterfall (columns) and brick (rows) layouts
 *
 * Features that do not work:
 *
 * - Fr units with grid-template-rows
 *
 * Usage:
 *
 * 1. Initialize the polyfill after DOM load and only if native support is missing:
 *
 * Document.addEventListener("DOMContentLoaded", () => { if
 * (!GridLanesPolyfill.supportsGridLanes()) { GridLanesPolyfill.init({ force:
 * true }); } }); 2. In your CSS, you MUST include the following custom property
 * on any element using `display: grid-lanes`:
 *
 * --grid-lanes-polyfill: 1;
 *
 * This is required because browsers strip unknown properties and values
 * (including `display: grid-lanes`) during CSS parsing. The polyfill uses this
 * custom property as a hook to detect and process affected elements.
 *
 * @license MIT
 * @version 1.2.0
 * @author Simon Willison
 * @author ninjamar
 * @author hoangnhan2ka3
 */

interface GridLanesOptions {
    force?: boolean
}

interface MinMax {
    min: string
    max: string
}

interface Repeat {
    count: string
    pattern: string
}

interface FrValue {
    fr: number
}

type LaneMax = number | FrValue

interface LaneDef {
    min: number
    max: LaneMax
    size: number
}

interface ParsedStyles {
    gridTemplateColumns: string
    gridTemplateRows: string
    columnGap: number
    rowGap: number
    fontSize: number
    rootFontSize: number
    tolerance: number
}

interface ItemStyles {
    columnSpan: number
    columnStart: number | null
    columnEnd: number | null
    rowSpan: number
    rowStart: number | null
    rowEnd: number | null
}

interface ItemRecord {
    element: HTMLElement
    styles: ItemStyles
}

interface InitResult {
    supported: boolean
    instances: Map<HTMLElement, GridLanesLayout> | never[]
    observer?: MutationObserver
    refresh?: () => void
    destroy?: () => void
}

// const POLYFILL_NAME = "GridLanesPolyfill"
const POLYFILL_ATTR = "data-grid-lanes-polyfilled"
const DEFAULT_TOLERANCE = 16 // ~1em in pixels

// Store parsed CSS rules for grid-lanes containers
const parsedGridLanesRules = new Map<HTMLElement, Record<string, string>>()

/** Check if the browser natively supports display: grid-lanes */
function supportsGridLanes(): boolean {
    if (typeof CSS === "undefined" || typeof CSS.supports !== "function") {
        return false
    }
    return CSS.supports("display", "grid-lanes")
}

/** Recursively resolve CSS var() functions Helps JS read variables */
function resolveCSSVariables(
    value: string,
    computed: CSSStyleDeclaration
): string {
    if (!value.includes("var(")) return value

    let result = value
    const innerVarRegex = /var\(\s*(--[\w-]+)\s*(?:,\s*([^()]+))?\s*\)/g

    let maxDepth = 10
    while (result.includes("var(") && maxDepth > 0) {
        const previous = result
        result = result.replace(
            innerVarRegex,
            (_, varName: string, fallback: string | undefined) => {
                const val = computed.getPropertyValue(varName).trim()
                if (val) return val
                if (fallback !== undefined) return fallback.trim()
                return ""
            }
        )
        if (previous === result) break
        maxDepth--
    }

    return result
}

/** Parse a CSS length value to pixels */
function parseLengthToPixels(
    value: string | undefined | null,
    containerSize: number,
    fontSize = 16,
    rootFontSize = 16
): number | null {
    if (!value || value === "auto" || value === "none") return null

    const num = parseFloat(value)
    if (isNaN(num)) return null

    if (value.endsWith("px")) return num
    if (value.endsWith("rem")) return num * rootFontSize
    if (value.endsWith("em")) return num * fontSize
    if (value.endsWith("ch")) return num * fontSize * 0.5
    if (value.endsWith("lh")) return num * fontSize * 1.2
    if (value.endsWith("%")) return (num / 100) * containerSize
    if (value.endsWith("vw")) return (num / 100) * window.innerWidth
    if (value.endsWith("vh")) return (num / 100) * window.innerHeight
    if (value.endsWith("vmin"))
        return (num / 100) * Math.min(window.innerWidth, window.innerHeight)
    if (value.endsWith("vmax"))
        return (num / 100) * Math.max(window.innerWidth, window.innerHeight)
    if (value.endsWith("fr")) return null

    if (!isNaN(num) && value === String(num)) return num

    return null
}

/** Parse minmax() function */
function parseMinMax(value: string): MinMax | null {
    const match = /minmax\(\s*([^,]+)\s*,\s*([^)]+)\s*\)/.exec(value)
    if (!match || match.length < 3) return null
    return {
        min: match[1].trim(),

        max: match[2].trim()
    }
}

/** Parse repeat() function */
function parseRepeat(value: string): Repeat | null {
    const match = /repeat\(\s*([^,]+)\s*,\s*(.+)\s*\)/.exec(value)
    if (!match || match.length < 3) return null
    return {
        count: match[1].trim(),

        pattern: match[2].trim()
    }
}

/** Tokenize a grid template string */
function tokenizeTemplate(template: string): string[] {
    const tokens: string[] = []
    let current = ""
    let parenDepth = 0

    for (const char of template) {
        if (char === "(") {
            parenDepth++
            current += char
        } else if (char === ")") {
            parenDepth--
            current += char
        } else if (char === " " && parenDepth === 0) {
            if (current.trim()) {
                tokens.push(current.trim())
            }
            current = ""
        } else {
            current += char
        }
    }

    if (current.trim()) {
        tokens.push(current.trim())
    }

    return tokens
}

/** Calculate lane sizes from grid-template-columns/rows */
function calculateLaneSizes(
    template: string,
    containerSize: number,
    gap: number,
    fontSize: number,
    rootFontSize: number
): number[] | null {
    if (!template || template === "none" || template === "auto") {
        return null
    }

    const availableSpace = containerSize
    const lanes: LaneDef[] = []
    let totalFr = 0
    let fixedSpace = 0

    // Parse the template
    const tokens = tokenizeTemplate(template)

    for (const token of tokens) {
        // Handle repeat()
        const repeatInfo = parseRepeat(token)
        if (repeatInfo) {
            const { count, pattern } = repeatInfo
            const patternTokens = tokenizeTemplate(pattern)

            if (count === "auto-fill" || count === "auto-fit") {
                // Calculate how many repetitions fit
                let minSize = 0

                for (const pt of patternTokens) {
                    const minmax = parseMinMax(pt)
                    if (minmax) {
                        const minVal = parseLengthToPixels(
                            minmax.min,
                            containerSize,
                            fontSize,
                            rootFontSize
                        )
                        if (
                            minmax.min === "max-content" ||
                            minmax.min === "min-content"
                        ) {
                            minSize += 100 // Fallback estimate
                        } else if (minVal !== null) {
                            minSize += minVal
                        }
                    } else {
                        const size = parseLengthToPixels(
                            pt,
                            containerSize,
                            fontSize,
                            rootFontSize
                        )
                        if (size !== null) {
                            minSize += size
                        } else if (pt.endsWith("fr")) {
                            minSize += 100 // Minimum fallback for fr units
                        }
                    }
                }

                // Calculate repetitions
                const patternCount = patternTokens.length
                const gapCount = patternCount - 1
                const minPatternSize = minSize + gapCount * gap

                const reps = Math.max(
                    1,
                    Math.floor((availableSpace + gap) / (minPatternSize + gap))
                )

                // Expand pattern
                for (let i = 0; i < reps; i++) {
                    for (const pt of patternTokens) {
                        const minmax = parseMinMax(pt)
                        if (minmax) {
                            const minVal = parseLengthToPixels(
                                minmax.min,
                                containerSize,
                                fontSize,
                                rootFontSize
                            )
                            const maxVal: LaneMax = minmax.max.endsWith("fr")
                                ? { fr: parseFloat(minmax.max) }
                                : (parseLengthToPixels(
                                      minmax.max,
                                      containerSize,
                                      fontSize,
                                      rootFontSize
                                  ) ?? 0)

                            lanes.push({
                                min: minVal ?? 0,
                                max: maxVal,
                                size: 0
                            })

                            if (typeof maxVal === "object" && maxVal.fr) {
                                totalFr += maxVal.fr
                            }
                            fixedSpace += minVal ?? 0
                        } else if (pt.endsWith("fr")) {
                            const fr = parseFloat(pt)
                            lanes.push({ min: 0, max: { fr }, size: 0 })
                            totalFr += fr
                        } else {
                            const size =
                                parseLengthToPixels(
                                    pt,
                                    containerSize,
                                    fontSize,
                                    rootFontSize
                                ) ?? 0
                            lanes.push({ min: size, max: size, size })
                            fixedSpace += size
                        }
                    }
                }
            } else {
                // Fixed repeat count
                const reps = parseInt(count, 10)
                for (let i = 0; i < reps; i++) {
                    for (const pt of patternTokens) {
                        const minmax = parseMinMax(pt)

                        if (minmax) {
                            const minVal = parseLengthToPixels(
                                minmax.min,
                                containerSize,
                                fontSize,
                                rootFontSize
                            )
                            const maxVal: LaneMax = minmax.max.endsWith("fr")
                                ? { fr: parseFloat(minmax.max) }
                                : (parseLengthToPixels(
                                      minmax.max,
                                      containerSize,
                                      fontSize,
                                      rootFontSize
                                  ) ?? 0)

                            lanes.push({
                                min: minVal ?? 0,
                                max: maxVal,
                                size: 0
                            })

                            if (typeof maxVal === "object" && maxVal.fr) {
                                totalFr += maxVal.fr
                            }
                            fixedSpace += minVal ?? 0
                        } else if (pt.endsWith("fr")) {
                            const fr = parseFloat(pt)
                            lanes.push({ min: 0, max: { fr }, size: 0 })
                            totalFr += fr
                        } else {
                            const size =
                                parseLengthToPixels(
                                    pt,
                                    containerSize,
                                    fontSize,
                                    rootFontSize
                                ) ?? 0
                            lanes.push({ min: size, max: size, size })
                            fixedSpace += size
                        }
                    }
                }
            }
            continue
        }

        // Handle minmax()
        const minmax = parseMinMax(token)
        if (minmax) {
            const minVal = parseLengthToPixels(
                minmax.min,
                containerSize,
                fontSize,
                rootFontSize
            )
            const maxVal: LaneMax = minmax.max.endsWith("fr")
                ? { fr: parseFloat(minmax.max) }
                : (parseLengthToPixels(
                      minmax.max,
                      containerSize,
                      fontSize,
                      rootFontSize
                  ) ?? 0)

            lanes.push({ min: minVal ?? 0, max: maxVal, size: 0 })
            if (typeof maxVal === "object" && maxVal.fr) {
                totalFr += maxVal.fr
            }
            fixedSpace += minVal ?? 0
            continue
        }

        // Handle fr units
        if (token.endsWith("fr")) {
            const fr = parseFloat(token)
            lanes.push({ min: 0, max: { fr }, size: 0 })
            totalFr += fr
            continue
        }

        // Handle fixed sizes
        const size = parseLengthToPixels(
            token,
            containerSize,
            fontSize,
            rootFontSize
        )
        if (size !== null) {
            lanes.push({ min: size, max: size, size })
            fixedSpace += size
        }
    }

    // Calculate final sizes
    const totalGaps = Math.max(0, lanes.length - 1) * gap
    const flexSpace = Math.max(0, availableSpace - fixedSpace - totalGaps)
    const frUnit = totalFr > 0 ? flexSpace / totalFr : 0

    for (const lane of lanes) {
        if (typeof lane.max === "object" && lane.max.fr) {
            lane.size = Math.max(lane.min, frUnit * lane.max.fr)
        } else if (typeof lane.max === "number") {
            lane.size = Math.min(lane.max, Math.max(lane.min, lane.min))
        } else {
            lane.size = lane.min
        }
    }

    return lanes.map((l) => l.size)
}

/** Get computed styles for grid-lanes properties */
function getGridLanesStyles(element: HTMLElement): ParsedStyles {
    const computed = window.getComputedStyle(element)

    const parsedFs = parseFloat(computed.fontSize)
    const fontSize = Number.isNaN(parsedFs) ? 16 : parsedFs

    const parsedRootFs = parseFloat(
        window.getComputedStyle(document.documentElement).fontSize
    )
    const rootFontSize = Number.isNaN(parsedRootFs) ? 16 : parsedRootFs

    // Get parsed CSS rules for this element (from raw CSS parsing)
    const parsedRules = parsedGridLanesRules.get(element) ?? {}

    // Resolve variables for gap
    const gapRaw = parsedRules.gap || computed.gap || "0px"
    const gap = resolveCSSVariables(gapRaw, computed)

    const columnGapRaw = parsedRules["column-gap"] || computed.columnGap || gap
    let columnGap = resolveCSSVariables(columnGapRaw, computed)

    const rowGapRaw = parsedRules["row-gap"] || computed.rowGap || gap
    let rowGap = resolveCSSVariables(rowGapRaw, computed)

    // Handle combined gap values like "24px 16px"
    if (gap.includes(" ")) {
        const parts = gap.split(/\s+/)
        const rg = parts[0]
        const cg = parts[1]
        if (rg && !parsedRules["row-gap"])
            rowGap = resolveCSSVariables(rg, computed)
        if (cg && !parsedRules["column-gap"])
            columnGap = resolveCSSVariables(cg, computed)
    }

    // Parse flow-tolerance with CSS Variable Resolution
    let tolerance = DEFAULT_TOLERANCE
    const toleranceValueRaw =
        parsedRules["--flow-tolerance"] ||
        computed.getPropertyValue("--flow-tolerance").trim() ||
        computed.getPropertyValue("flow-tolerance").trim()

    const toleranceValue = resolveCSSVariables(toleranceValueRaw, computed)

    if (toleranceValue) {
        const parsed = parseLengthToPixels(
            toleranceValue,
            0,
            fontSize,
            rootFontSize
        )
        if (parsed !== null) tolerance = parsed
    }

    // Get grid template and resolve possible tailwind variables
    const gridTemplateColumns = resolveCSSVariables(
        parsedRules["grid-template-columns"] || computed.gridTemplateColumns,
        computed
    )
    const gridTemplateRows = resolveCSSVariables(
        parsedRules["grid-template-rows"] || computed.gridTemplateRows,
        computed
    )

    return {
        gridTemplateColumns,
        gridTemplateRows,
        columnGap:
            parseLengthToPixels(
                columnGap.split(" ")[0],
                0,
                fontSize,
                rootFontSize
            ) ?? 0,
        rowGap:
            parseLengthToPixels(
                rowGap.split(" ")[0],
                0,
                fontSize,
                rootFontSize
            ) ?? 0,
        fontSize,
        rootFontSize,
        tolerance
    }
}

/** Get item placement properties */
function getItemStyles(element: HTMLElement): ItemStyles {
    const computed = window.getComputedStyle(element)
    const gridColumn = computed.gridColumn || computed.gridColumnStart
    const gridRow = computed.gridRow || computed.gridRowStart

    let columnSpan = 1
    let columnStart: number | null = null
    let columnEnd: number | null = null
    let rowSpan = 1
    let rowStart: number | null = null
    let rowEnd: number | null = null

    // Parse grid-column
    if (gridColumn && gridColumn !== "auto") {
        const spanMatch = /span\s+(\d+)/.exec(gridColumn)
        if (spanMatch?.[1]) {
            columnSpan = parseInt(spanMatch[1], 10)
        } else if (gridColumn.includes("/")) {
            const parts = gridColumn.split("/").map((s) => s.trim())
            columnStart = parseInt(parts[0] ?? "", 10)
            columnEnd = parseInt(parts[1] ?? "", 10)
            if (!isNaN(columnStart) && !isNaN(columnEnd)) {
                columnSpan = Math.abs(columnEnd - columnStart)
            }
        } else {
            const num = parseInt(gridColumn, 10)
            if (!isNaN(num)) {
                columnStart = num
            }
        }
    }

    // Parse grid-row
    if (gridRow && gridRow !== "auto") {
        const spanMatch = /span\s+(\d+)/.exec(gridRow)
        if (spanMatch?.[1]) {
            rowSpan = parseInt(spanMatch[1], 10)
        } else if (gridRow.includes("/")) {
            const parts = gridRow.split("/").map((s) => s.trim())
            rowStart = parseInt(parts[0] ?? "", 10)
            rowEnd = parseInt(parts[1] ?? "", 10)
            if (!isNaN(rowStart) && !isNaN(rowEnd)) {
                rowSpan = Math.abs(rowEnd - rowStart)
            }
        } else {
            const num = parseInt(gridRow, 10)
            if (!isNaN(num)) {
                rowStart = num
            }
        }
    }

    return {
        columnSpan,
        columnStart,
        columnEnd,
        rowSpan,
        rowStart,
        rowEnd
    }
}

/** Main Grid Lanes layout class */
class GridLanesLayout {
    container: HTMLElement
    options: GridLanesOptions
    isVertical = true
    lanes: number[] = []
    laneHeights: number[] = []
    resizeObserver: ResizeObserver | null = null
    mutationObserver: MutationObserver | null = null

    constructor(container: HTMLElement, options: GridLanesOptions = {}) {
        this.container = container
        this.options = options
        this.init()
    }

    init() {
        // Mark as polyfilled
        this.container.setAttribute(POLYFILL_ATTR, "true")

        // Set up container styles
        this.container.style.position = "relative"
        this.container.style.display = "block"

        // Initial layout
        this.layout()

        // Set up observers
        this.setupObservers()
    }

    setupObservers() {
        let layoutTimeout: NodeJS.Timeout | null = null
        const debouncedLayout = () => {
            if (layoutTimeout) clearTimeout(layoutTimeout)
            layoutTimeout = setTimeout(() => {
                this.layout()
            }, 16)
        }

        this.resizeObserver = new ResizeObserver((entries) => {
            for (const entry of entries) {
                if (
                    entry.target === this.container ||
                    entry.target.parentElement === this.container
                ) {
                    debouncedLayout()
                    break
                }
            }
        })
        this.resizeObserver.observe(this.container)

        for (const child of Array.from(this.container.children)) {
            if (child.nodeType === Node.ELEMENT_NODE) {
                this.resizeObserver.observe(child)
            }
        }

        this.mutationObserver = new MutationObserver((mutations) => {
            let shouldRelayout = false
            for (const mutation of mutations) {
                if (mutation.type === "childList") {
                    for (const node of Array.from(mutation.addedNodes)) {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            this.resizeObserver?.observe(node as Element)
                            this.observeImages(node as HTMLElement)
                        }
                    }
                    shouldRelayout = true
                } else if (
                    mutation.type === "attributes" &&
                    (mutation.attributeName === "style" ||
                        mutation.attributeName === "class")
                ) {
                    shouldRelayout = true
                }
            }
            if (shouldRelayout) {
                debouncedLayout()
            }
        })
        this.mutationObserver.observe(this.container, {
            childList: true,
            subtree: false,
            attributes: true,
            attributeFilter: ["style", "class"]
        })

        this.observeImages(this.container)
    }

    observeImages(root: HTMLElement) {
        const images = root.querySelectorAll("img")
        for (const img of Array.from(images)) {
            if (!img.complete) {
                img.addEventListener(
                    "load",
                    () => {
                        this.layout()
                    },
                    { once: true }
                )
                img.addEventListener(
                    "error",
                    () => {
                        this.layout()
                    },
                    { once: true }
                )
            }
        }
    }

    layout() {
        const styles = getGridLanesStyles(this.container)
        const containerRect = this.container.getBoundingClientRect()

        const hasColumns =
            styles.gridTemplateColumns &&
            styles.gridTemplateColumns !== "none" &&
            !styles.gridTemplateColumns.startsWith("auto")
        const hasRows =
            styles.gridTemplateRows &&
            styles.gridTemplateRows !== "none" &&
            !styles.gridTemplateRows.startsWith("auto")

        this.isVertical = hasColumns || !hasRows

        if (this.isVertical) {
            const calculated = calculateLaneSizes(
                styles.gridTemplateColumns,
                containerRect.width,
                styles.columnGap,
                styles.fontSize,
                styles.rootFontSize
            )
            this.lanes = calculated ?? [containerRect.width]
        } else {
            const calculated = calculateLaneSizes(
                styles.gridTemplateRows,
                containerRect.height,
                styles.rowGap,
                styles.fontSize,
                styles.rootFontSize
            )
            this.lanes = calculated ?? [containerRect.height]
        }

        this.laneHeights = Array.from({ length: this.lanes.length }, () => 0)

        const items = Array.from(this.container.children).filter(
            (el) =>
                el.nodeType === Node.ELEMENT_NODE &&
                window.getComputedStyle(el).display !== "none"
        ) as HTMLElement[]

        const explicitItems: ItemRecord[] = []
        const autoItems: ItemRecord[] = []

        for (const item of items) {
            const itemStyles = getItemStyles(item)
            if (this.isVertical && itemStyles.columnStart !== null) {
                explicitItems.push({ element: item, styles: itemStyles })
            } else if (!this.isVertical && itemStyles.rowStart !== null) {
                explicitItems.push({ element: item, styles: itemStyles })
            } else {
                autoItems.push({ element: item, styles: itemStyles })
            }
        }

        for (const { element, styles: itemStyles } of explicitItems) {
            this.placeExplicitItem(element, itemStyles, styles)
        }

        for (const { element, styles: itemStyles } of autoItems) {
            this.placeAutoItem(element, itemStyles, styles)
        }

        const containerHeight = Math.max(...this.laneHeights, 0)
        this.container.style.minHeight = containerHeight.toString() + "px"
    }

    placeExplicitItem(
        element: HTMLElement,
        itemStyles: ItemStyles,
        containerStyles: ParsedStyles
    ) {
        const gap = this.isVertical
            ? containerStyles.columnGap
            : containerStyles.rowGap
        const crossGap = this.isVertical
            ? containerStyles.rowGap
            : containerStyles.columnGap

        let laneIndex: number
        let span: number

        if (this.isVertical) {
            laneIndex = itemStyles.columnStart ?? 0
            if (laneIndex < 0) {
                laneIndex = this.lanes.length + laneIndex + 1
            }
            laneIndex = Math.max(
                0,
                Math.min(laneIndex - 1, this.lanes.length - 1)
            )
            span = itemStyles.columnSpan
        } else {
            laneIndex = itemStyles.rowStart ?? 0
            if (laneIndex < 0) {
                laneIndex = this.lanes.length + laneIndex + 1
            }
            laneIndex = Math.max(
                0,
                Math.min(laneIndex - 1, this.lanes.length - 1)
            )
            span = itemStyles.rowSpan
        }

        let position = 0
        for (let i = 0; i < laneIndex; i++) {
            position += (this.lanes[i] ?? 0) + gap
        }

        let size = 0
        const endLane = Math.min(laneIndex + span, this.lanes.length)
        for (let i = laneIndex; i < endLane; i++) {
            size += this.lanes[i] ?? 0
            if (i < endLane - 1) size += gap
        }

        let maxHeight = 0
        for (let i = laneIndex; i < endLane; i++) {
            maxHeight = Math.max(maxHeight, this.laneHeights[i] ?? 0)
        }

        element.style.position = "absolute"

        if (this.isVertical) {
            element.style.left = position.toString() + "px"
            element.style.top =
                (maxHeight > 0 ? maxHeight + crossGap : 0).toString() + "px"
            element.style.width = size.toString() + "px"
            element.style.height = ""
        } else {
            element.style.top = position.toString() + "px"
            element.style.left =
                (maxHeight > 0 ? maxHeight + crossGap : 0).toString() + "px"
            element.style.height = size.toString() + "px"
            element.style.width = ""
        }

        const itemRect = element.getBoundingClientRect()
        const itemSize = this.isVertical ? itemRect.height : itemRect.width
        const newHeight = maxHeight + (maxHeight > 0 ? crossGap : 0) + itemSize

        for (let i = laneIndex; i < endLane; i++) {
            this.laneHeights[i] = newHeight
        }
    }

    placeAutoItem(
        element: HTMLElement,
        itemStyles: ItemStyles,
        containerStyles: ParsedStyles
    ) {
        const gap = this.isVertical
            ? containerStyles.columnGap
            : containerStyles.rowGap
        const crossGap = this.isVertical
            ? containerStyles.rowGap
            : containerStyles.columnGap
        const tolerance = containerStyles.tolerance
        const span = this.isVertical
            ? itemStyles.columnSpan
            : itemStyles.rowSpan

        let bestLane = 0
        let bestHeight = Infinity

        for (let i = 0; i <= this.lanes.length - span; i++) {
            let maxHeight = 0
            for (let j = i; j < i + span; j++) {
                maxHeight = Math.max(maxHeight, this.laneHeights[j] ?? 0)
            }

            if (bestHeight - maxHeight > tolerance) {
                bestHeight = maxHeight
                bestLane = i
            } else if (
                Math.abs(maxHeight - bestHeight) <= tolerance &&
                i < bestLane
            ) {
                bestHeight = maxHeight
                bestLane = i
            }
        }

        let position = 0
        for (let i = 0; i < bestLane; i++) {
            position += (this.lanes[i] ?? 0) + gap
        }

        let size = 0
        const endLane = Math.min(bestLane + span, this.lanes.length)
        for (let i = bestLane; i < endLane; i++) {
            size += this.lanes[i] ?? 0
            if (i < endLane - 1) size += gap
        }

        element.style.position = "absolute"

        if (this.isVertical) {
            element.style.left = position.toString() + "px"
            element.style.top =
                (bestHeight > 0 ? bestHeight + crossGap : 0).toString() + "px"
            element.style.width = size.toString() + "px"
            element.style.height = ""
        } else {
            element.style.top = position.toString() + "px"
            element.style.left =
                (bestHeight > 0 ? bestHeight + crossGap : 0).toString() + "px"
            element.style.height = size.toString() + "px"
            element.style.width = ""
        }

        const itemRect = element.getBoundingClientRect()
        const itemSize = this.isVertical ? itemRect.height : itemRect.width
        const newHeight =
            bestHeight + (bestHeight > 0 ? crossGap : 0) + itemSize

        for (let i = bestLane; i < endLane; i++) {
            this.laneHeights[i] = newHeight
        }
    }

    destroy() {
        if (this.resizeObserver) {
            this.resizeObserver.disconnect()
        }
        if (this.mutationObserver) {
            this.mutationObserver.disconnect()
        }

        this.container.removeAttribute(POLYFILL_ATTR)
        this.container.style.position = ""
        this.container.style.display = ""
        this.container.style.minHeight = ""

        for (const item of Array.from(this.container.children)) {
            if (item.nodeType === Node.ELEMENT_NODE) {
                const el = item as HTMLElement
                el.style.position = ""
                el.style.left = ""
                el.style.top = ""
                el.style.width = ""
                el.style.height = ""
            }
        }
    }

    refresh() {
        this.layout()
    }
}

function parseCSSProperties(cssBlock: string): Record<string, string> {
    const props: Record<string, string> = {}
    const propRegex = /([\w-]+)\s*:\s*([^;]+);?/g
    let match: RegExpExecArray | null
    while ((match = propRegex.exec(cssBlock)) !== null) {
        if (match[1] && match[2]) {
            props[match[1].trim()] = match[2].trim()
        }
    }
    return props
}

function processStyleSheets(): Set<HTMLElement> {
    const containers = new Set<HTMLElement>()
    const gridLanesSelectors = new Set<string>()

    const allElements = document.querySelectorAll<HTMLElement>(
        '[style*="grid-lanes"]'
    )
    for (const el of Array.from(allElements)) {
        const styleAttr = el.getAttribute("style") ?? ""
        if (/display\s*:\s*grid-lanes/i.test(styleAttr)) {
            containers.add(el)
            const props = parseCSSProperties(styleAttr)
            if (!parsedGridLanesRules.has(el)) {
                parsedGridLanesRules.set(el, props)
            }
        }
    }

    const parseCSSRule = (rule: CSSRule) => {
        if (
            rule.cssText &&
            (/display\s*:\s*grid-lanes/i.test(rule.cssText) ||
                /--grid-lanes-polyfill:\s*1/i.test(rule.cssText))
        ) {
            const styleRule = rule as CSSStyleRule
            if (
                styleRule.selectorText &&
                !gridLanesSelectors.has(styleRule.selectorText)
            ) {
                gridLanesSelectors.add(styleRule.selectorText)
                const props = parseCSSProperties(rule.cssText)
                try {
                    const elements = document.querySelectorAll<HTMLElement>(
                        styleRule.selectorText
                    )
                    for (const el of Array.from(elements)) {
                        containers.add(el)
                        if (!parsedGridLanesRules.has(el)) {
                            parsedGridLanesRules.set(el, props)
                        }
                    }
                } catch {
                    // Invalid selector
                }
            }
        }
    }

    const handleRules = (node: Document | CSSStyleSheet | CSSImportRule) => {
        if ("styleSheet" in node && node.styleSheet) {
            handleRules(node.styleSheet)
            return
        }

        if ("cssRules" in node) {
            try {
                const sheet = node
                const rules = sheet.cssRules
                for (const rule of Array.from(rules)) {
                    if (rule instanceof CSSImportRule) {
                        handleRules(rule)
                    } else {
                        parseCSSRule(rule)
                    }
                }
            } catch {
                // Ignore DOMException (SecurityError) for cross-origin styles
            }
        } else if ("styleSheets" in node) {
            const doc = node
            for (const sheet of Array.from(doc.styleSheets)) {
                handleRules(sheet)
            }
        }
    }

    handleRules(document)
    return containers
}

function init(options: GridLanesOptions = {}): InitResult {
    if (supportsGridLanes() && !options.force) {
        return { supported: true, instances: [] }
    }

    const instances = new Map<HTMLElement, GridLanesLayout>()

    const containers = processStyleSheets()
    for (const container of Array.from(containers)) {
        if (!container.hasAttribute(POLYFILL_ATTR)) {
            instances.set(container, new GridLanesLayout(container, options))
        }
    }

    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.type === "childList") {
                for (const node of Array.from(mutation.addedNodes)) {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        const el = node as HTMLElement
                        const style = window.getComputedStyle(el)
                        if (
                            el.style.display === "grid-lanes" ||
                            style.getPropertyValue("display") === "grid-lanes"
                        ) {
                            if (!instances.has(el)) {
                                instances.set(
                                    el,
                                    new GridLanesLayout(el, options)
                                )
                            }
                        }

                        const descendants =
                            el.querySelectorAll<HTMLElement>("*")
                        for (const desc of Array.from(descendants)) {
                            const descStyle = window.getComputedStyle(desc)
                            if (
                                desc.style.display === "grid-lanes" ||
                                descStyle.getPropertyValue("display") ===
                                    "grid-lanes"
                            ) {
                                if (!instances.has(desc)) {
                                    instances.set(
                                        desc,
                                        new GridLanesLayout(desc, options)
                                    )
                                }
                            }
                        }
                    }
                }
            }
        }

        const newContainers = processStyleSheets()
        for (const container of Array.from(newContainers)) {
            if (!instances.has(container)) {
                instances.set(
                    container,
                    new GridLanesLayout(container, options)
                )
            }
        }
    })

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    })

    return {
        supported: false,
        instances,
        observer,
        refresh() {
            for (const instance of Array.from(instances.values())) {
                instance.refresh()
            }
        },
        destroy() {
            observer.disconnect()
            for (const instance of Array.from(instances.values())) {
                instance.destroy()
            }
            instances.clear()
        }
    }
}

function apply(
    element: HTMLElement,
    options: GridLanesOptions = {}
): GridLanesLayout | null {
    if (supportsGridLanes() && !options.force) {
        return null
    }
    return new GridLanesLayout(element, options)
}

const GridLanesPolyfill = {
    supportsGridLanes,
    init,
    apply,
    GridLanesLayout,
    version: "1.2.0"
}

export type { GridLanesOptions, InitResult }

export { apply, GridLanesLayout, GridLanesPolyfill, init, supportsGridLanes }
