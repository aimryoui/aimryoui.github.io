import { Divider } from "@/components/layout/divider"
import { SectionLine } from "@/components/layout/line"
import { Space } from "@/components/layout/space"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
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
            <div
                data-slot="table-container"
                className={cn(
                    "relative grid w-full grid-cols-5 gap-[calc(var(--spacing)*6+var(--px)*2)] bg-background py-4.5"
                )}
            >
                <Table
                    className={cn(
                        "col-span-full col-start-2 grid table-fixed gap-y-2",
                        {
                            "@[50.125rem]": "col-start-1 gap-y-4 px-6"
                        }
                    )}
                >
                    <TableCaption
                        className={cn(
                            "absolute left-6 whitespace-pre-line font-wght-500",
                            {
                                "@[50.125rem]": "static font-wght-600"
                            }
                        )}
                    >
                        University
                    </TableCaption>

                    <TableHeader className={cn("sr-only grid")}>
                        <TableRow
                            className={cn(
                                "grid grid-cols-4 gap-x-[calc(var(--spacing)*6+var(--px)*2)]",
                                {
                                    "last:*": "pe-6"
                                }
                            )}
                        >
                            <TableHead className="px-0">Period</TableHead>
                            <TableHead className="col-span-2 px-0">
                                Name
                            </TableHead>
                            <TableHead className="px-0">Detail</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody
                        className={cn("grid gap-y-2", {
                            "@[50.125rem]": "gap-y-4",
                            lg: "gap-y-4"
                        })}
                    >
                        <TableRow
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
                                    "col-span-2 flex justify-between gap-x-[calc(var(--spacing)*6+var(--px)*2)] p-0 align-top text-foreground font-wght-600",
                                    {
                                        "@[59.375rem]": "col-span-1 mt-8"
                                    }
                                )}
                            >
                                Bachelor of Arts / Digital Art & Design{" "}
                                <At className="float-end mx-auto" />
                            </TableCell>

                            <TableCell
                                className={cn("p-0 align-top", {
                                    "@[59.375rem]": "mt-8"
                                })}
                            >
                                <Link
                                    href="https://daihoc.fpt.edu.vn/hcm/"
                                    openInNewTab
                                    aria-label="Go to the FPT University website"
                                >
                                    FPT University HCMC
                                </Link>
                            </TableCell>
                        </TableRow>

                        <TableRow
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
                    </TableBody>
                </Table>
            </div>
        </section>
    )
}

export default Education
