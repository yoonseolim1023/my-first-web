"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

export default function AuthNav() {
  const router = useRouter();
  const { user, loading, signOut } = useAuth();

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (!error) {
      router.push("/");
    }
  };

  if (user) {
    return (
      <ul className="flex items-center gap-5 text-sm font-medium">
        <li>
          <Link href="/" className="transition hover:text-gray-200">
            홈
          </Link>
        </li>
        <li>
          <Link href="/posts" className="transition hover:text-gray-200">
            블로그
          </Link>
        </li>
        <li>
          <Link href="/posts/new" className="transition hover:text-gray-200">
            새 글 쓰기
          </Link>
        </li>
        <li>
          <Button
            type="button"
            variant="secondary"
            onClick={handleSignOut}
            disabled={loading}
            className="h-9"
          >
            {loading ? "로딩 중..." : "로그아웃"}
          </Button>
        </li>
      </ul>
    );
  }

  return (
    <ul className="flex items-center gap-5 text-sm font-medium">
      <li>
        <Link href="/" className="transition hover:text-gray-200">
          홈
        </Link>
      </li>
      <li>
        <Link href="/posts" className="transition hover:text-gray-200">
          블로그
        </Link>
      </li>
      <li>
        <Link href="/login" className="transition hover:text-gray-200">
          로그인
        </Link>
      </li>
      <li>
        <Link href="/signup" className="transition hover:text-gray-200">
          회원가입
        </Link>
      </li>
      <li>
        <Link
          href="/posts/new"
          className="transition hover:text-gray-200"
          aria-disabled={loading}
        >
          새 글 쓰기
        </Link>
      </li>
    </ul>
  );
}
