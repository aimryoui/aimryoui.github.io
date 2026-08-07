"use client"

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
import { At, Link } from "@/components/ui/typography"
import { cn } from "@/lib/utils"
import SectionTitle from "@/portfolio/_components/section-title"

function Education() {
    return (
        <section className="@container">
            <Space />
            <SectionLine />
            <SectionTitle
                id="education"
                title="Education"
                className="sticky top-0 z-50"
            />
            <SectionLine containerClassName="sticky top-space z-50" />
            <Divider />
            <SectionLine />
            <TableContainer
                className={cn(
                    "grid grid-cols-5 gap-x-[calc(var(--spacing-safe-zone)+var(--px)*2)] gap-y-table-between bg-background py-safe-zone-vertical"
                )}
            >
                <TableCaption
                    className={cn(
                        "sticky top-[calc(var(--spacing-space)+var(--spacing-safe-zone-vertical))] z-45 h-fit whitespace-pre-line ps-safe-zone font-wght-500",
                        {
                            "@[50.125rem]":
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
                            "@[50.125rem]":
                                "col-start-1 gap-y-table-between px-safe-zone"
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
                            "@[50.125rem]": "gap-y-table-between"
                        })}
                    >
                        <TableRow
                            id="education-degree"
                            className={cn(
                                "grid grid-cols-4 gap-x-[calc(var(--spacing-safe-zone)+var(--px)*2)]",
                                {
                                    "@[59.375rem]": "grid-cols-2",
                                    "last:*": "pe-safe-zone"
                                }
                            )}
                        >
                            <TableCell
                                className={cn("p-0 align-top font-mono", {
                                    "@[59.375rem]": "absolute"
                                })}
                            >
                                09.2021 — 11.2025
                            </TableCell>

                            <TableCell
                                className={cn(
                                    "col-span-2 flex justify-between gap-x-[calc(var(--spacing-safe-zone)+var(--px)*2)] text-pretty p-0 align-top text-foreground font-wght-500",
                                    {
                                        "@[59.375rem]": "col-span-1 mt-[2em]",
                                        lg: "font-wght-600"
                                    }
                                )}
                            >
                                Bachelor of Arts / Digital Art & Design{" "}
                                <At className="float-end mx-auto" />
                            </TableCell>

                            <TableCell
                                className={cn("p-0 align-top", {
                                    "@[59.375rem]": "mt-[2em]"
                                })}
                            >
                                <Link
                                    href="https://daihoc.fpt.edu.vn/hcm/"
                                    openInNewTab
                                    aria-label="Go to the FPT University website"
                                    className="lg:font-wght-600"
                                >
                                    FPT University HCMC
                                </Link>
                            </TableCell>
                        </TableRow>

                        <TableRow
                            id="education-grade"
                            className={cn(
                                "grid grid-cols-4 gap-x-[calc(var(--spacing-safe-zone)+var(--px)*2)] border-b-0 hover:bg-transparent",
                                {
                                    "@[59.375rem]": "grid-cols-2",
                                    "last:*": "pe-safe-zone"
                                }
                            )}
                        >
                            <TableCell
                                className={cn({
                                    "@[59.375rem]": "hidden"
                                })}
                            />

                            <TableCell
                                className={cn("col-span-2 p-0 align-top", {
                                    "@[59.375rem]": "col-span-1"
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
                                "grid grid-cols-4 gap-x-[calc(var(--spacing-safe-zone)+var(--px)*2)] border-b-0 hover:bg-transparent",
                                {
                                    "@[59.375rem]": "grid-cols-2",
                                    "last:*": "pe-safe-zone"
                                }
                            )}
                        >
                            <TableCell
                                className={cn({
                                    "@[59.375rem]": "hidden"
                                })}
                            />

                            <TableCell
                                className={cn("col-span-2 p-0 align-top", {
                                    "@[59.375rem]": "col-span-1"
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
                                "grid grid-cols-4 gap-x-[calc(var(--spacing-safe-zone)+var(--px)*2)] border-b-0 hover:bg-transparent",
                                {
                                    "@[59.375rem]": "grid-cols-2",
                                    "last:*": "pe-safe-zone"
                                }
                            )}
                        >
                            <TableCell
                                className={cn({
                                    "@[59.375rem]": "hidden"
                                })}
                            />

                            <TableCell
                                className={cn("col-span-2 p-0 align-top", {
                                    "@[59.375rem]": "col-span-1"
                                })}
                            >
                                Full Scholarship
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
