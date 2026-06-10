"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImagePlus, X, PenTool, Layout, FileText, ChevronLeft } from "lucide-react";
import { createPostAction } from "./actions";
import { cn } from "@/lib/utils";

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

    const actionFormData = new FormData();
    actionFormData.set("title", title);
    actionFormData.set("content", content);
    if (imageFile) {
      actionFormData.set("image", imageFile);
    }

    const result = await createPostAction(actionFormData);

    if (!result.ok) {
      setServerError(result.error);
      setSubmitting(false);
      return;
    }

    if (result.warning) {
      setServerError(result.warning);
    }

    router.refresh();
    router.push(`/posts/${result.postId}`);
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center space-y-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-sm font-medium text-muted-foreground">인증 정보를 동기화 중입니다...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <section className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-6">
        <div className="text-6xl">🔒</div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">로그인이 필요합니다</h1>
          <p className="text-muted-foreground">게시글을 작성하려면 먼저 로그인해 주세요.</p>
        </div>
        <Button asChild size="lg" className="rounded-xl shadow-xl shadow-primary/20">
          <Link href="/login?next=/posts/new">로그인하러 가기</Link>
        </Button>
      </section>
    );
  }

  return (
    <section className="max-w-3xl mx-auto space-y-10 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="space-y-4">
        <Link href="/posts" className="group inline-flex items-center gap-1 text-sm font-semibold text-muted-foreground transition-colors hover:text-primary">
          <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" /> 목록으로
        </Link>
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
             <PenTool className="h-6 w-6" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight">새로운 생각 기록</h1>
        </div>
      </header>

      <Card className="overflow-hidden border-none bg-card shadow-2xl shadow-primary/5">
        <CardHeader className="bg-muted/30 border-b border-border/40 pb-6 pt-8 px-8">
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <Layout className="h-5 w-5 text-primary" /> 게시글 작성
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-8" noValidate>
            {/* 제목 */}
            <div className="space-y-3">
              <label htmlFor="title" className="flex items-center gap-2 text-sm font-bold text-foreground">
                <FileText className="h-4 w-4 text-primary" /> 제목
              </label>
              <Input
                id="title"
                name="title"
                type="text"
                placeholder="어떤 멋진 제목을 지어볼까요? (최소 2자)"
                disabled={submitting}
                aria-describedby={fieldErrors.title ? "title-error" : undefined}
                className={cn(
                  "h-12 border-none bg-muted/40 px-4 transition-all focus:bg-background focus:ring-2",
                  fieldErrors.title ? "ring-2 ring-destructive/50" : "focus:ring-primary/20"
                )}
              />
              {fieldErrors.title && (
                <p id="title-error" className="text-xs font-medium text-destructive animate-in slide-in-from-left-2 transition-all">
                  {fieldErrors.title}
                </p>
              )}
            </div>

            {/* 내용 */}
            <div className="space-y-3">
              <label htmlFor="content" className="flex items-center gap-2 text-sm font-bold text-foreground">
                <Layout className="h-4 w-4 text-primary" /> 내용
              </label>
              <textarea
                id="content"
                name="content"
                rows={12}
                placeholder="여기에 당신의 영감을 기록해 보세요 (최소 10자)..."
                disabled={submitting}
                aria-describedby={fieldErrors.content ? "content-error" : undefined}
                className={cn(
                  "w-full rounded-2xl border-none bg-muted/40 px-4 py-4 text-base text-foreground shadow-sm transition-all focus:bg-background focus:ring-2 outline-none resize-none",
                  fieldErrors.content ? "ring-2 ring-destructive/50" : "focus:ring-primary/20"
                )}
              />
              {fieldErrors.content && (
                <p id="content-error" className="text-xs font-medium text-destructive animate-in slide-in-from-left-2 transition-all">
                  {fieldErrors.content}
                </p>
              )}
            </div>

            {/* 이미지 업로드 */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-bold text-foreground">
                <ImagePlus className="h-4 w-4 text-primary" /> 이미지 첨부 (선택)
              </label>
              {imagePreview ? (
                <div className="relative group w-full overflow-hidden rounded-2xl border border-border/50 shadow-lg transition-all hover:shadow-xl">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imagePreview}
                    alt="미리보기"
                    className="w-full max-h-[400px] object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                  <button
                    type="button"
                    onClick={handleImageRemove}
                    aria-label="이미지 제거"
                    className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-xl bg-background/90 text-foreground shadow-lg transition-all hover:bg-destructive hover:text-destructive-foreground"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                <label
                  htmlFor="image-input"
                  className="group flex min-h-[200px] cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-border/60 bg-muted/20 px-4 py-10 transition-all hover:border-primary hover:bg-primary/[0.02]"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-background shadow-sm transition-transform group-hover:scale-110 group-hover:rotate-6">
                    <ImagePlus className="h-7 w-7 text-primary" />
                  </div>
                  <div className="text-center">
                    <p className="text-base font-bold text-foreground">클릭하여 이미지 업로드</p>
                    <p className="mt-1 text-xs text-muted-foreground font-medium">JPG, PNG, GIF, WebP · 최대 5MB</p>
                  </div>
                  <input
                    id="image-input"
                    name="image"
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={handleImageChange}
                    disabled={submitting}
                  />
                </label>
              )}
            </div>

            {serverError && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm font-medium text-rose-600 animate-in shake-1">
                ⚠️ {serverError}
              </div>
            )}

            <div className="flex items-center gap-4 pt-4">
              <Button 
                type="submit" 
                disabled={submitting} 
                className="h-12 flex-1 rounded-xl font-extrabold text-base shadow-xl shadow-primary/20 transition-all hover:scale-[1.01] active:scale-[0.98]"
              >
                {submitting ? "저장 중..." : "게시글 발행하기"}
              </Button>
              <Button asChild variant="ghost" disabled={submitting} className="h-12 px-6 rounded-xl font-bold">
                <Link href="/posts">취소</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}
