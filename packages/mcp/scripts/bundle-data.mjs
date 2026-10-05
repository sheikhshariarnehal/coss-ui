import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const WORKSPACE_ROOT = path.resolve(__dirname, "../../..");
const COMPONENTS_DIR = path.join(WORKSPACE_ROOT, "components");
const PUBLIC_R_DIR = path.join(WORKSPACE_ROOT, "public", "r");
const HOOKS_DIR = path.join(WORKSPACE_ROOT, "registry", "default", "hooks");
const LIB_UTILS_PATH = path.join(WORKSPACE_ROOT, "lib", "utils.ts");
const OUT_DIR = path.join(__dirname, "../src/db");

// Category mapping helper
const CATEGORY_MAP = {
  // Forms & Inputs
  "input": "Forms & Inputs",
  "input-group": "Forms & Inputs",
  "textarea": "Forms & Inputs",
  "select": "Forms & Inputs",
  "combobox": "Forms & Inputs",
  "autocomplete": "Forms & Inputs",
  "checkbox": "Forms & Inputs",
  "checkbox-group": "Forms & Inputs",
  "checkbox-tree": "Forms & Inputs",
  "radio": "Forms & Inputs",
  "radio-group": "Forms & Inputs",
  "switch": "Forms & Inputs",
  "slider": "Forms & Inputs",
  "number-field": "Forms & Inputs",
  "otp-field": "Forms & Inputs",
  "date-picker": "Forms & Inputs",
  "calendar": "Forms & Inputs",
  "calendar-date-picker": "Forms & Inputs",
  "calendar-rac": "Forms & Inputs",
  "event-calendar": "Forms & Inputs",
  "file-upload": "Forms & Inputs",
  "form": "Forms & Inputs",
  "field": "Forms & Inputs",
  "fieldset": "Forms & Inputs",
  "label": "Forms & Inputs",
  "image-cropper": "Forms & Inputs",

  // Buttons & Actions
  "button": "Buttons & Actions",
  "skeuomorphic-button": "Buttons & Actions",
  "toggle": "Buttons & Actions",
  "toggle-group": "Buttons & Actions",
  "toolbar": "Buttons & Actions",
  "segmented-control": "Buttons & Actions",

  // Overlays & Dialogs
  "dialog": "Overlays & Dialogs",
  "alert-dialog": "Overlays & Dialogs",
  "sheet": "Overlays & Dialogs",
  "drawer": "Overlays & Dialogs",
  "popover": "Overlays & Dialogs",
  "tooltip": "Overlays & Dialogs",
  "context-menu": "Overlays & Dialogs",
  "dropdown": "Overlays & Dialogs",
  "menu": "Overlays & Dialogs",
  "preview-card": "Overlays & Dialogs",

  // Navigation
  "navigation": "Navigation",
  "navbar": "Navigation",
  "breadcrumb": "Navigation",
  "pagination": "Navigation",
  "tabs": "Navigation",
  "sidebar": "Navigation",
  "stepper": "Navigation",

  // Data Display
  "table": "Data Display",
  "card": "Data Display",
  "badge": "Data Display",
  "avatar": "Data Display",
  "kbd": "Data Display",
  "separator": "Data Display",
  "scroll-area": "Data Display",
  "frame": "Data Display",
  "group": "Data Display",
  "timeline": "Data Display",
  "tree": "Data Display",
  "collapsible": "Data Display",
  "accordion": "Data Display",

  // Feedback & Status
  "alert": "Feedback & Status",
  "toast": "Feedback & Status",
  "notification": "Feedback & Status",
  "banner": "Feedback & Status",
  "progress": "Feedback & Status",
  "meter": "Feedback & Status",
  "spinner": "Feedback & Status",
  "skeleton": "Feedback & Status",
  "empty": "Feedback & Status",
  "command": "Overlays & Dialogs"
};

function extractReadmeMeta(readmePath) {
  let title = "";
  let description = "";
  let content = "";
  if (fs.existsSync(readmePath)) {
    content = fs.readFileSync(readmePath, "utf-8");
    const mTitle = content.match(/^#\s+(.+)$/m);
    if (mTitle) title = mTitle[1].trim();
    const mDesc = content.match(/^>\s+(.+)$/m);
    if (mDesc) description = mDesc[1].trim();
  }
  return { title, description, content };
}

function getDesignTags(name, code, desc) {
  const tags = new Set();
  const lower = `${name} ${desc} ${code}`.toLowerCase();

  if (name.includes("skeuomorphic") || lower.includes("skeuomorphic")) {
    tags.add("skeuomorphic");
    tags.add("3d");
    tags.add("glossy");
    tags.add("embossed");
  }
  if (lower.includes("rainbow")) tags.add("rainbow");
  if (lower.includes("glass") || lower.includes("backdrop-blur")) tags.add("glassmorphism");
  if (lower.includes("gradient")) tags.add("gradient");
  if (lower.includes("dark")) tags.add("dark-mode");
  if (lower.includes("animate") || lower.includes("framer-motion")) tags.add("animated");
  if (lower.includes("accessible") || lower.includes("aria") || lower.includes("radix")) tags.add("accessible");
  if (lower.includes("otp") || lower.includes("pin")) tags.add("otp");
  if (lower.includes("cropper")) tags.add("image-cropper");
  if (lower.includes("calendar") || lower.includes("date")) tags.add("date-picker");
  if (lower.includes("confetti")) tags.add("confetti");
  if (lower.includes("youtube")) tags.add("youtube-style");
  if (lower.includes("badge")) tags.add("badge");
  if (lower.includes("avatar")) tags.add("avatar");
  if (lower.includes("filter") || lower.includes("search")) tags.add("searchable");
  if (lower.includes("drag") || lower.includes("dnd")) tags.add("drag-and-drop");

  return Array.from(tags);
}

// 1. Load registry JSON files in public/r
const registryFiles = fs.readdirSync(PUBLIC_R_DIR).filter(f => f.endsWith(".json"));
const registryMap = new Map();

for (const f of registryFiles) {
  try {
    const raw = fs.readFileSync(path.join(PUBLIC_R_DIR, f), "utf-8");
    const parsed = JSON.parse(raw);
    registryMap.set(parsed.name || f.replace(".json", ""), parsed);
  } catch (err) {
    // Ignore invalid JSON
  }
}

// 2. Discover all components from components/ directory
const componentDirs = fs.readdirSync(COMPONENTS_DIR).filter(d => {
  return fs.statSync(path.join(COMPONENTS_DIR, d)).isDirectory();
});

const components = [];
const particleExamples = [];

for (const compSlug of componentDirs) {
  const compDir = path.join(COMPONENTS_DIR, compSlug);
  const readmePath = path.join(compDir, "README.md");
  const { title: rTitle, description: rDesc, content: readmeContent } = extractReadmeMeta(readmePath);
  
  const title = rTitle || compSlug.split("-").map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(" ");
  const description = rDesc || `Accessible, customizable ${title} component.`;
  const category = CATEGORY_MAP[compSlug] || "Other";

  // Check for component tsx source
  let code = "";
  const directTsx = path.join(compDir, `${compSlug}.tsx`);
  if (fs.existsSync(directTsx)) {
    code = fs.readFileSync(directTsx, "utf-8");
  }

  // Registry JSON info if exists
  const regItem = registryMap.get(compSlug);
  let dependencies = [];
  let registryDependencies = [];

  if (regItem) {
    dependencies = regItem.dependencies || [];
    registryDependencies = regItem.registryDependencies || [];
    if (!code && regItem.files && regItem.files.length > 0) {
      code = regItem.files[0].content || "";
    }
  }

  // Check peer utility needs
  const needsUtils = code.includes("@/lib/utils") || code.includes("@/registry/default/lib/utils") || code.includes("cn(");
  const hooksNeeded = [];
  const hookMatches = code.match(/use-[a-z0-9-]+/g);
  if (hookMatches) {
    for (const h of hookMatches) {
      if (!hooksNeeded.includes(h)) hooksNeeded.push(h);
    }
  }

  // Scan examples
  const examplesDir = path.join(compDir, "examples");
  const componentExampleIds = [];

  if (fs.existsSync(examplesDir)) {
    const exFiles = fs.readdirSync(examplesDir).filter(f => f.endsWith(".tsx"));
    for (const exFile of exFiles) {
      const exId = exFile.replace(".tsx", "");
      componentExampleIds.push(exId);

      const exPath = path.join(examplesDir, exFile);
      const exCode = fs.readFileSync(exPath, "utf-8");

      // Extract title from label or filename
      let exTitle = "";
      const labelMatch = exCode.match(/<Label[^>]*>([^<]+)<\/Label>/);
      if (labelMatch && labelMatch[1].trim().length > 2 && labelMatch[1].trim().length < 50) {
        exTitle = labelMatch[1].trim();
      } else {
        exTitle = exId.replace(/^origin-comp-/, `${title} #`).replace(/^p-/, "").replace(/-/g, " ");
        exTitle = exTitle.charAt(0).toUpperCase() + exTitle.slice(1);
      }

      const exReg = registryMap.get(exId);
      const exTags = exReg?.meta?.tags || getDesignTags(exId, exCode, exTitle);

      particleExamples.push({
        id: exId,
        componentSlug: compSlug,
        title: exTitle,
        filename: exFile,
        code: exCode,
        dependencies: exReg?.dependencies || [],
        registryDependencies: exReg?.registryDependencies || [],
        tags: exTags
      });
    }
  }

  const tags = getDesignTags(compSlug, code, description);

  // Generate npm install command string
  const npmInstallCmd = dependencies.length > 0
    ? `npm install ${dependencies.join(" ")}`
    : "";

  components.push({
    slug: compSlug,
    title,
    description,
    category,
    hasCode: Boolean(code),
    code,
    dependencies,
    registryDependencies,
    npmInstallCmd,
    needsUtils,
    hooksNeeded,
    examplesCount: componentExampleIds.length,
    exampleIds: componentExampleIds,
    tags,
    readme: readmeContent
  });
}

// 3. Scan shared utilities & hooks
const utilities = [];

// cn in lib/utils.ts
if (fs.existsSync(LIB_UTILS_PATH)) {
  utilities.push({
    name: "utils",
    path: "lib/utils.ts",
    description: "Standard clsx and tailwind-merge (cn) classname merging utility",
    code: fs.readFileSync(LIB_UTILS_PATH, "utf-8"),
    dependencies: ["clsx", "tailwind-merge"],
    npmInstallCmd: "npm install clsx tailwind-merge"
  });
}

// Hooks from registry/default/hooks
if (fs.existsSync(HOOKS_DIR)) {
  const hookFiles = fs.readdirSync(HOOKS_DIR).filter(f => f.endsWith(".ts"));
  for (const hf of hookFiles) {
    const hName = hf.replace(".ts", "");
    const hPath = path.join(HOOKS_DIR, hf);
    const hCode = fs.readFileSync(hPath, "utf-8");
    utilities.push({
      name: hName,
      path: `hooks/${hf}`,
      description: `Custom React hook for ${hName.replace("use-", "").replace(/-/g, " ")}`,
      code: hCode,
      dependencies: [],
      npmInstallCmd: ""
    });
  }
}

// Compute categories summary
const categoriesSet = new Set(components.map(c => c.category));
const categories = Array.from(categoriesSet).sort().map(catName => {
  const comps = components.filter(c => c.category === catName);
  const partCount = comps.reduce((acc, c) => acc + c.examplesCount, 0);
  return {
    name: catName,
    componentCount: comps.length,
    exampleCount: partCount,
    components: comps.map(c => ({ slug: c.slug, title: c.title, examplesCount: c.examplesCount }))
  };
});

const outputData = {
  version: "1.0.0",
  generatedAt: new Date().toISOString(),
  stats: {
    totalComponents: components.length,
    totalExamples: particleExamples.length,
    totalCategories: categories.length,
    totalUtilities: utilities.length
  },
  categories,
  components,
  particleExamples,
  utilities
};

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

const jsonPath = path.join(OUT_DIR, "bundled-registry.json");
fs.writeFileSync(jsonPath, JSON.stringify(outputData, null, 2), "utf-8");

console.log(`[build-data] Successfully bundled:`);
console.log(` - Components: ${components.length}`);
console.log(` - Particle Examples: ${particleExamples.length}`);
console.log(` - Categories: ${categories.length}`);
console.log(` - Utilities: ${utilities.length}`);
console.log(`Output: ${jsonPath} (${(fs.statSync(jsonPath).size / 1024 / 1024).toFixed(2)} MB)`);
