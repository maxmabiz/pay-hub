"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  SAMPLE_HANDLE_HISTORY,
  type HandleOpinion,
} from "@/lib/payments-data";
import { cn } from "@/lib/utils";

export function HandleHistoryPanel({
  history,
  className,
}: {
  history?: HandleOpinion[];
  className?: string;
}) {
  const records =
    history && history.length > 0 ? history : SAMPLE_HANDLE_HISTORY;

  return (
    <Card className={cn(className)}>
      <CardHeader className="py-2.5">
        <CardTitle className="text-base">处理历史</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto rounded-md border border-slate-200">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-[#f5f6f8] text-xs text-ink-2">
                <th className="w-28 whitespace-nowrap border-b border-slate-200 px-3 py-2.5 font-medium">
                  环节
                </th>
                <th className="border-b border-slate-200 px-3 py-2.5 font-medium">
                  处理意见
                </th>
              </tr>
            </thead>
            <tbody>
              {records.length === 0 ? (
                <tr>
                  <td
                    colSpan={2}
                    className="px-3 py-6 text-center text-sm text-ink-4"
                  >
                    暂无处理历史
                  </td>
                </tr>
              ) : (
                records.map((item, idx) => (
                  <tr key={`${item.stage}-${item.at}-${idx}`}>
                    <td className="whitespace-nowrap border-b border-slate-100 px-3 py-2.5 text-ink-2">
                      {item.stage}
                    </td>
                    <td className="border-b border-slate-100 px-3 py-2.5 text-ink-1">
                      {item.content || "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
