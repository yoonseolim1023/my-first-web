"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { uploadPostImage } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toUserMessage } from "@/lib/error-message";
import { ImagePlus, X } from "lucide-react";

export default function NewPostPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ title?: string; content?: string }>({});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const isAuthenticated = Boolean(user);

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setServerError("이미지 파일만 첨부할 수 있습니다.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setServerError("이미지 크기는 5MB 이하여야 합니다.");
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setServerError(null);
  };

  const handleImageRemove = () => {
    setImageFile(null);
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(null);
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

    const { error: profileError } = await supabase.from("profiles").upsert(
      {
        id: user.id,
        username: user.user_metadata?.name ?? user.email?.split("@")[0] ?? null,
        avatar_url: user.user_metadata?.avatar_url ?? null,
      },
      { onConflict: "id" }
    );

    if (profileError) {
      console.error("[NewPostPage] ensure profile error:", profileError);
      setServerError(toUserMessage(profileError));
      setSubmitting(false);
      return;
    }

    // 이미지 업로드
    let imageUrl: string | null = null;
    if (imageFile) {
      imageUrl = await uploadPostImage(imageFile, user.id);
      if (!imageUrl) {
        console.error("[NewPostPage] image upload failed, saving post without image.");
      }
    }

    const { data, error } = await supabase
      .from("posts")
      .insert({ title, content, user_id: user.id, image_url: imageUrl })
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

  if (loading) {
    return (
      <section className="space-y-6">
        <h1 className="text-2xl font-bold">새 글 작성</h1>
        <p className="text-sm text-muted-foreground animate-pulse">로그인 확인 중...</p>
      </section>
    );
  }

  if (!isAuthenticated) {
    return (
      <section className="space-y-6">
        <h1 className="text-2xl font-bold">새 글 작성</h1>
        <p className="text-sm text-muted-foreground">로그인이 필요합니다.</p>
        <Button asChild variant="outline">
          <Link href="/login?next=/posts/new">로그인하러 가기</Link>
        </Button>
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
            {/* 제목 */}
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

            {/* 내용 */}
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

            {/* 이미지 업로드 */}
            <div className="space-y-2">
              <label className="text-sm font-medium">이미지 첨부 (선택)</label>
              {imagePreview ? (
                <div className="relative w-full">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imagePreview}
                    alt="미리보기"
                    className="w-full max-h-64 rounded-lg object-cover border border-border"
                  />
                  <button
                    type="button"
                    onClick={handleImageRemove}
                    aria-label="이미지 제거"
                    className="absolute top-2 right-2 rounded-full bg-background/80 p-1 text-foreground hover:bg-destructive hover:text-destructive-foreground transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <label
                  htmlFor="image-input"
                  className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed border-border px-4 py-8 text-sm text-muted-foreground hover:border-ring hover:text-foreground transition-colors"
                >
                  <ImagePlus className="h-6 w-6" />
                  <span>클릭하여 이미지를 첨부하세요</span>
                  <span className="text-xs">JPG, PNG, GIF, WebP · 최대 5MB</span>
                  <input
                    id="image-input"
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={handleImageChange}
                    disabled={submitting}
                  />
                </label>
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
