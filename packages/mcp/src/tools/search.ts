import { z } from "zod";
import { searchRegistry } from "../db/search.js";

export const searchComponentsSchema = {
  query: z.string().optional().describe("Search term or design keyword (e.g. 'skeuomorphic', 'button', 'login modal', 'date picker', 'rainbow', 'avatar group', 'confetti')"),
  category: z.string().optional().describe("Filter by component category (e.g. 'Forms & Inputs', 'Buttons & Actions', 'Overlays & Dialogs', 'Navigation', 'Data Display', 'Feedback & Status')"),
  type: z.enum(["all", "component", "example"]).optional().default("all").describe("Filter by item type: 'all' (both), 'component' (core UI primitives), or 'example' (particle design variants)"),
  limit: z.number().optional().default(10).describe("Maximum number of results to return (default 10, max 50)")
};

export function handleSearchComponents(args: {
  query?: string;
  category?: string;
  type?: "all" | "component" | "example";
  limit?: number;
}) {
  const results = searchRegistry(args);

  if (results.length === 0) {
    return {
      content: [
        {
          type: "text" as const,
          text: `No components or examples found matching "${args.query || ""}"${args.category ? ` in category "${args.category}"` : ""}. Try broader search keywords or list all categories using list_categories.`
        }
      ]
    };
  }

  const lines: string[] = [
    `Found ${results.length} Coss UI component(s) / example(s):`,
    ""
  ];

  for (const r of results) {
    if (r.type === "component") {
      lines.push(`### [Component] ${r.title} (\`${r.slug}\`)`);
      lines.push(`- **Category**: ${r.category}`);
      lines.push(`- **Description**: ${r.description}`);
      if (r.tags && r.tags.length > 0) {
        lines.push(`- **Tags**: ${r.tags.map(t => `\`${t}\``).join(", ")}`);
      }
      lines.push(`- **To view source & install**: Call \`get_component({ slug: "${r.slug}" })\``);
      lines.push("");
    } else {
      lines.push(`### [Example] ${r.title} (\`${r.id}\`)`);
      lines.push(`- **Parent Component**: \`${r.slug}\` | **Category**: ${r.category}`);
      if (r.tags && r.tags.length > 0) {
        lines.push(`- **Tags**: ${r.tags.map(t => `\`${t}\``).join(", ")}`);
      }
      lines.push(`- **To view example code**: Call \`get_example({ id: "${r.id}" })\``);
      lines.push("");
    }
  }

  return {
    content: [
      {
        type: "text" as const,
        text: lines.join("\n")
      }
    ]
  };
}
