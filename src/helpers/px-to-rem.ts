import { BASE_FONT_SIZE } from "~/tailwind.config"

export function pxToRem(px: number) {
    return px / BASE_FONT_SIZE
}
