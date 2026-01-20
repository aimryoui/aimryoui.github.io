import ProjectHeader from "@/app/portfolio/_components/project-header"
import { Divider, ProjectSectionDivider } from "@/components/layout/divider"
import { SectionLine } from "@/components/layout/line"
import { MediaFrame } from "@/components/layout/media-frame"
import { Space } from "@/components/layout/space"
import { Image } from "@/components/ui/image"
import { cn } from "@/lib/utils"

import UIUXHeader from "./header"

function UIUX() {
    return (
        <>
            <UIUXHeader />
            <SectionLine />
            <Space />
            <SectionLine />
            <ProjectHeader
                projectName="Siglo"
                category="Mobile App / Website"
                information={{
                    newest: true,
                    duration: "Mar 2025 — Sep 2025",
                    subject: "SU25 Capstone Project",
                    place: "FPT University HCMC"
                }}
                tools={["figma", "photoshop", "illustrator", "afterEffects"]}
                detail={{
                    description:
                        "One-for-all Community Messaging Application for Influencers, KOLs, KOCs, Creators.",
                    abbreviation:
                        "A broadcast-style messaging app where celebrities, influencers, who can take advantage of the app's features, connect, inspire, \nand build private communities with their fans or their target audiences. A next-generation messaging platform, \ntrendsetters to connect, ignite conversations, and lead their audiences like never before."
                }}
            />
            <SectionLine />
            <Divider />
            <SectionLine />
            <MediaFrame>
                <Image
                    placeholderPriority
                    src="uiux/siglo/siglo-1.jpg"
                    alt="Brading Presentation"
                    className={cn("rounded-2xl")}
                />
            </MediaFrame>
            <SectionLine />
            <ProjectSectionDivider sectionName="Logo & Icon Guidelines" />
            <SectionLine />
            <MediaFrame className={cn("grid grid-cols-2 grid-rows-2")}>
                <Image
                    placeholderPriority
                    src="uiux/siglo/siglo-2.jpg"
                    alt="Grid System"
                    className={cn("rounded-2xl")}
                />
                <Image
                    placeholderPriority
                    src="uiux/siglo/siglo-3.jpg"
                    alt="Safe Zone"
                    className={cn("rounded-2xl")}
                />
                <Image
                    placeholderPriority
                    src="uiux/siglo/siglo-4.jpg"
                    alt="Logo Mark & Logo Type"
                    className={cn("rounded-2xl")}
                />
                <Image
                    placeholderPriority
                    src="uiux/siglo/siglo-5.jpg"
                    alt="App Icon Grid System"
                    className={cn("rounded-2xl")}
                />
            </MediaFrame>
        </>
    )
}

export default UIUX
