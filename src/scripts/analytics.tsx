import { siteConfig } from "@/configs/site.config"
import { minifyJs } from "@/helpers/minify-js"

async function AnalyticsScripts() {
    if (
        process.env.NODE_ENV !== "production"
        || !siteConfig.analytics.googleAnalytics
    ) {
        return null
    }

    return (
        <>
            <script
                id="_next-ga-init"
                dangerouslySetInnerHTML={{
                    __html: await minifyJs(
                        /* js */ `
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag("js", new Date());
                        gtag("config", "${siteConfig.analytics.googleAnalytics}");
                    `,
                        ["gtag"]
                    )
                }}
            />
            <script
                id="_next-ga"
                async
                src={`https://www.googletagmanager.com/gtag/js?id=${siteConfig.analytics.googleAnalytics}`}
            />
        </>
    )
}

export { AnalyticsScripts }
