import type { AuthError } from "@supabase/supabase-js";

type SupabaseErrorLike = {
  message?: string;
  code?: string | number;
};

export function toUserMessage(
  error: AuthError | SupabaseErrorLike | Error | unknown
): string {
  const message = (error as SupabaseErrorLike)?.message?.toLowerCase() ?? "";
  const code = String((error as SupabaseErrorLike)?.code ?? "");

  if (code === "42501" || message.includes("row-level security")) {
    return "이 작업을 수행할 권한이 없습니다.";
  }

  if (message.includes("failed to fetch")) {
    return "인터넷 연결을 확인해주세요.";
  }

  if (message.includes("not found") || message.includes("no rows") || code === "PGRST116") {
    return "요청한 게시글을 찾을 수 없습니다.";
  }

  return "일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
}