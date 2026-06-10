"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { toUserMessage } from "@/lib/error-message";

export type CreatePostResult =
  | { ok: true; postId: string; warning?: string }
  | { ok: false; error: string };

export async function createPostAction(formData: FormData): Promise<CreatePostResult> {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, error: "로그인이 필요합니다." };
  }

  const title = String(formData.get("title") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();
  const imageValue = formData.get("image");
  const imageFile = imageValue instanceof File && imageValue.size > 0 ? imageValue : null;

  if (!title) {
    return { ok: false, error: "제목을 입력하세요." };
  }
  if (title.length < 2) {
    return { ok: false, error: "제목은 최소 2자 이상이어야 합니다." };
  }
  if (!content) {
    return { ok: false, error: "내용을 입력하세요." };
  }
  if (content.length < 10) {
    return { ok: false, error: "내용은 최소 10자 이상이어야 합니다." };
  }

  const { error: profileError } = await supabase.from("profiles").upsert(
    {
      id: user.id,
      username: user.user_metadata?.name ?? user.email?.split("@")[0] ?? null,
      avatar_url: user.user_metadata?.avatar_url ?? null,
    },
    { onConflict: "id" }
  );

  if (profileError) {
    return { ok: false, error: toUserMessage(profileError) };
  }

  let imageUrl: string | null = null;
  let uploadWarning: string | undefined;

  if (imageFile) {
    const ext = imageFile.name.split(".").pop() ?? "jpg";
    const path = `${user.id}/${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("post-images")
      .upload(path, imageFile, { upsert: false });

    if (uploadError) {
      console.error("[createPostAction] upload error:", uploadError);
      uploadWarning = "이미지 업로드에 실패해서 글만 저장했습니다.";
    } else {
      const { data } = supabase.storage.from("post-images").getPublicUrl(path);
      imageUrl = data.publicUrl;
    }
  }

  const { data, error } = await supabase
    .from("posts")
    .insert({ title, content, user_id: user.id, image_url: imageUrl })
    .select("id")
    .single();

  if (error || !data) {
    return { ok: false, error: toUserMessage(error ?? new Error("게시글 저장에 실패했습니다.")) };
  }

  return { ok: true, postId: data.id, warning: uploadWarning };
}