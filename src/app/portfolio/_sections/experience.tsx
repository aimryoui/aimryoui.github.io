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
    TableFooter,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import { At, Link } from "@/components/ui/typography"
import { slugify } from "@/helpers/slugify"
import { cn } from "@/lib/utils"
import SectionTitle from "@/portfolio/_components/section-title"

interface SectionProps {
    startDate: string
    endDate?: string
    position: string
    organization?: {
        text: string
        url: string
        ariaLabel?: string
        duplicate?: boolean
    }
}

interface Section {
    section: string
    items: SectionProps[]
}

const sections: Section[] = [
    {
        section: "Contract",
        items: [
            {
                startDate: "12.2025",
                endDate: "07.2026",
                position: "Motion Designer",
                organization: {
                    text: "SAN Data Systems Inc.",
                    url: "https://sandatasystem.com"
                }
            },
            {
                startDate: "01.2024",
                endDate: "04.2024",
                position: "Design Internship",
                organization: {
                    text: "Amazing Tech Co.",
                    url: "https://amazingtech.vn",
                    ariaLabel: "Go to the Amazing Tech Company website"
                }
            }
        ]
    },
    {
        section: "Clubs and \nCategory Projects",
        items: [
            {
                startDate: "12.2024",
                position: "Design Team Mentor",
                organization: {
                    text: "Cóc Sài Gòn Communication Club",
                    url: "https://www.facebook.com/cocsaigonfuhcm"
                }
            },
            {
                startDate: "06.2022",
                position: "HR Media Team",
                organization: {
                    text: "Cóc Sài Gòn Communication Club",
                    url: "https://www.facebook.com/cocsaigonfuhcm",
                    duplicate: true
                }
            },
            {
                startDate: "10.2023",
                endDate: "11.2024",
                position: "Design Team Lead",
                organization: {
                    text: "Cóc Sài Gòn Communication Club",
                    url: "https://www.facebook.com/cocsaigonfuhcm",
                    duplicate: true
                }
            },
            {
                startDate: "10.2021",
                endDate: "09.2023",
                position: "Designer",
                organization: {
                    text: "Cóc Sài Gòn Communication Club",
                    url: "https://www.facebook.com/cocsaigonfuhcm",
                    duplicate: true
                }
            },
            {
                startDate: "01.2023",
                endDate: "03.2023",
                position: "Design Team Lead",
                organization: {
                    text: "Humans of FPTU",
                    url: "https://www.facebook.com/HumansOfFPTU.CSG"
                }
            },
            {
                startDate: "05.2022",
                endDate: "01.2023",
                position: "Designer",
                organization: {
                    text: "Humans of FPTU",
                    url: "https://www.facebook.com/HumansOfFPTU.CSG",
                    duplicate: true
                }
            }
        ]
    },
    {
        section: "Freelance",
        items: [
            {
                startDate: "From 2022",
                position: "Freelancer"
            },
            {
                startDate: "04.2026",
                endDate: "07.2026",
                position: "Freelance Designer",
                organization: {
                    text: "Cường Khanh Advertising Co., Ltd",
                    url: "https://cuongkhanhadv.com.vn",
                    ariaLabel: "Go to the Cường Khanh Advertising website"
                }
            },
            {
                startDate: "05.2026",
                endDate: "06.2026",
                position: "UI/UX Designer",
                organization: {
                    text: "FINA Care Studio",
                    url: "https://fina-studio.com",
                    ariaLabel: "Go to the FINA Care Studio website"
                }
            },
            {
                startDate: "01.2026",
                endDate: "01.2026",
                position: "Logo Designer",
                organization: {
                    text: "Nguyên Liệu 24H Co., Ltd",
                    url: "https://masothue.com/0319246054-cong-ty-tnhh-nguyen-lieu-24h",
                    ariaLabel: "Go see the Nguyên Liệu 24H information"
                }
            },
            {
                startDate: "03.2025",
                endDate: "03.2025",
                position: "Freelance Designer",
                organization: {
                    text: "Tọa Độ Cồng Chiêng",
                    url: "https://www.facebook.com/toadocongchieng",
                    ariaLabel: "Go to the Tọa Độ Cồng Chiêng project fanpage"
                }
            },
            {
                startDate: "02.2025",
                endDate: "10.2025",
                position: "UI/UX Designer",
                organization: {
                    text: "Nalee Viet Nam JSC",
                    url: "http://naleegroup.com",
                    ariaLabel: "Go to the Nalee Viet Nam JSC website"
                }
            },
            {
                startDate: "02.2025",
                endDate: "04.2025",
                position: "Key Visual Designer",
                organization: {
                    text: "Xoay Vật Chuyển Dòng",
                    url: "https://www.facebook.com/xoayvatchuyendong.project",
                    ariaLabel: "Go to the Xoay Vật Chuyển Dòng project fanpage"
                }
            },
            {
                startDate: "02.2025",
                endDate: "03.2025",
                position: "Key Visual Designer",
                organization: {
                    text: "Oẳn Tù Tì Production",
                    url: "https://www.facebook.com/OanTuTiProduction"
                }
            },
            {
                startDate: "01.2025",
                endDate: "04.2025",
                position: "Art Director",
                organization: {
                    text: "The Present Thinker Crew",
                    url: "https://www.facebook.com/phimnganmeoii"
                }
            },
            {
                startDate: "07.2023",
                endDate: "08.2023",
                position: "Free Designer",
                organization: {
                    text: "Đơ Ngã Đỡ Production",
                    url: "https://www.facebook.com/phimnganroi"
                }
            },
            {
                startDate: "03.2023",
                endDate: "05.2023",
                position: "Freelance Designer",
                organization: {
                    text: "bédeb Production",
                    url: "https://www.facebook.com/phimngannotket"
                }
            },
            {
                startDate: "02.2023",
                endDate: "03.2023",
                position: "Key Visual Designer",
                organization: {
                    text: "RMIT Vietnam Finance Club",
                    url: "https://www.facebook.com/RMITVietnamResearchChallenge"
                }
            }
        ]
    }
]

function Experience() {
    return (
        <section className="@container">
            <Space />
            <SectionLine />
            <SectionTitle
                id="experience"
                title="Experience"
                note="Information"
            />
            <SectionLine />
            <Divider />
            <SectionLine />

            {sections.map((section, index, arr) => (
                <Fragment key={section.section}>
                    <TableContainer
                        className={cn(
                            "grid grid-cols-5 gap-x-[calc(var(--spacing)*6+var(--px)*2)] gap-y-table-between bg-background py-safe-zone-vertical"
                        )}
                    >
                        <TableCaption
                            className={cn(
                                "absolute left-safe-zone top-safe-zone-vertical whitespace-pre-line font-wght-500",
                                {
                                    "@[59.375rem]":
                                        "static col-span-full whitespace-normal px-safe-zone font-wght-600"
                                }
                            )}
                        >
                            {section.section}
                        </TableCaption>
                        <Table
                            aria-label="Experience"
                            className={cn(
                                "col-span-full col-start-2 grid table-fixed gap-y-table-between",
                                {
                                    "@[59.375rem]": "col-start-1 ps-safe-zone"
                                }
                            )}
                        >
                            <TableHeader
                                className={cn("sr-only grid", {
                                    "[&>tr]": [
                                        "grid grid-cols-4 gap-x-[calc(var(--spacing)*6+var(--px)*2)]",
                                        {
                                            "last:*": "pe-safe-zone"
                                        }
                                    ]
                                })}
                            >
                                <TableHead className="px-0">Period</TableHead>
                                <TableHead className="px-0" isRowHeader>
                                    Position
                                </TableHead>
                                <TableHead className="col-span-2 px-0">
                                    Organization
                                </TableHead>
                            </TableHeader>

                            <TableBody
                                items={section.items.map((place) => ({
                                    ...place,
                                    id: slugify(
                                        `${place.startDate} ${place.position} ${place.organization?.text}`
                                    )
                                }))}
                                className={cn("grid gap-y-table-between")}
                            >
                                {(place) => (
                                    <TableRow
                                        className={cn(
                                            "relative grid grid-cols-4 gap-x-[calc(var(--spacing-safe-zone)+var(--px)*2)]",
                                            {
                                                "@[50.125rem]": "grid-cols-2",
                                                "last:*": "pe-safe-zone"
                                            }
                                        )}
                                    >
                                        <TableCell
                                            className={cn(
                                                "p-0 align-top font-mono",
                                                {
                                                    "@[50.125rem]": "absolute"
                                                }
                                            )}
                                        >
                                            {place.startDate ===
                                            place.endDate ? (
                                                place.startDate
                                            ) : (
                                                <>
                                                    {place.startDate} —{" "}
                                                    {place.endDate ?? (
                                                        <span className="text-foreground">
                                                            Now
                                                        </span>
                                                    )}
                                                </>
                                            )}
                                        </TableCell>

                                        <TableCell
                                            className={cn(
                                                "flex justify-between gap-x-[calc(var(--spacing-safe-zone)+var(--px)*2)] p-0 align-top text-foreground font-wght-500",
                                                {
                                                    "@[50.125rem]":
                                                        "mt-[1.5em] gap-x-2",
                                                    lg: "font-wght-600"
                                                }
                                            )}
                                        >
                                            {place.position}{" "}
                                            {place.organization && (
                                                <At className="float-end" />
                                            )}
                                        </TableCell>

                                        <TableCell
                                            className={cn(
                                                "col-span-2 p-0 align-top",
                                                {
                                                    "@[50.125rem]":
                                                        "col-span-1 mt-[1.5em]"
                                                }
                                            )}
                                        >
                                            {place.organization && (
                                                <Link
                                                    href={
                                                        place.organization.url
                                                    }
                                                    aria-label={
                                                        place.organization
                                                            .ariaLabel
                                                    }
                                                    openInNewTab
                                                    translate="no"
                                                    className={cn(
                                                        place.organization
                                                            .duplicate &&
                                                            "text-muted-foreground",
                                                        "lg:font-wght-600"
                                                    )}
                                                >
                                                    {place.organization.text}
                                                </Link>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>

                            {index === arr.length - 1 && (
                                <TableFooter className="grid border-t-0 bg-transparent">
                                    <TableRow
                                        className={cn({
                                            hover: "bg-transparent",
                                            "last:*": "pe-safe-zone"
                                        })}
                                    >
                                        <TableCell
                                            colSpan={3}
                                            className={cn(
                                                "flex flex-col gap-y-safe-zone-vertical p-0 pt-[calc(var(--spacing-safe-zone-vertical)-var(--spacing-table-between))] align-top"
                                                // {
                                                //     "@[59.375rem]": "pt-0.5"
                                                // }
                                            )}
                                        >
                                            <SectionLine
                                                className={cn(
                                                    "-right-[calc(var(--spacing-safe-zone)*2)]",
                                                    {
                                                        lg: [
                                                            "-right-[calc(var(--spacing-safe-zone)*2)] left-auto"
                                                        ]
                                                    }
                                                )}
                                            />
                                            And a bunch of University course
                                            projects or miscellaneous freelance
                                            jobs on the road...
                                        </TableCell>
                                    </TableRow>
                                </TableFooter>
                            )}
                        </Table>
                    </TableContainer>
                    {index < arr.length - 1 &&
                        arr[index + 1].section !== section.section && (
                            <SectionLine />
                        )}
                </Fragment>
            ))}

            <SectionLine />
        </section>
    )
}

export default Experience
