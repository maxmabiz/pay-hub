import { paymentIdStaticParams } from "@/lib/payments-data";
import ReviewDetailClient from "./detail-client";

export function generateStaticParams() {
  return paymentIdStaticParams();
}

export default function ReviewDetailPage() {
  return <ReviewDetailClient />;
}
