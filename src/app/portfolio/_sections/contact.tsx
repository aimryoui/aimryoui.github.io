import { Fragment } from "react"

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
import { Link } from "@/components/ui/typography"
import { siteConfig } from "@/configs/site.config"
import { cn } from "@/lib/utils"
import SectionTitle from "@/portfolio/_components/section-title"

interface SectionProps {
    title: string
    icon: React.ReactElement<React.SVGProps<SVGSVGElement>>
    links: {
        text: string
        url: string
        hidden?: boolean
    }
    prefer?: boolean
}

interface Section {
    section: string
    platforms: SectionProps[]
}

const sections: Section[] = [
    {
        section: "Phone",
        platforms: [
            {
                title: "Phone",
                icon: (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 40 40"
                        className={cn("size-6")}
                    >
                        <path
                            fill="currentColor"
                            d="M3.624 1.957c3.018-3.018 7.375-2.322 8.985.564l1.803 3.23c1.088 1.948.723 4.703-1.22 6.645-.318.32-.57.7-.783 1.096a6.2 6.2 0 0 0-.713 2.624c-.113 2.302.922 5.064 4.024 8.165 3.1 3.1 5.861 4.136 8.163 4.023a6.2 6.2 0 0 0 2.625-.712c.126-.068 1.066-.796 1.096-.785 1.942-1.942 4.697-2.306 6.645-1.219l3.23 1.802c2.886 1.61 3.582 5.968.564 8.986-2.142 2.141-4.487 3.514-6.833 3.603-4.788.182-13.15-.998-21.67-9.518S-.16 13.577.02 8.789C.11 6.444 1.482 4.1 3.624 1.957"
                        />
                    </svg>
                ),
                links: {
                    text: siteConfig.tel.fullWithBrackets,
                    url: siteConfig.link.tel
                }
            },
            {
                title: "Zalo",
                icon: (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 40 40"
                        className={cn("size-6")}
                    >
                        <path
                            fill="currentColor"
                            d="M9.104.108C2.137 6.823 1.608 21.383 7.516 29.29l.02.034c.91 1.342.032 3.69-1.341 5.065-.223.207-.144.335.191.366 1.95.216 4.39-.34 6.12-1.18 7.448 4.117 19.05 3.959 26.182-.47a14.6 14.6 0 0 1-5.278 4.73C30.767 39.252 27.79 40 22.697 40h-3.693c-5.093 0-8.069-.748-10.711-2.165-2.642-1.416-4.728-3.486-6.129-6.128C.748 29.065 0 26.087 0 20.996v-3.694c0-5.094.748-8.07 2.165-10.711C3.581 3.949 5.65 1.863 8.292.462Q8.745.217 9.218 0l-.115.108"
                        />
                        <path
                            fill="currentColor"
                            d="M21.54 14.702c.885 0 1.7.285 2.36.768v-.547h1.64v7.671h-.94a.704.704 0 0 1-.7-.684v-.026a3.96 3.96 0 0 1-2.36.776 3.98 3.98 0 0 1-3.978-3.98 3.98 3.98 0 0 1 3.979-3.978m0 1.639a2.343 2.343 0 0 0-2.34 2.339 2.344 2.344 0 0 0 3.237 2.164 2.33 2.33 0 0 0 1.444-2.164 2.344 2.344 0 0 0-2.34-2.339m12.324-1.705a4.015 4.015 0 0 1 4.01 4.012 4.015 4.015 0 0 1-4.01 4.01 4.014 4.014 0 0 1-4.011-4.01 4.016 4.016 0 0 1 4.011-4.012m0 1.672a2.35 2.35 0 0 0-2.357 2.355 2.353 2.353 0 0 0 3.26 2.178 2.35 2.35 0 0 0 1.453-2.178 2.35 2.35 0 0 0-2.356-2.355"
                        />
                        <path
                            fill="currentColor"
                            d="M17.132 12.677c0 .461-.063.843-.366 1.289l-.032.048c-.062.08-.207.254-.286.349l-5.251 6.59h5.951v.938c0 .383-.319.701-.7.701H8.744v-.444c0-.542.127-.78.303-1.036l5.586-6.924H8.967v-1.75h8.165zm11.563 9.915h-1.162a.59.59 0 0 1-.59-.589v-9.566h1.752z"
                        />
                    </svg>
                ),
                links: {
                    text: siteConfig.tel.spaced,
                    url: siteConfig.link.zalo
                },
                prefer: true
            }
        ]
    },
    {
        section: "E-Mail",
        platforms: [
            {
                title: "Email",
                icon: (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 40 40"
                        className={cn("size-6")}
                    >
                        <path
                            fill="currentColor"
                            d="M37.39 10.775c.25-.373.375-.56.597-.677.365-.193.972-.086 1.242.218.164.186.201.352.275.683.495 2.227.496 5.264.496 9.59 0 7.265 0 10.898-2.343 13.155S31.543 36 24 36h-8c-7.542 0-11.314 0-13.657-2.256C0 31.487 0 27.854 0 20.59c0-4.326 0-7.364.495-9.59.074-.333.111-.5.276-.685.27-.304.877-.411 1.241-.218.222.117.347.304.597.678a156 156 0 0 0 4.16 5.914c1.5 2.019 3.007 4.008 4.807 5.968 1.81 1.79 3.943 4.495 8.424 4.675 4.48-.18 6.613-2.886 8.424-4.675 1.8-1.96 3.308-3.949 4.807-5.968a156 156 0 0 0 4.16-5.914"
                        />
                        <path
                            fill="currentColor"
                            d="M36.337 5.127c.747.252 1.082.477 1.187.981s-.215.85-.853 1.542C33.149 11.466 23.6 19.901 20 19.5c-3.601.401-13.15-8.034-16.672-11.85-.639-.692-.958-1.038-.853-1.542s.424-.783 1.187-.981C8 4 14.644 3.5 20 3.5S33 4 36.337 5.127"
                        />
                    </svg>
                ),
                links: {
                    text: siteConfig.email.work,
                    url: `mailto:${siteConfig.email.work}`
                },
                prefer: true
            }
        ]
    },
    {
        section: "Social",
        platforms: [
            {
                title: "Facebook / Messenger",
                icon: (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 40 40"
                        className={cn("size-6")}
                    >
                        <path
                            fill="currentColor"
                            d="m29.58 22.959 1.378-7.5H22.94v-2.653c0-3.964 1.555-5.488 5.58-5.488 1.25 0 2.255.03 2.835.091v-6.8C30.258.306 27.576 0 26.02 0 17.82 0 14.038 3.872 14.038 12.226v3.232H8.977v7.5h5.06V40h8.904V22.959h6.64Z"
                        />
                    </svg>
                ),
                links: {
                    text: `fb.me/${siteConfig.username}`,
                    url: siteConfig.link.facebook
                },
                prefer: true
            },
            {
                title: "LinkedIn",
                icon: (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 40 40"
                        className={cn("size-6")}
                    >
                        <path
                            fill="currentColor"
                            d="M38 38h-7.397V25.401c0-3.454-1.312-5.384-4.046-5.384-2.975 0-4.528 2.009-4.528 5.384V38H14.9V14h7.129v3.233s2.143-3.966 7.236-3.966c5.09 0 8.735 3.108 8.735 9.538V38ZM6.396 10.857C3.968 10.857 2 8.874 2 6.43 2 3.983 3.968 2 6.396 2s4.394 1.983 4.394 4.429c0 2.445-1.966 4.428-4.394 4.428ZM2.715 38h7.433V14H2.715v24Z"
                        />
                    </svg>
                ),
                links: {
                    text: `linkedin.com/in/${siteConfig.username}`,
                    url: siteConfig.link.linkedIn
                }
            },
            {
                title: "GitHub",
                icon: (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 40 40"
                        className={cn("size-6")}
                    >
                        <path
                            fill="currentColor"
                            d="M20 0C8.95 0 0 8.95 0 20c0 8.85 5.725 16.325 13.675 18.975 1 .175 1.375-.425 1.375-.95 0-.475-.025-2.05-.025-3.725C10 35.225 8.7 33.075 8.3 31.95c-.225-.575-1.2-2.35-2.05-2.825-.7-.375-1.7-1.3-.025-1.325 1.575-.025 2.7 1.45 3.075 2.05 1.8 3.025 4.675 2.175 5.825 1.65.175-1.3.7-2.175 1.275-2.675-4.45-.5-9.1-2.225-9.1-9.875 0-2.175.775-3.975 2.05-5.375-.2-.5-.9-2.55.2-5.3 0 0 1.675-.525 5.5 2.05 1.6-.45 3.3-.675 5-.675 1.7 0 3.4.225 5 .675 3.825-2.6 5.5-2.05 5.5-2.05 1.1 2.75.4 4.8.2 5.3 1.275 1.4 2.05 3.175 2.05 5.375 0 7.675-4.675 9.375-9.125 9.875.725.625 1.35 1.825 1.35 3.7 0 2.675-.025 4.825-.025 5.5 0 .525.375 1.15 1.375.95C34.275 36.325 40 28.825 40 20 40 8.95 31.05 0 20 0Z"
                        />
                    </svg>
                ),
                links: {
                    text: `github.com/${siteConfig.username}`,
                    url: siteConfig.link.github
                }
            }
        ]
    },
    {
        section: "Messaging",
        platforms: [
            {
                title: "Telegram",
                icon: (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 40 40"
                        className={cn("size-6")}
                    >
                        <path
                            fill="currentColor"
                            d="M2.533 17.893c9.93-4.312 16.541-7.178 19.86-8.568C31.841 5.38 33.828 4.7 35.105 4.672c.284 0 .908.057 1.333.397.34.284.426.653.483.936.056.284.113.88.056 1.334-.51 5.39-2.723 18.47-3.858 24.485-.482 2.553-1.419 3.404-2.327 3.49-1.986.17-3.49-1.306-5.39-2.554-3.008-1.958-4.681-3.178-7.604-5.107-3.376-2.213-1.191-3.433.738-5.42.51-.51 9.22-8.454 9.39-9.163.03-.085.03-.426-.17-.596-.198-.17-.482-.113-.709-.057-.312.057-5.078 3.235-14.356 9.505-1.361.936-2.581 1.39-3.688 1.362-1.22-.029-3.546-.681-5.305-1.249-2.128-.68-3.83-1.05-3.689-2.241.085-.624.937-1.248 2.525-1.9Z"
                        />
                    </svg>
                ),
                links: {
                    text: `t.me/${siteConfig.username}`,
                    url: siteConfig.link.telegram
                }
            },
            {
                title: "WhatsApp",
                icon: (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 40 40"
                        className={cn("size-6")}
                    >
                        <path
                            fill="currentColor"
                            d="M13.977 11.01c.35.014.74.031 1.108.826.437.944 1.393 3.305 1.517 3.545.123.239.204.519.04.837-.163.318-.244.517-.49.796-.247.278-.518.622-.739.836-.247.237-.504.497-.217.974.288.478 1.276 2.041 2.739 3.307 1.88 1.626 3.464 2.131 3.957 2.37.492.238.779.198 1.066-.12.287-.319 1.23-1.394 1.558-1.872.328-.478.656-.399 1.107-.24.452.16 2.87 1.315 3.362 1.554.493.24.82.358.944.558.122.2.122 1.155-.287 2.27-.41 1.114-2.419 2.19-3.322 2.27-.902.08-1.748.396-5.905-1.194-5.002-1.914-8.16-6.89-8.406-7.208-.246-.32-2.009-2.59-2.009-4.939 0-2.35 1.272-3.504 1.723-3.982.45-.478.983-.598 1.311-.598l.943.01Z"
                        />
                        <path
                            fill="currentColor"
                            d="M20.084 0c5.327.003 10.327 2.067 14.088 5.813 3.76 3.747 5.83 8.727 5.828 14.023-.005 10.928-8.94 19.82-19.916 19.821h-.009a19.977 19.977 0 0 1-9.517-2.413L0 40l2.826-10.27a19.719 19.719 0 0 1-2.659-9.91C.172 8.891 9.106 0 20.084 0Zm.006 3.349c-9.131 0-16.557 7.39-16.56 16.472a16.38 16.38 0 0 0 2.53 8.768l.394.623-1.673 6.079 6.266-1.636.605.358a16.589 16.589 0 0 0 8.425 2.297h.007c9.124 0 16.55-7.392 16.553-16.475a16.308 16.308 0 0 0-1.25-6.31c-.83-2.001-2.053-3.818-3.594-5.345a16.45 16.45 0 0 0-5.365-3.583 16.51 16.51 0 0 0-6.338-1.248Z"
                        />
                    </svg>
                ),
                links: {
                    text: siteConfig.tel.fullWithoutSpace,
                    url: siteConfig.link.whatsapp
                }
            }
        ]
    },
    {
        section: "Artwork",
        platforms: [
            {
                title: "Behance",
                icon: (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 40 40"
                        className={cn("size-6")}
                    >
                        <path
                            fill="currentColor"
                            d="M12.662 8.672c1.077 0 2.061.096 2.951.286.89.19 1.65.502 2.284.936a4.367 4.367 0 0 1 1.476 1.73c.35.72.524 1.608.524 2.666 0 1.142-.26 2.094-.778 2.855-.518.762-1.286 1.386-2.3 1.872 1.396.402 2.438 1.106 3.126 2.11.688 1.004 1.032 2.216 1.032 3.634 0 1.142-.222 2.132-.666 2.968a5.76 5.76 0 0 1-1.794 2.046c-.752.53-1.608.92-2.57 1.174a11.6 11.6 0 0 1-2.966.38H2V8.672h10.662Zm-.635 9.17c.888 0 1.618-.213 2.19-.635.572-.424.858-1.11.856-2.062 0-.527-.096-.961-.286-1.3a2.107 2.107 0 0 0-.762-.793 3.224 3.224 0 0 0-1.094-.396 7.28 7.28 0 0 0-1.285-.11H6.984v5.3l5.043-.005Zm.287 9.613c.47.002.937-.046 1.395-.142a3.441 3.441 0 0 0 1.174-.476c.338-.222.608-.524.81-.904.2-.38.302-.868.302-1.46 0-1.162-.328-1.994-.984-2.49-.656-.498-1.524-.746-2.601-.746H6.983v6.22l5.33-.002Zm14.93-.476c.677.656 1.65.984 2.92.984.91 0 1.692-.228 2.348-.682.656-.454 1.058-.936 1.206-1.444h3.966c-.634 1.968-1.608 3.374-2.92 4.22-1.312.846-2.898 1.27-4.76 1.27-1.29 0-2.453-.206-3.49-.618a7.258 7.258 0 0 1-2.633-1.762 7.89 7.89 0 0 1-1.666-2.728c-.39-1.058-.586-2.222-.586-3.49 0-1.226.2-2.368.602-3.426a8.04 8.04 0 0 1 1.714-2.744 8.057 8.057 0 0 1 2.65-1.823c1.026-.444 2.164-.666 3.412-.666 1.395 0 2.611.27 3.65.81a7.285 7.285 0 0 1 2.553 2.173 8.936 8.936 0 0 1 1.444 3.11c.296 1.164.402 2.38.318 3.65H26.137c.062 1.454.432 2.512 1.108 3.166Zm5.094-8.63c-.54-.592-1.36-.888-2.46-.888-.72 0-1.317.122-1.791.364-.476.244-.856.544-1.142.904-.286.36-.486.74-.602 1.142a5.133 5.133 0 0 0-.206 1.078h7.33c-.215-1.14-.59-2.008-1.129-2.6Zm-6.973-8.527h9.157v2.54h-9.157v-2.54Z"
                        />
                    </svg>
                ),
                links: {
                    text: `be.net/${siteConfig.username}`,
                    url: siteConfig.link.behance
                }
            },
            {
                title: "Dribbble",
                icon: (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 40 40"
                        className={cn("size-6")}
                    >
                        <path
                            fill="currentColor"
                            d="M20 0C8.954 0 0 8.955 0 20s8.954 20 20 20 20-8.955 20-20S31.046 0 20 0Zm13.124 9.68a16.626 16.626 0 0 1 3.57 9.851c-4.488-.786-8.358-.81-11.702-.28a71.044 71.044 0 0 0-1.307-2.832c3.586-1.475 6.802-3.627 9.439-6.74Zm-2.302-2.39c-2.355 2.859-5.31 4.826-8.656 6.165a85.654 85.654 0 0 0-6.104-9.687A16.553 16.553 0 0 1 20 3.294 16.615 16.615 0 0 1 30.822 7.29ZM12.82 4.919a81.949 81.949 0 0 1 6.178 9.595c-4.692 1.288-9.94 1.636-15.253 1.65A16.768 16.768 0 0 1 12.819 4.92Zm-9.524 15.08.014-.54h.09c5.952 0 11.862-.39 17.16-1.952.396.804.784 1.629 1.165 2.478-6.972 2.044-11.318 6.63-14.297 10.996a16.626 16.626 0 0 1-4.132-10.983Zm6.567 13.265c2.82-4.248 6.75-8.45 13.145-10.215 1.494 3.827 2.713 8.005 3.358 12.392a16.55 16.55 0 0 1-6.364 1.265 16.596 16.596 0 0 1-10.139-3.442Zm19.575.512c-.683-4.009-1.803-7.832-3.152-11.377 2.922-.372 6.282-.282 10.177.435a16.74 16.74 0 0 1-7.025 10.942Z"
                        />
                    </svg>
                ),
                links: {
                    text: `dribbble.com/${siteConfig.username}`,
                    url: siteConfig.link.dribbble
                }
            }
        ]
    }
]

function Contact() {
    return (
        <section className="@container">
            <Space />
            <SectionLine />
            <SectionTitle id="contact" title="Contact" />
            <SectionLine />
            <Divider />
            <SectionLine />
            <address>
                {sections.map((section, index, arr) => (
                    <Fragment key={section.section}>
                        <div
                            data-slot="table-container"
                            className={cn(
                                "relative grid w-full grid-cols-5 gap-[calc(var(--spacing)*6+var(--px)*2)] bg-background py-4.5"
                            )}
                        >
                            <Table
                                className={cn(
                                    "col-span-full col-start-2 grid table-fixed gap-y-2.5",
                                    {
                                        "@[40rem]": "col-start-1 ps-6"
                                    }
                                )}
                            >
                                <TableCaption
                                    className={cn(
                                        "sr-only absolute left-6 whitespace-pre-line font-wght-500"
                                    )}
                                >
                                    {section.section}
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
                                        <TableHead className="px-0">
                                            Name
                                        </TableHead>
                                        <TableHead className="px-0">
                                            Link
                                        </TableHead>
                                        <TableHead className="col-span-2 px-0">
                                            Prefer?
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>

                                <TableBody
                                    className={cn("grid gap-y-2", {
                                        "@[50.125rem]": "gap-y-4",
                                        lg: "gap-y-4"
                                    })}
                                >
                                    {section.platforms.map((platform) => (
                                        <TableRow
                                            key={platform.title}
                                            className={cn(
                                                "grid grid-cols-4 gap-x-[calc(var(--spacing)*6+var(--px)*2)]",
                                                {
                                                    "@[32rem]": "flex gap-6"
                                                }
                                            )}
                                        >
                                            <TableCell
                                                className={cn("p-0 align-top")}
                                            >
                                                <span
                                                    className={cn(
                                                        "absolute left-6 text-highlighted [&>svg]:size-[calc(1em*1.3)]",
                                                        {
                                                            "@[40rem]":
                                                                "hidden",
                                                            "@[32rem]":
                                                                "static !block"
                                                        }
                                                    )}
                                                >
                                                    {platform.icon}
                                                </span>
                                                <p
                                                    className={cn({
                                                        "@[32rem]": "sr-only"
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
                                                            "pe-6 text-left",
                                                        // "@[32rem]": "ms-auto"
                                                        "@[24rem]": "sr-only"
                                                    }
                                                )}
                                            >
                                                {platform.prefer && "Prefer"}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                        {index < arr.length - 1 &&
                            arr[index + 1].section !== section.section && (
                                <SectionLine />
                            )}
                    </Fragment>
                ))}
            </address>
        </section>
    )
}

export type { SectionProps }
export { sections }
export default Contact
