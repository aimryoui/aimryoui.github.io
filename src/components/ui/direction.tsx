"use client"

import { useEffect } from "react"

import { DirectionProvider as BaseUIDirectionProvider } from "@base-ui/react/direction-provider"
import { I18nProvider, useLocale } from "react-aria-components/I18nProvider"

import { usePreference } from "@/hooks/use-preference"

function BaseUIDirectionSync({ children }: { children: React.ReactNode }) {
    const { direction } = useLocale()

    useEffect(() => {
        document.documentElement.dir = direction
    }, [direction])

    return (
        <BaseUIDirectionProvider direction={direction}>
            {children}
        </BaseUIDirectionProvider>
    )
}

type DirectionProviderProps = React.ComponentProps<typeof I18nProvider> & {
    direction?: React.ComponentProps<"div">["dir"]
}

function DirectionProvider({ children, ...props }: DirectionProviderProps) {
    const { directionPref } = usePreference()
    const { locale: currentLocale, direction: systemDirection } = useLocale()

    // Resolve what direction we should actually use
    const resolvedDirection =
        directionPref === "auto"
            ? (props.direction ?? systemDirection)
            : directionPref

    let locale = props.locale
    if (!locale && resolvedDirection) {
        locale = new Intl.Locale(currentLocale, {
            script: resolvedDirection === "rtl" ? "Arab" : "Latn"
        }).toString()
    }

    return (
        <I18nProvider {...props} locale={locale}>
            <BaseUIDirectionSync>{children}</BaseUIDirectionSync>
        </I18nProvider>
    )
}

function useDirection() {
    const { direction } = useLocale()
    return direction
}

export type { DirectionProviderProps }
export { DirectionProvider, I18nProvider, useDirection, useLocale }
