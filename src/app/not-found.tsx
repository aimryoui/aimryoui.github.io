"use client"

import { useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"

const TRAILING_SLASHES_REGEX = /\/+$/u

export default function NotFound() {
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        if (pathname && pathname.length > 1 && pathname.endsWith("/")) {
            const purePath = pathname.replace(TRAILING_SLASHES_REGEX, "")
            router.replace(purePath)
        }
    }, [pathname, router])

    return (
        <div>
            <h2>Not Found</h2>
            <p>Could not find requested resource</p>
        </div>
    )
}
