import { Fragment } from "react"

import { Divider } from "@/components/layout/divider"
import { SectionLine } from "@/components/layout/line"
import { Space } from "@/components/layout/space"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import { At, Link } from "@/components/ui/typography"
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
                startDate: "05.2026",
                endDate: "06.2026",
                position: "Freelance UI/UX Designer",
                organization: {
                    text: "FINA Care Studio",
                    url: "https://fina-studio.com",
                    ariaLabel: "Go to the FINA Care Studio website"
                }
            },
            {
                startDate: "04.2026",
                endDate: "06.2026",
                position: "Freelance Designer",
                organization: {
                    text: "Cường Khanh Advertising Co., Ltd",
                    url: "https://cuongkhanhadv.com.vn",
                    ariaLabel: "Go to the Cường Khanh Advertising website"
                }
            },
            {
                startDate: "01.2026",
                endDate: "01.2026",
                position: "Freelance Designer",
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
                endDate: "04.2025",
                position: "Visual Designer",
                organization: {
                    text: "Xoay Vật Chuyển Dòng",
                    url: "https://www.facebook.com/xoayvatchuyendong.project",
                    ariaLabel: "Go to the Xoay Vật Chuyển Dòng project fanpage"
                }
            },
            {
                startDate: "02.2025",
                endDate: "03.2025",
                position: "Freelance Designer",
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
        <section>
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
                    <div
                        data-slot="table-container"
                        className={cn(
                            "relative grid w-full grid-cols-5 gap-[calc(var(--spacing)*6+var(--px)*2)] bg-background py-3",
                            { lg: "py-4" }
                        )}
                    >
                        <Table
                            className={cn(
                                "col-span-full col-start-2 grid table-fixed gap-y-2",
                                {
                                    xl: "col-start-1 gap-y-4 px-6"
                                }
                            )}
                        >
                            <TableCaption
                                className={cn(
                                    "absolute left-6 whitespace-pre-line",
                                    {
                                        xl: "static whitespace-normal font-bold"
                                    }
                                )}
                            >
                                {section.section}
                            </TableCaption>

                            <TableHeader className={cn("sr-only grid")}>
                                <TableRow
                                    className={cn(
                                        "grid grid-cols-4 gap-x-[calc(var(--spacing)*6+var(--px)*2)]"
                                    )}
                                >
                                    <TableHead className="px-0">
                                        Period
                                    </TableHead>
                                    <TableHead className="px-0">
                                        Position
                                    </TableHead>
                                    <TableHead className="col-span-2 px-0 pe-6">
                                        Organization
                                    </TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody
                                className={cn("grid gap-y-2", {
                                    xl: "gap-y-4"
                                })}
                            >
                                {section.items.map((place, index) => (
                                    <TableRow
                                        key={index}
                                        className={cn(
                                            "relative grid grid-cols-4 gap-x-[calc(var(--spacing)*6+var(--px)*2)]",
                                            {
                                                xl: "grid-cols-2"
                                            }
                                        )}
                                    >
                                        <TableCell
                                            className={cn(
                                                "p-0 align-top font-mono",
                                                {
                                                    xl: "absolute"
                                                }
                                            )}
                                        >
                                            {place.startDate === place.endDate
                                                ? place.startDate
                                                : `${place.startDate} — ${place.endDate ?? "Now"}`}
                                        </TableCell>

                                        <TableCell
                                            className={cn(
                                                "flex justify-between gap-x-[calc(var(--spacing)*6+var(--px)*2)] p-0 align-top font-bold text-foreground",
                                                {
                                                    xl: "mt-6 gap-x-2"
                                                }
                                            )}
                                        >
                                            {place.position}{" "}
                                            {place.organization && (
                                                <At className="float-end" />
                                            )}
                                        </TableCell>

                                        <TableCell
                                            colSpan={2}
                                            className={cn(
                                                "col-span-2 p-0 pe-6 align-top",
                                                {
                                                    xl: "col-span-1 mt-6"
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
                                                            "text-muted-foreground"
                                                    )}
                                                >
                                                    {place.organization.text}
                                                </Link>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>

                            {index === arr.length - 1 && (
                                <TableFooter className="grid border-t-0 bg-transparent">
                                    <TableRow className="hover:bg-transparent">
                                        <TableCell
                                            colSpan={4}
                                            className={cn(
                                                "flex flex-col gap-y-2 p-0 pt-1.5 align-top",
                                                { lg: "gap-y-4 pt-0" }
                                            )}
                                        >
                                            <SectionLine />
                                            And a bunch of University course
                                            projects or miscellaneous freelance
                                            jobs on the road...
                                        </TableCell>
                                    </TableRow>
                                </TableFooter>
                            )}
                        </Table>
                    </div>
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
