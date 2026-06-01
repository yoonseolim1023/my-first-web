"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("[GlobalError]", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <div className="text-5xl">⚠️</div>
      <h2 className="text-xl font-semibold text-foreground">예상치 못한 오류가 발생했어요</h2>
      <p className="text-sm text-muted-foreground">
        잠시 후 다시 시도하거나, 문제가 계속되면 새로고침 해주세요.
      </p>
      <Button onClick={reset} variant="outline">
        다시 시도
      </Button>
    </div>
  );
}