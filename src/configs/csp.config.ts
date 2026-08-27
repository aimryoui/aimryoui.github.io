const cspDirectives = [
    "default-src 'self'",
    "script-src 'self' https://www.googletagmanager.com https://www.google-analytics.com",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' blob: data: https://www.googletagmanager.com https://www.google-analytics.com",
    "connect-src 'self' https://www.googletagmanager.com https://www.google-analytics.com",
    "font-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "upgrade-insecure-requests"
]

const cspConfig = {
    base: cspDirectives.join("; ") + ";"
}

export { cspConfig }
