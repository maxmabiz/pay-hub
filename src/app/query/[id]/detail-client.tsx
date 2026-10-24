"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import {
  PaymentDetailPanel,
  detailTitle,
} from "@/components/payments/payment-detail-panel";

export default function QueryDetailClient() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  return (
    <AppShell
      title={detailTitle("query", "view")}
      actions={
        <Link href="/query">
          <Button variant="secondary">返回列表</Button>
        </Link>
      }
    >
      <PaymentDetailPanel
        orderId={params.id}
        scene="query"
        mode="view"
        onClose={() => router.push("/query")}
      />
    </AppShell>
  );
}
