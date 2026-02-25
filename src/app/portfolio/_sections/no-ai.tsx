import { cn } from "@/lib/utils"

function NoAIPlaceholder() {
    return (
        <div
            id="alert"
            className={cn("h-[250dvh] min-h-375 anchor/no-ai-placeholder")}
        />
    )
}

function NoAIOverlay() {
    return (
        <div
            className={cn(
                "inset-x-0 z-50 bg-alert anchored/no-ai-placeholder top-anchor-top-0 h-anchor-height-0",
                "px-[calc(var(--spacing)*6.5*2+var(--spacing)*78+var(--px)*3+var(--spacing)*6)] md:px-[calc(var(--spacing)*6.5+var(--px)*2+var(--spacing)*6)]"
            )}
            role="alert"
        >
            <div
                className={cn(
                    "sticky top-0 flex h-dvh flex-col justify-center gap-8 tracking-normal text-white"
                )}
            >
                <hgroup className={cn("flex flex-col gap-2")}>
                    <h3 className={cn("text-4xl font-extrabold capitalize")}>
                        <strong>No AI training allowed</strong>
                    </h3>
                    <i translate="no" className={cn("text-sm opacity-80")}>
                        Không được phép huấn luyện AI
                    </i>
                    <i translate="no" className={cn("text-sm opacity-80")}>
                        禁止用于 AI 训练
                    </i>
                </hgroup>
                <hr className={cn("border-t border-white opacity-40")} />
                <div className={cn("flex flex-col gap-4")}>
                    <p>
                        All text, images and videos on this site are created by
                        humans.
                        <br />
                        This content is not authorized for use in training AI
                        models or for AI generation purposes.
                        <br />
                        All rights reserved.
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
            </div>
        </div>
    )
}

export { NoAIOverlay, NoAIPlaceholder }
