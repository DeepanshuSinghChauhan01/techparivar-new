import { prisma } from "@/lib/prisma";

const MAX_ATTEMPTS = 10;

function randomSegment(): string {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

/**
 * Server-generated only — never derived from user input (avoids slug
 * collisions/unicode edge cases) and never accepted from the client.
 * Format: PRJ-<year>-<4 digits>, retried on the rare unique clash.
 */
export async function generateProjectCode(): Promise<string> {
  const year = new Date().getFullYear();
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const code = `PRJ-${year}-${randomSegment()}`;
    const existing = await prisma.project.findUnique({
      where: { projectCode: code },
      select: { id: true },
    });
    if (!existing) return code;
  }
  throw new Error("Failed to generate a unique project code. Please try again.");
}
