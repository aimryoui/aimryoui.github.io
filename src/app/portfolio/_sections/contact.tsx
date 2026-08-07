"use client"

import { Fragment } from "react"

import { Divider } from "@/components/layout/divider"
import { SectionLine } from "@/components/layout/line"
import { Space } from "@/components/layout/space"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableContainer,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import { Link } from "@/components/ui/typography"
import { slugify } from "@/helpers/slugify"
import { cn } from "@/lib/utils"
import SectionTitle from "@/portfolio/_components/section-title"
import { CONTACT_METHODS } from "@/portfolio/_configs/contact-methods"

function Contact() {
    return (
        <section className="@container">
            <Space />
            <SectionLine />
            <SectionTitle
                id="contact"
                title="Contact"
                className="sticky top-0 z-50"
            />
            <SectionLine containerClassName="sticky top-space z-50" />
            <Divider />
            <SectionLine />
            <address>
                {CONTACT_METHODS.map((method, index, arr) => (
                    <Fragment key={method.method}>
                        <TableContainer
                            className={cn(
                                "grid grid-cols-5 gap-[calc(var(--spacing-safe-zone)+var(--px)*2)] bg-background py-safe-zone-vertical"
                            )}
                        >
                            <TableCaption
                                className={cn(
                                    "sr-only absolute left-safe-zone top-safe-zone-vertical whitespace-pre-line font-wght-500"
                                )}
                            >
                                {method.method}
                            </TableCaption>
                            <Table
                                aria-label="Contact"
                                className={cn(
                                    "col-span-full col-start-2 grid table-fixed gap-y-2.5",
                                    {
                                        "@[40rem]": "col-start-1 ps-safe-zone"
                                    }
                                )}
                            >
                                <TableHeader
                                    className={cn("sr-only grid", {
                                        "[&>tr]": [
                                            "grid grid-cols-4 gap-x-[calc(var(--spacing-safe-zone)+var(--px)*2)]",
                                            {
                                                "last:*": "pe-safe-zone"
                                            }
                                        ]
                                    })}
                                >
                                    <TableHead
                                        id="name"
                                        className="px-0"
                                        isRowHeader
                                    >
                                        Name
                                    </TableHead>
                                    <TableHead id="link" className="px-0">
                                        Link
                                    </TableHead>
                                    <TableHead
                                        id="prefer"
                                        className="col-span-2 px-0"
                                    >
                                        Prefer?
                                    </TableHead>
                                </TableHeader>

                                <TableBody
                                    items={method.platforms.map((platform) => ({
                                        ...platform,
                                        id: `contact-${slugify(platform.title)}`
                                    }))}
                                    dependencies={[method.platforms]}
                                    className={cn("grid gap-y-table-between")}
                                >
                                    {(platform) => (
                                        <TableRow
                                            className={cn(
                                                "grid grid-cols-4 gap-x-[calc(var(--spacing-safe-zone)+var(--px)*2)]",
                                                {
                                                    "@[28rem]":
                                                        "flex gap-safe-zone"
                                                }
                                            )}
                                        >
                                            <TableCell
                                                className={cn("p-0 align-top")}
                                            >
                                                <span
                                                    className={cn(
                                                        "absolute left-safe-zone text-highlighted [&>svg]:size-[calc(1em*1.3)]",
                                                        {
                                                            "@[40rem]":
                                                                "hidden",
                                                            "@[28rem]":
                                                                "static !block"
                                                        }
                                                    )}
                                                >
                                                    {platform.icon}
                                                </span>
                                                <p
                                                    className={cn({
                                                        "@[28rem]": "sr-only"
                                                    })}
                                                >
                                                    {platform.title}
                                                </p>
                                            </TableCell>

                                            <TableCell
                                                className={cn("p-0 align-top", {
                                                    "@[59.375rem]": "col-span-2"
                                                })}
                                            >
                                                <Link
                                                    href={platform.links.url}
                                                    openInNewTab
                                                    translate="no"
                                                    className={cn(
                                                        platform.links.hidden &&
                                                            "text-transparent",
                                                        "lg:font-wght-600"
                                                    )}
                                                >
                                                    {platform.links.text}
                                                </Link>
                                            </TableCell>

                                            <TableCell
                                                className={cn(
                                                    "col-span-1 p-0 text-right align-top text-highlighted font-wght-500",
                                                    {
                                                        "@[59.375rem]":
                                                            "pe-safe-zone text-left",
                                                        "@[19.5rem]": "sr-only"
                                                    }
                                                )}
                                            >
                                                {platform.prefer && "Prefer"}
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        {index < arr.length - 1 &&
                            arr[index + 1].method !== method.method && (
                                <SectionLine />
                            )}
                    </Fragment>
                ))}
            </address>
        </section>
    )
}

export default Contact
