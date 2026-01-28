"use client"

import { useEffect, useRef, useState } from "react"

/**
 * @param ids - List of IDs to be tracked
 * @param offsetPercent - Active point from top of viewport by % (Default: 40%)
 */
export function useActiveSpy(ids: string[], offsetPercent = 40) {
    const [activeId, setActiveId] = useState<string>("")
    const isScrollPending = useRef(false)

    useEffect(() => {
        const handleScroll = () => {
            if (isScrollPending.current) return
            isScrollPending.current = true

            requestAnimationFrame(() => {
                const scrollY = window.scrollY
                const innerHeight = window.innerHeight

                // 1. Logic AUTO TOP:
                // Nếu đang ở đỉnh trang (cách top < 10px), auto active thằng đầu tiên.
                // Điều này fix lỗi khi section đầu tiên có margin-top lớn làm nó chưa chạm vạch active.
                if (scrollY < 10 && ids.length > 0) {
                    setActiveId(ids[0])
                    isScrollPending.current = false
                    return
                }

                // 2. Logic AUTO BOTTOM:
                // Nếu đã cuộn xuống tận đáy (cách đáy < 10px), auto active thằng cuối cùng.
                const isBottom =
                    innerHeight + scrollY >=
                    document.documentElement.scrollHeight - 10

                if (isBottom && ids.length > 0) {
                    setActiveId(ids[ids.length - 1])
                    isScrollPending.current = false
                    return
                }

                // 3. Logic LINE CROSSING (Vạch kẻ ảo):
                // Tính điểm vạch kẻ dựa trên % màn hình
                // Ví dụ: màn hình cao 1000px, offset 40% -> vạch kẻ nằm ở pixel thứ 400.
                const activePoint = innerHeight * (offsetPercent / 100)

                let newActiveId = ""

                // Duyệt ngược từ dưới lên trên
                for (let i = ids.length - 1; i >= 0; i--) {
                    const id = ids[i]
                    const element = document.getElementById(id)

                    if (!element) continue

                    const rect = element.getBoundingClientRect()

                    // rect.top: Khoảng cách từ đỉnh element đến đỉnh màn hình
                    // Nếu đỉnh element nằm trên vạch kẻ (nhỏ hơn activePoint) -> Active
                    if (rect.top <= activePoint) {
                        newActiveId = id
                        break
                    }
                }

                if (newActiveId) {
                    setActiveId(newActiveId)
                }

                isScrollPending.current = false
            })
        }

        handleScroll()
        window.addEventListener("scroll", handleScroll, { passive: true })
        // Cập nhật lại khi resize màn hình (vì height thay đổi)
        window.addEventListener("resize", handleScroll, { passive: true })

        return () => {
            window.removeEventListener("scroll", handleScroll)
            window.removeEventListener("resize", handleScroll)
        }
    }, [ids, offsetPercent])

    return activeId
}
