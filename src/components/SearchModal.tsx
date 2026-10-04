import React, { useState, useEffect, useMemo, useRef } from 'react';
import { ComponentMeta } from '../data/components-list';
import { Search, Sparkles, BookOpen, X, ChevronRight, ArrowUpDown, CornerDownLeft } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  components: ComponentMeta[];
  onSelectComponent: (slug: string) => void;
  onSelectParticle?: (slug: string, particleId: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  components,
  onSelectComponent,
  onSelectParticle,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Flatten searchable items (Components + Particles)
  const items = useMemo(() => {
    const list: Array<{
      type: 'component' | 'particle';
      id: string;
      title: string;
      subtitle: string;
      slug: string;
      particleId?: string;
    }> = [];

    const q = query.toLowerCase().trim();

    components.forEach((c) => {
      if (!q || c.title.toLowerCase().includes(q) || c.slug.toLowerCase().includes(q) || c.description.toLowerCase().includes(q)) {
        list.push({
          type: 'component',
          id: `comp-${c.slug}`,
          title: c.title,
          subtitle: c.description || `coss UI ${c.title} component`,
          slug: c.slug,
        });
      }

      c.examples.forEach((ex) => {
        if (!q || ex.title.toLowerCase().includes(q) || ex.id.toLowerCase().includes(q) || c.title.toLowerCase().includes(q)) {
          list.push({
            type: 'particle',
            id: `part-${c.slug}-${ex.id}`,
            title: `${c.title} • ${ex.title}`,
            subtitle: `Particle variant ${ex.id}.tsx`,
            slug: c.slug,
            particleId: ex.id,
          });
        }
      });
    });

    return list.slice(0, 40); // Top 40 results
  }, [components, query]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % Math.max(1, items.length));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + items.length) % Math.max(1, items.length));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (items[selectedIndex]) {
          const item = items[selectedIndex];
          if (item.type === 'component') {
            onSelectComponent(item.slug);
          } else if (item.particleId && onSelectParticle) {
            onSelectParticle(item.slug, item.particleId);
          } else {
            onSelectComponent(item.slug);
          }
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, items, selectedIndex, onClose, onSelectComponent, onSelectParticle]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-150">
      <div
        className="w-full max-w-2xl rounded-2xl border border-border bg-popover shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 border-b border-border/80 px-4 py-3 bg-muted/20">
          <Search className="size-5 text-muted-foreground shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search all 57 components and 550+ particles..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            className="flex-1 bg-transparent text-sm sm:text-base text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1 rounded text-muted-foreground hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-2 divide-y divide-border/20">
          {items.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              No components or particles match "{query}".
            </div>
          ) : (
            <div className="space-y-1">
              {items.map((item, index) => {
                const isSelected = index === selectedIndex;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      if (item.type === 'component') {
                        onSelectComponent(item.slug);
                      } else if (item.particleId && onSelectParticle) {
                        onSelectParticle(item.slug, item.particleId);
                      } else {
                        onSelectComponent(item.slug);
                      }
                      onClose();
                    }}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left transition-all ${
                      isSelected
                        ? 'bg-accent text-foreground shadow-xs'
                        : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`flex size-8 shrink-0 items-center justify-center rounded-lg border ${
                          item.type === 'component'
                            ? 'border-border/80 bg-background text-primary'
                            : 'border-amber-500/20 bg-amber-500/10 text-amber-500'
                        }`}
                      >
                        {item.type === 'component' ? (
                          <BookOpen className="size-4" />
                        ) : (
                          <Sparkles className="size-4" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium text-sm text-foreground truncate">{item.title}</div>
                        <div className="text-xs text-muted-foreground truncate">{item.subtitle}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] uppercase tracking-wider font-mono px-2 py-0.5 rounded bg-muted text-muted-foreground">
                        {item.type}
                      </span>
                      {isSelected && <CornerDownLeft className="size-3.5 text-primary" />}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-border/60 bg-muted/10 px-4 py-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="rounded bg-muted px-1 font-mono text-[10px]">↑</kbd>
              <kbd className="rounded bg-muted px-1 font-mono text-[10px]">↓</kbd> to navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="rounded bg-muted px-1.5 font-mono text-[10px]">↵</kbd> to select
            </span>
          </div>
          <div>{items.length} results</div>
        </div>
      </div>
    </div>
  );
};
