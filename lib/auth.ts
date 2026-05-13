import { createClient } from "@/lib/supabase/client";

type AuthResult<T> = {
  data: T | null;
  error: Error | null;
};

export const signInWithEmail = async (
  email: string,
  password: string
): Promise<AuthResult<{ userId: string | null }>> => {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { data: null, error };
  }

  return { data: { userId: data.user?.id ?? null }, error: null };
};

export const signUpWithEmail = async (
  email: string,
  password: string,
  name: string
): Promise<AuthResult<{ userId: string | null }>> => {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name },
    },
  });

  if (error) {
    return { data: null, error };
  }

  return { data: { userId: data.user?.id ?? null }, error: null };
};

export const signOut = async (): Promise<AuthResult<null>> => {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    return { data: null, error };
  }

  return { data: null, error: null };
};
