//! Change this
const baseUrl = process.env.PAGES_BASE_PATH

export const siteConfig = {
    // Base links
    get url() {
        return process.env.NODE_ENV === "production"
            ? baseUrl
            : this.localHostUrl
    },
    get domain() {
        return this.url.replace(/(.*)+:\/\//, "")
    },
    localHostUrl: "http://localhost:3000",

    // Personal information
    name: "Nguyễn Hoàng Nhân",
    shortName: "Hoàng Nhân",
    birthDay: "20/03/2003",
    get birthYear() {
        return Number(/\d{4}/.exec(this.birthDay)?.[0])
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
            return this.phone
                .replace(/^0?/, "")
                .replace(/(\d{3})(\d{3})(\d{3})/, "$1 $2 $3")
        },
        get full() {
            return (
                "+84" +
                " " +
                this.phone
                    .replace(/^0?/, "")
                    .replace(/(\d{3})(\d{3})(\d{3})/, "$1 $2 $3")
            )
        },
        get fullWithBrackets() {
            return (
                "(+84)" +
                " " +
                this.phone
                    .replace(/^0?/, "")
                    .replace(/(\d{3})(\d{3})(\d{3})/, "$1 $2 $3")
            )
        },
        get fullWithoutSpace() {
            return "+84" + this.phone.replace(/^0?/, "")
        }
    },

    // Base site information
    title: "Hoàng Nhân | Creative Designer",
    description:
        "This website is Hoang Nhan's Portfolio Space, come enjoy my artworks",

    // Social media
    username: "hoangnhan2ka3",
    link: {
        facebook: "https://facebook.com/hoangnhan2ka3",
        instagram: "https://instagram.com/hoangnhan2ka3",
        threads: "https://threads.net/u/hoangnhan2ka3",
        linkedIn: "https://linkedin.com/in/hoangnhan2ka3",
        behance: "https://behance.net/hoangnhan2ka3",
        dribbble: "https://dribbble.com/hoangnhan2ka3",
        github: "https://github.com/hoangnhan2ka3",
        pinterest: "https://pinterest.com/hoangnhan2ka3",
        telegram: "https://t.me/hoangnhan2ka3",
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
