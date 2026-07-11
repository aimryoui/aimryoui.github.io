/** biome-ignore-all lint/performance/useTopLevelRegex: Local configs */
const APP_BASE_URL =
    process.env.NEXT_PUBLIC_BASE_URL ?? "https://localhost:3000"
const APP_BASE_PATH = process.env.PAGES_BASE_PATH ?? ""

const URL_SCHEME_REGEX = /(.*)+:\/\//u
const YEAR_REGEX = /\d{4}/u
const PHONE_NUMBER_REGEX = /(\d{3})(\d{3})(\d{3})/u
const LEADING_ZERO_REGEX = /^0?/u

export const siteConfig = {
    // Base links
    url: APP_BASE_URL,
    fullUrl: APP_BASE_URL + APP_BASE_PATH,
    get domain() {
        return this.url.replace(URL_SCHEME_REGEX, "")
    },

    // Personal information
    name: "Nguyễn Hoàng Nhân",
    shortName: "Hoàng Nhân",
    birthDay: "20/03/2003",
    get birthYear() {
        return Number(YEAR_REGEX.exec(this.birthDay)?.[0])
    },
    get age() {
        return new Date().getFullYear() - this.birthYear
    },
    role: ["Creative Designer", "UI/UX Designer"],
    email: {
        personal: "nhnhana5@gmail.com",
        school: "nhannhse171176@fpt.edu.vn",
        work: "workwith.hnhan@gmail.com",
        company: "nhnhan@redcloudcomputing.com"
    },
    tel: {
        phone: "0817818898",
        get spaced() {
            return this.phone.replace(PHONE_NUMBER_REGEX, "$1 $2 $3")
        },
        get full() {
            return (
                "+84" +
                " " +
                this.phone
                    .replace(LEADING_ZERO_REGEX, "")
                    .replace(PHONE_NUMBER_REGEX, "$1 $2 $3")
            )
        },
        get fullWithBrackets() {
            return (
                "(+84)" +
                " " +
                this.phone
                    .replace(LEADING_ZERO_REGEX, "")
                    .replace(PHONE_NUMBER_REGEX, "$1 $2 $3")
            )
        },
        get fullWithoutSpace() {
            return `+84${this.phone.replace(LEADING_ZERO_REGEX, "")}`
        }
    },

    // Base site information
    title: "Hoàng Nhân | Creative Designer",
    description:
        "This website is Hoang Nhan's Portfolio Space, come enjoy my artworks",

    // Social media
    username: "aimryoui",
    link: {
        tel: "tel:+84817818898",
        facebook: "https://facebook.com/aimryoui",
        instagram: "https://instagram.com/aimryoui",
        threads: "https://threads.com/@aimryoui",
        linkedIn: "https://linkedin.com/in/aimryoui",
        behance: "https://behance.net/aimryoui",
        dribbble: "https://dribbble.com/aimryoui",
        github: "https://github.com/aimryoui",
        pinterest: "https://pinterest.com/aimryoui",
        telegram: "https://t.me/aimryoui",
        whatsapp: "https://wa.me/84817818898",
        zalo: "https://zalo.me/0817818898"
    },

    // Analytics ID
    analytics: {
        googleVerification: "eQWQgOEPxHImqJ2L8COXOXrRvoG51zYXxSX6OwSPyUo",
        yandexVerification: "fb6729bde7a90a52",
        googleTagManager: "GTM-TVP4K3H6",
        googleAnalytics: "G-M8GZQ7E1MD",
        cloudFlareInsights: "{'token':'d03afe61bd644ac6b165fe710cece3a8'}"
    }
}

export type SiteConfig = typeof siteConfig
