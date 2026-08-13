import { useEffect, useEffectEvent } from "react"

function useWindowEvent<K extends string>(
    type: K,
    listener: K extends keyof WindowEventMap
        ? (this: Window, ev: WindowEventMap[K]) => void
        : (this: Window, ev: CustomEvent) => void,
    options?: boolean | AddEventListenerOptions
) {
    const stableListener = useEffectEvent(listener)

    useEffect(() => {
        window.addEventListener(type, stableListener as EventListener, options)
        return () => {
            window.removeEventListener(
                type,
                stableListener as EventListener,
                options
            )
        }
    }, [type, options])
}

export { useWindowEvent }
