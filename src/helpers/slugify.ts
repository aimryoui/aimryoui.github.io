/**
 * Slugify a string
 *
 * @param {string} str Input string
 * @returns {string} Slugified string
 */
export function slugify(str: string): string {
    if (!str) return ""

    return str
        .toLowerCase()
        .trim()
        .normalize("NFD") // Tách tổ hợp (VD: 'á' -> 'a' + '´')
        .replaceAll(/[\u0300-\u036F]/gu, "") // Xóa các ký tự dấu (diacritics)
        .replaceAll(/[đĐ]/gu, "d") // Gộp đ và Đ vào 1 dòng
        .replaceAll(/[\s_.]+/gu, "-") // Thay khoảng trắng bằng dấu gạch ngang
        .replaceAll(/[^\w-]+/gu, "") // Xóa tất cả ký tự không phải chữ, số, gạch ngang
        .replaceAll(/--+/gu, "-") // Thay thế nhiều dấu gạch ngang liên tiếp thành 1
        .replace(/^-+/u, "") // Xóa gạch ngang ở đầu
        .replace(/-+$/u, "") // Xóa gạch ngang ở cuối
}
