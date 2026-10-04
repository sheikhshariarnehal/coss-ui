import React from 'react';
import { OriginTopBanner } from './OriginTopBanner';
import { OriginHeader } from './OriginHeader';
import { OriginHomePage } from './OriginHomePage';
import { OriginCategoryPage } from './OriginCategoryPage';

interface OriginPageProps {
  selectedCategory: string | null;
  onSelectCategory: (slug: string | null) => void;
  onSwitchToCossUi: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenSearch: () => void;
}

export const OriginPage: React.FC<OriginPageProps> = ({
  selectedCategory,
  onSelectCategory,
  onSwitchToCossUi,
  darkMode,
  onToggleDarkMode,
  onOpenSearch,
}) => {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* 1:1 Origin Top Announcement Banner */}
      <OriginTopBanner onSwitchToCossUi={onSwitchToCossUi} />

      {/* 1:1 Origin Brand Header */}
      <OriginHeader
        onNavigateHome={() => onSelectCategory(null)}
        onSwitchToCossUi={onSwitchToCossUi}
        darkMode={darkMode}
        onToggleDarkMode={onToggleDarkMode}
        activeCategory={selectedCategory}
      />

      {/* Main Page Content */}
      <main className="flex-1">
        {selectedCategory ? (
          <OriginCategoryPage
            slug={selectedCategory}
            onBackToHome={() => onSelectCategory(null)}
            onSelectCategory={onSelectCategory}
          />
        ) : (
          <OriginHomePage
            onSelectCategory={onSelectCategory}
            onOpenSearch={onOpenSearch}
            darkMode={darkMode}
          />
        )}
      </main>
    </div>
  );
};
