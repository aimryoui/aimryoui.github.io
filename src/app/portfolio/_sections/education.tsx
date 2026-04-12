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
        <section>
            <Space />
            <SectionLine />
            <SectionTitle id="education" title="Education" />
            <SectionLine />
            <Divider />
            <SectionLine />
            <div
                data-slot="table-container"
                className={cn(
                    "relative grid w-full grid-cols-5 gap-[calc(var(--spacing)*6+var(--px)*2)] bg-background pb-3 pt-3.25"
                )}
            >
                <Table
                    className={cn(
                        "col-span-full col-start-2 grid table-fixed",
                        {
                            lg: "col-start-1 ps-6"
                        }
                    )}
                >
                    <TableCaption
                        className={cn("absolute left-6 whitespace-pre-line", {
                            lg: "static pb-3.25 font-bold"
                        })}
                    >
                        University
                    </TableCaption>

                    <colgroup>
                        <col />
                        <col span={2} />
                        <col />
                    </colgroup>

                    <TableHeader className={cn("sr-only grid")}>
                        <TableRow
                            className={cn(
                                "grid grid-cols-4 gap-x-[calc(var(--spacing)*6+var(--px)*2)]"
                            )}
                        >
                            <TableHead className="px-0">Period</TableHead>
                            <TableHead className="col-span-2 px-0">
                                Name
                            </TableHead>
                            <TableHead className="px-0">Information</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody className="grid gap-y-2">
                        <TableRow
                            className={cn(
                                "grid grid-cols-4 gap-x-[calc(var(--spacing)*6+var(--px)*2)] border-b-0 hover:bg-transparent"
                            )}
                        >
                            <TableCell
                                className={cn("p-0 align-top font-mono")}
                            >
                                09.2021 — 11.2025
                            </TableCell>

                            <TableCell
                                className={cn(
                                    "col-span-2 flex justify-between gap-x-[calc(var(--spacing)*6+var(--px)*2)] p-0 align-top font-bold text-foreground"
                                )}
                            >
                                Bachelor&#39;s Degree / Digital Art & Design{" "}
                                <At className="float-end mx-auto" />
                            </TableCell>

                            <TableCell className={cn("p-0 pe-6 align-top")}>
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
                                "grid grid-cols-4 gap-x-[calc(var(--spacing)*6+var(--px)*2)] border-b-0 hover:bg-transparent"
                            )}
                        >
                            <TableCell />

                            <TableCell
                                className={cn("col-span-2 p-0 align-top")}
                            >
                                Grade Point Average (GPA)
                            </TableCell>

                            <TableCell
                                className={cn(
                                    "p-0 pe-6 align-top font-bold text-highlighted"
                                )}
                            >
                                8.05
                            </TableCell>
                        </TableRow>

                        <TableRow
                            className={cn(
                                "grid grid-cols-4 gap-x-[calc(var(--spacing)*6+var(--px)*2)] border-b-0 hover:bg-transparent"
                            )}
                        >
                            <TableCell />

                            <TableCell
                                className={cn("col-span-2 p-0 align-top")}
                            >
                                Degree Classification
                            </TableCell>

                            <TableCell
                                className={cn(
                                    "p-0 pe-6 align-top font-bold italic text-foreground"
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
