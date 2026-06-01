"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function PostDetailError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("[PostDetailError]", error);
  }, [error]);

  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 text-center">
      <div className="text-4xl">😔</div>
      <h2 className="text-lg font-semibold text-foreground">게시글을 불러오지 못했어요</h2>
      <p className="text-sm text-muted-foreground">
        잠시 후 다시 시도하거나 목록으로 돌아가 주세요.
      </p>
      <div className="flex gap-2">
        <Button onClick={reset} variant="outline" size="sm">
          다시 시도
        </Button>
        <Button asChild variant="ghost" size="sm">
          <Link href="/posts">목록으로</Link>
        </Button>
      </div>
    </div>
  );
}