import { type PortfolioRole } from "@/configs/role.config"
import { type ProjectId } from "@/types/project-ids"

const SELECTED_WORKS: Record<PortfolioRole, ProjectId[]> = {
    pd: [
        "siglo",
        "megakit",
        "coc-sai-gon-member-website",
        "tem-25",
        "coc-sai-gon-15th-anniversary",
        "chi-chi-chanh-chanh-2023",
        "fptu-debate-tournament-3rd-season",
        "bong-dat-nuoc",
        "bean-jr",
        "blue-grape"
    ],
    cd: [
        "coc-sai-gon-15th-anniversary",
        "tem-25",
        "chi-chi-chanh-chanh-2023",
        "fptu-debate-tournament-3rd-season",
        "ecoecho",
        "bean-jr",
        "bong-dat-nuoc",
        "halloween-festi-x-hellwarming-2022",
        "roi",
        "blue-grape"
    ]
}

export { SELECTED_WORKS }
