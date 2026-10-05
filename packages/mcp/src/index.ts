import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ListResourceTemplatesRequestSchema,
  ReadResourceRequestSchema,
  ListPromptsRequestSchema,
  GetPromptRequestSchema,
  ErrorCode,
  McpError
} from "@modelcontextprotocol/sdk/types.js";

import { handleSearchComponents } from "./tools/search.js";
import { handleListCategories, handleListComponents } from "./tools/list.js";
import { handleGetComponent } from "./tools/get.js";
import { handleGetExample } from "./tools/example.js";
import { handleGetUtils } from "./tools/utils.js";
import { STATIC_RESOURCES, RESOURCE_TEMPLATES, handleReadResource } from "./resources/index.js";
import { PROMPTS, handleGetPrompt } from "./prompts/index.js";
import { db } from "./db/registry.js";

// Initialize MCP Server
const server = new Server(
  {
    name: "coss-ui-mcp",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
      resources: {},
      prompts: {},
    },
  }
);

// 1. Register Tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "search_components",
        description: "Search across 70 Coss UI components and 1,150+ particle examples by keyword, category, or design style tags (e.g. 'skeuomorphic', 'rainbow', 'date picker', 'otp', 'avatar group', 'glassmorphism').",
        inputSchema: {
          type: "object",
          properties: {
            query: {
              type: "string",
              description: "Search keywords, intent, or design tags (e.g. 'button', 'skeuomorphic', 'calendar', 'login modal')"
            },
            category: {
              type: "string",
              description: "Filter by category: 'Forms & Inputs', 'Buttons & Actions', 'Overlays & Dialogs', 'Navigation', 'Data Display', 'Feedback & Status'"
            },
            type: {
              type: "string",
              enum: ["all", "component", "example"],
              default: "all",
              description: "Filter by item type ('all', 'component', or 'example')"
            },
            limit: {
              type: "number",
              default: 10,
              description: "Maximum number of items to return (default 10, max 50)"
            }
          }
        }
      },
      {
        name: "list_categories",
        description: "List all component categories in the Coss UI library along with component counts, particle example counts, and member component slugs.",
        inputSchema: {
          type: "object",
          properties: {}
        }
      },
      {
        name: "list_components",
        description: "List all 70 components in the Coss UI library, optionally filtered by a specific category.",
        inputSchema: {
          type: "object",
          properties: {
            category: {
              type: "string",
              description: "Category name to filter by (optional)"
            }
          }
        }
      },
      {
        name: "get_component",
        description: "Retrieve full TSX implementation source code, exact npm package install command, required shared utilities (e.g. lib/utils cn), custom CSS/Tailwind requirements, and available particle example IDs for a component.",
        inputSchema: {
          type: "object",
          properties: {
            slug: {
              type: "string",
              description: "The component slug (e.g. 'skeuomorphic-button', 'button', 'dialog', 'calendar', 'slider')"
            }
          },
          required: ["slug"]
        }
      },
      {
        name: "get_example",
        description: "Retrieve full TSX source code for a specific particle example variation demonstrating real-world usage and styling.",
        inputSchema: {
          type: "object",
          properties: {
            id: {
              type: "string",
              description: "Particle example ID (e.g. 'comp-01', 'origin-comp-334', 'p-accordion-1')"
            }
          },
          required: ["id"]
        }
      },
      {
        name: "get_utils",
        description: "Retrieve code and installation instructions for shared utilities (e.g. lib/utils.ts cn function) and custom React hooks used across Coss UI components.",
        inputSchema: {
          type: "object",
          properties: {
            name: {
              type: "string",
              description: "Specific utility or hook name (e.g. 'utils', 'cn', 'use-character-limit', 'use-file-upload', 'use-pagination', 'use-slider-with-input', 'use-toast'). If omitted, lists all available utilities."
            }
          }
        }
      }
    ]
  };
});

// Tool invocation handler
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args = {} } = request.params;

  try {
    switch (name) {
      case "search_components":
        return handleSearchComponents(args as any);
      case "list_categories":
        return handleListCategories();
      case "list_components":
        return handleListComponents(args as any);
      case "get_component":
        if (!args.slug || typeof args.slug !== "string") {
          throw new McpError(ErrorCode.InvalidParams, "Missing required argument 'slug'");
        }
        return handleGetComponent({ slug: args.slug });
      case "get_example":
        if (!args.id || typeof args.id !== "string") {
          throw new McpError(ErrorCode.InvalidParams, "Missing required argument 'id'");
        }
        return handleGetExample({ id: args.id });
      case "get_utils":
        return handleGetUtils(args as any);
      default:
        throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
    }
  } catch (err: any) {
    if (err instanceof McpError) throw err;
    return {
      isError: true,
      content: [
        {
          type: "text" as const,
          text: `Error executing ${name}: ${err.message || String(err)}`
        }
      ]
    };
  }
});

// 2. Register Resources
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: STATIC_RESOURCES
  };
});

server.setRequestHandler(ListResourceTemplatesRequestSchema, async () => {
  return {
    resourceTemplates: RESOURCE_TEMPLATES
  };
});

server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  try {
    return handleReadResource(request.params.uri);
  } catch (err: any) {
    throw new McpError(ErrorCode.InvalidRequest, err.message || `Failed to read resource: ${request.params.uri}`);
  }
});

// 3. Register Prompts
server.setRequestHandler(ListPromptsRequestSchema, async () => {
  return {
    prompts: PROMPTS
  };
});

server.setRequestHandler(GetPromptRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  try {
    return handleGetPrompt(name, args);
  } catch (err: any) {
    throw new McpError(ErrorCode.InvalidParams, err.message || `Prompt not found: ${name}`);
  }
});

// Main process execution
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error(`[coss-ui-mcp] Server running on stdio (${db.stats.totalComponents} components, ${db.stats.totalExamples} examples ready)`);
}

main().catch((error) => {
  console.error("[coss-ui-mcp] Fatal error during startup:", error);
  process.exit(1);
});
