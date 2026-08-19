import { z } from "zod"

const AVAILABLE_SIDEBAR_POSITIONS = ["inline-start", "inline-end"] as const
const sidebarPositionSchema = z.enum(AVAILABLE_SIDEBAR_POSITIONS)
type SidebarPosition = z.infer<typeof sidebarPositionSchema>

const DEFAULT_SIDEBAR_PREFERENCES = "inline-start" as SidebarPosition

const AVAILABLE_TOOLBAR_POSITIONS = ["top", "bottom"] as const
const toolbarPositionSchema = z.enum(AVAILABLE_TOOLBAR_POSITIONS)
type ToolbarPosition = z.infer<typeof toolbarPositionSchema>

const DEFAULT_TOOLBAR_PREFERENCES = "bottom" as ToolbarPosition

export type { SidebarPosition, ToolbarPosition }
export {
    AVAILABLE_SIDEBAR_POSITIONS,
    AVAILABLE_TOOLBAR_POSITIONS,
    DEFAULT_SIDEBAR_PREFERENCES,
    DEFAULT_TOOLBAR_PREFERENCES,
    sidebarPositionSchema,
    toolbarPositionSchema
}
