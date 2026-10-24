"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  ClipboardCheck,
  FileInput,
  Fullscreen,
  Moon,
  GitCompare,
  Search,
  Settings,
  UserRound,
  Wallet,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const MENUS = [
  {
    href: "/submit",
    label: "初审付款单",
    icon: FileInput,
    match: (p: string) => p === "/" || p.startsWith("/submit"),
  },
  {
    href: "/review",
    label: "复核付款单",
    icon: ClipboardCheck,
    match: (p: string) => p.startsWith("/review"),
  },
  {
    href: "/query",
    label: "查询付款单",
    icon: Search,
    match: (p: string) => p.startsWith("/query"),
  },
  {
    href: "/compare",
    label: "查询比对结果",
    icon: GitCompare,
    match: (p: string) => p.startsWith("/compare"),
  },
];

function currentMenu(pathname: string) {
  return MENUS.find((m) => m.match(pathname)) ?? MENUS[0];
}

function breadcrumb(pathname: string) {
  const menu = currentMenu(pathname);
  const isDetail = /\/(submit|review|query)\/[^/]+/.test(pathname);
  return ["付款中心", menu.label, ...(isDetail ? ["明细"] : [])];
}

export function AppShell({
  title,
  description,
  children,
  actions,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}) {
  const pathname = usePathname();
  const menu = currentMenu(pathname);
  const crumbs = breadcrumb(pathname);
  const MenuIcon = menu.icon;
  const isDetail = /\/(submit|review|query)\/[^/]+/.test(pathname);
  const tabLabel = isDetail ? `${menu.label}明细` : menu.label;

  return (
    <div className="flex min-h-screen bg-[#f5f6f8] text-ink-1">
      {/* Independent app sidebar */}
      <aside className="flex w-[200px] shrink-0 flex-col border-r border-slate-200 bg-white sm:w-[220px]">
        <div className="flex h-12 items-center gap-2 border-b border-slate-100 px-4">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-brand-500 text-white">
            <Wallet className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <div className="truncate text-[15px] font-semibold leading-tight">
              付款中心
            </div>
            <div className="truncate text-[11px] text-ink-4">Payment Center</div>
          </div>
        </div>
        <nav className="flex-1 space-y-0.5 px-2 py-3">
          {MENUS.map((item) => {
            const Icon = item.icon;
            const isActive = item.match(pathname);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 rounded-md px-3 py-2 text-[13px] transition-colors",
                  isActive
                    ? "bg-[#e8f1ff] font-medium text-brand-600"
                    : "text-ink-2 hover:bg-slate-50"
                )}
              >
                <Icon
                  className={cn(
                    "h-4 w-4 shrink-0",
                    isActive ? "text-brand-600" : "text-ink-3"
                  )}
                  aria-hidden
                />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-12 shrink-0 items-center gap-3 border-b border-slate-200 bg-white px-4">
          <div className="min-w-0 flex-1 truncate text-xs text-ink-3 sm:text-[13px]">
            {crumbs.map((c, i) => (
              <span key={`${c}-${i}`}>
                {i > 0 ? <span className="mx-1.5 text-ink-4">&gt;</span> : null}
                <span className={i === crumbs.length - 1 ? "text-ink-1" : ""}>
                  {c}
                </span>
              </span>
            ))}
          </div>
          <div className="hidden items-center gap-2 rounded-md border border-slate-200 bg-[#f5f6f8] px-2.5 py-1.5 text-xs text-ink-4 md:flex">
            <Search className="h-3.5 w-3.5" />
            <span>搜索</span>
            <kbd className="rounded border border-slate-200 bg-white px-1 text-[10px]">
              ⌘K
            </kbd>
          </div>
          <div className="flex items-center gap-0.5 text-ink-3">
            <IconBtn>
              <Settings className="h-4 w-4" />
            </IconBtn>
            <IconBtn>
              <Moon className="h-4 w-4" />
            </IconBtn>
            <IconBtn>
              <Fullscreen className="h-4 w-4" />
            </IconBtn>
            <IconBtn>
              <Bell className="h-4 w-4" />
            </IconBtn>
            <div className="ml-1 flex h-7 w-7 items-center justify-center rounded-full bg-brand-50 text-brand-600">
              <UserRound className="h-3.5 w-3.5" />
            </div>
          </div>
        </header>

        <div className="flex h-10 shrink-0 items-end gap-1 border-b border-slate-200 bg-[#eef0f3] px-3">
          <div className="flex h-8 items-center gap-1.5 rounded-t-md bg-brand-500 px-3 text-xs font-medium text-white shadow-sm">
            <MenuIcon className="h-3.5 w-3.5" />
            <span>{tabLabel}</span>
            <button
              type="button"
              className="ml-1 rounded p-0.5 hover:bg-white/20"
              aria-label="关闭"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        </div>

        <main className="min-h-0 flex-1 overflow-auto p-3 sm:p-4">
          {(description || actions) && (
            <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              {description ? (
                <p className="text-xs text-ink-3">{description}</p>
              ) : (
                <span />
              )}
              {actions ? (
                <div className="flex flex-wrap gap-2">{actions}</div>
              ) : null}
            </div>
          )}
          <h1 className="sr-only">{title}</h1>
          {children}
        </main>
      </div>
    </div>
  );
}

function IconBtn({ children }: { children: React.ReactNode }) {
  return (
    <button
      type="button"
      className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-slate-100"
    >
      {children}
    </button>
  );
}
