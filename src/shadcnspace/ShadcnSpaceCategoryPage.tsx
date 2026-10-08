import React, { useState, Suspense, useMemo } from 'react';
import {
  Code,
  Copy,
  Check,
  ChevronLeft,
  Terminal,
  Loader2,
  X,
  RotateCw,
  Search,
  Sparkles,
  ArrowUpRight,
  Menu,
  LayoutGrid,
  LayoutList,
} from 'lucide-react';
import {
  SHADCNSPACE_COMPONENTS,
  ShadcnSpaceComponent,
} from '../data/shadcnspace-list';
import {
  SHADCNSPACE_SIDEBAR_ITEMS,
} from '../data/shadcnspace-sidebar';
import {
  loadShadcnSpaceComponent,
  getShadcnSpaceComponentSource,
} from './shadcnspace-loader';
import { CodeBlock } from '../components/CodeBlock';

interface ShadcnSpaceCategoryPageProps {
  category: string;
  onBackToHome: () => void;
  onSelectCategory: (cat: string) => void;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  componentName: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ComponentErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.warn(`[Shadcn Space] Error rendering ${this.props.componentName}:`, error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center p-8 text-center text-xs text-muted-foreground gap-2">
          <p className="font-medium text-foreground">Interactive preview error</p>
          <p className="max-w-md text-amber-500/80 font-mono text-[11px] truncate">
            {this.state.error?.message || "Render error"}
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-muted/50 hover:bg-muted text-foreground transition-colors cursor-pointer text-xs"
          >
            <RotateCw className="size-3" />
            <span>Try re-render</span>
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export const ShadcnSpaceCategoryPage: React.FC<ShadcnSpaceCategoryPageProps> = ({
  category,
  onBackToHome,
  onSelectCategory,
}) => {
  const [sidebarSearch, setSidebarSearch] = useState('');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [layoutCols, setLayoutCols] = useState<1 | 2>(2);

  // Components in active category
  const components = useMemo(() => {
    return SHADCNSPACE_COMPONENTS.filter((c) => c.category === category);
  }, [category]);

  // Filter sidebar categories by search query
  const filteredSidebarItems = useMemo(() => {
    const q = sidebarSearch.toLowerCase().trim();
    if (!q) return SHADCNSPACE_SIDEBAR_ITEMS;
    return SHADCNSPACE_SIDEBAR_ITEMS.filter((item) =>
      item.title.toLowerCase().includes(q) ||
      item.slug.toLowerCase().includes(q)
    );
  }, [sidebarSearch]);

  const [activeCodeModal, setActiveCodeModal] = useState<ShadcnSpaceComponent | null>(null);
  const [modalCode, setModalCode] = useState<string>('');
  const [loadingCode, setLoadingCode] = useState<boolean>(false);
  const [activePkgManager, setActivePkgManager] = useState<'pnpm' | 'npm' | 'yarn' | 'bun'>('pnpm');
  const [copiedCli, setCopiedCli] = useState<boolean>(false);
  const [copiedModalCode, setCopiedModalCode] = useState<boolean>(false);
  const [copiedCardId, setCopiedCardId] = useState<string | null>(null);
  const [reloadKeys, setReloadKeys] = useState<Record<string, number>>({});

  const handleOpenCode = async (comp: ShadcnSpaceComponent) => {
    setActiveCodeModal(comp);
    setLoadingCode(true);
    try {
      const filename = comp.files.length > 0 ? comp.files[0].name : `${comp.slug}.tsx`;
      const code = await getShadcnSpaceComponentSource(comp.category, filename);
      setModalCode(code);
    } catch {
      setModalCode('// Failed to load source code');
    } finally {
      setLoadingCode(false);
    }
  };

  const handleCloseModal = () => {
    setActiveCodeModal(null);
    setModalCode('');
    setCopiedCli(false);
    setCopiedModalCode(false);
  };

  const getCliCommand = (slug: string) => {
    switch (activePkgManager) {
      case 'pnpm':
        return `pnpm dlx shadcn@latest add @shadcn-space/${slug}`;
      case 'npm':
        return `npx shadcn@latest add @shadcn-space/${slug}`;
      case 'yarn':
        return `npx shadcn@latest add @shadcn-space/${slug}`;
      case 'bun':
        return `bunx --bun shadcn@latest add @shadcn-space/${slug}`;
    }
  };

  const handleCopyCli = (slug: string) => {
    navigator.clipboard.writeText(getCliCommand(slug));
    setCopiedCli(true);
    setTimeout(() => setCopiedCli(false), 2000);
  };

  const handleCopyCard = (comp: ShadcnSpaceComponent) => {
    navigator.clipboard.writeText(`pnpm dlx shadcn@latest add @shadcn-space/${comp.slug}`);
    setCopiedCardId(comp.id);
    setTimeout(() => setCopiedCardId(null), 2000);
  };

  const handleReload = (slug: string) => {
    setReloadKeys((prev) => ({
      ...prev,
      [slug]: (prev[slug] || 0) + 1,
    }));
  };

  return (
    <div className="container mx-auto px-4 py-6 sm:px-6 lg:py-8 max-w-[1440px]">
      {/* Mobile Top Bar to toggle sidebar & go home */}
      <div className="md:hidden flex items-center justify-between pb-4 mb-4 border-b border-border/70">
        <button
          type="button"
          onClick={onBackToHome}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="size-4" />
          <span>All Components</span>
        </button>
        <button
          type="button"
          onClick={() => setIsMobileSidebarOpen((prev) => !prev)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card text-xs font-semibold text-foreground"
        >
          <Menu className="size-3.5" />
          <span className="capitalize">{category.replace(/-/g, ' ')} ({components.length})</span>
        </button>
      </div>

      <div className="flex gap-8 lg:gap-10 items-start">
        {/* Left Sidebar (Desktop Sticky + Mobile Drawer) */}
        <aside
          className={`
            fixed inset-y-0 left-0 z-50 w-72 bg-background p-4 border-r border-border/80 shadow-2xl transition-transform duration-300
            md:sticky md:top-16 md:z-30 md:w-60 xl:w-64 md:p-0 md:pr-4 md:border-r md:border-border/60 md:shadow-none md:translate-x-0 md:self-start md:h-[calc(100vh-4rem)]
            ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          `}
        >
          {/* Mobile drawer header */}
          <div className="md:hidden flex items-center justify-between pb-3 mb-3 border-b border-border/80">
            <span className="font-bold text-sm">Components</span>
            <button
              type="button"
              onClick={() => setIsMobileSidebarOpen(false)}
              className="size-8 inline-flex items-center justify-center rounded-lg hover:bg-muted"
            >
              <X className="size-4" />
            </button>
          </div>

          <div className="h-full flex flex-col pt-3 pb-6">
            {/* Distilled Filter Input */}
            <div className="relative shrink-0 mb-3">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground/60 pointer-events-none" />
              <input
                type="text"
                placeholder="Filter categories..."
                value={sidebarSearch}
                onChange={(e) => setSidebarSearch(e.target.value)}
                className="w-full rounded-md border border-border/60 bg-muted/30 py-1.5 pl-8 pr-7 text-xs text-foreground placeholder:text-muted-foreground/60 focus:border-foreground/30 focus:bg-background focus:outline-none focus:ring-1 focus:ring-ring transition-all"
              />
              {sidebarSearch && (
                <button
                  type="button"
                  onClick={() => setSidebarSearch('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="size-3" />
                </button>
              )}
            </div>

            {/* Section Heading */}
            <div className="flex items-center justify-between px-2 py-1 text-[11px] font-semibold tracking-wider text-muted-foreground/70 uppercase shrink-0 mb-1">
              <span>Categories</span>
              <span className="text-[10px] font-mono text-muted-foreground/50 lowercase">
                {filteredSidebarItems.length}
              </span>
            </div>

            {/* Distilled Category List with Modern Invisible / Ultra-thin Scrollbar */}
            <div className="flex-1 overflow-y-auto space-y-0.5 pr-1 [scrollbar-width:thin] [scrollbar-color:rgba(150,150,150,0.2)_transparent] [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-muted-foreground/20 hover:[&::-webkit-scrollbar-thumb]:bg-muted-foreground/40 [&::-webkit-scrollbar-thumb]:rounded-full">
              {filteredSidebarItems.map((item) => {
                const isActive = item.slug === category;
                return (
                  <button
                    key={item.slug}
                    type="button"
                    onClick={() => {
                      onSelectCategory(item.slug);
                      setIsMobileSidebarOpen(false);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`group/item flex items-center justify-between w-full h-8 px-2.5 rounded-md text-xs font-medium transition-colors cursor-pointer text-left ${
                      isActive
                        ? 'bg-accent text-accent-foreground font-semibold shadow-2xs'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="truncate">{item.title}</span>
                      {item.badge && (
                        <span className="inline-flex items-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-1.5 py-0.2 text-[9px] font-semibold whitespace-nowrap leading-none shrink-0">
                          {item.badge.replace(/^\+/, '')}
                        </span>
                      )}
                    </div>
                    {item.count && (
                      <span className="text-[11px] font-mono tabular-nums text-muted-foreground/60 group-hover/item:text-foreground/80 shrink-0 ml-2">
                        {item.count}
                      </span>
                    )}
                  </button>
                );
              })}

              {filteredSidebarItems.length === 0 && (
                <div className="py-8 text-center text-xs text-muted-foreground">
                  No categories found
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Mobile backdrop for drawer */}
        {isMobileSidebarOpen && (
          <div
            onClick={() => setIsMobileSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
          />
        )}

        {/* Right Main Content Column */}
        <main className="flex-1 min-w-0">
          {/* Category Top Bar with Layout Controls */}
          <div className="mb-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold capitalize text-foreground">
                {category.replace(/-/g, ' ')}
              </h2>
              <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground font-mono">
                {components.length} variants
              </span>
            </div>

            {/* Layout Toggle (Grid vs Single Column) */}
            <div className="hidden sm:flex items-center gap-1 p-0.5 rounded-lg border border-border/70 bg-muted/30 text-xs">
              <button
                type="button"
                onClick={() => setLayoutCols(2)}
                className={`p-1.5 rounded-md transition-all cursor-pointer ${
                  layoutCols === 2
                    ? 'bg-background text-foreground shadow-2xs font-semibold'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                title="2 Columns (Grid)"
              >
                <LayoutGrid className="size-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setLayoutCols(1)}
                className={`p-1.5 rounded-md transition-all cursor-pointer ${
                  layoutCols === 1
                    ? 'bg-background text-foreground shadow-2xs font-semibold'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                title="1 Column (List)"
              >
                <LayoutList className="size-3.5" />
              </button>
            </div>
          </div>

          {/* Responsive Component Cards Grid */}
          <div
            className={`grid gap-5 sm:gap-6 ${
              layoutCols === 2 ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'
            }`}
          >
            {components.map((comp) => {
              const filename = comp.files.length > 0 ? comp.files[0].name : `${comp.slug}.tsx`;
              const LoadedComponent = loadShadcnSpaceComponent(comp.category, filename);

              return (
                <div
                  key={comp.id}
                  className="rounded-lg border border-border/80 bg-card overflow-hidden shadow-2xs transition-all flex flex-col justify-between"
                >
                  {/* Component Card Header Bar (matching screenshot) */}
                  <div className="h-11 flex items-center justify-between gap-2 border-b border-border/60 bg-muted/15 px-4">
                    <div className="flex items-center gap-2 min-w-0">
                      <h3 className="text-sm font-semibold text-foreground tracking-tight truncate">
                        {comp.name}
                      </h3>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {/* Pro badge (purple styling from screenshot) */}
                      {(comp.isPro || comp.meta?.isPro) && (
                        <span className="rounded-md bg-purple-500/10 border border-purple-500/25 px-2 py-0.5 text-[11px] font-semibold text-purple-600 dark:text-purple-400">
                          Pro
                        </span>
                      )}

                      {/* Reload preview button */}
                      <button
                        type="button"
                        onClick={() => handleReload(comp.slug)}
                        className="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
                        title="Reload preview"
                      >
                        <RotateCw className="size-3.5" />
                      </button>

                      {/* Copy CLI command */}
                      <button
                        type="button"
                        onClick={() => handleCopyCard(comp)}
                        className="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
                        title="Copy CLI command"
                      >
                        {copiedCardId === comp.id ? (
                          <Check className="size-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="size-3.5" />
                        )}
                      </button>

                      {/* View code button (<> icon) */}
                      <button
                        type="button"
                        onClick={() => handleOpenCode(comp)}
                        className="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
                        title="View source code"
                      >
                        <Code className="size-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Component Interactive Live Preview Canvas */}
                  <div className="relative min-h-[220px] flex-1 flex items-center justify-center p-6 sm:p-8 bg-background/50 overflow-x-auto">
                    {LoadedComponent ? (
                      <Suspense
                        fallback={
                          <div className="flex items-center gap-2 text-muted-foreground text-xs">
                            <Loader2 className="size-4 animate-spin text-emerald-500" />
                            <span>Loading preview...</span>
                          </div>
                        }
                      >
                        <div key={reloadKeys[comp.slug] || 0} className="w-full flex justify-center">
                          <ComponentErrorBoundary componentName={comp.name}>
                            <LoadedComponent />
                          </ComponentErrorBoundary>
                        </div>
                      </Suspense>
                    ) : (
                      <div className="text-xs text-muted-foreground">Preview not available</div>
                    )}
                  </div>

                  {/* Footer file path info */}
                  <div className="border-t border-border/40 px-4 py-2.5 bg-muted/10 text-xs text-muted-foreground flex items-center justify-between gap-2">
                    <span className="truncate max-w-[65%]">{comp.description || `${comp.name} variant`}</span>
                    <span className="font-mono text-[11px] text-muted-foreground/70 shrink-0">
                      components/shadcnspace/{comp.category}/{filename}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>

      {/* Code Modal Dialog */}
      {activeCodeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="relative flex flex-col w-full max-w-4xl max-h-[90vh] rounded-2xl border border-border bg-card shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-border/80 px-6 py-4 bg-muted/30">
              <div className="space-y-1">
                <h3 className="text-base font-semibold text-foreground">CLI Command</h3>
                <p className="text-xs text-muted-foreground">
                  Install this component directly via shadcn CLI
                </p>
              </div>
              <button
                onClick={handleCloseModal}
                className="size-8 inline-flex items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* CLI Bar with PM Selector */}
            <div className="border-b border-border/60 bg-muted/10 p-5 space-y-3">
              <div className="flex items-center gap-1.5">
                {(['pnpm', 'npm', 'yarn', 'bun'] as const).map((pm) => (
                  <button
                    key={pm}
                    onClick={() => setActivePkgManager(pm)}
                    className={`rounded-md px-2.5 py-1 text-xs font-mono font-medium transition-colors cursor-pointer ${
                      activePkgManager === pm
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {pm}
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between rounded-xl border border-border bg-background px-4 py-2.5 font-mono text-xs text-foreground shadow-xs">
                <span className="truncate">{getCliCommand(activeCodeModal.slug)}</span>
                <button
                  onClick={() => handleCopyCli(activeCodeModal.slug)}
                  className="shrink-0 ml-3 inline-flex items-center gap-1 text-xs font-sans text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  {copiedCli ? (
                    <>
                      <Check className="size-3.5 text-emerald-400" />
                      <span className="text-emerald-400 font-medium">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="size-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Explorer Path Header */}
            <div className="flex items-center justify-between border-b border-border/60 bg-muted/20 px-6 py-2.5 text-xs text-muted-foreground">
              <div className="flex items-center gap-2 font-mono">
                <Terminal className="size-3.5 text-emerald-400" />
                <span>
                  components/shadcnspace/{activeCodeModal.category}/
                  {activeCodeModal.files.length > 0 ? activeCodeModal.files[0].name : `${activeCodeModal.slug}.tsx`}
                </span>
              </div>
              <button
                onClick={() => {
                  if (modalCode) {
                    navigator.clipboard.writeText(modalCode);
                    setCopiedModalCode(true);
                    setTimeout(() => setCopiedModalCode(false), 2000);
                  }
                }}
                className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                {copiedModalCode ? (
                  <>
                    <Check className="size-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-medium">Copied code</span>
                  </>
                ) : (
                  <>
                    <Copy className="size-3.5" />
                    <span>Copy code</span>
                  </>
                )}
              </button>
            </div>

            {/* Code Body */}
            <div className="flex-1 overflow-auto p-4 bg-muted/40 max-h-[50vh]">
              {loadingCode ? (
                <div className="flex items-center justify-center py-20 text-muted-foreground">
                  <Loader2 className="size-6 animate-spin text-emerald-500" />
                </div>
              ) : (
                <CodeBlock code={modalCode} language="tsx" />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
