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
 * @license MIT
 * @version 1.3.0 (Optimized - No CSS Parsing)
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
    cachedCrossSize: number
}

interface InitResult {
    supported: boolean
    instances: Map<HTMLElement, GridLanesLayout> | never[]
    observer?: MutationObserver
    refresh?: () => void
    destroy?: () => void
}

const POLYFILL_ATTR = "data-grid-lanes-polyfilled"
const DEFAULT_TOLERANCE = 16

function supportsGridLanes(): boolean {
    if (typeof CSS === "undefined" || typeof CSS.supports !== "function") {
        return false
    }
    return CSS.supports("display", "grid-lanes")
}

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

function parseMinMax(value: string): MinMax | null {
    const match = /minmax\(\s*([^,]+)\s*,\s*([^)]+)\s*\)/.exec(value)
    if (!match || match.length < 3) return null
    return {
        min: match[1].trim(),
        max: match[2].trim()
    }
}

function parseRepeat(value: string): Repeat | null {
    const match = /repeat\(\s*([^,]+)\s*,\s*(.+)\s*\)/.exec(value)
    if (!match || match.length < 3) return null
    return {
        count: match[1].trim(),
        pattern: match[2].trim()
    }
}

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

    const tokens = tokenizeTemplate(template)

    for (const token of tokens) {
        const repeatInfo = parseRepeat(token)
        if (repeatInfo) {
            const { count, pattern } = repeatInfo
            const patternTokens = tokenizeTemplate(pattern)

            if (count === "auto-fill" || count === "auto-fit") {
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
                            minSize += 100
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
                            minSize += 100
                        }
                    }
                }

                const patternCount = patternTokens.length
                const gapCount = patternCount - 1
                const minPatternSize = minSize + gapCount * gap

                const reps = Math.max(
                    1,
                    Math.floor((availableSpace + gap) / (minPatternSize + gap))
                )

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

        if (token.endsWith("fr")) {
            const fr = parseFloat(token)
            lanes.push({ min: 0, max: { fr }, size: 0 })
            totalFr += fr
            continue
        }

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

function getGridLanesStyles(element: HTMLElement): ParsedStyles {
    const computed = window.getComputedStyle(element)

    const parsedFs = parseFloat(computed.fontSize)
    const fontSize = Number.isNaN(parsedFs) ? 16 : parsedFs

    const parsedRootFs = parseFloat(
        window.getComputedStyle(document.documentElement).fontSize
    )
    const rootFontSize = Number.isNaN(parsedRootFs) ? 16 : parsedRootFs

    const gapRaw = computed.gap || "0px"
    const gap = resolveCSSVariables(gapRaw, computed)

    const columnGapRaw = computed.columnGap || gap
    let columnGap = resolveCSSVariables(columnGapRaw, computed)

    const rowGapRaw = computed.rowGap || gap
    let rowGap = resolveCSSVariables(rowGapRaw, computed)

    if (gap.includes(" ")) {
        const parts = gap.split(/\s+/)
        if (parts[0]) rowGap = resolveCSSVariables(parts[0], computed)
        if (parts[1]) columnGap = resolveCSSVariables(parts[1], computed)
    }

    let tolerance = DEFAULT_TOLERANCE
    const toleranceValueRaw =
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

    const gridTemplateColumns = resolveCSSVariables(
        computed.gridTemplateColumns,
        computed
    )
    const gridTemplateRows = resolveCSSVariables(
        computed.gridTemplateRows,
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

class GridLanesLayout {
    container: HTMLElement
    options: GridLanesOptions
    isVertical = true
    lanes: number[] = []
    laneHeights: number[] = []
    resizeObserver: ResizeObserver | null = null
    mutationObserver: MutationObserver | null = null
    intersectionObserver: IntersectionObserver | null = null

    isVisible = true
    layoutTimeout: ReturnType<typeof setTimeout> | null = null
    layoutAF: number | null = null

    constructor(container: HTMLElement, options: GridLanesOptions = {}) {
        this.container = container
        this.options = options
        this.init()
    }

    init() {
        this.container.style.position = "relative"
        this.container.style.display = "block"

        this.layout()
        this.setupObservers()
    }

    setupObservers() {
        const debouncedLayout = () => {
            if (!this.isVisible) return

            if (this.layoutTimeout) clearTimeout(this.layoutTimeout)
            if (this.layoutAF) cancelAnimationFrame(this.layoutAF)

            this.layoutTimeout = setTimeout(() => {
                this.layoutAF = requestAnimationFrame(() => {
                    this.layout()
                })
            }, 100)
        }

        this.intersectionObserver = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    this.isVisible = entry.isIntersecting
                    if (this.isVisible) {
                        debouncedLayout()
                    }
                }
            },
            { rootMargin: "500px" }
        )
        this.intersectionObserver.observe(this.container)

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

        this.mutationObserver = new MutationObserver((mutations) => {
            let shouldRelayout = false
            for (const mutation of mutations) {
                if (mutation.type === "childList") {
                    for (const node of Array.from(mutation.addedNodes)) {
                        if (node.nodeType === Node.ELEMENT_NODE) {
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
                        if (this.isVisible) this.layout()
                    },
                    { once: true }
                )
                img.addEventListener(
                    "error",
                    () => {
                        if (this.isVisible) this.layout()
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

        const gap = this.isVertical ? styles.columnGap : styles.rowGap
        const crossGap = this.isVertical ? styles.rowGap : styles.columnGap
        const tolerance = styles.tolerance

        for (const item of items) {
            const itemStyles = getItemStyles(item)
            const record: ItemRecord = {
                element: item,
                styles: itemStyles,
                cachedCrossSize: 0
            }

            if (this.isVertical && itemStyles.columnStart !== null) {
                explicitItems.push(record)
            } else if (!this.isVertical && itemStyles.rowStart !== null) {
                explicitItems.push(record)
            } else {
                autoItems.push(record)
            }
        }

        for (const record of [...explicitItems, ...autoItems]) {
            const span = this.isVertical
                ? record.styles.columnSpan
                : record.styles.rowSpan

            let size = 0
            if (this.lanes.length > 0) {
                const laneSize = this.lanes[0] ?? 0
                size = span * laneSize + Math.max(0, span - 1) * gap
            }

            record.element.style.position = ""
            if (this.isVertical) {
                record.element.style.width = size.toString() + "px"
                record.element.style.height = ""
                record.cachedCrossSize = record.element.offsetHeight
            } else {
                record.element.style.height = size.toString() + "px"
                record.element.style.width = ""
                record.cachedCrossSize = record.element.offsetWidth
            }
        }

        const writes: (() => void)[] = []

        for (const record of explicitItems) {
            const { element, styles: itemStyles, cachedCrossSize } = record

            let laneIndex: number
            let span: number

            if (this.isVertical) {
                laneIndex = itemStyles.columnStart ?? 0
                if (laneIndex < 0) laneIndex = this.lanes.length + laneIndex + 1
                laneIndex = Math.max(
                    0,
                    Math.min(laneIndex - 1, this.lanes.length - 1)
                )
                span = itemStyles.columnSpan
            } else {
                laneIndex = itemStyles.rowStart ?? 0
                if (laneIndex < 0) laneIndex = this.lanes.length + laneIndex + 1
                laneIndex = Math.max(
                    0,
                    Math.min(laneIndex - 1, this.lanes.length - 1)
                )
                span = itemStyles.rowSpan
            }

            let position = 0
            for (let i = 0; i < laneIndex; i++)
                position += (this.lanes[i] ?? 0) + gap

            const endLane = Math.min(laneIndex + span, this.lanes.length)

            let maxHeight = 0
            for (let i = laneIndex; i < endLane; i++) {
                maxHeight = Math.max(maxHeight, this.laneHeights[i] ?? 0)
            }

            const t = maxHeight > 0 ? maxHeight + crossGap : 0
            const l = position

            writes.push(() => {
                element.style.position = "absolute"
                if (this.isVertical) {
                    element.style.left = l.toString() + "px"
                    element.style.top = t.toString() + "px"
                } else {
                    element.style.top = l.toString() + "px"
                    element.style.left = t.toString() + "px"
                }
            })

            const newHeight =
                maxHeight + (maxHeight > 0 ? crossGap : 0) + cachedCrossSize
            for (let i = laneIndex; i < endLane; i++) {
                this.laneHeights[i] = newHeight
            }
        }

        for (const record of autoItems) {
            const { element, styles: itemStyles, cachedCrossSize } = record
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
            for (let i = 0; i < bestLane; i++)
                position += (this.lanes[i] ?? 0) + gap

            const endLane = Math.min(bestLane + span, this.lanes.length)

            const t = bestHeight > 0 ? bestHeight + crossGap : 0
            const l = position

            writes.push(() => {
                element.style.position = "absolute"
                if (this.isVertical) {
                    element.style.left = l.toString() + "px"
                    element.style.top = t.toString() + "px"
                } else {
                    element.style.top = l.toString() + "px"
                    element.style.left = t.toString() + "px"
                }
            })

            const newHeight =
                bestHeight + (bestHeight > 0 ? crossGap : 0) + cachedCrossSize
            for (let i = bestLane; i < endLane; i++) {
                this.laneHeights[i] = newHeight
            }
        }

        for (const write of writes) {
            write()
        }

        const containerHeight = Math.max(...this.laneHeights, 0)
        this.container.style.minHeight = containerHeight.toString() + "px"
    }

    destroy() {
        if (this.resizeObserver) {
            this.resizeObserver.disconnect()
        }
        if (this.mutationObserver) {
            this.mutationObserver.disconnect()
        }
        if (this.intersectionObserver) {
            this.intersectionObserver.disconnect()
        }
        if (this.layoutTimeout) clearTimeout(this.layoutTimeout)
        if (this.layoutAF) cancelAnimationFrame(this.layoutAF)

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

function init(options: GridLanesOptions = {}): InitResult {
    if (supportsGridLanes() && !options.force) {
        return { supported: true, instances: new Map() }
    }

    const instances = new Map<HTMLElement, GridLanesLayout>()

    const initElements = () => {
        const elements = document.querySelectorAll<HTMLElement>(
            `[${POLYFILL_ATTR}="true"]`
        )
        for (const el of Array.from(elements)) {
            if (!instances.has(el)) {
                instances.set(el, new GridLanesLayout(el, options))
            }
        }
    }

    initElements()

    const observer = new MutationObserver((mutations) => {
        let shouldInit = false
        for (const mutation of mutations) {
            if (mutation.type === "childList") {
                for (const node of Array.from(mutation.addedNodes)) {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        const el = node as HTMLElement
                        if (
                            el.getAttribute(POLYFILL_ATTR) === "true" ||
                            el.querySelector(`[${POLYFILL_ATTR}="true"]`)
                        ) {
                            shouldInit = true
                        }
                    }
                }
            } else if (
                mutation.type === "attributes" &&
                mutation.attributeName === POLYFILL_ATTR
            ) {
                shouldInit = true
            }
        }

        if (shouldInit) initElements()
    })

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: [POLYFILL_ATTR]
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
    version: "1.3.0"
}

export type { GridLanesOptions, InitResult }

export { apply, GridLanesLayout, GridLanesPolyfill, init, supportsGridLanes }
