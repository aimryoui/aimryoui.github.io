"use client"

import { useEffect, useRef, useState } from "react"

import {
    createTocStore,
    TocStoreContext,
    type TocStoreProps
} from "@/portfolio/_components/_layout/toc/stores/toc-store"

type TocStoreProviderProps = TocStoreProps & {
    children: React.ReactNode
}

function TocStoreProvider({ children, ...props }: TocStoreProviderProps) {
    const [store] = useState(() => createTocStore(props))

    const prevProps = useRef(props)

    useEffect(() => {
        const keys1 = Object.keys(props)
        const keys2 = Object.keys(prevProps.current)
        
        const hasChanged =
            keys1.length !== keys2.length ||
            keys1.some(
                (key) =>
                    props[key as keyof typeof props] !==
                    prevProps.current[key as keyof typeof props]
            )

        if (hasChanged) {
            store.setState(props)
            prevProps.current = props
        }
    })

    return (
        <TocStoreContext.Provider value={store}>
            {children}
        </TocStoreContext.Provider>
    )
}

export { TocStoreProvider }
