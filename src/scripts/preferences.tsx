import { DEFAULT_EFFECTS_PREFERENCES } from "@/configs/effects.config"
import { DEFAULT_MEDIA_PREFERENCES } from "@/configs/media.config"
import { minifyJs } from "@/helpers/minify-js"

async function PreferenceScripts() {
    return (
        <script
            dangerouslySetInnerHTML={{
                __html: await minifyJs(/* js */ `
                    const htmlElement = document.documentElement
                    const setAttr = (k, v) => htmlElement.setAttribute(k, v)
                    const removeAttr = (k) => htmlElement.removeAttribute(k)
                    const getItem = (k) => localStorage.getItem(k)
                    const parse = JSON.parse
                    const error = console.error

                    // Platform detection
                    setAttr("data-platform",
                        window.navigator.platform.includes("Mac")
                        ? "mac"
                        : "win"
                    )

                    // Motion preference
                    try {
                        const motionPref = getItem("nhn-motion-preference")
                        if (motionPref) {
                            const parsed = parse(motionPref)
                            setAttr("data-motion", parsed.state.preference)
                        } else {
                            setAttr("data-motion", "system")
                        }
                    } catch (e) {
                        error("Error getting motion preference:", e)
                        setAttr("data-motion", "system")
                    }

                    // Effects preferences
                    try {
                        const defaultEffectsString = ${DEFAULT_EFFECTS_PREFERENCES.length > 0 ? `"${DEFAULT_EFFECTS_PREFERENCES.join(" ")}"` : '"null"'}
                        const effectsPreference = getItem("nhn-effects-preference")
                        if (effectsPreference) {
                            const parsed = parse(effectsPreference)
                            const effects = parsed.state.effects
                            setAttr(
                                "data-effects",
                                effects.length > 0 ? effects.join(" ") : "null"
                            )
                        } else {
                            setAttr("data-effects", defaultEffectsString)
                        }
                    } catch (e) {
                        error("Error getting effects preference:", e)
                        setAttr("data-effects", ${DEFAULT_EFFECTS_PREFERENCES.length > 0 ? `"${DEFAULT_EFFECTS_PREFERENCES.join(" ")}"` : '"null"'})
                    }

                    // Media preferences
                    try {
                        const defaultMediaString = ${DEFAULT_MEDIA_PREFERENCES.length > 0 ? `"${DEFAULT_MEDIA_PREFERENCES.join(" ")}"` : '"null"'}
                        const mediaPreferences = getItem("nhn-media-preferences")
                        if (mediaPreferences) {
                            const parsed = parse(mediaPreferences)
                            const prefs = parsed.state.preferences
                            setAttr(
                                "data-media",
                                prefs.length > 0 ? prefs.join(" ") : "null"
                            )
                        } else {
                            setAttr("data-media", defaultMediaString)
                        }
                    } catch (e) {
                        error("Error getting media preferences:", e)
                        setAttr("data-media", ${DEFAULT_MEDIA_PREFERENCES.length > 0 ? `"${DEFAULT_MEDIA_PREFERENCES.join(" ")}"` : '"null"'})
                    }

                    // Navigation bar position
                    try {
                        const sidebarPosition = getItem("nhn-sidebar-position")
                        const toolbarPosition = getItem("nhn-toolbar-position")
                        if (sidebarPosition) {
                            const parsed = parse(sidebarPosition)
                            let position = parsed.state.position
                            if (position === "left") position = "inline-start"
                            if (position === "right") position = "inline-end"
                            setAttr(
                                "data-sidebar-position",
                                position
                            )
                        } else {
                            setAttr(
                                "data-sidebar-position",
                                "inline-start"
                            )
                        }
                        if (toolbarPosition) {
                            const parsed = parse(toolbarPosition)
                            setAttr(
                                "data-toolbar-position",
                                parsed.state.position
                            )
                        } else {
                            setAttr(
                                "data-toolbar-position",
                                "bottom"
                            )
                        }
                    } catch (e) {
                        error("Error getting navigation bar position:", e)
                        setAttr("data-sidebar-position", "inline-start")
                        setAttr("data-toolbar-position", "bottom")
                    }

                    // Direction preference
                    try {
                        const direction = getItem("nhn-direction-preference")
                        let pref = "auto"
                        if (direction) {
                            const parsed = parse(direction)
                            if (parsed.state.preference !== "auto") { pref = parsed.state.preference }
                        }
                        if (pref === "rtl") {
                            htmlElement.dir = "rtl"
                        } else if (pref === "ltr") {
                            htmlElement.dir = "ltr"
                        } else {
                            // auto
                            const loc = new Intl.Locale(navigator.language)
                            const dir = loc.textInfo?.direction || (["ar", "he", "fa", "ur", "ps", "syr", "dv", "ku"].includes(loc.language) ? "rtl" : "ltr")
                            htmlElement.dir = dir
                        }
                    } catch (e) {
                        error("Error getting direction preference:", e)
                        htmlElement.dir = "ltr"
                    }
                    
                    // Directories menu
                    try {
                        const directoriesPref = getItem("nhn-directories-menu")
                        if (directoriesPref) {
                            const parsed = parse(directoriesPref)
                            if (parsed.state && parsed.state.isDirectoriesMenuEnabled) {
                                setAttr("data-directories", "")
                            } else {
                                removeAttr("data-directories")
                            }
                        } else {
                            removeAttr("data-directories")
                        }
                    } catch (e) {
                        error("Error getting directories preference:", e)
                        removeAttr("data-directories")
                    }
                `)
            }}
        />
    )
}

export { PreferenceScripts }
