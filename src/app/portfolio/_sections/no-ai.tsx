import { cn } from "@/lib/utils"

function NoAI() {
    return (
        <div className={cn("z-50 h-[200dvh]")}>
            <div className={cn("h-[inherit] bg-red-500 py-20")}>
                <div
                    className={cn(
                        "sticky top-0 flex h-dvh flex-col items-center justify-center gap-8 tracking-normal text-white"
                    )}
                >
                    <div className={cn("flex w-1/2 flex-col gap-2")}>
                        <b className={cn("text-3xl font-extrabold")}>
                            No AI Training Allowed
                        </b>
                        <p
                            translate="no"
                            className={cn("text-sm italic opacity-80")}
                        >
                            Không được phép huấn luyện AI
                        </p>
                        <p
                            translate="no"
                            className={cn("text-sm italic opacity-80")}
                        >
                            禁止用于 AI 训练
                        </p>
                    </div>
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
                        <p
                            translate="no"
                            className={cn("text-sm italic opacity-80")}
                        >
                            Tất cả văn bản, hình ảnh và video trên trang web này
                            đều do tác nhân con người. Không được phép sử dụng
                            để huấn luyện mô hình AI hoặc cho mục đích tạo ra
                            nội dung bằng AI.
                            <br />
                            Bảo lưu toàn quyền.
                        </p>
                        <p
                            translate="no"
                            className={cn("text-sm italic opacity-80")}
                        >
                            本站所有文字、图片及视频内容均为人工创作。
                            <br />
                            未经授权，严禁将相关内容用于人工智能（AI）模型训练或
                            AI 生成目的。
                            <br />
                            版权所有。
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NoAI
