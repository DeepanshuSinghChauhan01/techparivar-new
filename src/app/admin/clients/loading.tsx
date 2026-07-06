import { Card } from "@/components/portal-ui/card";

export default function ClientsLoading() {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="h-16 animate-pulse rounded-xl bg-surface-container-high" />
      <div className="h-24 animate-pulse rounded-xl bg-surface-container-high" />
      <Card className="h-96 animate-pulse gap-0 p-0" />
    </div>
  );
}
