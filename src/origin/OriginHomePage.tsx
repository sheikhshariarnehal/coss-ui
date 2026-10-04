import React, { useState } from 'react';
import { categories, ComponentCategory } from './components-config';
import { Search } from 'lucide-react';

interface OriginHomePageProps {
  onSelectCategory: (slug: string) => void;
  onOpenSearch: () => void;
  darkMode: boolean;
}

export const OriginHomePage: React.FC<OriginHomePageProps> = ({
  onSelectCategory,
  onOpenSearch,
  darkMode,
}) => {
  const [filterQuery, setFilterQuery] = useState('');

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
    cat.slug.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div className="w-full pb-24">
      {/* Hero Section matching coss.com/origin screenshot 2 */}
      <div className="max-w-[1416px] mx-auto px-4 sm:px-6 pt-12 pb-14">
        <div className="max-w-3xl">
          <h1 className="font-heading text-4xl/[1.1] sm:text-5xl/[1.1] md:text-6xl/[1.1] font-bold tracking-tight text-foreground">
            Beautiful UI components built with Tailwind CSS and React.
          </h1>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground">
            An open-source collection of copy-and-paste components for quickly build application UIs.
          </p>

          {/* Quick Search Button */}
          <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={onOpenSearch}
              className="group flex h-10 w-full max-w-sm items-center justify-between rounded-xl border border-border/80 bg-muted/40 px-3.5 text-sm text-muted-foreground hover:border-border hover:bg-muted/60 transition-all cursor-pointer shadow-xs"
            >
              <div className="flex items-center gap-2">
                <Search className="size-4 opacity-70 group-hover:opacity-100" />
                <span>Quick search...</span>
              </div>
              <kbd className="rounded border border-border bg-background px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground shadow-xs">
                ⌘K
              </kbd>
            </button>

            {/* Optional category inline filter */}
            <input
              type="text"
              placeholder="Filter categories..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              className="h-10 w-full max-w-xs rounded-xl border border-border/80 bg-background px-3.5 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-ring focus:ring-1 focus:ring-ring"
            />
          </div>
        </div>

        {/* Categories Grid matching coss.com/origin */}
        <div className="relative my-14">
          <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filteredCategories.map((category) => {
              const compCount = category.components.length;
              const thumbLight = `/origin/thumbs/${category.slug}.png`;
              const thumbDark = `/origin/thumbs/${category.slug}-dark.png`;

              return (
                <div
                  key={category.slug}
                  onClick={() => onSelectCategory(category.slug)}
                  className="group flex flex-col space-y-3 text-center cursor-pointer"
                >
                  {/* Thumbnail Card Container */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-950/20 dark:bg-zinc-900/40 transition-all duration-200 group-hover:border-zinc-400 dark:group-hover:border-zinc-700 group-hover:shadow-md">
                    {/* New Badge */}
                    {category.isNew && (
                      <span className="absolute top-3 left-3 z-10 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-400 border border-emerald-500/20">
                        New
                      </span>
                    )}

                    {/* Image with fallback */}
                    <img
                      src={darkMode ? thumbDark : thumbLight}
                      alt={`${category.name} components`}
                      className="size-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.02]"
                      onError={(e) => {
                        // fallback to dark or placeholder if image fails
                        const target = e.currentTarget;
                        if (!target.src.includes('-dark.png')) {
                          target.src = thumbDark;
                        }
                      }}
                    />
                  </div>

                  {/* Title & Count */}
                  <div>
                    <h2 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                      {category.name}
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      {compCount} {compCount === 1 ? 'Component' : 'Components'}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
