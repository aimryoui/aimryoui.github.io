import "react"

declare global {
    type Without<T, U> = Partial<Record<Exclude<keyof T, keyof U>, never>>
    type XOR<T, U> = T | U extends object
        ? (Without<T, U> & U) | (Without<U, T> & T)
        : T | U
}

declare module "react" {
    interface CSSProperties {
        // oxlint-disable-next-line typescript/consistent-indexed-object-style
        [key: `--${string}`]: string | number
    }
}
