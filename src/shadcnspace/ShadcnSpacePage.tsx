import React from 'react';
import { ShadcnSpaceHeader } from './ShadcnSpaceHeader';
import { ShadcnSpaceHomePage } from './ShadcnSpaceHomePage';
import { ShadcnSpaceCategoryPage } from './ShadcnSpaceCategoryPage';
import { SHADCNSPACE_COMPONENTS } from '../data/shadcnspace-list';

interface ShadcnSpacePageProps {
  selectedCategory: string | null;
  onSelectCategory: (cat: string | null) => void;
  onSwitchToCossUi: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenSearch?: () => void;
}

export const ShadcnSpacePage: React.FC<ShadcnSpacePageProps> = ({
  selectedCategory,
  onSelectCategory,
  onSwitchToCossUi,
  darkMode,
  onToggleDarkMode,
  onOpenSearch,
}) => {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <ShadcnSpaceHeader
        onNavigateHome={() => onSelectCategory(null)}
        onSwitchToCossUi={onSwitchToCossUi}
        darkMode={darkMode}
        onToggleDarkMode={onToggleDarkMode}
        activeCategory={selectedCategory}
        onSelectCategory={onSelectCategory}
        totalComponents={SHADCNSPACE_COMPONENTS.length}
        onOpenSearch={onOpenSearch}
      />

      <main className="flex-1">
        {selectedCategory ? (
          <ShadcnSpaceCategoryPage
            category={selectedCategory}
            onBackToHome={() => onSelectCategory(null)}
            onSelectCategory={(cat) => onSelectCategory(cat)}
          />
        ) : (
          <ShadcnSpaceHomePage
            onSelectCategory={(cat) => onSelectCategory(cat)}
          />
        )}
      </main>
    </div>
  );
};
