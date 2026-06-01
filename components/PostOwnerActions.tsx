"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toUserMessage } from "@/lib/error-message";

type PostOwnerActionsProps = {
  postId: string;
  postUserId: string;
  initialTitle: string;
  initialContent: string;
};

export function PostOwnerActions({
  postId,
  postUserId,
  initialTitle,
  initialContent,
}: PostOwnerActionsProps) {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (loading || !user || user.id !== postUserId) {
    return null;
  }

  const handleUpdate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!title.trim() || !content.trim()) {
      setError("제목과 내용을 입력하세요.");
      return;
    }

    setSubmitting(true);
    try {
      const supabase = createClient();
      const { data: updatedPost, error: updateError } = await supabase
        .from("posts")
        .update({
          title: title.trim(),
          content: content.trim(),
        })
        .eq("id", postId)
        .select("id")
        .maybeSingle();

      if (updateError || !updatedPost) {
        setError(updateError ? toUserMessage(updateError) : "수정에 실패했습니다.");
        return;
      }

      router.push("/posts");
    } catch (caught) {
      console.error("[PostOwnerActions] update failed", caught);
      setError(toUserMessage(caught));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm("정말 삭제할까요?");
    if (!confirmed) {
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const supabase = createClient();
      const { data: deletedPost, error: deleteError } = await supabase
        .from("posts")
        .delete()
        .eq("id", postId)
        .select("id")
        .maybeSingle();

      if (deleteError || !deletedPost) {
        setError(deleteError ? toUserMessage(deleteError) : "삭제에 실패했습니다.");
        return;
      }

      router.push("/posts");
    } catch (caught) {
      console.error("[PostOwnerActions] delete failed", caught);
      setError(toUserMessage(caught));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground">
        UI 분기는 편의용이며, 실제 보안은 Ch11 RLS에서 처리합니다.
      </p>
      {!editing ? (
        <div className="flex items-center gap-2">
          <Button type="button" variant="outline" size="sm" onClick={() => setEditing(true)}>
            수정
          </Button>
          <Button type="button" variant="destructive" size="sm" onClick={handleDelete}>
            삭제
          </Button>
        </div>
      ) : (
        <form onSubmit={handleUpdate} className="space-y-3">
          <div className="space-y-2">
            <label htmlFor="edit-title" className="text-sm font-medium">
              제목
            </label>
            <Input
              id="edit-title"
              name="title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              disabled={submitting}
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="edit-content" className="text-sm font-medium">
              내용
            </label>
            <textarea
              id="edit-content"
              name="content"
              rows={6}
              value={content}
              onChange={(event) => setContent(event.target.value)}
              disabled={submitting}
              required
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <div className="flex items-center gap-2">
            <Button type="submit" disabled={submitting}>
              {submitting ? "저장 중..." : "저장"}
            </Button>
            <Button type="button" variant="ghost" onClick={() => setEditing(false)} disabled={submitting}>
              취소
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
