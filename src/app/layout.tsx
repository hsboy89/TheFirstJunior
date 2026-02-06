import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "EduPulse - 모험 가득한 공부의 세계",
    description: "미국 Common Core 기반 영어 학습 플랫폼",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ko">
            <body>{children}</body>
        </html>
    );
}
