"use client";

import { FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NewPostPage() {
  const router = useRouter();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    alert("저장되었습니다");
    router.push("/posts");
  };

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">새 글 작성</h1>

      <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-gray-200 p-5">
        <div className="space-y-2">
          <label htmlFor="title" className="text-sm font-medium text-gray-700">
            제목
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 outline-none ring-0 transition focus:border-gray-500"
            placeholder="제목을 입력하세요"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="content" className="text-sm font-medium text-gray-700">
            내용
          </label>
          <textarea
            id="content"
            name="content"
            required
            rows={8}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 outline-none ring-0 transition focus:border-gray-500"
            placeholder="내용을 입력하세요"
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-700"
          >
            저장
          </button>
          <Link
            href="/posts"
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            취소
          </Link>
        </div>
      </form>
    </section>
  );
}
