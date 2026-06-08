"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Heart } from "lucide-react";

type Props = {
  postId: string;
  initialCount: number;
  initialLiked: boolean;
  currentUserId: string | undefined;
};

export default function LikeButton({
  postId,
  initialCount,
  initialLiked,
  currentUserId,
}: Props) {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [count, setCount] = useState(initialCount);
  const [liked, setLiked] = useState(initialLiked);
  const [loading, setLoading] = useState(false);
  const effectiveUserId = currentUserId ?? user?.id;

  const handleClick = async () => {
    if (authLoading) {
      return;
    }

    if (!effectiveUserId) {
      router.push("/login");
      return;
    }
    if (loading) return;

    // Optimistic update
    const prevLiked = liked;
    const nextLiked = !liked;
    setLiked(nextLiked);
    setCount((prev) => prev + (nextLiked ? 1 : -1));
    setLoading(true);

    const supabase = createClient();
    let error: { message: string } | null = null;

    // 프로필이 아직 없으면 먼저 생성해서 likes 외래키 오류를 막는다.
    if (user) {
      const { error: profileError } = await supabase.from("profiles").upsert(
        {
          id: user.id,
          username: user.user_metadata?.name ?? user.email?.split("@")[0] ?? null,
          avatar_url: user.user_metadata?.avatar_url ?? null,
        },
        { onConflict: "id" }
      );

      if (profileError) {
        error = profileError;
      }
    }

    if (!error && prevLiked) {
      const { error: deleteError } = await supabase
        .from("likes")
        .delete()
        .eq("post_id", postId)
        .eq("user_id", effectiveUserId);
      error = deleteError;
    } else if (!error) {
      const { error: insertError } = await supabase
        .from("likes")
        .insert({ post_id: postId, user_id: effectiveUserId });
      error = insertError;
    }

    if (error) {
      console.error("[LikeButton] like action failed:", error);
      // Rollback on error
      setLiked(prevLiked);
      setCount((prev) => prev + (prevLiked ? 1 : -1));
    }
    setLoading(false);
  };

  return (
    <button
      id="like-button"
      type="button"
      onClick={handleClick}
      disabled={loading || authLoading}
      aria-label={liked ? "좋아요 취소" : "좋아요"}
      aria-busy={loading || authLoading}
      className={[
        "inline-flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-sm font-medium transition-all",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
        liked
          ? "border-rose-400 bg-rose-50 text-rose-600 dark:bg-rose-950/30 dark:text-rose-400"
          : "border-border bg-background text-muted-foreground hover:border-rose-300 hover:text-rose-500",
        loading || authLoading ? "opacity-60 cursor-not-allowed" : "cursor-pointer",
      ].join(" ")}
    >
      <Heart
        className={`h-4 w-4 ${liked ? "fill-rose-500 text-rose-500" : ""}`}
      />
      <span>{count}</span>
    </button>
  );
}
