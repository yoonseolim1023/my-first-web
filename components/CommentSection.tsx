"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Comment } from "@/lib/blog-types";
import { Button } from "@/components/ui/button";
import { MessageSquare, MoreHorizontal, Send, Trash2, User } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  postId: string;
  initialComments: Comment[];
  currentUserId: string | undefined;
};

function formatDate(value: string) {
  const date = new Date(value);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  
  if (diff < 1000 * 60) return "방금 전";
  if (diff < 1000 * 60 * 60) return `${Math.floor(diff / (1000 * 60))}분 전`;
  if (diff < 1000 * 60 * 60 * 24) return `${Math.floor(diff / (1000 * 60 * 60))}시간 전`;
  
  return date.toLocaleDateString("ko-KR", {
    month: "2-digit",
    day: "2-digit",
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
    if (submitting) return;
    setError(null);
    const text = content.trim();
    if (!text) return;
    if (!currentUserId) {
      setError("로그인이 필요합니다.");
      return;
    }

    setSubmitting(true);
    const supabase = createClient();

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
    if (!confirm("정말 삭제하시겠습니까?")) return;
    
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
    <section className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <MessageSquare className="h-5 w-5" />
        </div>
        <h2 className="text-2xl font-bold">
          의견 <span className="text-primary">{comments.length}</span>
        </h2>
      </div>

      {/* 댓글 작성 폼 */}
      <div className="rounded-2xl border border-border/50 bg-muted/30 p-4 transition-focus-within focus-within:bg-background focus-within:ring-2 focus-within:ring-primary/20">
        {currentUserId ? (
          <form onSubmit={handleSubmit} className="space-y-3">
            <textarea
              id="comment-input"
              rows={3}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={submitting}
              placeholder="따뜻한 댓글을 남겨주세요..."
              className="w-full resize-none bg-transparent px-2 py-0 text-base placeholder:text-muted-foreground outline-none border-none"
            />
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                {error && <span className="text-rose-500 animate-pulse">{error}</span>}
              </div>
              <Button 
                type="submit" 
                size="sm" 
                disabled={submitting || !content.trim()} 
                id="comment-submit"
                className="rounded-lg px-4 font-bold shadow-md shadow-primary/10"
              >
                {submitting ? "등록 중..." : "등록하기"}
                <Send className="ml-2 h-3.5 w-3.5" />
              </Button>
            </div>
          </form>
        ) : (
          <div className="py-2 text-center text-sm text-muted-foreground">
            생각을 공유하려면 <a href="/login" className="font-bold text-primary hover:underline">로그인</a>이 필요합니다.
          </div>
        )}
      </div>

      {/* 댓글 목록 */}
      <div className="space-y-6">
        {comments.length === 0 && (
          <p className="py-8 text-center text-sm text-muted-foreground bg-muted/20 rounded-2xl border border-dashed border-border/60">
            아직 의논된 내용이 없네요. 대화의 주인공이 되어보세요!
          </p>
        )}
        {comments.map((comment, index) => (
          <div
            key={comment.id}
            className="group flex gap-4 transition-all duration-300"
          >
            <div className="flex-shrink-0">
               <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-secondary-foreground font-bold">
                 {comment.author.charAt(0)}
               </div>
            </div>
            <div className="flex-1 space-y-1.5 pt-0.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold">{comment.author}</span>
                  <span className="text-[10px] sm:text-xs text-muted-foreground opacity-60">
                    {formatDate(comment.created_at)}
                  </span>
                </div>
                {currentUserId === comment.user_id && (
                  <button
                    onClick={() => handleDelete(comment.id)}
                    className="rounded-lg p-1 text-muted-foreground opacity-0 transition-all hover:bg-rose-50 hover:text-rose-500 group-hover:opacity-100"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
              <div className="text-base text-foreground/90 whitespace-pre-wrap leading-relaxed px-1">
                {comment.content}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
