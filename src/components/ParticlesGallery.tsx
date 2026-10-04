import React, { useState, useMemo, Suspense } from 'react';
import { ComponentMeta } from '../data/components-list';
import { loadParticleComponent, getParticleSourceCode } from '../data/dynamic-loader';
import { CodeBlock } from './CodeBlock';
import {
  Search,
  Sparkles,
  Filter,
  Eye,
  Code2,
  X,
  Copy,
  Check,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';

interface ParticlesGalleryProps {
  components: ComponentMeta[];
  onSelectComponent: (slug: string) => void;
}

export const ParticlesGallery: React.FC<ParticlesGalleryProps> = ({
  components,
  onSelectComponent,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [activeCodeParticle, setActiveCodeParticle] = useState<{
    slug: string;
    id: string;
    title: string;
    filename: string;
    code: string;
  } | null>(null);

  // Flatten all particles with their parent component meta
  const allParticles = useMemo(() => {
    const list: Array<{
      id: string;
      filename: string;
      title: string;
      componentSlug: string;
      componentTitle: string;
    }> = [];

    components.forEach((c) => {
      c.examples.forEach((ex) => {
        list.push({
          id: ex.id,
          filename: ex.filename,
          title: ex.title,
          componentSlug: c.slug,
          componentTitle: c.title,
        });
      });
    });

    return list;
  }, [components]);

  // Filter particles based on query and selected component category checkboxes
  const filteredParticles = useMemo(() => {
    let result = allParticles;

    if (selectedCategories.length > 0) {
      result = result.filter((p) => selectedCategories.includes(p.componentSlug));
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.id.toLowerCase().includes(q) ||
          p.componentTitle.toLowerCase().includes(q) ||
          p.componentSlug.toLowerCase().includes(q)
      );
    }

    return result;
  }, [allParticles, selectedCategories, searchQuery]);

  const toggleCategory = (slug: string) => {
    setSelectedCategories((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  };

  const handleOpenCode = async (p: typeof allParticles[0]) => {
    const code = await getParticleSourceCode(p.componentSlug, p.filename);
    setActiveCodeParticle({
      slug: p.componentSlug,
      id: p.id,
      title: p.title,
      filename: p.filename,
      code,
    });
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      {/* Hero Section */}
      <div className="text-center space-y-4 max-w-2xl mx-auto pt-4">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-500 shadow-xs">
          <Sparkles className="size-3.5" />
          <span>550+ Ready-to-Use UI Variations</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground font-heading">
          Browse Particles
        </h1>
        <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
          Discover {allParticles.length} ready-to-use particles, the building blocks of your design system.
          Filter by category to find the perfect component for your project.
        </p>
      </div>

      {/* Search & Category Filter Section */}
      <div className="space-y-4 max-w-3xl mx-auto">
        {/* Search input */}
        <div className="relative">
          <Search className="absolute left-4 top-3.5 size-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search particles by component name or variation..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-2xl border border-input bg-card/80 backdrop-blur-sm pl-12 pr-10 py-3 text-sm sm:text-base text-foreground placeholder:text-muted-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-3.5 text-muted-foreground hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        {/* Category Pills & Filter List */}
        <div className="rounded-2xl border border-border/80 bg-card/40 p-4 backdrop-blur-xs space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Filter className="size-3.5" />
              Filter by Component
            </span>
            {selectedCategories.length > 0 && (
              <button
                type="button"
                onClick={() => setSelectedCategories([])}
                className="text-primary hover:underline lowercase text-xs"
              >
                clear ({selectedCategories.length})
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
            {components
              .filter((c) => c.exampleCount > 0)
              .map((c) => {
                const isSelected = selectedCategories.includes(c.slug);
                return (
                  <button
                    key={c.slug}
                    type="button"
                    onClick={() => toggleCategory(c.slug)}
                    className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                      isSelected
                        ? 'bg-primary text-primary-foreground shadow-xs'
                        : 'border border-border/80 bg-background text-muted-foreground hover:text-foreground hover:bg-accent'
                    }`}
                  >
                    <span>{c.title}</span>
                    <span className="rounded bg-black/10 dark:bg-white/10 px-1 py-0.2 text-[10px] font-mono">
                      {c.exampleCount}
                    </span>
                  </button>
                );
              })}
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-sm text-muted-foreground border-b border-border/40 pb-3">
        <span>
          Showing <strong className="text-foreground">{filteredParticles.length}</strong> particles
        </span>
        <span className="text-xs">Click "View Code" or component link for full details</span>
      </div>

      {/* Particle Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredParticles.map((p) => {
          const LiveParticle = loadParticleComponent(p.componentSlug, p.filename);

          return (
            <div
              key={p.id}
              className="group rounded-2xl border border-border/80 bg-card overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 flex flex-col"
            >
              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-border/60 bg-muted/20 px-4 py-2.5 text-xs">
                <button
                  type="button"
                  onClick={() => onSelectComponent(p.componentSlug)}
                  className="font-medium text-foreground hover:text-primary transition-colors flex items-center gap-1"
                >
                  <span>{p.componentTitle}</span>
                  <ExternalLink className="size-3 opacity-60" />
                </button>
                <span className="font-mono text-[11px] text-muted-foreground">
                  {p.id}
                </span>
              </div>

              {/* Live Interactive Preview Area */}
              <div className="flex-1 min-h-[220px] sm:min-h-[260px] w-full items-center justify-center p-6 bg-background/50 flex relative">
                {LiveParticle ? (
                  <Suspense
                    fallback={
                      <div className="text-xs text-muted-foreground flex items-center gap-1.5 animate-pulse">
                        <RefreshCw className="size-3 animate-spin" />
                        <span>Rendering...</span>
                      </div>
                    }
                  >
                    <div className="w-full max-w-[280px] flex items-center justify-center">
                      <LiveParticle />
                    </div>
                  </Suspense>
                ) : (
                  <div className="text-xs text-muted-foreground">Preview unavailable</div>
                )}
              </div>

              {/* Card Footer Actions */}
              <div className="flex items-center justify-between border-t border-border/60 bg-muted/10 px-4 py-2 text-xs">
                <span className="font-medium text-muted-foreground truncate">{p.title}</span>
                <button
                  type="button"
                  onClick={() => handleOpenCode(p)}
                  className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                >
                  <Code2 className="size-3.5" />
                  <span>View Code</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Code Modal Drawer */}
      {activeCodeParticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in">
          <div
            className="w-full max-w-3xl rounded-2xl border border-border bg-popover shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border px-5 py-3.5 bg-muted/20">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-foreground">
                  {activeCodeParticle.title}
                </span>
                <span className="rounded bg-muted px-2 py-0.5 font-mono text-xs text-muted-foreground">
                  {activeCodeParticle.filename}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setActiveCodeParticle(null)}
                className="p-1 rounded-lg border border-border text-muted-foreground hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <CodeBlock
                code={activeCodeParticle.code}
                language="tsx"
                filename={`components/${activeCodeParticle.slug}/examples/${activeCodeParticle.filename}`}
                showLineNumbers={true}
              />
            </div>

            <div className="border-t border-border px-5 py-3 flex items-center justify-between bg-muted/10">
              <button
                type="button"
                onClick={() => {
                  onSelectComponent(activeCodeParticle.slug);
                  setActiveCodeParticle(null);
                }}
                className="text-xs text-primary hover:underline flex items-center gap-1"
              >
                <span>Go to {activeCodeParticle.slug} documentation</span>
                <ExternalLink className="size-3" />
              </button>

              <button
                type="button"
                onClick={() => setActiveCodeParticle(null)}
                className="rounded-lg bg-primary text-primary-foreground px-4 py-1.5 text-xs font-medium hover:opacity-90 transition-opacity"
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
