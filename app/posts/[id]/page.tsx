import Link from "next/link";
import { posts } from "@/lib/posts";

type PostDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function PostDetailPage({ params }: PostDetailPageProps) {
  const { id } = await params;
  const postId = Number(id);
  const post = posts.find((item) => item.id === postId);

  if (!post) {
    return (
      <section className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">게시글 상세</h1>
        <p className="text-gray-600">게시글을 찾을 수 없습니다.</p>
        <Link
          href="/posts"
          className="inline-flex items-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
        >
          목록으로 돌아가기
        </Link>
      </section>
    );
  }

  return (
    <article className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold text-gray-900">{post.title}</h1>
        <p className="text-sm text-gray-500">
          {post.author} · {post.date}
        </p>
      </header>

      <p className="leading-7 text-gray-700">{post.content}</p>

      <Link
        href="/posts"
        className="inline-flex items-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
      >
        목록으로 돌아가기
      </Link>
    </article>
  );
}
