import React from 'react';
import { Moon, Sun, ArrowLeft, Github, Search } from 'lucide-react';

interface ShadcnSpaceHeaderProps {
  onNavigateHome: () => void;
  onSwitchToCossUi: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  activeCategory: string | null;
  onSelectCategory: (cat: string | null) => void;
  totalComponents: number;
  onOpenSearch?: () => void;
}

export const ShadcnSpaceHeader: React.FC<ShadcnSpaceHeaderProps> = ({
  onNavigateHome,
  onSwitchToCossUi,
  darkMode,
  onToggleDarkMode,
  activeCategory,
  totalComponents,
  onOpenSearch,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/70 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-14 sm:h-16 items-center justify-between px-4 sm:px-6 max-w-[1440px]">
        {/* Left: Distilled Brand & Context Breadcrumb */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onNavigateHome}
            className="flex items-center gap-2.5 hover:opacity-85 transition-opacity cursor-pointer group text-left"
          >
            <div className="size-6 sm:size-7 rounded-full bg-[#FFE600] shrink-0 shadow-2xs" />
            <span className="font-extrabold text-lg sm:text-xl tracking-tight text-foreground">
              shadcnspace.
            </span>
          </button>

          {/* Context indicator */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-muted-foreground/40">/</span>
            {activeCategory ? (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={onNavigateHome}
                  className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer hidden sm:inline font-medium"
                >
                  Components
                </button>
                <span className="text-muted-foreground/40 hidden sm:inline">/</span>
                <span className="font-semibold text-foreground capitalize">
                  {activeCategory.replace(/-/g, ' ')}
                </span>
              </div>
            ) : (
              <span className="rounded-full bg-muted px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
                {totalComponents} Components
              </span>
            )}
          </div>
        </div>

        {/* Right: Distilled Utilities (No dummy links or fake badges) */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Quick Search Trigger */}
          {onOpenSearch && (
            <button
              type="button"
              onClick={onOpenSearch}
              className="inline-flex items-center gap-2 h-8 px-2.5 rounded-lg border border-border/70 bg-muted/30 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors cursor-pointer mr-1"
            >
              <Search className="size-3.5" />
              <span className="hidden sm:inline">Search...</span>
              <kbd className="hidden sm:inline-block rounded border border-border/80 bg-background px-1 py-0.2 text-[10px] font-mono text-muted-foreground">
                ⌘K
              </kbd>
            </button>
          )}

          {/* Theme Toggle */}
          <button
            type="button"
            onClick={onToggleDarkMode}
            className="inline-flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
            aria-label="Toggle theme"
          >
            {darkMode ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </button>

          {/* GitHub Repository */}
          <a
            href="https://github.com/sheikhshariarnehal/coss-ui"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            aria-label="GitHub Repository"
          >
            <Github className="size-4" />
          </a>

          {/* Divider */}
          <div className="h-4 w-px bg-border/60 mx-1 hidden sm:block" />

          {/* Return to Coss UI */}
          <button
            type="button"
            onClick={onSwitchToCossUi}
            className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg border border-border/80 bg-card hover:bg-accent text-xs font-semibold text-foreground transition-all cursor-pointer shadow-2xs"
            title="Switch back to Coss UI components"
          >
            <ArrowLeft className="size-3.5" />
            <span>Coss UI</span>
          </button>
        </div>
      </div>
    </header>
  );
};
