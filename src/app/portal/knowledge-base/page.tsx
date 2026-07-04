"use client";

import { useMemo, useState } from "react";
import { BookOpen, Search } from "lucide-react";

import { Card } from "@/components/portal-ui/card";
import { Input } from "@/components/portal-ui/input";
import { cn } from "@/lib/utils";
import { knowledgeArticles, knowledgeCategories } from "@/data/portal";

export default function KnowledgeBasePage() {
  const [category, setCategory] = useState<(typeof knowledgeCategories)[number]>("All");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return knowledgeArticles.filter((article) => {
      const matchesCategory = category === "All" || article.category === category;
      const matchesQuery = article.title.toLowerCase().includes(query.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [category, query]);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="font-portal-display text-2xl font-bold md:text-3xl">Knowledge Base</h1>
        <p className="mt-1 text-sm text-on-surface-variant">
          Guides and answers for working with your TechParivar engineering team.
        </p>
      </div>

      <div className="relative max-w-sm">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-on-surface-variant" />
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search articles..."
          className="pl-10"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {knowledgeCategories.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setCategory(item)}
            className={cn(
              "rounded-full border px-4 py-2 text-xs font-semibold transition-colors",
              item === category
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border text-on-surface-variant hover:text-foreground"
            )}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {filtered.map((article) => (
          <Card key={article.id} className="gap-3 p-5">
            <span className="flex size-9 items-center justify-center rounded-lg bg-surface-container-high text-primary">
              <BookOpen className="size-4" />
            </span>
            <div>
              <p className="font-portal-data text-[10px] uppercase tracking-wider text-on-surface-variant">
                {article.category}
              </p>
              <p className="mt-1 font-semibold leading-snug">{article.title}</p>
              <p className="mt-1.5 text-sm text-on-surface-variant">{article.summary}</p>
            </div>
            <div className="flex items-center justify-between border-t border-border/60 pt-3 text-xs text-on-surface-variant">
              <span>{article.readTime}</span>
              <span>{article.updated}</span>
            </div>
          </Card>
        ))}
        {filtered.length === 0 && (
          <p className="text-sm text-on-surface-variant">No articles match your search.</p>
        )}
      </div>
    </div>
  );
}
