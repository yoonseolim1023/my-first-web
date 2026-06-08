-- ============================================================
-- RLS: comments
-- ============================================================
alter table comments enable row level security;

create policy "comments_select_all"
  on comments for select using (true);

create policy "comments_insert_own"
  on comments for insert
  with check (auth.uid() = user_id);

create policy "comments_delete_own"
  on comments for delete
  using (auth.uid() = user_id);

-- ============================================================
-- RLS: likes
-- ============================================================
alter table likes enable row level security;

create policy "likes_select_all"
  on likes for select using (true);

create policy "likes_insert_own"
  on likes for insert
  with check (auth.uid() = user_id);

create policy "likes_delete_own"
  on likes for delete
  using (auth.uid() = user_id);

-- ============================================================
-- Storage: post-images 정책
-- ============================================================

-- 로그인한 사용자 업로드 허용
create policy "storage_post_images_insert"
  on storage.objects for insert
  with check (
    bucket_id = 'post-images'
    and auth.role() = 'authenticated'
  );

-- 누구나 읽기 허용 (public 버킷)
create policy "storage_post_images_select"
  on storage.objects for select
  using (bucket_id = 'post-images');

-- 업로드한 본인만 삭제
create policy "storage_post_images_delete"
  on storage.objects for delete
  using (
    bucket_id = 'post-images'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
