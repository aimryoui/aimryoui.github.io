"use client"

import { AudioToggle } from "@/components/audio/audio"
import { useDevice } from "@/hooks/use-device"

function AudioButton() {
    const { isTouchDevice } = useDevice()
    return (
        !isTouchDevice && (
            <li>
                <AudioToggle />
            </li>
        )
    )
}

export { AudioButton }
