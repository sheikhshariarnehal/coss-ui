import { z } from "zod";
import { componentsMap } from "../db/registry.js";

export const getComponentSchema = {
  slug: z.string().describe("The unique slug of the component (e.g. 'skeuomorphic-button', 'button', 'dialog', 'calendar', 'slider')")
};

export function handleGetComponent(args: { slug: string }) {
  const slug = args.slug.trim().toLowerCase();
  const comp = componentsMap.get(slug);

  if (!comp) {
    return {
      content: [
        {
          type: "text" as const,
          text: `Component "${args.slug}" was not found. Use search_components or list_components to find valid component slugs.`
        }
      ]
    };
  }

  const sections: string[] = [
    `# Component: ${comp.title} (\`${comp.slug}\`)`,
    `**Category:** ${comp.category}`,
    `**Description:** ${comp.description}`,
    "",
    "---",
    "## 1. Dependencies & Installation",
    ""
  ];

  if (comp.dependencies.length > 0) {
    sections.push("Run this command in your project root to install external dependencies:");
    sections.push("```bash");
    sections.push(`npm install ${comp.dependencies.join(" ")}`);
    sections.push("```");
    sections.push("");
  } else {
    sections.push("No additional external npm packages required.");
    sections.push("");
  }

  sections.push("## 2. Shared Utilities & Hooks Required");
  sections.push("");
  if (comp.needsUtils) {
    sections.push("- **Utility:** Requires `cn()` helper in `@/lib/utils.ts` (call `get_utils({ name: \"utils\" })` if needed).");
  }
  if (comp.hooksNeeded && comp.hooksNeeded.length > 0) {
    sections.push(`- **Hooks:** Requires custom hooks: ${comp.hooksNeeded.map(h => `\`${h}\``).join(", ")} (call \`get_utils({ name: "<hook_name>" })\`).`);
  }
  if (!comp.needsUtils && (!comp.hooksNeeded || comp.hooksNeeded.length === 0)) {
    sections.push("Standard React & Tailwind setup only.");
  }
  sections.push("");

  // Styling & CSS specifics
  if (comp.slug === "skeuomorphic-button" || comp.code.includes("animate-rainbow")) {
    sections.push("## 3. Tailwind CSS & Animations");
    sections.push("");
    sections.push("For the rainbow variant in `@keyframes rainbow`: ensure your Tailwind config includes:");
    sections.push("```css");
    sections.push("@keyframes rainbow {");
    sections.push("  0% { background-position: 0% 50%; }");
    sections.push("  50% { background-position: 100% 50%; }");
    sections.push("  100% { background-position: 0% 50%; }");
    sections.push("}");
    sections.push(".animate-rainbow {");
    sections.push("  background-size: 200% 200%;");
    sections.push("  animation: rainbow 3s linear infinite;");
    sections.push("}");
    sections.push("```");
    sections.push("");
  }

  // TSX Source Code
  sections.push("## 4. Source Code (`components/ui/" + comp.slug + ".tsx`)");
  sections.push("");
  if (comp.code) {
    sections.push("```tsx");
    sections.push(comp.code);
    sections.push("```");
    sections.push("");
  } else {
    sections.push("*(Source code packaged in particle examples)*");
    sections.push("");
  }

  // Available particle examples
  if (comp.exampleIds && comp.exampleIds.length > 0) {
    sections.push(`## 5. Particle Examples (${comp.exampleIds.length} variations)`);
    sections.push("Explore variations of this component by calling `get_example({ id: \"<id>\" })`:");
    sections.push(comp.exampleIds.slice(0, 15).map(id => `- \`${id}\``).join("\n"));
    if (comp.exampleIds.length > 15) {
      sections.push(`- ... and ${comp.exampleIds.length - 15} more examples`);
    }
    sections.push("");
  }

  return {
    content: [
      {
        type: "text" as const,
        text: sections.join("\n")
      }
    ]
  };
}
