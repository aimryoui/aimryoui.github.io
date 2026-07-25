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
            <SectionTitle id="education" title="Education" />
            <SectionLine />
            <Divider />
            <SectionLine />
            <TableContainer
                className={cn(
                    "grid grid-cols-5 gap-x-[calc(var(--spacing)*6+var(--px)*2)] gap-y-4 bg-background py-4.5",
                    {
                        lg: "py-5.5"
                    }
                )}
            >
                <TableCaption
                    className={cn(
                        "absolute left-6 top-4.5 whitespace-pre-line font-wght-500",
                        {
                            "@[50.125rem]":
                                "static col-span-full whitespace-normal px-6 font-wght-600"
                        }
                    )}
                >
                    University
                </TableCaption>
                <Table
                    aria-label="Education"
                    className={cn(
                        "col-span-full col-start-2 grid table-fixed gap-y-2",
                        {
                            "@[50.125rem]": "col-start-1 gap-y-4 px-6"
                        }
                    )}
                >
                    <TableHeader
                        className={cn("sr-only grid", {
                            "[&>tr]": [
                                "grid grid-cols-4 gap-x-[calc(var(--spacing)*6+var(--px)*2)]",
                                {
                                    "last:*": "pe-6"
                                }
                            ]
                        })}
                    >
                        <TableHead className="px-0">Period</TableHead>
                        <TableHead className="col-span-2 px-0" isRowHeader>
                            Name
                        </TableHead>
                        <TableHead className="px-0">Detail</TableHead>
                    </TableHeader>

                    <TableBody
                        className={cn("grid gap-y-2", {
                            "@[50.125rem]": "gap-y-4"
                        })}
                    >
                        <TableRow
                            id="education-degree"
                            className={cn(
                                "grid grid-cols-4 gap-x-[calc(var(--spacing)*6+var(--px)*2)]",
                                {
                                    "@[59.375rem]": "grid-cols-2",
                                    "last:*": "pe-6"
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
                                    "col-span-2 flex justify-between gap-x-[calc(var(--spacing)*6+var(--px)*2)] text-pretty p-0 align-top text-foreground font-wght-500",
                                    {
                                        "@[59.375rem]": "col-span-1 mt-9",
                                        lg: "font-wght-600"
                                    }
                                )}
                            >
                                Bachelor of Arts / Digital Art & Design{" "}
                                <At className="float-end mx-auto" />
                            </TableCell>

                            <TableCell
                                className={cn("p-0 align-top", {
                                    "@[59.375rem]": "mt-9"
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
                                "grid grid-cols-4 gap-x-[calc(var(--spacing)*6+var(--px)*2)] border-b-0 hover:bg-transparent",
                                {
                                    "@[59.375rem]": "grid-cols-2",
                                    "last:*": "pe-6"
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
                                "grid grid-cols-4 gap-x-[calc(var(--spacing)*6+var(--px)*2)] border-b-0 hover:bg-transparent",
                                {
                                    "@[59.375rem]": "grid-cols-2",
                                    "last:*": "pe-6"
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
                                "grid grid-cols-4 gap-x-[calc(var(--spacing)*6+var(--px)*2)] border-b-0 hover:bg-transparent",
                                {
                                    "@[59.375rem]": "grid-cols-2",
                                    "last:*": "pe-6"
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
