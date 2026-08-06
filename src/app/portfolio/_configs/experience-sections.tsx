interface ExperienceSectionDetails {
    startDate: string
    endDate?: string
    position: string
    organization?: {
        text: string
        url: string
        ariaLabel?: string
        duplicate?: boolean
    }
    summary?: string
    description?: string[]
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
                startDate: "12.2025",
                endDate: "07.2026",
                position: "Motion Designer",
                organization: {
                    text: "SAN Data Systems Inc.",
                    url: "https://sandatasystem.com"
                },
                summary:
                    "Contractor position, working remotely on a full-time basis. Work entirely in English, involved interaction with colleagues who were Indian-Americans and Indians.",
                description: [
                    "Worked on marketing motion graphic, product launch videos; product instruction, documentation videos using Adobe After Effects and Adobe XD.",
                    "Created design system and component library from scratch; adapted to existing products.",
                    "Redesigned/refined given products UI on Figma for better UX and ready for motion.",
                    "Designed booth display and presentation materials for Red Hat Summit; integrated AI for mockups, presentation.",
                    "Reported directly to the CTO."
                ]
            },
            {
                startDate: "01.2024",
                endDate: "04.2024",
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
        section: "Clubs & \nCategory Projects",
        items: [
            {
                startDate: "12.2024",
                position: "Design Team Mentor",
                organization: {
                    text: "Cóc Sài Gòn Communication Club",
                    url: "https://www.facebook.com/cocsaigonfuhcm"
                },
                summary:
                    "A non-profit University club, one of the largest in Vietnam. Currently as a mentor, providing guidance and feedback on designs for next generations of the organization.",
                description: [
                    "Supervising, providing feedback on, and monitoring designs, publications, and content in general.",
                    "Serving as a supervisor/mentor for projects whenever guidance and assistance are required.",
                    "Regularly keep up with design trends, tips and tricks, update to the team's master design file."
                ]
            },
            {
                startDate: "06.2022",
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
                startDate: "10.2023",
                endDate: "11.2024",
                position: "Design Team Lead",
                organization: {
                    text: "Cóc Sài Gòn Communication Club",
                    url: "https://www.facebook.com/cocsaigonfuhcm",
                    duplicate: true
                },
                summary:
                    "A non-profit University club, one of the largest in Vietnam. Previously as a leader of the Design Team, divided works among members, gave them feedback.",
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
                startDate: "10.2021",
                endDate: "09.2023",
                position: "Designer",
                organization: {
                    text: "Cóc Sài Gòn Communication Club",
                    url: "https://www.facebook.com/cocsaigonfuhcm",
                    duplicate: true
                },
                summary:
                    "Joined a communication club on the very first day of university. With a Graphic Designer role in the Design Team of the Media Department, carrying out assigned tasks.",
                description: [
                    "Designed basic posters and gradually gained exposure to design print materials.",
                    "Participated in event projects. Took the first project as a Design Leader.",
                    "Frequently recommended to served as the Design Leader for numerous projects later on.",
                    "Participated in the club's internal activities, such as term/annual wrap-up congresses, performance reviews, meetings, etc."
                ]
            },
            {
                startDate: "01.2023",
                endDate: "03.2023",
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
                startDate: "05.2022",
                endDate: "01.2023",
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
        section: "Freelance",
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
                startDate: "04.2026",
                endDate: "07.2026",
                position: "Freelance Designer",
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
                startDate: "05.2026",
                endDate: "06.2026",
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
                startDate: "01.2026",
                endDate: "01.2026",
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
                startDate: "03.2025",
                endDate: "03.2025",
                position: "Freelance Designer",
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
                    "Designed large-format, text-heavy, and infographic-style publications."
                ]
            },
            {
                startDate: "02.2025",
                endDate: "10.2025",
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
                startDate: "02.2025",
                endDate: "04.2025",
                position: "Key Visual Designer",
                organization: {
                    text: "Xoay Vật Chuyển Dòng",
                    url: "https://www.facebook.com/xoayvatchuyendong.project",
                    ariaLabel: "Go to the Xoay Vật Chuyển Dòng project fanpage"
                },
                summary:
                    "A graduation project for the Multimedia Communications program at FPT University HCMC. A communication campaign to help young people understand and know how to apply Feng Shui to create a harmonious connection between living space and emotions.",
                description: [
                    "Commissioned to design the key visual, color palette, and primary typeface for the entire project; choose and place the right elements.",
                    "Designed print materials for the interactive event, including tickets, wayfinding guides, and invitations.",
                    "Wrote a script to automate the generation of a large volume of GIF invitations featuring unique guest names and titles, and sorted the individual files into specific folders based on the sender."
                ]
            },
            {
                startDate: "02.2025",
                endDate: "03.2025",
                position: "Key Visual Designer",
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
                startDate: "01.2025",
                endDate: "04.2025",
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
                    "Design character posters that align with the key visual; hold meetings with the core production team to gather feedback, make revisions, and refine the designs.",
                    "Designed a visual identity for the project's social media channels."
                ]
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

export type { ExperienceSection, ExperienceSectionDetails }
export { EXPERIENCE_SECTIONS }
