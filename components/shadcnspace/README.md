# Shadcn Space Component Library

Comprehensive collection of **490+ components & variants** across **66 categories** sourced from [shadcnspace.com](https://shadcnspace.com/components), organized for seamless use within the Coss UI library and Next.js / React projects.

---

## 📁 Directory Structure

```text
components/shadcnspace/
├── accordion/          # 9 variants (accordion-01 ... accordion-09)
├── alert/              # 8 variants
├── animated-list/      # 3 variants
├── animated-text/      # 12 variants (.tsx and .css files)
├── animation/          # 1 variant
├── apple-dock/         # 2 variants
├── aspect-ratio/       # 6 variants
├── attachment/         # 9 variants
├── autocomplete/       # 6 variants
├── avatar/             # 8 variants
├── badge/              # 13 variants
├── breadcrumb/         # 6 variants
├── bubble/             # 8 variants
├── button/             # 33 variants
├── button-group/       # 13 variants
├── calendar/           # 16 variants
├── card/               # 26 variants
├── carousel/           # 8 variants
├── checkbox/           # 10 variants
├── code-block/         # 7 variants
├── collapsible/        # 5 variants
├── combobox/           # 10 variants
├── command/            # 7 variants
├── context-menu/       # 2 variants
├── date-picker/        # 4 variants
├── dialog/             # 8 variants
├── dots/               # 12 variants
├── drawer/             # 2 variants
├── dropdown-menu/      # 11 variants
├── field/              # 4 variants
├── file-upload/        # 5 variants
├── input/              # 20 variants
├── input-group/        # 4 variants
├── input-mask/         # 3 variants
├── input-otp/          # 10 variants
├── item/               # 2 variants
├── kbd/                # 5 variants
├── label/              # 6 variants
├── marquee/            # 5 variants
├── number-ticker/      # 8 variants
├── orbiting-circles/   # 4 variants
├── pagination/         # 3 variants
├── popover/            # 9 variants
├── progress/           # 4 variants
├── questionnaire/      # 1 variant
├── radio-group/        # 8 variants
├── rating/             # 3 variants
├── registry.json       # Complete JSON catalog of all 490 components
├── resizable/          # 4 variants
├── scroll-area/        # 4 variants
├── select/             # 12 variants
├── separator/          # 9 variants
├── sheet/              # 4 variants
├── shine-border/       # 7 variants
├── skeleton/           # 3 variants
├── slider/             # 8 variants
├── sonner/             # 7 variants
├── sortable/           # 6 variants
├── spinner/            # 10 variants
├── spinning-text/      # 2 variants
├── stepper/            # 4 variants
├── switch/             # 8 variants
├── tabs/               # 10 variants
├── textarea/           # 9 variants
├── toggle/             # 3 variants
├── toggle-group/       # 2 variants
└── tooltip/            # 9 variants
```

---

## 🚀 Installation & Usage

### 1. In this project (Coss UI App)
Navigate to the **Shadcn Space** tab in the top navigation bar (`/shadcnspace`), or visit any category directly (e.g. `/shadcnspace/card`). You can preview components live and copy their source code or CLI command.

### 2. Copy & Paste into external projects
Simply copy any component file from `components/shadcnspace/<category>/<name>.tsx` into your application. All imports use standard `@/components/ui/*` and `@/lib/utils`.

### 3. Via Shadcn CLI
```bash
# pnpm
pnpm dlx shadcn@latest add @shadcn-space/<component-slug>

# npm
npx shadcn@latest add @shadcn-space/<component-slug>

# bun
bunx --bun shadcn@latest add @shadcn-space/<component-slug>
```

---

## 🔄 Updater Script

To refresh or update components from the upstream registry:

```bash
python download_shadcnspace.py
```

The script:
1. Scrapes all 66 categories from `https://shadcnspace.com/components`.
2. Concurrently downloads every component's source code and styles.
3. Automatically updates `components/shadcnspace/registry.json`.
4. Updates the TypeScript registry index in `src/data/shadcnspace-list.ts`.
