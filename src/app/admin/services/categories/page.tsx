import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Card } from "@/components/portal-ui/card";
import { Badge } from "@/components/portal-ui/badge";
import { prisma } from "@/lib/prisma";
import { CreateCategoryForm } from "@/components/admin/create-category-form";
import { CategoryRowActions } from "@/components/admin/category-row-actions";

export const metadata: Metadata = { title: "Service Categories | TechParivar Admin" };

export default async function AdminServiceCategoriesPage() {
  const categories = await prisma.serviceCategory.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    select: {
      id: true,
      key: true,
      name: true,
      description: true,
      kpiTemplateKey: true,
      sortOrder: true,
      isActive: true,
      _count: { select: { services: true } },
    },
  });

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <Link
          href="/admin/services"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary"
        >
          <ArrowLeft className="size-4" /> Back to Services
        </Link>
        <h1 className="mt-3 font-portal-display text-2xl font-bold md:text-3xl">
          Service Categories
        </h1>
        <p className="mt-1 text-sm text-on-surface-variant">
          The stable grouping every service belongs to. Add a new category here any
          time — no code change or deployment is required.
        </p>
      </div>

      <Card className="p-6">
        <CreateCategoryForm />
      </Card>

      <Card className="gap-0 overflow-hidden p-0">
        {categories.length === 0 ? (
          <p className="py-16 text-center text-sm text-on-surface-variant">
            No categories yet. Create one above.
          </p>
        ) : (
          <div className="divide-y divide-border/60">
            {categories.map((category) => (
              <div
                key={category.id}
                className="flex items-center justify-between gap-4 p-4"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="truncate font-medium">{category.name}</p>
                    <Badge variant={category.isActive ? "success" : "secondary"}>
                      {category.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <p className="font-portal-data text-xs text-on-surface-variant">
                    {category.key} • {category._count.services} service
                    {category._count.services === 1 ? "" : "s"}
                  </p>
                </div>
                <CategoryRowActions
                  categoryId={category.id}
                  categoryName={category.name}
                  description={category.description}
                  kpiTemplateKey={category.kpiTemplateKey}
                  sortOrder={category.sortOrder}
                  isActive={category.isActive}
                  serviceCount={category._count.services}
                />
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
