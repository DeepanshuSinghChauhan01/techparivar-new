import type { Metadata } from "next";
import { FileImage, FileText, FileCode, FileSpreadsheet, Search, Upload } from "lucide-react";

import { Card } from "@/components/portal-ui/card";
import { Button } from "@/components/portal-ui/button";
import { Input } from "@/components/portal-ui/input";
import { fileLibrary, type FileItem } from "@/data/portal";

export const metadata: Metadata = {
  title: "Files | TechParivar Client Portal",
};

const iconMap: Record<FileItem["type"], typeof FileImage> = {
  figma: FileImage,
  image: FileImage,
  pdf: FileText,
  code: FileCode,
  sheet: FileSpreadsheet,
};

export default function FilesPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-portal-display text-2xl font-bold md:text-3xl">Files</h1>
          <p className="mt-1 text-sm text-on-surface-variant">
            Every asset, document, and export shared across your projects.
          </p>
        </div>
        <Button>
          <Upload className="size-4" /> Upload File
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-on-surface-variant" />
        <Input placeholder="Search files..." className="pl-10" />
      </div>

      <Card className="gap-0 p-0">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-border/60 text-xs text-on-surface-variant">
              <th className="px-6 py-3 font-medium">Name</th>
              <th className="px-6 py-3 font-medium">Project</th>
              <th className="px-6 py-3 font-medium">Size</th>
              <th className="px-6 py-3 font-medium">Updated</th>
            </tr>
          </thead>
          <tbody>
            {fileLibrary.map((file) => {
              const Icon = iconMap[file.type];
              return (
                <tr key={file.id} className="border-b border-border/40 last:border-0 hover:bg-white/5">
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-3">
                      <span className="flex size-9 items-center justify-center rounded-lg bg-surface-container-high text-primary">
                        <Icon className="size-4" />
                      </span>
                      <span className="font-medium">{file.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3.5 text-on-surface-variant">{file.project}</td>
                  <td className="px-6 py-3.5 text-on-surface-variant">{file.size}</td>
                  <td className="px-6 py-3.5 text-on-surface-variant">{file.updated}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
