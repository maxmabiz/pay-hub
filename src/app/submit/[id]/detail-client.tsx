"use client";

import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  PaymentDetailPanel,
  detailTitle,
} from "@/components/payments/payment-detail-panel";

function SubmitDetailInner() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const mode = searchParams.get("mode") === "edit" ? "edit" : "view";

  return (
    <AppShell
      title={detailTitle("submit", mode)}
      actions={
        <Link href="/submit">
          <Button variant="secondary">返回列表</Button>
        </Link>
      }
    >
      <PaymentDetailPanel
        orderId={params.id}
        scene="submit"
        mode={mode}
        onClose={() => router.push("/submit")}
      />
    </AppShell>
  );
}

export default function SubmitDetailClient() {
  return (
    <Suspense
      fallback={
        <AppShell title="付款单详情">
          <Card>
            <CardContent className="py-16 text-center text-ink-4">
              加载中…
            </CardContent>
          </Card>
        </AppShell>
      }
    >
      <SubmitDetailInner />
    </Suspense>
  );
}
