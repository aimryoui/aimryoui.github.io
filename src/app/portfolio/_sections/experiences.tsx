import React from "react"

import SectionTitle from "@/app/portfolio/_components/section-title"
import { Divider } from "@/components/layout/divider"
import { SectionLine } from "@/components/layout/line"
import { Space } from "@/components/layout/space"
import { At, Bold, Highlight, Link, Text } from "@/components/ui/typography"
import { cn } from "@/lib/utils"

interface SectionProps {
    startDate: string
    endDate?: string
    role: string
    at?: {
        text: string
        url: string
        duplicate?: boolean
    }
}

interface Section {
    section: string
    places: SectionProps[]
}

const sections: Section[] = [
    {
        section: "Company",
        places: [
            {
                startDate: "12.2025",
                role: "Motion Designer",
                at: {
                    text: "San Data Systems Inc.",
                    url: "https://sandatasystem.com"
                }
            },
            {
                startDate: "01.2024",
                endDate: "04.2024",
                role: "Design Internship",
                at: {
                    text: "Amazing Tech Co.",
                    url: "https://amazingtech.vn"
                }
            }
        ]
    },
    {
        section: `Clubs and \nCategory Projects`,
        places: [
            {
                startDate: "12.2024",
                role: "Design Team Mentor",
                at: {
                    text: "Cóc Sài Gòn Communication Club",
                    url: "https://www.facebook.com/cocsaigonfuhcm"
                }
            },
            {
                startDate: "06.2022",
                role: "HR Media Team",
                at: {
                    text: "Cóc Sài Gòn Communication Club",
                    url: "https://www.facebook.com/cocsaigonfuhcm",
                    duplicate: true
                }
            },
            {
                startDate: "10.2023",
                endDate: "11.2024",
                role: "Design Team Lead",
                at: {
                    text: "Cóc Sài Gòn Communication Club",
                    url: "https://www.facebook.com/cocsaigonfuhcm",
                    duplicate: true
                }
            },
            {
                startDate: "10.2021",
                endDate: "09.2023",
                role: "Designer",
                at: {
                    text: "Cóc Sài Gòn Communication Club",
                    url: "https://www.facebook.com/cocsaigonfuhcm",
                    duplicate: true
                }
            },
            {
                startDate: "01.2023",
                endDate: "03.2023",
                role: "Design Team Lead",
                at: {
                    text: "Humans of FPTU",
                    url: "https://www.facebook.com/HumansOfFPTU.CSG"
                }
            },
            {
                startDate: "05.2022",
                endDate: "01.2023",
                role: "Designer",
                at: {
                    text: "Humans of FPTU",
                    url: "https://www.facebook.com/HumansOfFPTU.CSG",
                    duplicate: true
                }
            }
        ]
    },
    {
        section: "Freelance",
        places: [
            {
                startDate: "From 2022",
                role: "Freelancer"
            },
            {
                startDate: "03.2025",
                endDate: "03.2025",
                role: "Freelance Designer",
                at: {
                    text: "Tọa Độ Cồng Chiêng",
                    url: "https://www.facebook.com/toadocongchieng"
                }
            },
            {
                startDate: "02.2025",
                endDate: "04.2025",
                role: "Visual Designer",
                at: {
                    text: "Xoay Vật Chuyển Dòng",
                    url: "https://www.facebook.com/xoayvatchuyendong.project"
                }
            },
            {
                startDate: "02.2025",
                endDate: "03.2025",
                role: "Freelance Designer",
                at: {
                    text: "Oẳn Tù Tì Production",
                    url: "https://www.facebook.com/OanTuTiProduction"
                }
            },
            {
                startDate: "01.2025",
                endDate: "04.2025",
                role: "Art Director",
                at: {
                    text: "The Present Thinker Crew",
                    url: "https://www.facebook.com/phimnganmeoii"
                }
            },
            {
                startDate: "07.2023",
                endDate: "08.2023",
                role: "Free Designer",
                at: {
                    text: "Đơ Ngã Đỡ Production",
                    url: "https://www.facebook.com/phimnganroi"
                }
            },
            {
                startDate: "03.2023",
                endDate: "05.2023",
                role: "Freelance Designer",
                at: {
                    text: "bédeb Production",
                    url: "https://www.facebook.com/phimngannotket"
                }
            },
            {
                startDate: "02.2023",
                endDate: "03.2023",
                role: "Key Visual Designer",
                at: {
                    text: "RMIT Vietnam Finance Club",
                    url: "https://www.facebook.com/RMITVietnamResearchChallenge"
                }
            }
        ]
    }
]

function SectionExperiences() {
    return (
        <section>
            <Space />
            <SectionLine />
            <SectionTitle
                id="experiences"
                title="Experiences"
                note="Information"
            />
            <SectionLine />
            <Divider />
            <SectionLine />
            {sections.map((section, index, arr) => (
                <React.Fragment key={section.section}>
                    <div
                        className={cn(
                            "bg-background relative grid grid-cols-5 gap-6 gap-y-3 pt-3.5 pb-4 [&>*:first-child]:ps-6 [&>*:last-child]:pe-6"
                        )}
                    >
                        <Highlight
                            className={cn("font-normal whitespace-pre-line")}
                            style={{
                                gridRow: `span ${section.places.length.toString()} / span ${section.places.length.toString()}`
                            }}
                        >
                            {section.section}
                        </Highlight>

                        {section.places.map((place, placeindex) => (
                            <React.Fragment key={placeindex}>
                                {place.at ? (
                                    <>
                                        <Text mono>
                                            {place.startDate === place.endDate
                                                ? place.startDate
                                                : `${place.startDate} — ${place.endDate ?? "Now"}`}
                                        </Text>
                                        <Bold>
                                            {place.role}{" "}
                                            <At className="float-end" />
                                        </Bold>
                                        <Link
                                            href={place.at.url}
                                            openInNewTab
                                            translate="no"
                                            className={cn(
                                                "col-span-2",
                                                place.at.duplicate &&
                                                    "text-muted-foreground"
                                            )}
                                        >
                                            {place.at.text}
                                        </Link>
                                    </>
                                ) : (
                                    <>
                                        <Text mono>{place.startDate}</Text>
                                        <Bold className={cn("col-span-3")}>
                                            {place.role}
                                        </Bold>
                                    </>
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                    {index < arr.length - 1 &&
                        arr[index + 1].section !== section.section && (
                            <SectionLine />
                        )}
                </React.Fragment>
            ))}
            <SectionLine />
            <div
                className={cn(
                    "bg-background relative grid grid-cols-5 gap-6 pt-3.5 pb-4 [&>*:first-child]:row-span-full [&>*:first-child]:ps-6 [&>*:last-child]:pe-6"
                )}
            >
                <Highlight
                    className={cn("row-span-2 font-normal text-transparent")}
                >
                    Others
                </Highlight>

                <Text className={cn("col-span-4")}>
                    And a bunch of University course projects or freelance jobs
                    on the road...
                </Text>
            </div>
        </section>
    )
}

export default SectionExperiences
