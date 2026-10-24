import { paymentIdStaticParams } from "@/lib/payments-data";
import QueryDetailClient from "./detail-client";

export function generateStaticParams() {
  return paymentIdStaticParams();
}

export default function QueryDetailPage() {
  return <QueryDetailClient />;
}
