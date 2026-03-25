import Link from "next/link";

const POSTS = [
  {
    id: 1,
    title: "Next.js 15와 Tailwind CSS 4로 블로그 만들기",
    date: "2025-03-25",
    excerpt: "새로운 기술 스택으로 블로그를 구축하면서 겪은 경험과 배운 점들을 공유합니다. App Router와 Tailwind CSS 4의 강력함을 느껴보세요.",
  },
  {
    id: 2,
    title: "공공인재와 빅데이터의 만남",
    date: "2025-03-20",
    excerpt: "공공 정책 결정 과정에서 빅데이터가 어떻게 혁신을 일으킬 수 있는지, 그리고 제가 공부하고 있는 공공인재빅데이터융합학에 대해 소개합니다.",
  },
  {
    id: 3,
    title: "농구 직관 후기: KBL 결승전",
    date: "2025-03-15",
    excerpt: "스포츠의 열기를 직접 느끼는 것만큼 즐거운 일은 없죠. 이번 주말 관람한 농구 경기 직관 후기와 경기 분석을 담았습니다.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-gray-900 tracking-tight">
            임윤서의 로그
          </Link>
          <nav className="flex gap-6 text-sm font-medium text-gray-600">
            <Link href="/" className="hover:text-gray-900 transition-colors">홈</Link>
            <Link href="/about" className="hover:text-gray-900 transition-colors">소개</Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto px-4 py-12 w-full">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-8">최근 게시물</h2>
        
        <div className="space-y-12">
          {POSTS.map((post) => (
            <article key={post.id} className="group cursor-pointer">
              <p className="text-sm text-gray-500 mb-2">{post.date}</p>
              <h3 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-4">
                {post.title}
              </h3>
              <p className="text-gray-600 leading-relaxed max-w-2xl mb-4">
                {post.excerpt}
              </p>
              <Link 
                href={`/posts/${post.id}`} 
                className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
              >
                더 읽어보기 &rarr;
              </Link>
            </article>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-12 mt-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-gray-500 text-sm">
            © 2025 Lim Yunseo. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
