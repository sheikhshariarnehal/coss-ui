import React from 'react';
import { CodeBlock } from './CodeBlock';
import {
  Sparkles,
  Layers,
  Palette,
  Terminal,
  ArrowRight,
  ShieldCheck,
  Zap,
  Boxes,
} from 'lucide-react';

interface OverviewPageProps {
  overviewId: string;
  onExploreComponents: () => void;
  onExploreParticles: () => void;
}

export const OverviewPage: React.FC<OverviewPageProps> = ({
  overviewId,
  onExploreComponents,
  onExploreParticles,
}) => {
  if (overviewId === 'get-started') {
    return (
      <main className="flex-1 max-w-4xl px-4 py-8 sm:px-8 sm:py-10 space-y-8">
        <div className="space-y-3 pb-6 border-b border-border/40">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground font-heading">
            Get Started
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            How to install and integrate Coss UI components into your React / Next.js / Vite projects.
          </p>
        </div>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold tracking-tight text-foreground font-heading">
            1. Install Core Dependencies
          </h2>
          <p className="text-sm text-muted-foreground">
            Coss UI is built on top of Base UI and Tailwind CSS for unstyled, accessible primitives with beautiful modern styles.
          </p>
          <CodeBlock
            code="npm install @base-ui/react lucide-react clsx tailwind-merge class-variance-authority"
            language="bash"
            showLineNumbers={false}
          />
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold tracking-tight text-foreground font-heading">
            2. Configure Utilities
          </h2>
          <p className="text-sm text-muted-foreground">
            Add the <code className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">cn</code> helper inside <code className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">lib/utils.ts</code>:
          </p>
          <CodeBlock
            code={`import { clsx, type ClassValue } from "clsx";\nimport { twMerge } from "tailwind-merge";\n\nexport function cn(...inputs: ClassValue[]) {\n  return twMerge(clsx(inputs));\n}`}
            language="typescript"
            filename="lib/utils.ts"
            showLineNumbers={true}
          />
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold tracking-tight text-foreground font-heading">
            3. Add Your First Component
          </h2>
          <p className="text-sm text-muted-foreground">
            Copy any component from the <strong className="text-foreground">Components</strong> tab into your <code className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">components/ui/</code> directory!
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={onExploreComponents}
              className="inline-flex items-center gap-2 rounded-xl bg-primary text-primary-foreground px-5 py-2.5 text-sm font-medium hover:opacity-90 transition-opacity shadow-sm"
            >
              <span>Explore All 57 Components</span>
              <ArrowRight className="size-4" />
            </button>
          </div>
        </section>
      </main>
    );
  }

  if (overviewId === 'styling') {
    return (
      <main className="flex-1 max-w-4xl px-4 py-8 sm:px-8 sm:py-10 space-y-8">
        <div className="space-y-3 pb-6 border-b border-border/40">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground font-heading">
            Styling & Design System
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            Tailwind CSS variables and dark mode architecture powering Coss UI.
          </p>
        </div>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold tracking-tight text-foreground font-heading">
            CSS Color Tokens
          </h2>
          <p className="text-sm text-muted-foreground">
            Coss UI uses HSL / OKLCH tailored tokens with seamless dark mode support and crisp border contrasts.
          </p>
          <CodeBlock
            code={`:root {\n  --background: #ffffff;\n  --foreground: #171717;\n  --border: rgba(0, 0, 0, 0.08);\n  --radius: 0.5rem;\n}\n\n.dark {\n  --background: #09090b;\n  --foreground: #f4f4f5;\n  --border: rgba(255, 255, 255, 0.08);\n}`}
            language="css"
            filename="globals.css"
            showLineNumbers={true}
          />
        </section>
      </main>
    );
  }

  // Default: Introduction
  return (
    <main className="flex-1 max-w-4xl px-4 py-8 sm:px-8 sm:py-10 space-y-10">
      <div className="space-y-4 pb-6 border-b border-border/40">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary shadow-xs">
          <Sparkles className="size-3.5" />
          <span>Next-Generation Base UI Components</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground font-heading">
          coss.com UI
        </h1>
        <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
          A high-quality collection of 57 accessible React components and 550+ interactive particle variations, designed with Base UI, Tailwind CSS, and TypeScript.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            type="button"
            onClick={onExploreComponents}
            className="inline-flex items-center gap-2 rounded-xl bg-primary text-primary-foreground px-5 py-2.5 text-sm font-medium hover:opacity-90 transition-opacity shadow-sm"
          >
            <span>Browse Components (57)</span>
            <ArrowRight className="size-4" />
          </button>

          <button
            type="button"
            onClick={onExploreParticles}
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-5 py-2.5 text-sm font-medium text-foreground hover:bg-accent transition-colors shadow-xs"
          >
            <Sparkles className="size-4 text-amber-500" />
            <span>Browse Particles (554)</span>
          </button>
        </div>
      </div>

      {/* Feature Highlights Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-border/80 bg-card p-6 space-y-2.5">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <ShieldCheck className="size-5" />
          </div>
          <h3 className="font-semibold text-foreground text-base">Accessible & Unstyled Core</h3>
          <p className="text-sm text-muted-foreground">
            Built on Base UI primitives for standard-compliant keyboard navigation, ARIA semantics, and screen reader support.
          </p>
        </div>

        <div className="rounded-2xl border border-border/80 bg-card p-6 space-y-2.5">
          <div className="flex size-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
            <Sparkles className="size-5" />
          </div>
          <h3 className="font-semibold text-foreground text-base">550+ Particle Variations</h3>
          <p className="text-sm text-muted-foreground">
            Ready-to-use production variations for menus, forms, calendars, pickers, tables, charts, dialogs, and navigation.
          </p>
        </div>

        <div className="rounded-2xl border border-border/80 bg-card p-6 space-y-2.5">
          <div className="flex size-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
            <Palette className="size-5" />
          </div>
          <h3 className="font-semibold text-foreground text-base">Dark Mode & Sleek Aesthetics</h3>
          <p className="text-sm text-muted-foreground">
            Calibrated dark mode palettes, glassmorphic headers, subtle dot matrices, and micro-interactions.
          </p>
        </div>

        <div className="rounded-2xl border border-border/80 bg-card p-6 space-y-2.5">
          <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
            <Zap className="size-5" />
          </div>
          <h3 className="font-semibold text-foreground text-base">Copy-Paste Friendly</h3>
          <p className="text-sm text-muted-foreground">
            Direct source files in your codebase with no hidden npm runtime wrappers or black-box dependencies.
          </p>
        </div>
      </div>
    </main>
  );
};
