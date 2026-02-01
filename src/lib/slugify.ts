export function slugify(str: string): string {
    if (!str) return ""

    return str
        .toLowerCase()
        .trim()
        .normalize("NFD") // Tách tổ hợp (VD: 'á' -> 'a' + '´')
        .replace(/[\u0300-\u036f]/g, "") // Xóa các ký tự dấu (diacritics)
        .replace(/[đĐ]/g, "d") // Gộp đ và Đ vào 1 dòng
        .replace(/[\s_.]+/g, "-") // Thay khoảng trắng bằng dấu gạch ngang
        .replace(/[^\w-]+/g, "") // Xóa tất cả ký tự không phải chữ, số, gạch ngang
        .replace(/--+/g, "-") // Thay thế nhiều dấu gạch ngang liên tiếp thành 1
        .replace(/^-+/, "") // Xóa gạch ngang ở đầu
        .replace(/-+$/, "") // Xóa gạch ngang ở cuối
}
