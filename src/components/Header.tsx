import React from 'react';
import { Search, Moon, Sun, Menu, Sparkles, BookOpen } from 'lucide-react';

interface HeaderProps {
  activeTab: 'docs' | 'particles' | 'blocks' | 'origin' | 'shadcnspace';
  setActiveTab: (tab: 'docs' | 'particles' | 'blocks' | 'origin' | 'shadcnspace') => void;
  isDark: boolean;
  toggleTheme: () => void;
  onOpenSearch: () => void;
  onToggleMobileSidebar: () => void;
  totalParticles: number;
  totalBlocks?: number;
  totalOrigin?: number;
  totalShadcnSpace?: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  isDark,
  toggleTheme,
  onOpenSearch,
  onToggleMobileSidebar,
  totalParticles,
  totalBlocks = 30,
  totalOrigin = 620,
  totalShadcnSpace = 490,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-sidebar/80 backdrop-blur-md before:absolute before:inset-x-0 before:bottom-0 before:h-px before:bg-border/64">
      <div className="container relative flex h-16 w-full items-center justify-between gap-2 px-4 sm:px-6">
        {/* Mobile Hamburger Menu Trigger */}
        <button
          type="button"
          onClick={onToggleMobileSidebar}
          className="relative inline-flex lg:hidden size-8 items-center justify-center rounded-lg border border-transparent text-foreground hover:bg-accent transition-colors"
          aria-label="Toggle navigation menu"
        >
          <Menu className="size-5" />
        </button>

        {/* Logo */}
        <a
          href="/ui/docs/components/accordion"
          onClick={(e) => {
            if (!e.metaKey && !e.ctrlKey) {
              e.preventDefault();
              setActiveTab('docs');
            }
          }}
          className="flex shrink-0 items-center gap-1.5 font-bold font-heading text-[1.375em] [font-variation-settings:'GEOM'_50,'opsz'_32] sm:text-2xl text-foreground"
        >
          <span>coss.com</span>
          <span className="text-muted-foreground/64 font-normal text-xl">ui</span>
        </a>

        {/* Right Navigation */}
        <div className="ms-auto flex items-center gap-2 md:flex-1 md:justify-end">
          <nav className="items-center gap-1 hidden lg:flex">
            <a
              href="/ui/docs/components/accordion"
              onClick={(e) => {
                if (!e.metaKey && !e.ctrlKey) {
                  e.preventDefault();
                  setActiveTab('docs');
                }
              }}
              className={`relative inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-lg border font-medium text-sm transition-all h-8 px-3 ${
                activeTab === 'docs'
                  ? 'border-transparent bg-accent text-foreground'
                  : 'border-transparent text-muted-foreground hover:bg-accent hover:text-foreground'
              }`}
            >
              Docs
            </a>
            <a
              href="/ui/blocks"
              onClick={(e) => {
                if (!e.metaKey && !e.ctrlKey) {
                  e.preventDefault();
                  setActiveTab('blocks');
                }
              }}
              className={`relative inline-flex shrink-0 cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border font-medium text-sm transition-all h-8 px-3 ${
                activeTab === 'blocks'
                  ? 'border-transparent bg-accent text-foreground'
                  : 'border-transparent text-muted-foreground hover:bg-accent hover:text-foreground'
              }`}
            >
              <span>Blocks</span>
              <span className="rounded-full bg-pink-500/10 px-1.5 py-0.2 text-[11px] font-semibold text-pink-400">
                {totalBlocks}
              </span>
            </a>
            <a
              href="/ui/particles"
              onClick={(e) => {
                if (!e.metaKey && !e.ctrlKey) {
                  e.preventDefault();
                  setActiveTab('particles');
                }
              }}
              className={`relative inline-flex shrink-0 cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border font-medium text-sm transition-all h-8 px-3 ${
                activeTab === 'particles'
                  ? 'border-transparent bg-accent text-foreground'
                  : 'border-transparent text-muted-foreground hover:bg-accent hover:text-foreground'
              }`}
            >
              <span>Components</span>
              <span className="rounded-full bg-primary/10 px-1.5 py-0.2 text-[11px] font-semibold text-primary">
                {totalParticles}
              </span>
            </a>
            <a
              href="/origin"
              onClick={(e) => {
                if (!e.metaKey && !e.ctrlKey) {
                  e.preventDefault();
                  setActiveTab('origin');
                }
              }}
              className={`relative inline-flex shrink-0 cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border font-medium text-sm transition-all h-8 px-3 ${
                activeTab === 'origin'
                  ? 'border-transparent bg-accent text-foreground'
                  : 'border-transparent text-muted-foreground hover:bg-accent hover:text-foreground'
              }`}
            >
              <span>Origin</span>
              <span className="rounded-full bg-amber-500/10 px-1.5 py-0.2 text-[11px] font-semibold text-amber-500">
                {totalOrigin}
              </span>
            </a>
            <a
              href="/shadcnspace"
              onClick={(e) => {
                if (!e.metaKey && !e.ctrlKey) {
                  e.preventDefault();
                  setActiveTab('shadcnspace');
                }
              }}
              className={`relative inline-flex shrink-0 cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border font-medium text-sm transition-all h-8 px-3 ${
                activeTab === 'shadcnspace'
                  ? 'border-transparent bg-accent text-foreground'
                  : 'border-transparent text-muted-foreground hover:bg-accent hover:text-foreground'
              }`}
            >
              <span>Shadcn Space</span>
              <span className="rounded-full bg-emerald-500/10 px-1.5 py-0.2 text-[11px] font-semibold text-emerald-400">
                {totalShadcnSpace}
              </span>
            </a>
          </nav>

          {/* Search Trigger */}
          <div className="mx-2 hidden w-full flex-1 md:flex md:w-auto md:flex-none">
            <button
              type="button"
              onClick={onOpenSearch}
              className="relative inline-flex shrink-0 cursor-pointer items-center justify-between gap-3 whitespace-nowrap rounded-lg border border-input bg-popover text-foreground shadow-xs/5 hover:bg-accent/50 h-8 px-3 sm:text-sm text-muted-foreground transition-all"
            >
              <div className="flex items-center gap-2">
                <Search className="size-4 opacity-80" />
                <span className="text-xs text-muted-foreground">Search docs...</span>
              </div>
              <kbd className="inline-flex items-center gap-1">
                <kbd className="pointer-events-none inline-flex h-5 min-w-5 select-none items-center justify-center rounded bg-muted px-1 font-medium font-sans text-muted-foreground text-[10px]">
                  ⌘
                </kbd>
                <kbd className="pointer-events-none inline-flex h-5 min-w-5 select-none items-center justify-center rounded bg-muted px-1 font-medium font-sans text-muted-foreground text-[10px]">
                  K
                </kbd>
              </kbd>
            </button>
          </div>

          <div className="shrink-0 bg-border/64 h-5 w-px max-md:hidden" />

          {/* GitHub Star Badge */}
          <a
            href="https://github.com/sheikhshariarnehal/coss-ui"
            target="_blank"
            rel="noreferrer"
            className="inline-flex shrink-0 cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border border-transparent text-foreground hover:bg-accent h-8 px-2.5 sm:h-7 text-xs font-medium transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="opacity-80"
            >
              <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
              <path d="M9 18c-4.51 2-5-2-7-2" />
            </svg>
            <span className="text-muted-foreground text-xs tabular-nums">10.6k</span>
          </a>

          {/* Theme Switcher Button */}
          <button
            type="button"
            onClick={toggleTheme}
            className="inline-flex shrink-0 cursor-pointer items-center justify-center rounded-lg border border-transparent text-foreground hover:bg-accent size-8 transition-colors"
            title="Toggle theme"
            aria-label="Toggle theme"
          >
            {isDark ? (
              <Sun className="size-4 opacity-80 text-foreground" />
            ) : (
              <Moon className="size-4 opacity-80 text-foreground" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
