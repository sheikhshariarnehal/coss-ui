import path from "node:path";
import { fileURLToPath } from "node:url";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const serverPath = path.resolve(__dirname, "../dist/index.js");

async function runTests() {
  console.log("=== Starting Coss UI MCP Server Verification ===");
  console.log(`Target binary: ${serverPath}`);

  const transport = new StdioClientTransport({
    command: "node",
    args: [serverPath],
  });

  const client = new Client(
    {
      name: "coss-ui-test-client",
      version: "1.0.0",
    },
    {
      capabilities: {},
    }
  );

  await client.connect(transport);
  console.log("✓ Connected to MCP server over stdio");

  // 1. List tools
  const toolsResult = await client.listTools();
  console.log(`✓ Tools registered: ${toolsResult.tools.length}`);
  const toolNames = toolsResult.tools.map(t => t.name);
  console.log("  Registered:", toolNames.join(", "));

  if (!toolNames.includes("search_components") || !toolNames.includes("get_component")) {
    throw new Error("Missing required tools!");
  }

  // 2. Test list_categories
  const catRes = await client.callTool({
    name: "list_categories",
    arguments: {}
  });
  console.log("✓ list_categories response received");
  if (!catRes.content[0].text.includes("Buttons & Actions")) {
    throw new Error("Categories missing expected content");
  }

  // 3. Test search_components with "skeuomorphic"
  const searchRes = await client.callTool({
    name: "search_components",
    arguments: { query: "skeuomorphic" }
  });
  console.log("✓ search_components('skeuomorphic') returned matches:");
  if (!searchRes.content[0].text.includes("skeuomorphic-button")) {
    throw new Error("search_components did not find skeuomorphic-button");
  }
  console.log("  -> Found skeuomorphic-button!");

  // 4. Test get_component for "skeuomorphic-button"
  const getCompRes = await client.callTool({
    name: "get_component",
    arguments: { slug: "skeuomorphic-button" }
  });
  console.log("✓ get_component('skeuomorphic-button') returned source code and details");
  const compText = getCompRes.content[0].text;
  if (!compText.includes("buttonVariants") || !compText.includes("@radix-ui/react-slot")) {
    throw new Error("Component code missing expected identifiers");
  }

  // 5. Test get_example for "comp-01"
  const getExRes = await client.callTool({
    name: "get_example",
    arguments: { id: "comp-01" }
  });
  console.log("✓ get_example('comp-01') returned example TSX code");

  // 6. Test get_utils
  const getUtilsRes = await client.callTool({
    name: "get_utils",
    arguments: { name: "utils" }
  });
  console.log("✓ get_utils('utils') returned cn helper");
  if (!getUtilsRes.content[0].text.includes("twMerge")) {
    throw new Error("Utils missing twMerge / clsx definition");
  }

  // 7. Test resources
  const resourcesList = await client.listResources();
  console.log(`✓ Static resources available: ${resourcesList.resources.length}`);

  const readRes = await client.readResource({ uri: "coss://categories" });
  console.log("✓ Successfully read resource coss://categories");

  // 8. Test prompts
  const promptsList = await client.listPrompts();
  console.log(`✓ Prompts registered: ${promptsList.prompts.length}`);
  const prompt = await client.getPrompt({
    name: "coss-component-picker",
    arguments: { ui_requirement: "Interactive glassy checkout card" }
  });
  console.log("✓ Successfully retrieved prompt coss-component-picker");

  await client.close();
  console.log("\n=== All Coss UI MCP Tests Passed Successfully! ===");
}

runTests().catch((err) => {
  console.error("Test failed with error:", err);
  process.exit(1);
});
