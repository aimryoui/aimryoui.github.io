const PORTFOLIO_ROLES = ["pd", "cd"] as const

type PortfolioRole = (typeof PORTFOLIO_ROLES)[number]

const DEFAULT_PORTFOLIO_ROLE: PortfolioRole = "pd"

const getResumeUrl = (role?: PortfolioRole) => {
    return role === "cd"
        ? "/Resume_Creative-Designer_Nguyen-Hoang-Nhan.pdf"
        : "/Resume_Product-Designer_Nguyen-Hoang-Nhan.pdf"
}

export type { PortfolioRole }
export { DEFAULT_PORTFOLIO_ROLE, getResumeUrl, PORTFOLIO_ROLES }
