import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { AuthProvider } from "@/contexts/AuthContext";
import AuthNav from "@/components/AuthNav";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

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
    <html lang="ko" className={cn("font-sans", geist.variable)} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                try {
                  var storageKey = "my-first-web-theme";
                  var savedTheme = localStorage.getItem(storageKey);
                  var prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
                  var theme = savedTheme === "light" || savedTheme === "dark" ? savedTheme : (prefersDark ? "dark" : "light");
                  document.documentElement.classList.toggle("dark", theme === "dark");
                } catch (error) {}
              })();
            `,
          }}
        />
      </head>
      <body className="flex min-h-screen flex-col bg-background text-foreground">
        <AuthProvider>
          <nav className="bg-primary text-primary-foreground">
            <div className="mx-auto flex w-full max-w-4xl items-center justify-between px-6 py-4">
              <Link href="/" className="text-lg font-semibold tracking-tight">
                내 블로그
              </Link>

              <AuthNav />
            </div>
          </nav>
          <main className="mx-auto w-full max-w-4xl flex-1 p-6">{children}</main>
          <footer className="py-4 text-center text-sm text-muted-foreground">© 2026 내 블로그</footer>
        </AuthProvider>
      </body>
    </html>
  );
}
