import { Divider } from "@/components/layout/divider"
import { SectionLine } from "@/components/layout/line"
import { Space } from "@/components/layout/space"
import { cn } from "@/lib/utils"
import FlashOverlay from "@/portfolio/_components/flash-overlay"
import About from "@/portfolio/_sections/about"
import Contact from "@/portfolio/_sections/contact"
import Education from "@/portfolio/_sections/education"
import Experience from "@/portfolio/_sections/experience"
import Footer from "@/portfolio/_sections/footer"
import { NoAIOverlay, NoAIPlaceholder } from "@/portfolio/_sections/no-ai"
import Outlines from "@/portfolio/_sections/outlines"
import Projects from "@/portfolio/_sections/projects"
import Software from "@/portfolio/_sections/software"

export default function Portfolio() {
    return (
        <>
            <NoAIOverlay />
            {/* <ViewTransition name="main"> */}
            <main className={cn("relative order-none flex-1")}>
                <FlashOverlay />
                <Space />
                <SectionLine showDecoration />
                <Space />
                <SectionLine />

                <About />

                <SectionLine />
                <Space />
                <SectionLine showDecoration />

                <Experience />
                <SectionLine />

                <Education />
                <SectionLine />

                <Software />
                <SectionLine />

                <Contact />
                <SectionLine />
                <Divider />

                <NoAIPlaceholder />
                <SectionLine />

                <Outlines />

                <Projects />

                <SectionLine />

                <Footer />
            </main>
            {/* </ViewTransition> */}
        </>
    )
}
