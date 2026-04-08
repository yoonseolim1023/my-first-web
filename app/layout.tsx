import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "내 블로그",
  description: "웹 개발을 배우며 기록하는 공간",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="min-h-screen flex flex-col">
        <nav className="bg-gray-800 text-white">
          <div className="mx-auto flex w-full max-w-4xl items-center justify-between px-6 py-4">
            <Link href="/" className="text-lg font-semibold tracking-tight">
              내 블로그
            </Link>

            <ul className="flex items-center gap-5 text-sm font-medium">
              <li>
                <Link href="/" className="transition hover:text-gray-200">
                  홈
                </Link>
              </li>
              <li>
                <Link href="/posts" className="transition hover:text-gray-200">
                  블로그
                </Link>
              </li>
              <li>
                <Link href="/posts/new" className="transition hover:text-gray-200">
                  새 글 쓰기
                </Link>
              </li>
            </ul>
          </div>
        </nav>
        <main className="mx-auto w-full max-w-4xl flex-1 p-6">{children}</main>
        <footer className="py-4 text-center text-gray-500">© 2026 내 블로그</footer>
      </body>
    </html>
  );
}
