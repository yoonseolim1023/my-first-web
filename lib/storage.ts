import { createClient } from "@/lib/supabase/client";

/**
 * Supabase Storage post-images 버킷에 이미지 업로드
 * @returns publicUrl (업로드 성공 시) 또는 null
 */
export async function uploadPostImage(
  file: File,
  userId: string
): Promise<string | null> {
  const supabase = createClient();
  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `${userId}/${Date.now()}.${ext}`;

  const { error } = await supabase.storage
    .from("post-images")
    .upload(path, file, { upsert: false });

  if (error) {
    console.error("[uploadPostImage] upload error:", error);
    return null;
  }

  const { data } = supabase.storage.from("post-images").getPublicUrl(path);
  return data.publicUrl;
}
