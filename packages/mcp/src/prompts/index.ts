export const PROMPTS = [
  {
    name: "coss-component-picker",
    description: "Analyze a design mockup or UI requirement and recommend the best Coss UI components, particle examples, and dependencies",
    arguments: [
      {
        name: "ui_requirement",
        description: "Description of the UI feature or screen you want to build (e.g. 'A login dialog with OTP verification and social buttons')",
        required: true
      }
    ]
  },
  {
    name: "coss-build-page",
    description: "Guide an AI agent to architect and construct a complete page using Coss UI components and styling",
    arguments: [
      {
        name: "page_type",
        description: "Type of page to construct (e.g. 'Landing Page', 'User Dashboard', 'Authentication Modal', 'Settings Form')",
        required: true
      },
      {
        name: "design_style",
        description: "Desired visual aesthetic (e.g. 'modern dark', 'skeuomorphic glossy', 'minimal clean', 'colorful gradient')",
        required: false
      }
    ]
  }
];

export function handleGetPrompt(name: string, args: Record<string, string> = {}) {
  if (name === "coss-component-picker") {
    const requirement = args.ui_requirement || "a modern UI interface";
    return {
      description: "Pick Coss UI components for your requirement",
      messages: [
        {
          role: "user" as const,
          content: {
            type: "text" as const,
            text: `I need to build the following UI: "${requirement}".

Please follow these steps:
1. Use the \`search_components\` tool to find relevant Coss UI components and particle examples matching these needs.
2. For each identified component, call \`get_component\` to inspect its props, dependencies, and TSX implementation.
3. If specific layout variations are needed, check \`get_example\` with the example IDs.
4. Recommend the best combination of components, along with the \`npm install\` commands and necessary \`@/lib/utils\` helpers to build it cleanly.`
          }
        }
      ]
    };
  }

  if (name === "coss-build-page") {
    const pageType = args.page_type || "Application Page";
    const style = args.design_style || "modern dark";
    return {
      description: `Build a ${pageType} with ${style} design using Coss UI`,
      messages: [
        {
          role: "user" as const,
          content: {
            type: "text" as const,
            text: `You are an expert frontend engineer building a high-end "${pageType}" using Coss UI components with a "${style}" aesthetic.

Please follow these steps:
1. Call \`list_categories\` and \`search_components\` to discover Coss UI primitives and particle demos needed for this page.
2. Call \`get_component\` for each required component (e.g. Buttons, Inputs, Dialogs, Cards, Tables, Navbars).
3. If custom utilities or hooks are required (like \`cn\` or custom hooks), call \`get_utils\`.
4. Compose the complete, production-ready TSX page layout incorporating these components with responsive design, accessibility, and high visual polish.`
          }
        }
      ]
    };
  }

  throw new Error(`Prompt not found: ${name}`);
}
