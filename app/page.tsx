import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, BookOpen, PenLine, Sparkles, TrendingUp, Zap, Star } from "lucide-react";

export const dynamic = "force-dynamic";

type RecentPost = {
  id: string;
  title: string;
  content: string;
  created_at: string;
};

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("ko-KR", {
    month: "long",
    day: "numeric",
  });
}

export default async function HomePage() {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("posts")
    .select("id, title, content, created_at")
    .order("created_at", { ascending: false })
    .limit(3);

  const posts = (data ?? []) as RecentPost[];

  return (
    <div className="space-y-32 pb-20">
      {/* Personalized Hero Section */}
      <section className="relative flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
        {/* Advanced Background Effects (Pastel Yellow/Peach Theme) */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-[140px] opacity-40" />
          <div className="absolute left-[25%] top-[25%] h-[300px] w-[300px] rounded-full bg-orange-100/30 blur-[100px] opacity-30 animate-pulse" />
          <div className="absolute right-[25%] bottom-[25%] h-[400px] w-[400px] rounded-full bg-yellow-100/30 blur-[100px] opacity-30 animate-pulse delay-1000" />
        </div>
        
        <div className="group inline-flex items-center gap-2 rounded-2xl border border-primary/20 bg-primary/5 px-5 py-2 text-sm font-bold text-primary transition-all hover:bg-primary/10 animate-in fade-in slide-in-from-top-4 duration-1000">
          <Star className="h-4 w-4 fill-primary" />
          <span className="uppercase tracking-widest text-[10px]">Development & Growth Archive</span>
        </div>
        
        <h1 className="mt-8 text-5xl font-black tracking-tighter sm:text-7xl lg:text-8xl leading-tight">
          <span className="block text-gradient opacity-90">기록을 통한 성장,</span>
          <span className="block bg-gradient-to-r from-primary via-orange-300/80 to-amber-300 bg-clip-text text-transparent italic tracking-tight">
            Yoonseo&apos;s log
          </span>
        </h1>
        
        <p className="mt-10 max-w-2xl text-xl leading-relaxed text-muted-foreground/70 sm:text-2xl font-medium tracking-tight">
          단순한 코딩을 넘어, <span className="text-foreground/80 font-bold">매일의 고민과 배움</span>을 기록합니다.<br className="hidden sm:block" />
          개발자 윤서가 채워나가는 <span className="text-foreground/80 font-bold">기술과 성장 이야기</span>를 만나보세요.
        </p>
        
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-300">
          <Button asChild size="lg" className="h-16 px-10 text-lg font-black rounded-2xl shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95 primary-gradient border-none text-primary-foreground">
            <Link href="/posts" className="flex items-center gap-3">
              게시글 탐색 <TrendingUp className="h-5 w-5" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="h-16 px-10 text-lg font-black rounded-2xl border-2 border-primary/10 transition-all hover:bg-primary/5 hover:scale-105 active:scale-95 bg-background/50 backdrop-blur-sm">
            <Link href="/posts/new" className="flex items-center gap-3">
              생각 기록하기 <PenLine className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Featured Section Header */}
      <section className="space-y-12">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between border-b border-border/40 pb-8">
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-3xl font-black tracking-tighter">
              <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-primary/10 text-primary">
                <BookOpen className="h-6 w-6" />
              </div>
              <h2>최근 업데이트</h2>
            </div>
            <p className="text-muted-foreground font-medium text-lg italic opacity-80">"끊임없이 배우고 기록하며 나아갑니다."</p>
          </div>
          <Link href="/posts" className="group flex items-center gap-2 text-sm font-bold text-primary transition-all hover:gap-3 underline-offset-4 hover:underline">
            전체 리스트 <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {error ? (
          <div className="flex min-h-[300px] flex-col items-center justify-center space-y-4 rounded-[2.5rem] border-2 border-dashed border-primary/10 bg-muted/5 p-12 text-center">
             <div className="h-12 w-12 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500 text-2xl">⚠️</div>
             <p className="text-muted-foreground font-medium max-w-xs">최근 소식을 불러오는 중 예상치 못한 문제가 발생했습니다.</p>
             <Link href="/posts" className="text-primary hover:underline font-bold">새로고침 시도</Link>
          </div>
        ) : posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-6 py-24 text-center animate-in fade-in zoom-in-95 duration-700">
             <div className="h-24 w-24 rounded-[2.5rem] bg-muted/20 flex items-center justify-center text-5xl shadow-inner">🌱</div>
             <div className="space-y-2">
               <h3 className="text-2xl font-bold">당신만의 첫 글을 기다리고 있어요</h3>
               <p className="text-muted-foreground max-w-sm font-medium italic">당신의 지식과 경험이 누군가에게는 큰 영감이 될 수 있습니다.</p>
             </div>
             <Button asChild size="lg" className="rounded-2xl shadow-xl shadow-primary/20 primary-gradient px-12 h-14 border-none text-primary-foreground font-black text-base transition-transform hover:scale-105">
               <Link href="/posts/new">게시글 발행하기</Link>
             </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {posts.map((post, index) => (
              <Link key={post.id} href={`/posts/${post.id}`} className="group">
                <div 
                  className="relative flex h-full flex-col overflow-hidden rounded-[2.5rem] bg-card/40 border border-border/40 p-1 transition-all duration-500 hover:bg-card hover:shadow-[0_20px_50px_rgba(255,210,150,0.1)] dark:hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:-translate-y-3"
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="flex flex-col flex-1 p-8 space-y-6">
                    <div className="space-y-4 flex-1">
                      <div className="h-1 w-12 rounded-full bg-primary/20 transition-all group-hover:w-20 group-hover:bg-primary" />
                      <h3 className="line-clamp-2 text-2xl font-black leading-tight tracking-tighter group-hover:text-primary transition-colors">
                        {post.title}
                      </h3>
                      <p className="line-clamp-4 text-sm leading-relaxed text-muted-foreground/60 font-medium tracking-tight">
                        {post.content}
                      </p>
                    </div>
                    <div className="flex items-center justify-between pt-6 border-t border-border/20">
                      <time className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">
                        {formatDate(post.created_at)}
                      </time>
                      <div className="h-8 w-8 rounded-full border border-border/40 flex items-center justify-center text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all">
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
