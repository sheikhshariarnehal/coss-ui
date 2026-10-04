import React from 'react';
import { RiGithubFill, RiTwitterXFill } from '@remixicon/react';
import { Sun, Moon } from 'lucide-react';

interface OriginHeaderProps {
  onNavigateHome: () => void;
  onSwitchToCossUi: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  activeCategory?: string | null;
}

export const OriginHeader: React.FC<OriginHeaderProps> = ({
  onNavigateHome,
  onSwitchToCossUi,
  darkMode,
  onToggleDarkMode,
}) => {
  return (
    <header className="relative border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-[1416px] mx-auto px-4 sm:px-6 h-[72px] flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <button
            onClick={onNavigateHome}
            className="flex items-center gap-1.5 font-heading text-2xl font-bold tracking-tight text-foreground hover:opacity-90 transition-opacity cursor-pointer"
          >
            <span>coss.com</span>
            <span className="text-muted-foreground/70 font-normal">origin</span>
          </button>
        </div>

        {/* Navigation links & Actions */}
        <div className="flex items-center gap-3 sm:gap-6">
          <button
            onClick={onNavigateHome}
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            Components
          </button>
          
          <button
            onClick={onSwitchToCossUi}
            className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-accent/40 px-3 py-1 text-xs font-medium text-foreground hover:bg-accent transition-colors cursor-pointer"
          >
            <span>Switch to Coss UI</span>
          </button>

          <div className="hidden sm:block h-4 w-px bg-border/60" />

          {/* Social Icons */}
          <div className="flex items-center gap-1">
            <a
              href="https://x.com/coss_com"
              target="_blank"
              rel="noreferrer"
              aria-label="X Twitter"
              className="inline-flex size-9 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            >
              <RiTwitterXFill className="size-4" />
            </a>
            <a
              href="https://github.com/sheikhshariarnehal/coss-ui"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              className="inline-flex size-9 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            >
              <RiGithubFill className="size-4" />
            </a>
            <button
              onClick={onToggleDarkMode}
              aria-label="Toggle theme"
              className="inline-flex size-9 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors cursor-pointer"
            >
              {darkMode ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
