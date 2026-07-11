export function formatViewTransitionName(value: string): string {
    return value
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/gu, "")
        .replaceAll(/[đĐ]/gu, "d")
        .replace(/[^a-zA-Z0-9]/gu, "-")
        .replace(/-+/gu, "-")
        .replace(/^-|-$/gu, "")
        .toLowerCase()
}
