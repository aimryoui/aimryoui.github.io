"use client"

import { Divider } from "@/components/layout/divider"
import { SectionLine } from "@/components/layout/line"
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
import { At } from "@/components/ui/typography"
import { cn } from "@/lib/utils"
import SectionTitle from "@/portfolio/_components/section-title"

function Education() {
    return (
        <section className="@container">
            <Space />
            <SectionLine containerClassName="z-55" />
            <SectionTitle
                id="education"
                title="Education"
                link="hash"
                className="sticky top-0 z-50"
            />
            <Divider />
            <SectionLine />
            <TableContainer
                className={cn(
                    "grid grid-cols-5 gap-x-safe-zone gap-y-table-between bg-background py-safe-zone-vertical"
                )}
            >
                <TableCaption
                    className={cn(
                        "sticky top-[calc(var(--spacing-space)+var(--spacing-safe-zone-vertical))] z-45 h-fit whitespace-pre-line ps-safe-zone font-wght-500",
                        {
                            "@[56.5rem]":
                                "static col-span-full whitespace-normal px-safe-zone font-wght-600"
                        }
                    )}
                >
                    University
                </TableCaption>
                <Table
                    aria-label="Education"
                    className={cn(
                        "col-span-full col-start-2 grid table-fixed gap-y-table-between",
                        {
                            "@[56.5rem]":
                                "col-start-1 gap-y-table-between px-safe-zone"
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
                        <TableHead id="period" className="px-0">
                            Period
                        </TableHead>
                        <TableHead
                            id="name"
                            className="col-span-2 px-0"
                            isRowHeader
                        >
                            Name
                        </TableHead>
                        <TableHead id="detail" className="px-0">
                            Detail
                        </TableHead>
                    </TableHeader>

                    <TableBody
                        className={cn("grid gap-y-table-between", {
                            "@[56.5rem]": "gap-y-table-between"
                        })}
                    >
                        <TableRow
                            id="education-degree"
                            className={cn("grid grid-cols-4 gap-x-safe-zone", {
                                "@[69rem]": "grid-cols-2",
                                "last:*": "pe-safe-zone"
                            })}
                        >
                            <TableCell
                                className={cn("p-0 align-top font-mono", {
                                    "@[69rem]": "absolute"
                                })}
                            >
                                <bdi>Sep</bdi> <bdi>2021</bdi> — <bdi>Nov</bdi>{" "}
                                <bdi>2025</bdi>
                            </TableCell>

                            <TableCell
                                className={cn(
                                    "col-span-2 flex justify-between gap-x-safe-zone text-pretty p-0 align-top text-foreground font-wght-500",
                                    {
                                        "@[69rem]": "col-span-1 mt-[2em]",
                                        lg: "font-wght-600"
                                    }
                                )}
                            >
                                Bachelor of Arts / Digital Art & Design{" "}
                                <At className="float-end mx-auto" />
                            </TableCell>

                            <TableCell
                                className={cn("p-0 align-top", {
                                    "@[69rem]": "mt-[2em]"
                                })}
                            >
                                <LinkButton
                                    href="https://daihoc.fpt.edu.vn/hcm/"
                                    nativeLink
                                    keepFeedback
                                    hoverSound="tick"
                                    pressSound="link"
                                    openInNewTab
                                    aria-label="Go to the FPT University website"
                                    translate="no"
                                    tracking={{
                                        eventName: "click_education_link",
                                        eventParams: {
                                            institution: "FPT University HCMC",
                                            url: "https://daihoc.fpt.edu.vn/hcm/"
                                        }
                                    }}
                                    className={cn(
                                        "[--space-between:calc(var(--spacing-table-between)/2)]",
                                        "group relative inline-block w-full text-base text-foreground font-wght-500",
                                        "-my-[--space-between] py-[--space-between]",
                                        {
                                            "focus-visible": "text-highlighted",
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
                                    <span
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
                                        FPT University HCMC
                                    </span>
                                </LinkButton>
                            </TableCell>
                        </TableRow>

                        <TableRow
                            id="education-grade"
                            className={cn(
                                "grid grid-cols-4 gap-x-safe-zone border-b-0 hover:bg-transparent",
                                {
                                    "@[69rem]": "grid-cols-2",
                                    "last:*": "pe-safe-zone"
                                }
                            )}
                        >
                            <TableCell
                                className={cn({
                                    "@[69rem]": "hidden"
                                })}
                            />

                            <TableCell
                                className={cn("col-span-2 p-0 align-top", {
                                    "@[69rem]": "col-span-1"
                                })}
                            >
                                Grade Point Average (GPA)
                            </TableCell>

                            <TableCell
                                className={cn(
                                    "p-0 align-top text-highlighted font-wght-600"
                                )}
                            >
                                8.05
                            </TableCell>
                        </TableRow>

                        <TableRow
                            id="education-classification"
                            className={cn(
                                "grid grid-cols-4 gap-x-safe-zone border-b-0 hover:bg-transparent",
                                {
                                    "@[69rem]": "grid-cols-2",
                                    "last:*": "pe-safe-zone"
                                }
                            )}
                        >
                            <TableCell
                                className={cn({
                                    "@[69rem]": "hidden"
                                })}
                            />

                            <TableCell
                                className={cn("col-span-2 p-0 align-top", {
                                    "@[69rem]": "col-span-1"
                                })}
                            >
                                Degree Classification
                            </TableCell>

                            <TableCell
                                className={cn(
                                    "p-0 align-top italic text-foreground font-wght-600"
                                )}
                            >
                                Very Good
                            </TableCell>
                        </TableRow>

                        <TableRow
                            id="education-scholarships"
                            className={cn(
                                "grid grid-cols-4 gap-x-safe-zone border-b-0 hover:bg-transparent",
                                {
                                    "@[69rem]": "grid-cols-2",
                                    "last:*": "pe-safe-zone"
                                }
                            )}
                        >
                            <TableCell
                                className={cn({
                                    "@[69rem]": "hidden"
                                })}
                            />

                            <TableCell
                                className={cn("col-span-2 p-0 align-top", {
                                    "@[69rem]": "col-span-1"
                                })}
                            >
                                Merit-Based Entrance Scholarship
                            </TableCell>

                            <TableCell
                                className={cn(
                                    "p-0 align-top text-highlighted font-wght-600"
                                )}
                            >
                                30%
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </section>
    )
}

export default Education
