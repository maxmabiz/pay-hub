import type { Metadata } from "next";
import { PaymentsProvider } from "@/lib/payments-store";
import "./globals.css";

export const metadata: Metadata = {
  title: "付款中心",
  description:
    "付款中心：承接飞书审批付款申请，生成付款单，复核后经万里汇出款，并将回单回传飞书审批流。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="font-sans antialiased">
        <PaymentsProvider>{children}</PaymentsProvider>
      </body>
    </html>
  );
}
