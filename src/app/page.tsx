import Link from "next/link"

import { cn } from "@/lib/utils"

export default function Home() {
    return (
        <main className={cn("w-full")}>
            Nguyễn Hoàng Nhân
            <br />
            Creative Designer | UI/UX Designer
            <br />
            <Link href="/portfolio" className={cn("hover:underline")}>
                Portfolio
            </Link>
        </main>
    )
}
