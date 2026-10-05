import { z } from "zod";
import { db } from "../db/registry.js";

export const listCategoriesSchema = {};

export function handleListCategories() {
  const lines: string[] = [
    "# Coss UI Categories",
    "",
    `Total Components: ${db.stats.totalComponents} | Total Particle Examples: ${db.stats.totalExamples}`,
    ""
  ];

  for (const cat of db.categories) {
    lines.push(`## ${cat.name} (${cat.componentCount} components, ${cat.exampleCount} particle examples)`);
    lines.push(`- **Components**: ${cat.components.map(c => `\`${c.slug}\` (${c.examplesCount} demos)`).join(", ")}`);
    lines.push("");
  }

  lines.push("To inspect components in any category, call `list_components({ category: \"<category_name>\" })` or `search_components({ category: \"<category_name>\" })`.");

  return {
    content: [
      {
        type: "text" as const,
        text: lines.join("\n")
      }
    ]
  };
}

export const listComponentsSchema = {
  category: z.string().optional().describe("Filter by category name (e.g. 'Forms & Inputs', 'Buttons & Actions', 'Overlays & Dialogs')")
};

export function handleListComponents(args: { category?: string }) {
  const selectedCategory = args.category?.trim().toLowerCase();

  const filteredComponents = selectedCategory
    ? db.components.filter(c => c.category.toLowerCase() === selectedCategory)
    : db.components;

  if (filteredComponents.length === 0) {
    return {
      content: [
        {
          type: "text" as const,
          text: `No components found for category "${args.category}". Call list_categories to see valid category names.`
        }
      ]
    };
  }

  const lines: string[] = [
    `# Coss UI Components (${filteredComponents.length})`,
    ""
  ];

  for (const comp of filteredComponents) {
    lines.push(`- **${comp.title}** (\`${comp.slug}\`) — ${comp.description}`);
    lines.push(`  - Category: *${comp.category}* | Examples: ${comp.examplesCount} | Inspect: \`get_component({ slug: "${comp.slug}" })\``);
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
