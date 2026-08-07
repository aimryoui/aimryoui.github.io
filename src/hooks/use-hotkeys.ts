import { useEffect, useRef } from "react"

interface KeyboardModifiers {
    alt: boolean
    ctrl: boolean
    meta: boolean
    mod: boolean
    shift: boolean
    plus: boolean
}

type Hotkey = KeyboardModifiers & {
    key?: string
}

type CheckHotkeyMatch = (event: KeyboardEvent) => boolean

const keyNameMap: Record<string, string> = {
    " ": "space",
    ArrowLeft: "arrowleft",
    ArrowRight: "arrowright",
    ArrowUp: "arrowup",
    ArrowDown: "arrowdown",
    Escape: "escape",
    Esc: "escape",
    esc: "escape",
    Enter: "enter",
    Tab: "tab",
    Backspace: "backspace",
    Delete: "delete",
    Insert: "insert",
    Home: "home",
    End: "end",
    PageUp: "pageup",
    PageDown: "pagedown",
    "+": "plus",
    "-": "minus",
    "*": "asterisk",
    "/": "slash"
}

function normalizeKey(key: string): string {
    const lowerKey = key.replace("Key", "").toLowerCase()
    return keyNameMap[key] || lowerKey
}

function parseHotkey(hotkey: string): Hotkey {
    const keys = hotkey
        .toLowerCase()
        .split("+")
        .map((part) => part.trim())

    const modifiers: KeyboardModifiers = {
        alt: keys.includes("alt"),
        ctrl: keys.includes("ctrl"),
        meta: keys.includes("meta"),
        mod: keys.includes("mod"),
        shift: keys.includes("shift"),
        plus: keys.includes("[plus]")
    }

    const reservedKeys = new Set(["alt", "ctrl", "meta", "shift", "mod"])

    const freeKey = keys.find((key) => !reservedKeys.has(key))

    return {
        ...modifiers,
        key: freeKey === "[plus]" ? "+" : freeKey
    }
}

function isExactHotkey(
    hotkey: Hotkey,
    event: KeyboardEvent,
    usePhysicalKeys?: boolean
): boolean {
    const { alt, ctrl, meta, mod, shift, key } = hotkey
    const { altKey, ctrlKey, metaKey, shiftKey, code: pressedCode } = event

    if (alt !== altKey) {
        return false
    }

    if (mod) {
        if (!ctrlKey && !metaKey) {
            return false
        }
    } else {
        if (ctrl !== ctrlKey) {
            return false
        }
        if (meta !== metaKey) {
            return false
        }
    }
    if (shift !== shiftKey) {
        return false
    }

    if (
        key &&
        (usePhysicalKeys
            ? normalizeKey(pressedCode) === normalizeKey(key)
            : normalizeKey(pressedCode) === normalizeKey(key))
    ) {
        return true
    }

    return false
}

function getHotkeyMatcher(
    hotkey: string,
    usePhysicalKeys?: boolean
): CheckHotkeyMatch {
    return (event) => isExactHotkey(parseHotkey(hotkey), event, usePhysicalKeys)
}

interface HotkeyItemOptions {
    preventDefault?: boolean
    usePhysicalKeys?: boolean
}

function getHotkeyHandler(hotkeys: HotkeyItem[]) {
    return (event: React.KeyboardEvent<HTMLElement> | KeyboardEvent) => {
        const _event = "nativeEvent" in event ? event.nativeEvent : event
        hotkeys.forEach(
            ([
                hotkey,
                handler,
                options = { preventDefault: true, usePhysicalKeys: false }
            ]) => {
                if (getHotkeyMatcher(hotkey, options.usePhysicalKeys)(_event)) {
                    if (options.preventDefault) {
                        event.preventDefault()
                    }

                    handler(_event)
                }
            }
        )
    }
}

type HotkeyItem = [string, (event: KeyboardEvent) => void, HotkeyItemOptions?]

function shouldFireEvent(
    event: KeyboardEvent,
    tagsToIgnore: string[],
    triggerOnContentEditable = false
) {
    if (event.target instanceof HTMLElement) {
        if (triggerOnContentEditable) {
            return !tagsToIgnore.includes(event.target.tagName)
        }

        return (
            !event.target.isContentEditable &&
            !tagsToIgnore.includes(event.target.tagName)
        )
    }

    return true
}

const DEFAULT_TAGS_TO_IGNORE = ["INPUT", "TEXTAREA", "SELECT"]

function useHotkeys(
    hotkeys: HotkeyItem[],
    tagsToIgnore: string[] = DEFAULT_TAGS_TO_IGNORE,
    triggerOnContentEditable = false
) {
    const hotkeysRef = useRef(hotkeys)

    useEffect(() => {
        hotkeysRef.current = hotkeys
    }, [hotkeys])

    useEffect(() => {
        const keydownListener = (event: KeyboardEvent) => {
            hotkeysRef.current.forEach(
                ([
                    hotkey,
                    handler,
                    options = { preventDefault: true, usePhysicalKeys: false }
                ]) => {
                    if (
                        getHotkeyMatcher(
                            hotkey,
                            options.usePhysicalKeys
                        )(event) &&
                        shouldFireEvent(
                            event,
                            tagsToIgnore,
                            triggerOnContentEditable
                        )
                    ) {
                        if (options.preventDefault) {
                            event.preventDefault()
                        }

                        handler(event)
                    }
                }
            )
        }

        document.documentElement.addEventListener("keydown", keydownListener)
        return () => {
            document.documentElement.removeEventListener(
                "keydown",
                keydownListener
            )
        }
    }, [tagsToIgnore, triggerOnContentEditable])
}

export type { HotkeyItem, HotkeyItemOptions }
export { getHotkeyHandler, useHotkeys }
