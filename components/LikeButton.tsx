"use client";

import { useState } from "react";
import { toggleLike } from "@/lib/likes";
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
  const [count, setCount] = useState(initialCount);
  const [liked, setLiked] = useState(initialLiked);
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (!currentUserId) {
      window.location.href = "/login";
      return;
    }
    if (loading) return;

    // Optimistic update
    const nextLiked = !liked;
    setLiked(nextLiked);
    setCount((prev) => prev + (nextLiked ? 1 : -1));
    setLoading(true);

    const { liked: resultLiked, error } = await toggleLike(
      postId,
      currentUserId,
      liked
    );

    if (error) {
      // Rollback
      setLiked(liked);
      setCount((prev) => prev + (liked ? 0 : -1));
    } else {
      setLiked(resultLiked);
    }
    setLoading(false);
  };

  return (
    <button
      id="like-button"
      onClick={handleClick}
      disabled={loading}
      aria-label={liked ? "좋아요 취소" : "좋아요"}
      className={[
        "inline-flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-sm font-medium transition-all",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
        liked
          ? "border-rose-400 bg-rose-50 text-rose-600 dark:bg-rose-950/30 dark:text-rose-400"
          : "border-border bg-background text-muted-foreground hover:border-rose-300 hover:text-rose-500",
        loading ? "opacity-60 cursor-not-allowed" : "cursor-pointer",
      ].join(" ")}
    >
      <Heart
        className={`h-4 w-4 ${liked ? "fill-rose-500 text-rose-500" : ""}`}
      />
      <span>{count}</span>
    </button>
  );
}
