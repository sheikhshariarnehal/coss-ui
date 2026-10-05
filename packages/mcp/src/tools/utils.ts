import { z } from "zod";
import { db, utilitiesMap } from "../db/registry.js";

export const getUtilsSchema = {
  name: z.string().optional().describe("Specific utility or hook name (e.g. 'utils', 'cn', 'use-character-limit', 'use-file-upload', 'use-pagination', 'use-slider-with-input', 'use-toast'). If omitted, lists all available utilities.")
};

export function handleGetUtils(args: { name?: string }) {
  if (args.name) {
    const key = args.name.trim().toLowerCase() === "cn" ? "utils" : args.name.trim().toLowerCase();
    const util = utilitiesMap.get(key);

    if (!util) {
      return {
        content: [
          {
            type: "text" as const,
            text: `Utility "${args.name}" not found. Available utilities:\n${db.utilities.map(u => `- \`${u.name}\` (${u.path})`).join("\n")}`
          }
        ]
      };
    }

    const lines: string[] = [
      `# Utility: ${util.name} (\`${util.path}\`)`,
      `**Description:** ${util.description}`,
      ""
    ];

    if (util.npmInstallCmd) {
      lines.push("## Installation");
      lines.push("```bash");
      lines.push(util.npmInstallCmd);
      lines.push("```");
      lines.push("");
    }

    lines.push("## Source Code");
    lines.push("```tsx");
    lines.push(util.code);
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

  // List all utilities
  const lines: string[] = [
    "# Coss UI Utilities & Hooks",
    "",
    "Call `get_utils({ name: \"<name>\" })` to inspect the code for any item below:",
    ""
  ];

  for (const u of db.utilities) {
    lines.push(`- **\`${u.name}\`** (\`${u.path}\`) — ${u.description}`);
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
