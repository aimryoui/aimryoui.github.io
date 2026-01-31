import { cn } from "@/lib/utils"

function NoAI() {
    return (
        <div className={cn("z-50 h-[250dvh]")}>
            <div className={cn("h-inherit bg-red-500 py-20")}>
                <div
                    className={cn(
                        "sticky top-0 flex h-dvh flex-col items-center justify-center gap-8 tracking-normal text-white"
                    )}
                >
                    <hgroup className={cn("flex w-1/2 flex-col gap-2")}>
                        <h3
                            className={cn("text-4xl font-extrabold capitalize")}
                        >
                            <strong>No AI training allowed</strong>
                        </h3>
                        <i translate="no" className={cn("text-sm opacity-80")}>
                            Không được phép huấn luyện AI
                        </i>
                        <i translate="no" className={cn("text-sm opacity-80")}>
                            禁止用于 AI 训练
                        </i>
                    </hgroup>
                    <hr
                        className={cn("w-1/2 border-t border-white opacity-40")}
                    />
                    <div className={cn("flex w-1/2 flex-col gap-4")}>
                        <p>
                            All text, images and videos on this site are created
                            by humans. This content is not authorized for use in
                            training AI models or for AI generation purposes.
                            <br />
                            All rights reserved.
                        </p>
                        <i translate="no" className={cn("text-sm opacity-80")}>
                            Tất cả văn bản, hình ảnh và video trên trang web này
                            đều do tác nhân con người. Không được phép sử dụng
                            để huấn luyện mô hình AI hoặc cho mục đích tạo ra
                            nội dung bằng AI.
                            <br />
                            Tất cả quyền lợi của tác giả được bảo lưu.
                        </i>
                        <i translate="no" className={cn("text-sm opacity-80")}>
                            本站所有文字、图片及视频内容均为人工创作。
                            <br />
                            未经授权，严禁将相关内容用于人工智能（AI）模型训练或
                            AI 生成目的。
                            <br />
                            版权所有。
                        </i>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NoAI
