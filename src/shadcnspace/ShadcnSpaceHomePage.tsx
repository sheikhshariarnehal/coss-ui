import React, { useState, useMemo } from 'react';
import { Search, ArrowRight } from 'lucide-react';
import { SHADCNSPACE_COMPONENTS, SHADCNSPACE_CATEGORIES } from '../data/shadcnspace-list';
import { SHADCNSPACE_CATEGORY_META } from '../data/shadcnspace-thumbnails';

interface ShadcnSpaceHomePageProps {
  onSelectCategory: (category: string) => void;
}

export const ShadcnSpaceHomePage: React.FC<ShadcnSpaceHomePageProps> = ({
  onSelectCategory,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Fallback stats by category from registry
  const categoryStats = useMemo(() => {
    const stats: Record<string, number> = {};
    for (const c of SHADCNSPACE_COMPONENTS) {
      stats[c.category] = (stats[c.category] || 0) + 1;
    }
    return stats;
  }, []);

  const filteredCategories = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return SHADCNSPACE_CATEGORIES;
    return SHADCNSPACE_CATEGORIES.filter((cat) => {
      const meta = SHADCNSPACE_CATEGORY_META[cat];
      const title = meta?.title?.toLowerCase() || cat.toLowerCase();
      return (
        title.includes(q) ||
        cat.toLowerCase().includes(q) ||
        cat.replace(/-/g, ' ').includes(q)
      );
    });
  }, [searchQuery]);

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:py-10 max-w-[1440px]">
      {/* Search Bar Row (Right-aligned, matching screenshot) */}
      <div className="mb-8 flex items-center justify-end">
        <div className="relative w-full sm:w-72 md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            placeholder="Search Components..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-border/80 bg-background py-2 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-foreground/40 focus:outline-none focus:ring-1 focus:ring-ring transition-all"
          />
        </div>
      </div>

      {/* Component Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-6">
        {filteredCategories.map((cat) => {
          const meta = SHADCNSPACE_CATEGORY_META[cat];
          const title =
            meta?.title ||
            cat
              .split('-')
              .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
              .join(' ');

          const isNew = meta?.badge === 'New';
          const count = meta?.count || categoryStats[cat] || 0;
          const imgSrc = meta?.localImage || `/shadcnspace/thumbnails/${cat}.webp`;

          return (
            <div
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className="rounded-lg group bg-card border border-border/80 dark:border-border hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col cursor-pointer"
            >
              {/* Card Image Area with dark background matching screenshot */}
              <div className="relative aspect-[484/290] w-full overflow-hidden bg-neutral-950 flex items-center justify-center">
                <img
                  src={imgSrc}
                  alt={title}
                  loading="lazy"
                  width="484"
                  height="290"
                  decoding="async"
                  onError={(e) => {
                    if (meta?.remoteImage && e.currentTarget.src !== meta.remoteImage) {
                      e.currentTarget.src = meta.remoteImage;
                    }
                  }}
                  className="w-full h-full object-cover group-hover:scale-105 duration-200 transition-all"
                />
              </div>

              {/* Card Info Section */}
              <div className="flex flex-col justify-between items-start w-full flex-1 bg-card">
                {/* Title & Count / Badge */}
                <div className="py-5 px-6 w-full">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-foreground tracking-tight">
                      {title}
                    </h2>
                    <div className="flex items-center gap-2">
                      {isNew ? (
                        <span className="inline-flex h-5 items-center justify-center rounded-sm bg-foreground text-background text-xs font-semibold px-2 py-0.5">
                          New
                        </span>
                      ) : (
                        <p className="text-base text-muted-foreground font-normal">
                          {count}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* View All Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectCategory(cat);
                  }}
                  className="py-4 px-6 border-t border-border/70 flex items-center justify-between text-muted-foreground group-hover:text-foreground hover:bg-accent/40 text-base font-semibold transition-all w-full cursor-pointer"
                >
                  <span>View All</span>
                  <ArrowRight className="size-4 group-hover:translate-x-1 duration-200 transition-transform" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty Search State */}
      {filteredCategories.length === 0 && (
        <div className="py-24 text-center">
          <p className="text-muted-foreground text-lg mb-4">
            No components found matching "{searchQuery}".
          </p>
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="text-sm font-semibold underline underline-offset-4 hover:text-foreground"
          >
            Clear search
          </button>
        </div>
      )}
    </div>
  );
};
