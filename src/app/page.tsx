"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/** 静态导出不支持服务端 redirect，改为客户端跳转 */
export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/submit");
  }, [router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f5f6f8] text-sm text-slate-500">
      正在进入付款中心…
    </main>
  );
}
