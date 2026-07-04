import type { Metadata } from "next";
import { Download } from "lucide-react";

import { Card } from "@/components/portal-ui/card";
import { Badge } from "@/components/portal-ui/badge";
import { Button } from "@/components/portal-ui/button";
import { invoices, type Invoice } from "@/data/portal";

export const metadata: Metadata = {
  title: "Invoices | TechParivar Client Portal",
};

const statusVariant: Record<Invoice["status"], "success" | "warning" | "destructive"> = {
  Paid: "success",
  Pending: "warning",
  Overdue: "destructive",
};

export default function InvoicesPage() {
  const totalPending = invoices
    .filter((invoice) => invoice.status !== "Paid")
    .reduce((sum, invoice) => sum + Number(invoice.amount.replace(/[^0-9.]/g, "")), 0);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="font-portal-display text-2xl font-bold md:text-3xl">Invoices</h1>
        <p className="mt-1 text-sm text-on-surface-variant">
          Billing history for every project and retainer engagement.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="gap-1 p-5">
          <p className="font-portal-data text-[10px] uppercase tracking-wider text-on-surface-variant">
            Outstanding Balance
          </p>
          <p className="font-portal-display text-2xl font-bold text-primary">
            ${totalPending.toLocaleString()}
          </p>
        </Card>
        <Card className="gap-1 p-5">
          <p className="font-portal-data text-[10px] uppercase tracking-wider text-on-surface-variant">
            Invoices Issued
          </p>
          <p className="font-portal-display text-2xl font-bold">{invoices.length}</p>
        </Card>
        <Card className="gap-1 p-5">
          <p className="font-portal-data text-[10px] uppercase tracking-wider text-on-surface-variant">
            Paid on Time
          </p>
          <p className="font-portal-display text-2xl font-bold text-mint-green">100%</p>
        </Card>
      </div>

      <Card className="gap-0 p-0">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-border/60 text-xs text-on-surface-variant">
              <th className="px-6 py-3 font-medium">Invoice</th>
              <th className="px-6 py-3 font-medium">Project</th>
              <th className="px-6 py-3 font-medium">Amount</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium">Due</th>
              <th className="px-6 py-3 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice) => (
              <tr key={invoice.id} className="border-b border-border/40 last:border-0 hover:bg-white/5">
                <td className="px-6 py-3.5 font-medium">{invoice.number}</td>
                <td className="px-6 py-3.5 text-on-surface-variant">{invoice.project}</td>
                <td className="px-6 py-3.5 font-semibold">{invoice.amount}</td>
                <td className="px-6 py-3.5">
                  <Badge variant={statusVariant[invoice.status]}>{invoice.status}</Badge>
                </td>
                <td className="px-6 py-3.5 text-on-surface-variant">{invoice.due}</td>
                <td className="px-6 py-3.5 text-right">
                  <Button variant="ghost" size="sm">
                    <Download className="size-3.5" /> PDF
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
