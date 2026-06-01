"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toUserMessage } from "@/lib/error-message";

export default function NewPostPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ title?: string; content?: string }>({});

  const validate = (title: string, content: string) => {
    const errors: { title?: string; content?: string } = {};
    if (!title) {
      errors.title = "제목을 입력하세요.";
    } else if (title.length < 2) {
      errors.title = "제목은 최소 2자 이상이어야 합니다.";
    }
    if (!content) {
      errors.content = "내용을 입력하세요.";
    } else if (content.length < 10) {
      errors.content = "내용은 최소 10자 이상이어야 합니다.";
    }
    return errors;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setServerError(null);
    setFieldErrors({});

    if (!user) {
      router.replace("/login");
      return;
    }

    const formData = new FormData(event.currentTarget);
    const title = String(formData.get("title") ?? "").trim();
    const content = String(formData.get("content") ?? "").trim();

    const errors = validate(title, content);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setSubmitting(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from("posts")
      .insert({ title, content, user_id: user.id })
      .select("id")
      .single();

    if (error) {
      console.error("[NewPostPage] insert error:", error);
      setServerError(toUserMessage(error));
      setSubmitting(false);
      return;
    }

    router.refresh();
    router.push(data?.id ? `/posts/${data.id}` : "/posts");
  };

  if (loading || !user) {
    return (
      <section className="space-y-6">
        <h1 className="text-2xl font-bold">새 글 작성</h1>
        <p className="text-sm text-muted-foreground animate-pulse">로그인 확인 중...</p>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-bold">새 글 작성</h1>

      <Card className="rounded-lg shadow-sm">
        <CardHeader>
          <CardTitle>게시글 작성</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="space-y-1">
              <label htmlFor="title" className="text-sm font-medium">
                제목
              </label>
              <Input
                id="title"
                name="title"
                type="text"
                placeholder="제목을 입력하세요 (최소 2자)"
                disabled={submitting}
                aria-describedby={fieldErrors.title ? "title-error" : undefined}
                className={fieldErrors.title ? "border-destructive focus-visible:ring-destructive/50" : ""}
              />
              {fieldErrors.title && (
                <p id="title-error" className="text-xs text-destructive">
                  {fieldErrors.title}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <label htmlFor="content" className="text-sm font-medium">
                내용
              </label>
              <textarea
                id="content"
                name="content"
                rows={8}
                placeholder="내용을 입력하세요 (최소 10자)"
                disabled={submitting}
                aria-describedby={fieldErrors.content ? "content-error" : undefined}
                className={[
                  "w-full rounded-md border bg-background px-3 py-2 text-sm text-foreground shadow-sm",
                  "focus-visible:outline-none focus-visible:ring-2",
                  fieldErrors.content
                    ? "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/50"
                    : "border-input focus-visible:border-ring focus-visible:ring-ring/50",
                ].join(" ")}
              />
              {fieldErrors.content && (
                <p id="content-error" className="text-xs text-destructive">
                  {fieldErrors.content}
                </p>
              )}
            </div>

            {serverError && <p className="text-sm text-destructive">{serverError}</p>}

            <div className="flex items-center gap-3">
              <Button type="submit" disabled={submitting}>
                {submitting ? "저장 중..." : "저장"}
              </Button>
              <Button asChild variant="outline" disabled={submitting}>
                <Link href="/posts">취소</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}
