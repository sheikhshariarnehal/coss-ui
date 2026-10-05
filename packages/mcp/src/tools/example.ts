import { z } from "zod";
import { examplesMap, componentsMap } from "../db/registry.js";

export const getExampleSchema = {
  id: z.string().describe("The particle example ID (e.g. 'comp-01', 'origin-comp-334', 'p-accordion-1')")
};

export function handleGetExample(args: { id: string }) {
  const id = args.id.trim().toLowerCase();
  const example = examplesMap.get(id);

  if (!example) {
    return {
      content: [
        {
          type: "text" as const,
          text: `Particle example "${args.id}" was not found. Use search_components({ type: "example" }) or inspect a component's exampleIds with get_component.`
        }
      ]
    };
  }

  const parentComp = componentsMap.get(example.componentSlug.toLowerCase());

  const lines: string[] = [
    `# Particle Example: ${example.title} (\`${example.id}\`)`,
    `**Component:** \`${example.componentSlug}\`${parentComp ? ` (${parentComp.title})` : ""}`,
    `**Filename:** \`${example.filename}\``,
    ""
  ];

  if (example.tags && example.tags.length > 0) {
    lines.push(`**Tags:** ${example.tags.map(t => `\`${t}\``).join(", ")}`);
    lines.push("");
  }

  if (example.dependencies && example.dependencies.length > 0) {
    lines.push("**Dependencies:**");
    lines.push("```bash");
    lines.push(`npm install ${example.dependencies.join(" ")}`);
    lines.push("```");
    lines.push("");
  }

  if (example.registryDependencies && example.registryDependencies.length > 0) {
    lines.push(`**Registry Dependencies:** ${example.registryDependencies.join(", ")}`);
    lines.push("");
  }

  lines.push("## Source Code");
  lines.push("```tsx");
  lines.push(example.code);
  lines.push("```");

  return {
    content: [
      {
        type: "text" as const,
        text: lines.join("\n")
      }
    ]
  };
}
