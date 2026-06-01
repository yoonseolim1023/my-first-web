ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "posts_select_public" ON public.posts;
DROP POLICY IF EXISTS "posts_insert_own" ON public.posts;
DROP POLICY IF EXISTS "posts_update_own" ON public.posts;
DROP POLICY IF EXISTS "posts_delete_own" ON public.posts;

CREATE POLICY "posts_select_public"
ON public.posts
FOR SELECT
USING (true);

CREATE POLICY "posts_insert_own"
ON public.posts
FOR INSERT
WITH CHECK (user_id = auth.uid());

CREATE POLICY "posts_update_own"
ON public.posts
FOR UPDATE
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "posts_delete_own"
ON public.posts
FOR DELETE
USING (user_id = auth.uid());
