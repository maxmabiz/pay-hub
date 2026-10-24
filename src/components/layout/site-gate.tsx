"use client";

import { FormEvent, useEffect, useState, type ReactNode } from "react";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "payhub.gate";

/** 更换密码后，用新密码的 SHA-256 替换此值。明文不要写进仓库。 */
const PASSWORD_SHA256 =
  "8f27ff0b36130c4735b44e17c90a835ff754f6c462cfb446f5a9332bd10379d7";

async function sha256(value: string) {
  const data = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export function SiteGate({ children }: { children: ReactNode }) {
  const [unlocked, setUnlocked] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY) === PASSWORD_SHA256) {
      setUnlocked(true);
    }
  }, []);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");
    try {
      const hash = await sha256(password);
      if (hash !== PASSWORD_SHA256) {
        setError("密码不正确");
        return;
      }
      localStorage.setItem(STORAGE_KEY, hash);
      setUnlocked(true);
    } finally {
      setPending(false);
    }
  }

  if (!unlocked) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f5f6f8] px-4">
        <form
          onSubmit={onSubmit}
          className="w-full max-w-[380px] rounded-lg border border-slate-200 bg-white px-6 py-7 shadow-panel"
        >
          <div className="mb-5 flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-brand-500 text-white">
              <Lock className="h-4 w-4" aria-hidden="true" />
            </span>
            <div>
              <div className="text-[15px] font-semibold leading-tight">付款中心</div>
              <div className="text-[12px] text-ink-4">请输入访问密码</div>
            </div>
          </div>
          <label className="mb-1.5 block text-[13px] text-ink-2" htmlFor="site-password">
            访问密码
          </label>
          <input
            id="site-password"
            type="password"
            autoFocus
            autoComplete="current-password"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
              if (error) setError("");
            }}
            className="h-9 w-full rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
            placeholder="请输入访问密码"
          />
          {error ? <p className="mt-2 text-[12px] text-rose-500">{error}</p> : null}
          <Button type="submit" className="mt-4 h-9 w-full" disabled={pending || !password}>
            进入
          </Button>
        </form>
      </main>
    );
  }

  return children;
}
