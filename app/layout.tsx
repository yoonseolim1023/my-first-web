import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { Outfit } from "next/font/google";
import { cn } from "@/lib/utils";
import { AuthProvider } from "@/contexts/AuthContext";
import AuthNav from "@/components/AuthNav";

const fontSans = Outfit({ 
  subsets: ["latin"], 
  variable: "--font-outfit",
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Yoonseo Lim. dev | Insightful Stories",
  description: "개발자 윤서의 기술과 성장 이야기를 담은 블로그",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={cn("font-sans antialiased", fontSans.variable)} suppressHydrationWarning>
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
      <body className="flex min-h-screen flex-col bg-background text-foreground transition-colors duration-500 selection:bg-primary/40 selection:text-white">
        <AuthProvider>
          <header className="glass">
            <div className="mx-auto flex h-20 w-full max-w-5xl items-center justify-between px-6">
              <Link href="/" className="group flex items-center gap-3 text-2xl font-black tracking-tighter">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-orange-100 text-primary-foreground shadow-lg shadow-primary/20 transition-transform group-hover:rotate-6 group-active:scale-90">
                  <span className="text-xl">Y</span>
                </div>
                <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent group-hover:to-primary transition-all whitespace-nowrap">
                   Yoonseo Lim. dev
                </span>
              </Link>

              <AuthNav />
            </div>
          </header>
          
          <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-12 md:py-20 lg:py-24">
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out">
              {children}
            </div>
          </main>
          
          <footer className="border-t border-border/40 bg-muted/20 py-16">
            <div className="mx-auto max-w-5xl px-6 text-center space-y-6">
              <div className="flex items-center justify-center gap-2 text-xl font-black tracking-tighter opacity-80">
                <span className="h-2 w-2 rounded-full bg-primary" />
                Yoonseo Lim. dev
              </div>
              <p className="text-sm font-medium text-muted-foreground/70 max-w-md mx-auto leading-relaxed">
                단순한 코딩을 넘어, 매일의 고민과 배움을 기록합니다.<br />
                개발자 윤서가 채워나가는 기술과 성장 이야기를 만나보세요.
              </p>
              <div className="pt-4 border-t border-border/20">
                 <p className="text-xs font-bold text-muted-foreground/40 uppercase tracking-widest">
                   © 2026 Yoonseo Lim. dev. Crafted with Care.
                 </p>
              </div>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
