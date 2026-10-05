# coss-ui-mcp

> Model Context Protocol (MCP) server for the **Coss UI** component library and interactive particle examples.

Allows any AI coding assistant (**Cursor**, **Claude Desktop**, **Antigravity**, **Cline**, **Windsurf**, **Zed**) to search, inspect, and extract full TSX source code, dependencies, utilities, and particle demos from Coss UI (70 components, 1,150+ particle examples) with zero latency and 100% offline capability.

---

## Features

- **100% Bundled & Offline**: All 70 components, 1,154 particle examples, documentation, and hooks are embedded directly into the binary. No server or internet connection required.
- **Smart Scored Search**: Search by natural language intent, component name, or visual design tags (`skeuomorphic`, `3d`, `glassmorphism`, `rainbow`, `dark-mode`, `otp`, `confetti`).
- **Complete Self-Contained Guides**: `get_component` returns the complete TSX code, exact `npm install` command, required `@/lib/utils` helpers, and custom Tailwind CSS animations.
- **Particle Examples & Demos**: Retrieve real-world composition patterns with `get_example`.
- **MCP Resources & Prompts**: Includes `coss://` URIs and interactive prompt templates for page generation.

---

## Quickstart

### Run with `npx` (No installation needed)

```bash
npx coss-ui-mcp
```

---

## Client Setup

### 1. Antigravity IDE / Google Gemini IDE

Add to your `mcp_config.json` (`~/.gemini/config/mcp_config.json`):

```json
{
  "mcpServers": {
    "coss-ui": {
      "command": "npx",
      "args": ["-y", "coss-ui-mcp"]
    }
  }
}
```

*For local repository development:*
```json
{
  "mcpServers": {
    "coss-ui": {
      "command": "node",
      "args": ["O:/coss UI/packages/mcp/dist/index.js"]
    }
  }
}
```

---

### 2. Cursor

Add to `.cursor/mcp.json` (or Global Cursor Settings > MCP):

```json
{
  "mcpServers": {
    "coss-ui": {
      "command": "npx",
      "args": ["-y", "coss-ui-mcp"]
    }
  }
}
```

---

### 3. Claude Desktop

Add to `claude_desktop_config.json`:

- **macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "coss-ui": {
      "command": "npx",
      "args": ["-y", "coss-ui-mcp"]
    }
  }
}
```

---

## Available Tools

| Tool | Parameters | Description |
| :--- | :--- | :--- |
| `search_components` | `query?`, `category?`, `type?`, `limit?` | Scored search across 70 components and 1,154 particles by keyword or style tag. |
| `list_categories` | *(none)* | Lists all 6 categories with component and particle counts. |
| `list_components` | `category?` | Browse all 70 components or filter by category. |
| `get_component` | `slug` (required) | Returns TSX code, `npm install` command, required utilities (`cn`), and Tailwind styles. |
| `get_example` | `id` (required) | Returns particle demo TSX code illustrating a real-world pattern (e.g. `comp-01`, `origin-comp-334`). |
| `get_utils` | `name?` | Returns shared utilities like `@/lib/utils.ts` (`cn`) or custom React hooks. |

---

## Available Resources

- `coss://categories` — JSON overview of all categories.
- `coss://components` — Summary JSON list of all 70 components.
- `coss://components/{slug}` — Component TSX code by slug.
- `coss://examples/{id}` — Particle demo TSX code by ID.
- `coss://utils/cn` — Canonical `cn()` helper function.

---

## Available Prompts

- `coss-component-picker`: Recommends matching Coss UI components and particle examples based on a UI requirement.
- `coss-build-page`: Guides the AI assistant to architect and compose a complete responsive page layout with Coss UI components.

---

## Publishing to npm

To publish this package to the npm registry:

```bash
cd packages/mcp
npm run build
npm publish --access public
```

---

## License

MIT © Sheikh Shariar Nehal
