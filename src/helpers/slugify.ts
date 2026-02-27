/** biome-ignore-all lint/performance/useTopLevelRegex: Complexity */
export function slugify(str: string): string {
    if (!str) return ""

    return str
        .toLowerCase()
        .trim()
        .normalize("NFD") // Tách tổ hợp (VD: 'á' -> 'a' + '´')
        .replaceAll(/[\u0300-\u036F]/g, "") // Xóa các ký tự dấu (diacritics)
        .replaceAll(/[đĐ]/g, "d") // Gộp đ và Đ vào 1 dòng
        .replaceAll(/[\s_.]+/g, "-") // Thay khoảng trắng bằng dấu gạch ngang
        .replaceAll(/[^\w-]+/g, "") // Xóa tất cả ký tự không phải chữ, số, gạch ngang
        .replaceAll(/--+/g, "-") // Thay thế nhiều dấu gạch ngang liên tiếp thành 1
        .replace(/^-+/, "") // Xóa gạch ngang ở đầu
        .replace(/-+$/, "") // Xóa gạch ngang ở cuối
}
