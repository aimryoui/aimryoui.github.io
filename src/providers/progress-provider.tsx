"use client"

import { ProgressProvider as AppProgressProvider } from "@bprogress/next/app"

export function ProgressProvider({ children }: { children: React.ReactNode }) {
    return (
        <AppProgressProvider
            disableStyle
            options={{ showSpinner: false, template: null }}
            shallowRouting
            startOnLoad
        >
            {children}
        </AppProgressProvider>
    )
}
