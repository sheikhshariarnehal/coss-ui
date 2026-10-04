import React, { useState, useEffect, Suspense } from 'react';
import { getCategory, ComponentCategory } from './components-config';
import registryData from './registry.json';
import { loadOriginComponent, getOriginComponentSource } from './origin-loader';
import { CodeBlock } from '../components/CodeBlock';
import {
  Code,
  Copy,
  Check,
  ExternalLink,
  ChevronLeft,
  Terminal,
  Loader2,
  X,
} from 'lucide-react';

interface OriginCategoryPageProps {
  slug: string;
  onBackToHome: () => void;
  onSelectCategory?: (slug: string) => void;
}

interface ComponentMetaMap {
  [key: string]: {
    colSpan?: number;
    style?: number;
    tags?: string[];
  };
}

export const OriginCategoryPage: React.FC<OriginCategoryPageProps> = ({
  slug,
  onBackToHome,
}) => {
  const category: ComponentCategory | undefined = getCategory(slug);

  // Pre-index items from registry.json
  const [metaMap] = useState<ComponentMetaMap>(() => {
    const map: ComponentMetaMap = {};
    if (registryData && Array.isArray((registryData as any).items)) {
      for (const item of (registryData as any).items) {
        if (item.name) {
          map[item.name] = item.meta || {};
        }
      }
    }
    return map;
  });

  // Modal state for viewing code
  const [activeCodeModal, setActiveCodeModal] = useState<string | null>(null);
  const [modalCode, setModalCode] = useState<string>('');
  const [loadingCode, setLoadingCode] = useState<boolean>(false);
  const [copiedCli, setCopiedCli] = useState<boolean>(false);
  const [copiedModalCode, setCopiedModalCode] = useState<boolean>(false);

  const openCodeModal = async (compName: string) => {
    setActiveCodeModal(compName);
    setLoadingCode(true);
    try {
      const code = await getOriginComponentSource(compName);
      setModalCode(code);
    } catch {
      setModalCode('// Failed to load source code');
    } finally {
      setLoadingCode(false);
    }
  };

  const closeCodeModal = () => {
    setActiveCodeModal(null);
    setModalCode('');
    setCopiedCli(false);
    setCopiedModalCode(false);
  };

  const handleCopyCli = (compName: string) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://coss-ui-beta.vercel.app';
    navigator.clipboard.writeText(`npx shadcn@latest add ${origin}/origin/r/${compName}.json`);
    setCopiedCli(true);
    setTimeout(() => setCopiedCli(false), 2000);
  };

  const handleCopyModalCode = () => {
    if (modalCode) {
      navigator.clipboard.writeText(modalCode);
      setCopiedModalCode(true);
      setTimeout(() => setCopiedModalCode(false), 2000);
    }
  };

  if (!category) {
    return (
      <div className="py-24 text-center">
        <h2 className="text-2xl font-bold text-foreground">Category Not Found</h2>
        <p className="mt-2 text-muted-foreground">The requested Origin category "{slug}" could not be found.</p>
        <button
          onClick={onBackToHome}
          className="mt-6 inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 cursor-pointer"
        >
          <ChevronLeft className="size-4" />
          <span>Back to Origin Home</span>
        </button>
      </div>
    );
  }

  const compCount = category.components.length;
  const descriptionText =
    compCount === 1
      ? `A ${category.name.toLowerCase()} component built with React and Tailwind CSS.`
      : `A growing collection of ${compCount} ${category.name.toLowerCase()} components built with React and Tailwind CSS.`;

  return (
    <div className="w-full pb-24">
      {/* Back button */}
      <div className="max-w-[1416px] mx-auto px-4 sm:px-6 pt-6">
        <button
          onClick={onBackToHome}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        >
          <ChevronLeft className="size-4" />
          <span>All Origin Categories</span>
        </button>
      </div>

      {/* Hero Header */}
      <div className="max-w-[1416px] mx-auto px-4 sm:px-6 pt-10 pb-16 text-center">
        <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground">
          {category.name}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base sm:text-lg text-muted-foreground">
          {descriptionText}
        </p>
      </div>

      {/* 2-Column / Multi-column Bordered Grid matching coss.com/origin */}
      <div className="max-w-[1416px] mx-auto px-4 sm:px-6">
        <div className="overflow-hidden border border-border/80 rounded-xl bg-card">
          <div className="-m-px grid grid-cols-12 divide-y divide-x divide-border/60">
            {category.components.map((item) => {
              const compMeta = metaMap[item.name] || {};
              const colSpan = compMeta.colSpan;
              
              // Column span calculations matching Origin UI
              let colClasses = 'col-span-12 sm:col-span-6 lg:col-span-6';
              if (colSpan === 3) {
                colClasses = 'col-span-12';
              } else if (colSpan === 1) {
                colClasses = 'col-span-12 sm:col-span-6 lg:col-span-4';
              }

              const CompElement = loadOriginComponent(item.name);

              return (
                <div
                  key={item.name}
                  className={`group/item relative border-border/60 p-6 sm:p-8 xl:p-12 flex flex-col justify-center min-h-[300px] ${colClasses}`}
                >
                  {/* Floating Action Buttons */}
                  <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10 opacity-70 group-hover/item:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleCopyCli(item.name)}
                      title="Copy CLI command"
                      className="inline-flex size-8 items-center justify-center rounded-md border border-border/60 bg-background/80 backdrop-blur text-muted-foreground hover:text-foreground hover:bg-accent transition-colors cursor-pointer"
                    >
                      <Terminal className="size-3.5" />
                    </button>

                    <a
                      href={`https://v0.dev`}
                      target="_blank"
                      rel="noreferrer"
                      title="Open in v0"
                      className="inline-flex size-8 items-center justify-center rounded-md border border-border/60 bg-background/80 backdrop-blur text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                    >
                      <ExternalLink className="size-3.5" />
                    </a>

                    <button
                      onClick={() => openCodeModal(item.name)}
                      title="View Code"
                      className="inline-flex size-8 items-center justify-center rounded-md border border-border/60 bg-background/80 backdrop-blur text-muted-foreground hover:text-foreground hover:bg-accent transition-colors cursor-pointer"
                    >
                      <Code className="size-3.5" />
                    </button>
                  </div>

                  {/* Live Rendered Component */}
                  <div className="w-full py-4">
                    {CompElement ? (
                      <Suspense
                        fallback={
                          <div className="flex h-32 items-center justify-center text-muted-foreground">
                            <Loader2 className="size-5 animate-spin" />
                          </div>
                        }
                      >
                        <CompElement />
                      </Suspense>
                    ) : (
                      <div className="text-xs text-muted-foreground">Component {item.name} not found</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="mt-20 text-center">
        <h2 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Didn't find what you were looking for?
        </h2>
        <div className="mt-4">
          <a
            href="https://github.com/sheikhshariarnehal/coss-ui/discussions"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
          >
            <span>Suggest component</span>
          </a>
        </div>
      </div>

      {/* View Code Dialog Modal */}
      {activeCodeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 sm:p-6">
          <div className="relative w-full max-w-2xl max-h-[85vh] flex flex-col rounded-xl border border-border bg-card shadow-2xl overflow-hidden animate-in fade-in-0 zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <div>
                <h3 className="font-heading text-base font-semibold text-foreground">
                  Installation & Source
                </h3>
                <p className="text-xs text-muted-foreground">
                  {activeCodeModal}
                </p>
              </div>
              <button
                onClick={closeCodeModal}
                className="inline-flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              {/* CLI Command */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">CLI Install</span>
                  <button
                    onClick={() => handleCopyCli(activeCodeModal)}
                    className="inline-flex items-center gap-1 text-xs text-primary hover:underline cursor-pointer"
                  >
                    {copiedCli ? <Check className="size-3 text-emerald-500" /> : <Copy className="size-3" />}
                    <span>{copiedCli ? 'Copied' : 'Copy command'}</span>
                  </button>
                </div>
                <div className="rounded-lg border border-border bg-zinc-950 px-3.5 py-2.5 font-mono text-xs text-zinc-300 overflow-x-auto">
                  <code>
                    npx shadcn@latest add {typeof window !== 'undefined' ? window.location.origin : 'https://coss-ui-beta.vercel.app'}/origin/r/{activeCodeModal}.json
                  </code>
                </div>
              </div>

              {/* TSX Code */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Component Code</span>
                  <button
                    onClick={handleCopyModalCode}
                    className="inline-flex items-center gap-1 text-xs text-primary hover:underline cursor-pointer"
                  >
                    {copiedModalCode ? <Check className="size-3 text-emerald-500" /> : <Copy className="size-3" />}
                    <span>{copiedModalCode ? 'Copied code' : 'Copy code'}</span>
                  </button>
                </div>

                {loadingCode ? (
                  <div className="flex h-48 items-center justify-center rounded-lg border border-border bg-muted/20 text-muted-foreground">
                    <Loader2 className="size-5 animate-spin" />
                  </div>
                ) : (
                  <div className="max-h-[380px] overflow-y-auto rounded-lg">
                    <CodeBlock
                      code={modalCode}
                      language="tsx"
                      showLineNumbers={true}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end border-t border-border px-5 py-3 bg-muted/10">
              <button
                onClick={closeCodeModal}
                className="rounded-lg border border-border px-4 py-1.5 text-xs font-medium text-foreground hover:bg-accent cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
