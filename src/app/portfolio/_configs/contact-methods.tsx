import {
    IconBehance,
    IconDribbble,
    IconEmail,
    IconFacebook,
    IconGitHub,
    IconLinkedIn,
    IconPhone,
    IconTelegram,
    IconWhatsApp,
    IconZalo
} from "@/components/icons/contact-icons"
import { siteConfig } from "@/configs/site.config"

interface ContactMethodDetails {
    title: string
    icon: React.ElementType
    links: {
        text: string
        url: string
        hidden?: boolean
    }
    prefer?: boolean
}

interface ContactMethod {
    method: string
    platforms: ContactMethodDetails[]
}

const CONTACT_METHODS: ContactMethod[] = [
    {
        method: "Phone",
        platforms: [
            {
                title: "Phone",
                icon: IconPhone,
                links: {
                    text: siteConfig.tel.fullWithBrackets,
                    url: siteConfig.link.tel
                }
            },
            {
                title: "Zalo",
                icon: IconZalo,
                links: {
                    text: siteConfig.tel.spaced,
                    url: siteConfig.link.zalo
                },
                prefer: true
            }
        ]
    },
    {
        method: "E-Mail",
        platforms: [
            {
                title: "Email",
                icon: IconEmail,
                links: {
                    text: siteConfig.email.work,
                    url: `mailto:${siteConfig.email.work}`
                },
                prefer: true
            }
        ]
    },
    {
        method: "Social",
        platforms: [
            {
                title: "Facebook / Messenger",
                icon: IconFacebook,
                links: {
                    text: `fb.me/${siteConfig.username}`,
                    url: siteConfig.link.facebook
                },
                prefer: true
            },
            {
                title: "LinkedIn",
                icon: IconLinkedIn,
                links: {
                    text: `linkedin.com/in/${siteConfig.username}`,
                    url: siteConfig.link.linkedIn
                }
            },
            {
                title: "GitHub",
                icon: IconGitHub,
                links: {
                    text: `github.com/${siteConfig.username}`,
                    url: siteConfig.link.github
                }
            }
        ]
    },
    {
        method: "Messaging",
        platforms: [
            {
                title: "Telegram",
                icon: IconTelegram,
                links: {
                    text: `t.me/${siteConfig.username}`,
                    url: siteConfig.link.telegram
                }
            },
            {
                title: "WhatsApp",
                icon: IconWhatsApp,
                links: {
                    text: siteConfig.tel.fullWithoutSpace,
                    url: siteConfig.link.whatsapp
                }
            }
        ]
    },
    {
        method: "Artwork",
        platforms: [
            {
                title: "Behance",
                icon: IconBehance,
                links: {
                    text: `be.net/${siteConfig.username}`,
                    url: siteConfig.link.behance
                }
            },
            {
                title: "Dribbble",
                icon: IconDribbble,
                links: {
                    text: `dribbble.com/${siteConfig.username}`,
                    url: siteConfig.link.dribbble
                }
            }
        ]
    }
]

export type { ContactMethod, ContactMethodDetails }
export { CONTACT_METHODS }
