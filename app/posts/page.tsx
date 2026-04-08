import Link from "next/link";
import { posts } from "@/lib/posts";

export default function PostsPage() {
  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">블로그</h1>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/posts/${post.id}`}
            className="block rounded-lg border border-gray-200 p-4 transition hover:shadow-lg"
          >
            <h2 className="text-lg font-semibold text-gray-900">{post.title}</h2>
            <p className="mt-2 line-clamp-2 text-sm text-gray-600">{post.content}</p>
            <p className="mt-3 text-sm text-gray-500">
              {post.author} · {post.date}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
