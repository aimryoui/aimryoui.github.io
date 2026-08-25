"use client"

import { useState } from "react"
import { usePathname, useRouter } from "next/navigation"

import { ChevronsUpDown } from "lucide-react"

import { Logo } from "@/components/icons/icons"
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
import { DEFAULT_PORTFOLIO_ROLE, type PortfolioRole } from "@/configs/role.config"
import { siteConfig } from "@/configs/site.config"
import { useClientSearchParams } from "@/hooks/use-client-search-params"
import { cn } from "@/lib/utils"
import { useMobileTocStore } from "@/portfolio/_components/_layout/toc/mobile"
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
    { href: "/", label: "Home" },
    { href: "/portfolio", label: "Portfolio" }
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
        if (newRole === "cd") {
            searchParams.set("r", "cd")
        } else {
            searchParams.delete("r")
        }
        router.push(`${pathname}?${searchParams.toString()}`, { scroll: false })
    }

    if (!isDirectoriesMenuEnabled) {
        return (
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

    return (
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
                                data-cursor="ignore"
                                nativeButton
                                keepFeedback
                                tracking={{
                                    eventName: "button_click",
                                    eventParams: {
                                        button_name: "Toolbar - Home/Logo"
                                    }
                                }}
                                className={cn(
                                    "group flex items-center gap-[calc(var(--spacing-safe-zone)/2)]"
                                )}
                            >
                                <TriggerContent isDirectoriesMenuEnabled />
                            </Button>
                        }
                        payload={{
                            className: "min-w-auto",
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
                                                {dir.label}
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
    )
}

function TriggerContent({
    isDirectoriesMenuEnabled = false
}: {
    isDirectoriesMenuEnabled?: boolean
}) {
    return (
        <>
            <Logo
                className={cn("size-8.5", {
                    "motion-preferred":
                        "will-change-transform transition-[transform,rotate] ease-spring duration-700 group-hover:rotate-180"
                })}
            />
            <div
                className={cn(
                    "text-start",
                    // .25rem*8.5: logo width
                    // .25rem*4/2*(2|1): trigger gap width (4/2) * quantity (2 on menu enable, 1 on menu disable)
                    // .25rem*4*4: container gap width (4) * quantity (4)
                    // .25rem*16-.25rem*4: var(--spacing-space) on md breakpoint - container padding
                    // .25rem*9*3: right side button size (9) * quantity (3)
                    // 5.1rem: approx. width of texts
                    // 1.25rem: ChevronsUpDown icon width
                    // -.25rem: negative margin-inline-start of ChevronsUpDown icon
                    isDirectoriesMenuEnabled
                        ? "sm:@[calc(.25rem*8.5+.25rem*4/2*2+.25rem*4*4+.25rem*16-.25rem*4+.25rem*9*3+5.1rem+1.25rem-.2rem)]:hidden"
                        : "sm:@[calc(.25rem*8.5+.25rem*4/2*1+.25rem*4*4+.25rem*16-.25rem*4+.25rem*9*3+5.1rem)]:hidden"
                )}
            >
                <Bold className="text-sm">
                    <bdi>
                        <At className="text-current font-wght-[625]" />
                        {siteConfig.username}
                    </bdi>
                </Bold>
                <p className="font-mono text-xs">
                    <bdi>{`${projects.length} PROJECTS`}</bdi>
                </p>
            </div>
            {isDirectoriesMenuEnabled && (
                <ChevronsUpDown className="-ms-1 size-5 group-hover:text-foreground" />
            )}
        </>
    )
}

export { LogoLink }
