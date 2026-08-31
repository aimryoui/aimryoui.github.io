"use client"

import { useState } from "react"
import { usePathname, useRouter } from "next/navigation"

import { sendGAEvent } from "@next/third-parties/google"
import { ChevronsUpDown } from "lucide-react"

import { Logo } from "@/components/icons/icons"
import { showMenuToast } from "@/components/preferences/menu-toast"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuGroup,
    DropdownMenuLabel,
    DropdownMenuLinkItem,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Link } from "@/components/ui/link"
import { TooltipTrigger } from "@/components/ui/tooltip"
import { At, Bold } from "@/components/ui/typography"
import {
    DEFAULT_PORTFOLIO_ROLE,
    type PortfolioRole,
    ROLE_QUERY_PARAM_KEY
} from "@/configs/role.config"
import { siteConfig } from "@/configs/site.config"
import { useClientSearchParams } from "@/hooks/use-client-search-params"
import { cn } from "@/lib/utils"
import { useMobileTocStore } from "@/portfolio/_components/_layout/toc/stores/mobile-toc-store"
import { useDirectoriesStore } from "@/stores/directories-store"
import { useQueryStore } from "@/stores/query-store"

import { projects } from "~/.velite"

interface DirectoryConfig {
    href: string
    label: string
}

interface RoleConfig {
    value: PortfolioRole
    label: string
}

const DIRECTORIES_CONFIG: DirectoryConfig[] = [
    { href: "/", label: "/" },
    { href: "/portfolio", label: "/portfolio" }
]

const ROLES_CONFIG: Record<PortfolioRole, RoleConfig> = {
    pd: {
        value: "pd",
        label: "Product Designer"
    },
    cd: {
        value: "cd",
        label: "Creative Designer"
    }
}

function LogoLink() {
    const isDirectoriesMenuEnabled = useDirectoriesStore(
        (s) => s.isDirectoriesMenuEnabled
    )
    const role = useQueryStore((s) => s.role)
    const [isLogoLinkOpen, setIsLogoLinkOpen] = useState(false)
    const router = useRouter()
    const pathname = usePathname()

    const rawSearchParams = useClientSearchParams()

    const handleRoleChange = (newRole: string) => {
        const searchParams = new URLSearchParams(rawSearchParams.toString())
        if (newRole === DEFAULT_PORTFOLIO_ROLE) {
            searchParams.delete(ROLE_QUERY_PARAM_KEY)
        } else {
            searchParams.set(ROLE_QUERY_PARAM_KEY, newRole)
        }

        sendGAEvent("event", "change_role", { role: newRole })

        showMenuToast(
            "Viewing as",
            ROLES_CONFIG[role]?.label
                || ROLES_CONFIG[DEFAULT_PORTFOLIO_ROLE].label,
            ROLES_CONFIG[newRole as PortfolioRole]?.label
                || ROLES_CONFIG[DEFAULT_PORTFOLIO_ROLE].label,
            () => {
                const undoSearchParams = new URLSearchParams(
                    rawSearchParams.toString()
                )
                if (role === DEFAULT_PORTFOLIO_ROLE) {
                    undoSearchParams.delete(ROLE_QUERY_PARAM_KEY)
                } else {
                    undoSearchParams.set(ROLE_QUERY_PARAM_KEY, role)
                }
                sendGAEvent("event", "change_role_undo", { role })
                router.push(`${pathname}?${undoSearchParams.toString()}`, {
                    scroll: false
                })
            }
        )

        router.push(`${pathname}?${searchParams.toString()}`, { scroll: false })
    }

    return isDirectoriesMenuEnabled ? (
        <DropdownMenu
            onOpenChange={(open) => {
                setIsLogoLinkOpen(open)
            }}
            containerClassName="[--solar-secondary-opacity:0.25] dark:[--solar-secondary-opacity:0.4]"
        >
            <TooltipTrigger
                delay={500}
                disabled={isLogoLinkOpen}
                payload={{
                    content: <span>Directories & Roles</span>
                }}
                render={
                    <DropdownMenuTrigger
                        render={
                            <Button
                                nativeButton
                                keepFeedback
                                tracking={{
                                    eventName: "button_click",
                                    eventParams: {
                                        button_name: "Toolbar - Home/Logo"
                                    }
                                }}
                                className={cn(
                                    "group relative flex items-center gap-[calc(var(--spacing-safe-zone)/2)] rounded-xl",
                                    "-my-[calc(var(--spacing-safe-zone-vertical)/2)] -me-[calc(var(--spacing-safe-zone)/2-var(--spacing))] -ms-[calc(var(--spacing-safe-zone)/2)]",
                                    "py-[calc(var(--spacing-safe-zone-vertical)/2)] pe-[calc(var(--spacing-safe-zone)/2-var(--spacing))] ps-[calc(var(--spacing-safe-zone)/2)]",
                                    {
                                        hover: "bg-accent/60 data-target-cursor:rounded-none",
                                        active: "bg-accent/60 dark:bg-accent",
                                        "focus-visible":
                                            "text-muted-foreground",
                                        "aria-expanded": "bg-muted",

                                        "data-target-cursor":
                                            "transition-[transform,translate,scale,background-color,border-radius] ease-[linear,linear,linear,linear,cubic-bezier(0.22,1,0.36,1)] duration-[.1s,.1s,.1s,.1s,.2s]",

                                        md: [
                                            "-me-[calc(var(--spacing-safe-zone)*3/5-var(--spacing))] -ms-[calc(var(--spacing-safe-zone)*3/5)]",
                                            "pe-[calc(var(--spacing-safe-zone)*3/5-var(--spacing))] ps-[calc(var(--spacing-safe-zone)*3/5)]"
                                        ]
                                    }
                                )}
                            >
                                <TriggerContent />
                            </Button>
                        }
                        payload={{
                            className:
                                "min-w-auto origin-bottom-left rtl:origin-bottom-right",
                            content: (
                                <>
                                    <DropdownMenuGroup>
                                        <DropdownMenuLabel>
                                            Directories
                                        </DropdownMenuLabel>
                                        {DIRECTORIES_CONFIG.map((dir) => (
                                            <DropdownMenuLinkItem
                                                key={dir.href}
                                                href={dir.href}
                                                closeOnClick
                                            >
                                                {`${dir.label}${role === "cd" ? "?r=cd" : ""}`}
                                            </DropdownMenuLinkItem>
                                        ))}
                                    </DropdownMenuGroup>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuGroup>
                                        <DropdownMenuLabel>
                                            Roles
                                        </DropdownMenuLabel>
                                        <DropdownMenuRadioGroup
                                            value={role}
                                            onValueChange={handleRoleChange}
                                        >
                                            {Object.values(ROLES_CONFIG).map(
                                                (roleConfig) => (
                                                    <DropdownMenuRadioItem
                                                        key={roleConfig.value}
                                                        isDefault={
                                                            roleConfig.value
                                                            === DEFAULT_PORTFOLIO_ROLE
                                                        }
                                                        value={roleConfig.value}
                                                        closeOnClick
                                                    >
                                                        {roleConfig.label}
                                                    </DropdownMenuRadioItem>
                                                )
                                            )}
                                        </DropdownMenuRadioGroup>
                                    </DropdownMenuGroup>
                                </>
                            )
                        }}
                    />
                }
            />
        </DropdownMenu>
    ) : (
        <Link
            data-cursor="ignore"
            href="/portfolio"
            scroll={false}
            tracking={{
                eventName: "button_click",
                eventParams: {
                    button_name: "Toolbar - Home/Logo"
                }
            }}
            onPress={() => {
                useMobileTocStore.getState().setIsTocOpen(false)
            }}
            className={cn(
                "group flex items-center gap-[calc(var(--spacing-safe-zone)/2)]"
            )}
        >
            <TriggerContent />
        </Link>
    )
}

function TriggerContent() {
    return (
        <>
            <Logo
                className={cn("size-8.5", {
                    "motion-preferred":
                        "will-change-transform transition-[transform,rotate] ease-spring duration-700 group-hover:rotate-180 group-active:rotate-180"
                })}
            />
            <div
                className={cn(
                    "z-1 text-start",
                    // .25rem*8.5: logo width
                    // .25rem*4/2*(2|1): trigger gap width (4/2) * quantity (2 on menu enable, 1 on menu disable)
                    // .25rem*4*4: container gap width (4) * quantity (4)
                    // .25rem*16-.25rem*4: var(--spacing-space) on md breakpoint - container padding
                    // .25rem*9*3: right side button size (9) * quantity (3)
                    // 5.1rem: approx. width of texts
                    // 1.25rem: ChevronsUpDown icon width
                    // -.35rem: negative margin-inline-start of ChevronsUpDown icon
                    "sm:@[calc(.25rem*8.5+.25rem*4/2*1+.25rem*4*4+.25rem*16-.25rem*4+.25rem*9*3+5.1rem)]:hidden",
                    "group-data-[directories]/html:sm:@[calc(.25rem*8.5+.25rem*4/2*2+.25rem*4*4+.25rem*16-.25rem*4+.25rem*9*3+5.1rem+1.25rem-.35rem)]:hidden"
                )}
            >
                <Bold className="block text-sm">
                    <bdi>
                        <At className="text-current font-wght-[625]" />
                        {siteConfig.username}
                    </bdi>
                </Bold>
                <p className="block font-mono text-xs">
                    <bdi>{`${projects.length} PROJECTS`}</bdi>
                </p>
            </div>
            <ChevronsUpDown className="z-1 -ms-1.5 hidden size-5 group-hover:text-foreground group-data-[directories]/html:block" />
        </>
    )
}

export { LogoLink }
