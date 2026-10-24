import { paymentIdStaticParams } from "@/lib/payments-data";
import SubmitDetailClient from "./detail-client";

export function generateStaticParams() {
  return paymentIdStaticParams();
}

export default function SubmitDetailPage() {
  return <SubmitDetailClient />;
}
