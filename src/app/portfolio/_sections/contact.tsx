"use client"

import { Fragment } from "react"

import { InfoCircleBoldDuotoneIcon } from "@solar-icons/react"

import { Divider } from "@/components/layout/divider"
import { SectionLine } from "@/components/layout/line"
import { Note } from "@/components/layout/note"
import { Space } from "@/components/layout/space"
import { LinkButton } from "@/components/ui/button"
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
import { slugify } from "@/helpers/slugify"
import { cn } from "@/lib/utils"
import SectionTitle from "@/portfolio/_components/section-title"
import { CONTACT_METHODS } from "@/portfolio/_configs/contact-methods"

const id = "contact"

function Contact() {
    return (
        <section id={id} className="@container">
            <Space />
            <SectionLine containerClassName="z-55" />
            <SectionTitle id={id} title="Contact" link="hash" />
            <Divider />
            <SectionLine />
            <Note
                className={cn(
                    "flex flex-col items-start justify-start text-start"
                )}
            >
                <div className="mb-0.5 flex items-center gap-1 self-start">
                    <InfoCircleBoldDuotoneIcon className="-ms-0.5 size-5" />
                    <strong>Disclaimer:</strong>
                </div>
                <span>
                    I have listed all my contact details so that{" "}
                    <strong>anyone can reach me</strong>. I am not a fan of
                    social media, so do not judge. <br className="md:hidden" />
                    <strong>
                        All contact methods below are used solely for
                        communication purposes
                    </strong>
                    .
                </span>
            </Note>
            <SectionLine />
            <Divider />
            <SectionLine />
            <address>
                {CONTACT_METHODS.map((method, index, arr) => (
                    <Fragment key={method.method}>
                        <TableContainer
                            className={cn(
                                "grid grid-cols-5 gap-safe-zone bg-background py-safe-zone-vertical"
                            )}
                        >
                            <TableCaption
                                className={cn(
                                    "sr-only absolute start-safe-zone top-safe-zone-vertical whitespace-pre-line font-wght-500"
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
                                            "grid grid-cols-4 gap-x-safe-zone",
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
                                                "grid grid-cols-4 gap-x-safe-zone",
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
                                                        "absolute start-safe-zone text-highlighted [&>svg]:size-[calc(1em*1.3)]",
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
                                                <LinkButton
                                                    href={platform.links.url}
                                                    nativeLink
                                                    keepFeedback
                                                    hoverSound="tick"
                                                    pressSound="link"
                                                    openInNewTab
                                                    translate="no"
                                                    tracking={{
                                                        eventName:
                                                            "click_contact_link",
                                                        eventParams: {
                                                            platform:
                                                                platform.title,
                                                            url: platform.links
                                                                .url
                                                        }
                                                    }}
                                                    className={cn(
                                                        "[--space-between:calc(var(--spacing-table-between)/2)]",
                                                        platform.links.hidden
                                                            && "text-transparent",
                                                        "group relative inline-block w-full text-base text-foreground font-wght-500",
                                                        "-my-[--space-between] py-[--space-between]",
                                                        {
                                                            "focus-visible":
                                                                "text-highlighted",
                                                            "group-first/table-row":
                                                                "-mb-[--space-between] -mt-safe-zone-vertical pb-[--space-between] pt-safe-zone-vertical",
                                                            "group-only/table-row":
                                                                "-my-safe-zone-vertical py-safe-zone-vertical",
                                                            "group-last/table-row":
                                                                "-mb-safe-zone-vertical -mt-[--space-between] pb-safe-zone-vertical pt-[--space-between]",

                                                            lg: "font-wght-600",
                                                            md: "text-sm"
                                                        }
                                                    )}
                                                >
                                                    <bdi
                                                        data-cursor="lock"
                                                        className={cn(
                                                            "-mx-1.5 -my-0.5 inline-block text-pretty px-1.5 py-0.5 underline",
                                                            {
                                                                "group-hover":
                                                                    "decoration-current decoration-solid",
                                                                "group-active":
                                                                    "decoration-current decoration-solid"
                                                            }
                                                        )}
                                                    >
                                                        {platform.links.text}
                                                    </bdi>
                                                </LinkButton>
                                            </TableCell>

                                            <TableCell
                                                className={cn(
                                                    "col-span-1 p-0 text-end align-top text-highlighted font-wght-500",
                                                    {
                                                        "@[59.375rem]":
                                                            "pe-safe-zone text-start",
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
                        {index < arr.length - 1
                            && arr[index + 1].method !== method.method && (
                                <SectionLine />
                            )}
                    </Fragment>
                ))}
            </address>
        </section>
    )
}

export default Contact
