"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function PostsError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("[PostsError]", error);
  }, [error]);

  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 text-center">
      <div className="text-4xl">😢</div>
      <h2 className="text-lg font-semibold text-foreground">목록을 불러오지 못했어요</h2>
      <p className="text-sm text-muted-foreground">
        네트워크 상태를 확인하고 다시 시도해 주세요.
      </p>
      <Button onClick={reset} variant="outline" size="sm">
        다시 시도
      </Button>
    </div>
  );
}