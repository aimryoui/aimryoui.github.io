"use client"

import { useEffect, useRef, useState } from "react"

import { cn } from "@/lib/utils"

function NoAIPlaceholder() {
    return (
        <div
            id="alert"
            className={cn("h-[250dvh] min-h-375 anchor/no-ai-placeholder", {
                lg: "hidden"
            })}
        />
    )
}

function NoAIOverlay() {
    const [isActive, setIsActive] = useState(false)
    const isScrollPending = useRef(false)

    useEffect(() => {
        const el = document.getElementById("alert")
        if (!el) return

        const handleScroll = () => {
            if (isScrollPending.current) return
            isScrollPending.current = true

            requestAnimationFrame(() => {
                const rect = el.getBoundingClientRect()
                const innerHeight = window.innerHeight

                const activePoint = innerHeight * 0.4

                const isCurrentlyActive =
                    rect.top <= activePoint && rect.bottom > activePoint

                setIsActive(isCurrentlyActive)
                isScrollPending.current = false
            })
        }

        handleScroll()

        window.addEventListener("scroll", handleScroll, { passive: true })
        window.addEventListener("resize", handleScroll, { passive: true })

        return () => {
            window.removeEventListener("scroll", handleScroll)
            window.removeEventListener("resize", handleScroll)
        }
    }, [])

    return (
        <div
            className={cn(
                "inset-x-0 z-50 border-y border-dashed border-stroke anchored/no-ai-placeholder top-anchor-top-0 h-anchor-height-0 transition-[background-color] duration-500",
                isActive ? "bg-alert" : "bg-background",
                "px-[calc(var(--spacing)*6.5*2+theme(spacing.sidebar)+var(--px)*3+var(--spacing)*6)] lg:px-[calc(var(--spacing)*6.5+var(--px)*2+var(--spacing)*6)]",
                {
                    lg: "hidden"
                }
            )}
        >
            <div
                className={cn(
                    "sticky top-0 flex h-dvh flex-col justify-center gap-8 tracking-normal text-default",
                    isActive && "text-white"
                )}
            >
                <hgroup className={cn("flex flex-col gap-2")}>
                    <h3 className={cn("text-4xl font-extrabold capitalize")}>
                        <strong>No AI training allowed.</strong>
                    </h3>
                    <i translate="no" className={cn("text-sm opacity-80")}>
                        Không được phép huấn luyện AI.
                    </i>
                    <i translate="no" className={cn("text-sm opacity-80")}>
                        禁止用于 AI 训练.
                    </i>
                </hgroup>
                <hr className={cn("border-t border-current opacity-40")} />
                <div className={cn("flex flex-col gap-4")}>
                    <p>
                        All text, images and videos on this site are created by
                        humans.
                        <br />
                        This content is not authorized for use in training AI
                        models or for AI generation purposes.
                        <br />
                        All Rights Reserved.
                    </p>
                    <i translate="no" className={cn("text-sm opacity-80")}>
                        Tất cả văn bản, hình ảnh và video trên trang web này đều
                        do tác nhân con người.
                        <br />
                        Không được phép sử dụng để huấn luyện mô hình AI hoặc
                        cho mục đích tạo ra nội dung bằng AI.
                        <br />
                        Tất cả quyền lợi của tác giả được bảo lưu.
                    </i>
                    <i translate="no" className={cn("text-sm opacity-80")}>
                        本站所有文字、图片及视频内容均为人工创作。
                        <br />
                        未经授权，严禁将相关内容用于人工智能（AI）模型训练或 AI
                        生成目的。
                        <br />
                        版权所有。
                    </i>
                </div>
                <hr className={cn("border-t border-current opacity-40")} />
                <div className={cn("flex flex-col gap-4")}>
                    <p>
                        Continuing to scroll/slide down and/or passing this
                        alert signifies your agreement to the terms above.
                    </p>
                    <i translate="no" className={cn("text-sm opacity-80")}>
                        Tiếp tục lăn/lướt xuống và/hoặc vượt qua cảnh báo này
                        đồng nghĩa bạn đã đồng ý với với các điều trên.
                    </i>
                    <i translate="no" className={cn("text-sm opacity-80")}>
                        继续向下滚动/滑动，和/或略过此提示，即表示您同意上述条款。
                    </i>
                </div>
            </div>
        </div>
    )
}

export { NoAIOverlay, NoAIPlaceholder }
