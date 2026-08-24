import { type PortfolioRole } from "@/configs/role.config"

interface ExperienceSectionDetails {
    startDate: string
    endDate?: string
    position: string | Partial<Record<PortfolioRole, string>>
    organization?: {
        text: string
        url: string
        ariaLabel?: string
        duplicate?: boolean
    }
    summary?: string
    description?: string[] | Record<PortfolioRole, string[]>
}

interface ExperienceSection {
    section: string
    items: ExperienceSectionDetails[]
}

const EXPERIENCE_SECTIONS: ExperienceSection[] = [
    {
        section: "Contract",
        items: [
            {
                startDate: "Dec 2025",
                endDate: "Jul 2026",
                position: {
                    pd: "UI/UX & Motion Designer",
                    cd: "Graphic & Motion Designer"
                },
                organization: {
                    text: "SAN Data Systems Inc.",
                    url: "https://sandatasystem.com"
                },
                summary:
                    "Contractor position, worked remotely on a full-time basis. Worked entirely in English, involved interaction with colleagues who were Indian-Americans and Indians.",
                description: {
                    pd: [
                        "Created design system and component library from scratch; adapted to existing products.",
                        "Redesigned/refined given products UI on Figma for better UX and ready for motion.",
                        "Designed booth display and presentation materials for Red Hat Summit; integrated AI for mockups, presentation.",
                        "Worked on marketing motion graphic, product launch videos; product instruction, documentation videos using Adobe After Effects and Adobe XD.",
                        "Reported directly to the CTO."
                    ],
                    cd: [
                        "Worked on marketing motion graphic, product launch videos; product instruction, documentation videos using Adobe After Effects and Adobe XD.",
                        "Designed booth display and presentation materials for Red Hat Summit; integrated AI for mockups, presentation.",
                        "Redesigned/refined given products UI on Figma for better UX and ready for motion.",
                        "Reported directly to the CTO."
                    ]
                }
            },
            {
                startDate: "Jan 2024",
                endDate: "Apr 2024",
                position: "Design Internship",
                organization: {
                    text: "Amazing Tech Co.",
                    url: "https://amazingtech.vn",
                    ariaLabel: "Go to the Amazing Tech Company website"
                },
                summary:
                    "Referred by the University. Contract internship position, worked remotely; worked with peers came from the same semester across various majors.",
                description: [
                    "Refined and adapted new logo, branding across platforms.",
                    "Designed print materials.",
                    "Designed physical models using Blender."
                ]
            }
        ]
    },
    {
        section: "Community",
        items: [
            {
                startDate: "Dec 2024",
                position: "Design Team Mentor",
                organization: {
                    text: "Cóc Sài Gòn Communication Club",
                    url: "https://www.facebook.com/cocsaigonfuhcm"
                },
                summary:
                    "Currently as a mentor, providing guidance and feedback on designs for next generations of the organization.",
                description: [
                    "Supervising, providing feedback on, and monitoring designs, publications, and content in general.",
                    "Serving as a supervisor/mentor for projects whenever guidance and assistance are required.",
                    "Regularly keep up with design trends, tips and tricks, update to the team's master design file."
                ]
            },
            {
                startDate: "Jun 2022",
                position: "HR Media Team",
                organization: {
                    text: "Cóc Sài Gòn Communication Club",
                    url: "https://www.facebook.com/cocsaigonfuhcm",
                    duplicate: true
                },
                summary:
                    "HR Department in a non-profit University club, one of the largest in Vietnam. As a Designer of the Media Team, carrying out assigned tasks.",
                description: [
                    "Designing for HR-related activities: club workshops, competitions, team building, fundraising, mini-games, memes, etc.",
                    "Gaining a more comprehensive, panoramic view of the club's overall personnel and the Design Team specifically."
                ]
            },
            {
                startDate: "Oct 2023",
                endDate: "Nov 2024",
                position: "Design Team Lead",
                organization: {
                    text: "Cóc Sài Gòn Communication Club",
                    url: "https://www.facebook.com/cocsaigonfuhcm",
                    duplicate: true
                },
                summary:
                    "Previously as a leader of the Design Team, divided works among members, provided feedback, shared and carried.",
                description: [
                    "Executed the team's key activities: recruited personnel for projects; arranged/reassigned personnel to appropriate tasks, projects, annual projects.",
                    "Took on the role of Design Leader for major, critical projects; allow team members to shadow and learn.",
                    "Participated in the recruitment process, including interviews, design challenges, orientation presentations, introducing new members, etc.",
                    "Carried out hidden, unnamed tasks assigned directly by the executive team.",
                    "Shared, motivated, and encouraged team members at regular intervals.",
                    "Identified and promoted team members with the potential for higher-level roles."
                ]
            },
            {
                startDate: "Oct 2021",
                endDate: "Sep 2023",
                position: "Designer",
                organization: {
                    text: "Cóc Sài Gòn Communication Club",
                    url: "https://www.facebook.com/cocsaigonfuhcm",
                    duplicate: true
                },
                summary:
                    "Joined a communication club on the very first day of university. A non-profit University club, one of the largest in Vietnam. With a Graphic Designer role in the Design Team of the Media Department, carrying out assigned tasks.",
                description: [
                    "Designed basic posters and gradually gained exposure to design print materials.",
                    "Participated in event projects. Took the first project as a Design Leader.",
                    "Frequently recommended to served as the Design Leader for numerous projects later on.",
                    "Participated in the club's internal activities, such as term/annual wrap-up congresses, performance reviews, meetings, etc."
                ]
            },
            {
                startDate: "Jan 2023",
                endDate: "Mar 2023",
                position: "Design Team Lead",
                organization: {
                    text: "Humans of FPTU",
                    url: "https://www.facebook.com/HumansOfFPTU.CSG"
                },
                summary:
                    "One of many annual projects of Cóc Sài Gòn Communication Club. Promoted to Design Team Lead after a period of time.",
                description: [
                    "Assumed responsibility for core design works.",
                    "Coordinated, allocated work, and assigned tasks to team members. Recruited and assessed the quality of team members.",
                    "Determined the art style for the entire project.",
                    "Provided feedback and participated in the editing and post-production processes for members' work."
                ]
            },
            {
                startDate: "May 2022",
                endDate: "Jan 2023",
                position: "Designer",
                organization: {
                    text: "Humans of FPTU",
                    url: "https://www.facebook.com/HumansOfFPTU.CSG",
                    duplicate: true
                },
                summary:
                    "Assigned to participate in at least one of the club's annual projects. Served as a member of the Design Team.",
                description: [
                    "Designed posters, image albums featuring individuals from the FPT ecosystem.",
                    "Storytelling through imagery, brought people who deserve greater recognition to the public.",
                    "Involved in various activities aimed at contributing to and fostering the growth of the club, as well as enhancing the university environment at FPT in general.",
                    "Open to individuals of all backgrounds, roles, and gender identities. Engaged with members through a dynamic, proactive, and community-oriented approach."
                ]
            }
        ]
    },
    {
        section: "Freelance & Referral",
        items: [
            {
                startDate: "From 2022",
                position: "Freelancer",
                summary:
                    "Started taking on projects from friends and contacts, officially started as a freelance designer.",
                description: [
                    "Take on all types of projects, ranging from poster design, print materials, art direction, and branding to UI/UX, web design, app design, and more.",
                    "Often introduced by friends to friends."
                ]
            },
            {
                startDate: "Apr 2026",
                endDate: "Jul 2026",
                position: "Visual Designer",
                organization: {
                    text: "Cường Khanh Advertising Co., Ltd",
                    url: "https://cuongkhanhadv.com.vn",
                    ariaLabel: "Go to the Cường Khanh Advertising website"
                },
                summary:
                    "An advertising company with over 20 years of experience, specializing in the printing of various publications and project materials; frequently partners with major brands and big organizations.",
                description: [
                    "Commissioned to design the key visual for the 20th Anniversary campaign.",
                    "Designed a new visual identity system based on the existing logo, adapted and standardized it.",
                    "Designed several campaign print materials based on the key visual."
                ]
            },
            {
                startDate: "May 2026",
                endDate: "Jun 2026",
                position: "UI/UX Designer",
                organization: {
                    text: "FINA Care Studio",
                    url: "https://fina-studio.com",
                    ariaLabel: "Go to the FINA Care Studio website"
                },
                summary:
                    "A German spa and beauty brand that has just opened a branch in Vietnam. Aiming to build a marketing marketplace specifically for Vietnam.",
                description: [
                    "Designed a fully responsive website featuring a landing page and several sub-pages, characterized by a luxurious and elegant style.",
                    "Integrated AI to generate and edit images, ensuring they align with the page layout and overall aesthetic.",
                    "Used Figma Sites from start and design directly; ability to publish as a live website to showcase; offers real-time editing and publishing capabilities, along with CMS integration."
                ]
            },
            {
                startDate: "Jan 2026",
                endDate: "Jan 2026",
                position: "Logo Designer",
                organization: {
                    text: "Nguyên Liệu 24H Co., Ltd",
                    url: "https://masothue.com/0319246054-cong-ty-tnhh-nguyen-lieu-24h",
                    ariaLabel: "Go see the Nguyên Liệu 24H information"
                },
                summary:
                    "A newly established company supplying cooking ingredients to the market; seeks a clean, elegant, and professional brand identity.",
                description: [
                    "Designed the logo based on the following criteria: 24/7 operation, supply chain, and speed.",
                    "A total of four options were designed and showcased; the pitch deck layout is professional, refined, and visually appealing."
                ]
            },
            {
                startDate: "Dec 2025",
                endDate: "Jan 2026",
                position: "UI/UX Designer",
                organization: {
                    text: "Virtue Recovery Center",
                    url: "https://www.virtuerecoverycenter.com",
                    ariaLabel: "Go see the Virtue Recovery Center website"
                },
                summary:
                    "Designed a targeted, high-fidelity landing page for a US-based healthcare facility through a direct B2B referral from SAN Data Systems' CTO.",
                description: [
                    "Created a new landing page that aligns with the center's professional identity, improves visual clarity and user experience.",
                    "Structured clear CTA layouts with reassuring microcopy to comfort potential users and build a trustworthy experience."
                ]
            },
            {
                startDate: "Mar 2025",
                endDate: "Mar 2025",
                position: "Graphic Designer",
                organization: {
                    text: "Tọa Độ Cồng Chiêng",
                    url: "https://www.facebook.com/toadocongchieng",
                    ariaLabel: "Go to the Tọa Độ Cồng Chiêng project fanpage"
                },
                summary:
                    "A graduation project for the Multimedia Communications program at FPT University HCMC. A communication project on Central Highlands Gong Cultural Space.",
                description: [
                    "Designed print materials for the project's performances and programs.",
                    "Designed publications and posters for each project phase, incorporated varying colors and elements tailored to specific categories and phases.",
                    "Designed stage backdrops, side-backdrops, and workshop backgrounds.",
                    "Designed several large-format, text-heavy, and infographic-style publications."
                ]
            },
            {
                startDate: "Feb 2025",
                endDate: "Oct 2025",
                position: "UI/UX Designer",
                organization: {
                    text: "Nalee Viet Nam JSC",
                    url: "http://naleegroup.com",
                    ariaLabel: "Go to the Nalee Viet Nam JSC website"
                },
                summary:
                    "A company specializes in supplying food products processed from agricultural produce from the Central Highlands of Vietnam.",
                description: [
                    "Designed a fully responsive website featuring a landing page, product page and several sub-pages, optimized for e-commerce and SEO.",
                    "Built a color palette for the website based on the brand and its characteristics. Light mode only; no dark mode.",
                    "Sourced product images from the company's media channels to ensure the website showcase reflects reality as closely as possible."
                ]
            },
            {
                startDate: "Feb 2025",
                endDate: "Apr 2025",
                position: "Visual Designer",
                organization: {
                    text: "Xoay Vật Chuyển Dòng",
                    url: "https://www.facebook.com/xoayvatchuyendong.project",
                    ariaLabel: "Go to the Xoay Vật Chuyển Dòng project fanpage"
                },
                summary:
                    "With team members who founded bédeb Production, started a graduation project for the Multimedia Communications program at FPT University HCMC. A communication campaign to help young people understand and know how to apply Feng Shui to create a harmonious connection between living space and emotions.",
                description: [
                    "Commissioned to design the key visual, color palette, and primary typeface for the entire project; chose and placed the right elements.",
                    "Designed posters to present information about the campaign's sub-events.",
                    "Designed print materials for the interactive event, including tickets, orientation maps, and invitations.",
                    "Wrote scripts to automate the generation of a large volume of animated GIF invitations featuring unique guest names and titles using FFmpeg; sorted the individual files into specific folders based on the sender."
                ]
            },
            {
                startDate: "Feb 2025",
                endDate: "Mar 2025",
                position: "Visual Designer",
                organization: {
                    text: "Oẳn Tù Tì Production",
                    url: "https://www.facebook.com/OanTuTiProduction"
                },
                summary:
                    "A small studio founded by a group of students for a course project. It was well-crafted and consistently earned numerous awards both during and after its premiere.",
                description: [
                    "Designed movie logo, visual identity, typeface, and color palette; presented in a pitch deck.",
                    "Designed the movie poster; located and selected key character and environment images from the project's raw photo folder.",
                    "Designed a new visual identity for the project's social media channels."
                ]
            },
            {
                startDate: "Jan 2025",
                endDate: "Apr 2025",
                position: "Art Director",
                organization: {
                    text: "The Present Thinker Crew",
                    url: "https://www.facebook.com/phimnganmeoii"
                },
                summary:
                    "A small studio founded by a group of students for a University graduation project. The movie recognized the role and contribution of women in unnamed care work to the development of young people.",
                description: [
                    "Developed and defined the art and visual direction for the entire project with the role of an Art Director.",
                    "Designed movie logo, visual identity, typeface, and color palette; presented in a pitch deck.",
                    "Designed print materials, digital assets, presentation slides/decks, and project credits.",
                    "Designed character posters that aligned with the key visual; hold meetings with the core production team to gathered feedback, made revisions, and refined the designs.",
                    "Designed a visual identity for the project's social media channels."
                ]
            },
            {
                startDate: "Jul 2023",
                endDate: "Aug 2023",
                position: "Free Designer",
                organization: {
                    text: "Đơ Ngã Đỡ Production",
                    url: "https://www.facebook.com/phimnganroi"
                },
                summary:
                    "Yet another small studio founded by a group of students for a course project. Done some drama movies, earned some awards during their premiere. Paid me nothing for the designs...",
                description: [
                    "Redesigned the movie's visual identity. Provide strategic reorientation based on existing materials and assets.",
                    "Designed movie posters and character posters, adapted appropriate elements and effects after reading and understanding the movie script.",
                    "Designed direction for the project's print materials.",
                    "Designed a visual identity for the project's social media channels."
                ]
            },
            {
                startDate: "Mar 2023",
                endDate: "May 2023",
                position: "Visual Designer",
                organization: {
                    text: "bédeb Production",
                    url: "https://www.facebook.com/phimngannotket"
                },
                summary:
                    "A small studio founded by a group of students for a course project; later founded Xoay Vật Chuyển Dòng. Earned some awards during their premiere.",
                description: [
                    "Developed and defined the art and visual direction for the entire project after reading and understanding the movie script.",
                    "Designed movie posters and digital inivitations.",
                    "Designed a visual identity for the project's social media channels."
                ]
            },
            {
                startDate: "Feb 2023",
                endDate: "Mar 2023",
                position: "Visual Designer",
                organization: {
                    text: "RMIT Vietnam Finance Club",
                    url: "https://www.facebook.com/RMITVietnamResearchChallenge"
                },
                summary:
                    "A finance club affiliated with a major club at RMIT University. The design and content prioritize English, involved interacting with foreigners and university lecturers.",
                description: [
                    "Developed a key visual for the new season's project that stood out and surpassed the work of previous years.",
                    "Designed the event poster and related print materials.",
                    "Designed digital assets for use in invitations, registration forms, and competition meetings.",
                    "Designed a visual identity for the project's social media channels for the new season."
                ]
            }
        ]
    }
]

export type { ExperienceSection, ExperienceSectionDetails }
export { EXPERIENCE_SECTIONS }
