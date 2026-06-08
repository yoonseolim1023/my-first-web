"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Comment } from "@/lib/blog-types";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

type Props = {
  postId: string;
  initialComments: Comment[];
  currentUserId: string | undefined;
};

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function CommentSection({
  postId,
  initialComments,
  currentUserId,
}: Props) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const text = content.trim();
    if (!text) {
      setError("댓글 내용을 입력하세요.");
      return;
    }
    if (!currentUserId) {
      setError("로그인이 필요합니다.");
      return;
    }

    setSubmitting(true);
    const supabase = createClient();

    // 작성자명 조회
    const { data: profile } = await supabase
      .from("profiles")
      .select("username")
      .eq("id", currentUserId)
      .maybeSingle();
    const author = profile?.username ?? "익명";

    const { data, error: insertError } = await supabase
      .from("comments")
      .insert({ post_id: postId, user_id: currentUserId, content: text })
      .select("id, post_id, user_id, content, created_at")
      .single();

    if (insertError || !data) {
      setError(insertError?.message ?? "댓글 추가에 실패했습니다.");
      setSubmitting(false);
      return;
    }

    setComments((prev) => [...prev, { ...data, author }]);
    setContent("");
    setSubmitting(false);
  };

  const handleDelete = async (commentId: string) => {
    const supabase = createClient();
    const { error: deleteError } = await supabase
      .from("comments")
      .delete()
      .eq("id", commentId);
    if (deleteError) {
      setError(deleteError.message);
      return;
    }
    setComments((prev) => prev.filter((c) => c.id !== commentId));
  };

  return (
    <section className="space-y-4 pt-6 border-t border-border">
      <h2 className="text-lg font-semibold">
        댓글{" "}
        <span className="text-muted-foreground text-sm">({comments.length})</span>
      </h2>

      {/* 댓글 목록 */}
      <div className="space-y-3">
        {comments.length === 0 && (
          <p className="text-sm text-muted-foreground">
            아직 댓글이 없어요. 첫 댓글을 작성해 보세요!
          </p>
        )}
        {comments.map((comment) => (
          <div
            key={comment.id}
            className="rounded-lg border border-border bg-card p-4 space-y-1"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{comment.author}</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  {formatDate(comment.created_at)}
                </span>
                {currentUserId === comment.user_id && (
                  <button
                    onClick={() => handleDelete(comment.id)}
                    aria-label="댓글 삭제"
                    className="text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>
            <p className="text-sm text-foreground whitespace-pre-wrap">
              {comment.content}
            </p>
          </div>
        ))}
      </div>

      {/* 댓글 작성 폼 */}
      {currentUserId ? (
        <form onSubmit={handleSubmit} className="space-y-2">
          <textarea
            id="comment-input"
            rows={3}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={submitting}
            placeholder="댓글을 입력하세요..."
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
          />
          {error && <p className="text-xs text-destructive">{error}</p>}
          <Button
            type="submit"
            size="sm"
            disabled={submitting}
            id="comment-submit"
          >
            {submitting ? "저장 중..." : "댓글 달기"}
          </Button>
        </form>
      ) : (
        <p className="text-sm text-muted-foreground">
          댓글을 작성하려면{" "}
          <a href="/login" className="underline hover:text-foreground">
            로그인
          </a>
          이 필요합니다.
        </p>
      )}
    </section>
  );
}
