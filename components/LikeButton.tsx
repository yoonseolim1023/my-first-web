"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

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
  const [count, setCount] = useState(initialCount);
  const [liked, setLiked] = useState(initialLiked);
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (!currentUserId) {
      window.location.href = `/login?next=${encodeURIComponent(window.location.pathname)}`;
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

    if (prevLiked) {
      const { error: deleteError } = await supabase
        .from("likes")
        .delete()
        .eq("post_id", postId)
        .eq("user_id", currentUserId);
      error = deleteError;
    } else {
      const { error: insertError } = await supabase
        .from("likes")
        .insert({ post_id: postId, user_id: currentUserId });
      error = insertError;
    }

    if (error) {
      // Rollback on error
      setLiked(prevLiked);
      setCount((prev) => prev + (prevLiked ? 1 : -1));
      console.error("[LikeButton] action failed:", error);
    }
    setLoading(false);
  };

  return (
    <div className="group flex flex-col items-center gap-3">
      <button
        id="like-button"
        type="button"
        onClick={handleClick}
        disabled={loading}
        aria-label={liked ? "좋아요 취소" : "좋아요"}
        className={cn(
          "relative flex h-16 w-16 items-center justify-center rounded-full transition-all duration-300",
          "hover:scale-110 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50",
          liked 
            ? "bg-rose-500 text-white shadow-lg shadow-rose-500/40 ring-4 ring-rose-500/10" 
            : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
        )}
      >
        <Heart
          className={cn(
            "h-8 w-8 transition-all duration-300",
            liked ? "fill-current scale-110" : "scale-100 group-hover:scale-110"
          )}
        />
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center rounded-full bg-white/20">
             <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          </div>
        )}
      </button>
      <span className={cn(
        "text-sm font-bold transition-colors",
        liked ? "text-rose-500" : "text-muted-foreground"
      )}>
        {count.toLocaleString()}명이 좋아합니다
      </span>
    </div>
  );
}
