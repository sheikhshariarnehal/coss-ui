import { db } from "./registry.js";
import type { SearchResult } from "../types.js";

export interface SearchOptions {
  query?: string;
  category?: string;
  type?: "all" | "component" | "example";
  limit?: number;
}

export function searchRegistry(options: SearchOptions = {}): SearchResult[] {
  const { query = "", category, type = "all", limit = 10 } = options;
  const normalizedQuery = query.trim().toLowerCase();
  const queryTokens = normalizedQuery
    ? normalizedQuery.split(/\s+/).filter(t => t.length > 1)
    : [];

  const results: SearchResult[] = [];

  // Search Core Components
  if (type === "all" || type === "component") {
    for (const comp of db.components) {
      if (category && comp.category.toLowerCase() !== category.toLowerCase()) {
        continue;
      }

      let score = 0;
      const reasons: string[] = [];

      if (!normalizedQuery) {
        // If no query, return components by default
        score = 10;
      } else {
        const slugLower = comp.slug.toLowerCase();
        const titleLower = comp.title.toLowerCase();
        const descLower = comp.description.toLowerCase();
        const tagsLower = comp.tags.map(t => t.toLowerCase());

        // Exact slug match
        if (slugLower === normalizedQuery) {
          score += 100;
          reasons.push("Exact slug match");
        } else if (slugLower.includes(normalizedQuery)) {
          score += 60;
          reasons.push("Slug contains query");
        }

        // Title match
        if (titleLower.includes(normalizedQuery)) {
          score += 50;
          reasons.push("Title match");
        }

        // Tag match
        for (const tag of tagsLower) {
          if (tag === normalizedQuery) {
            score += 45;
            reasons.push(`Tag matched: ${tag}`);
          } else if (tag.includes(normalizedQuery)) {
            score += 25;
            reasons.push(`Tag contains: ${tag}`);
          }
        }

        // Token match
        for (const token of queryTokens) {
          if (slugLower.includes(token)) score += 20;
          if (titleLower.includes(token)) score += 15;
          if (descLower.includes(token)) score += 10;
          if (tagsLower.some(t => t.includes(token))) score += 15;
        }

        // Description match
        if (descLower.includes(normalizedQuery)) {
          score += 20;
          reasons.push("Description match");
        }
      }

      if (score > 0) {
        results.push({
          type: "component",
          slug: comp.slug,
          title: comp.title,
          description: comp.description,
          category: comp.category,
          tags: comp.tags,
          score,
          matchReason: reasons.join(", ") || "Category match",
        });
      }
    }
  }

  // Search Particle Examples
  if (type === "all" || type === "example") {
    for (const ex of db.particleExamples) {
      const parentComp = db.components.find(c => c.slug === ex.componentSlug);
      if (category && parentComp && parentComp.category.toLowerCase() !== category.toLowerCase()) {
        continue;
      }

      let score = 0;
      const reasons: string[] = [];

      if (!normalizedQuery) {
        // Only return if specifically requested
        if (type === "example") score = 5;
      } else {
        const idLower = ex.id.toLowerCase();
        const titleLower = ex.title.toLowerCase();
        const tagsLower = ex.tags.map(t => t.toLowerCase());

        // Exact ID match
        if (idLower === normalizedQuery) {
          score += 100;
          reasons.push("Exact example ID match");
        } else if (idLower.includes(normalizedQuery)) {
          score += 50;
          reasons.push("ID contains query");
        }

        // Title match
        if (titleLower.includes(normalizedQuery)) {
          score += 40;
          reasons.push("Example title match");
        }

        // Tag match
        for (const tag of tagsLower) {
          if (tag === normalizedQuery) {
            score += 35;
            reasons.push(`Example tag matched: ${tag}`);
          } else if (tag.includes(normalizedQuery)) {
            score += 20;
            reasons.push(`Example tag contains: ${tag}`);
          }
        }

        // Token match
        for (const token of queryTokens) {
          if (idLower.includes(token)) score += 15;
          if (titleLower.includes(token)) score += 10;
          if (tagsLower.some(t => t.includes(token))) score += 10;
        }
      }

      if (score > 0) {
        results.push({
          type: "example",
          slug: ex.componentSlug,
          id: ex.id,
          title: ex.title,
          description: `Example variant for ${ex.componentSlug} (${ex.id})`,
          category: parentComp?.category || "Example",
          tags: ex.tags,
          score,
          matchReason: reasons.join(", ") || "Matched example",
        });
      }
    }
  }

  // Sort descending by score, take limit
  results.sort((a, b) => b.score - a.score);
  return results.slice(0, Math.min(limit, 50));
}
