import SectionTitle from "@/app/portfolio/_components/section-title"
import { Divider } from "@/components/layout/divider"
import { SectionLine } from "@/components/layout/line"
import { Space } from "@/components/layout/space"
import { At, Bold, Highlight, Link, Text } from "@/components/ui/typography"
import { cn } from "@/lib/utils"

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
                className={cn(
                    "bg-background relative grid grid-cols-5 gap-6 gap-y-3 pt-3.5 pb-4 [&>*:first-child]:ps-6 [&>*:last-child]:pe-6"
                )}
            >
                <Highlight className={cn("font-normal")}>University</Highlight>

                <Text mono>09.2021 — 11.2025</Text>

                <div
                    className={cn("col-span-3 grid grid-cols-2 gap-6 gap-y-3")}
                >
                    <Bold>
                        Bachelor's Degree / Digital Art & Design{" "}
                        <At className="float-end" />
                    </Bold>
                    <Link href="https://daihoc.fpt.edu.vn/hcm/" openInNewTab>
                        FPT University HCMC
                    </Link>

                    <Text>Grade Point Average (GPA)</Text>
                    <Highlight>8.05</Highlight>

                    <Text>Degree Classification</Text>
                    <Bold italic>Very Good</Bold>
                </div>
            </div>
        </section>
    )
}

export default Education
