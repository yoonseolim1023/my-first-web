import Link from "next/link";
import { posts } from "@/lib/posts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PostsPage() {
  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-bold">블로그</h1>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {posts.map((post) => (
          <Link key={post.id} href={`/posts/${post.id}`}>
            <Card className="h-full rounded-lg shadow-sm transition hover:shadow-md">
              <CardHeader>
                <CardTitle className="text-lg">{post.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="line-clamp-2 text-sm text-muted-foreground">
                  {post.content}
                </p>
                <p className="mt-3 text-sm text-muted-foreground">
                  {post.author} · {post.date}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
