import React, { useState, useEffect } from 'react';
import { COMPONENTS_LIST, TOTAL_PARTICLES } from './data/components-list';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { ComponentDocsViewer } from './components/ComponentDocsViewer';
import { ParticlesGallery } from './components/ParticlesGallery';
import { SearchModal } from './components/SearchModal';
import { OverviewPage } from './components/OverviewPage';

const OVERVIEW_SLUGS = [
  'introduction',
  'get-started',
  'styling',
  'radix-migration',
  'skills',
  'changelog',
  'roadmap',
];

function parseCurrentRoute(): {
  tab: 'docs' | 'particles';
  componentSlug: string;
  overviewId: string | null;
} {
  const pathname = window.location.pathname.replace(/\/$/, '') || '/';

  if (
    pathname === '/ui/particles' ||
    pathname === '/particles' ||
    pathname.startsWith('/ui/particles') ||
    pathname.startsWith('/particles')
  ) {
    return { tab: 'particles', componentSlug: 'accordion', overviewId: null };
  }

  // Check /ui/docs/components/:slug or /docs/components/:slug or /components/:slug
  const compMatch = pathname.match(/^(?:\/ui)?(?:\/docs)?\/components\/([a-z0-9-]+)/i);
  if (compMatch) {
    const slug = compMatch[1].toLowerCase();
    if (COMPONENTS_LIST.some((c) => c.slug === slug)) {
      return { tab: 'docs', componentSlug: slug, overviewId: null };
    }
  }

  // Check /ui/docs/:overviewId or /docs/:overviewId
  const overviewMatch = pathname.match(/^(?:\/ui)?(?:\/docs)?\/([a-z0-9-]+)/i);
  if (overviewMatch) {
    const id = overviewMatch[1].toLowerCase();
    if (OVERVIEW_SLUGS.includes(id)) {
      return { tab: 'docs', componentSlug: 'accordion', overviewId: id };
    }
    if (COMPONENTS_LIST.some((c) => c.slug === id)) {
      return { tab: 'docs', componentSlug: id, overviewId: null };
    }
  }

  return { tab: 'docs', componentSlug: 'accordion', overviewId: null };
}

export function App() {
  const initialRoute = parseCurrentRoute();
  const [activeTab, setActiveTab] = useState<'docs' | 'particles'>(initialRoute.tab);
  const [selectedSlug, setSelectedSlug] = useState<string>(initialRoute.componentSlug);
  const [selectedOverview, setSelectedOverview] = useState<string | null>(initialRoute.overviewId);
  const [isDark, setIsDark] = useState<boolean>(true);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

  // Sync route on initial load if at root /
  useEffect(() => {
    const pathname = window.location.pathname;
    if (pathname === '/' || pathname === '' || pathname === '/ui' || pathname === '/ui/docs') {
      window.history.replaceState(null, '', '/ui/docs/components/accordion');
    }
  }, []);

  // Listen to browser Back/Forward navigation
  useEffect(() => {
    const handlePopState = () => {
      const route = parseCurrentRoute();
      setActiveTab(route.tab);
      setSelectedSlug(route.componentSlug);
      setSelectedOverview(route.overviewId);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Sync document title
  useEffect(() => {
    if (activeTab === 'particles') {
      document.title = 'Particles - coss ui';
    } else if (selectedOverview) {
      const formatted = selectedOverview
        .split('-')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
      document.title = `${formatted} - coss ui`;
    } else {
      const comp = COMPONENTS_LIST.find((c) => c.slug === selectedSlug);
      document.title = `${comp ? comp.title : 'Components'} - coss ui`;
    }
  }, [activeTab, selectedOverview, selectedSlug]);

  // Sync theme with document element
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDark]);

  // Global ⌘K / Ctrl+K shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleTheme = () => setIsDark((prev) => !prev);

  const handleSelectComponent = (slug: string) => {
    setSelectedSlug(slug);
    setSelectedOverview(null);
    setActiveTab('docs');
    window.history.pushState(null, '', `/ui/docs/components/${slug}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectOverview = (id: string) => {
    setSelectedOverview(id);
    setActiveTab('docs');
    window.history.pushState(null, '', `/ui/docs/${id}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTabChange = (tab: 'docs' | 'particles') => {
    setActiveTab(tab);
    if (tab === 'particles') {
      window.history.pushState(null, '', '/ui/particles');
    } else {
      const url = selectedOverview
        ? `/ui/docs/${selectedOverview}`
        : `/ui/docs/components/${selectedSlug}`;
      window.history.pushState(null, '', url);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentComponent =
    COMPONENTS_LIST.find((c) => c.slug === selectedSlug) || COMPONENTS_LIST[0];

  return (
    <div className="relative isolate flex min-h-screen flex-col bg-sidebar font-sans text-foreground antialiased selection:bg-neutral-800 selection:text-white">
      {/* Crisp vertical boundary lines flanking the central container */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-y-0 left-1/2 -translate-x-1/2 w-full max-w-[1416px] z-50 border-x border-border hidden sm:block"
      >
        {/* Decorative corner anchor boxes at the header line intersection */}
        <div className="absolute top-[3.75rem] -left-[4.5px] size-2 rounded-[2px] border border-border bg-popover shadow-xs" />
        <div className="absolute top-[3.75rem] -right-[4.5px] size-2 rounded-[2px] border border-border bg-popover shadow-xs" />
      </div>

      {/* Full-width sticky header with horizontal bottom line */}
      <Header
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        isDark={isDark}
        toggleTheme={toggleTheme}
        onOpenSearch={() => setIsSearchOpen(true)}
        onToggleMobileSidebar={() => setIsMobileSidebarOpen((prev) => !prev)}
        totalParticles={TOTAL_PARTICLES}
      />

      {/* Main Container */}
      {activeTab === 'docs' ? (
        <div className="container relative flex-1 flex w-full max-w-[1416px] px-0">
          {/* Left Sidebar with right border line */}
          <Sidebar
            components={COMPONENTS_LIST}
            selectedSlug={selectedSlug}
            onSelectComponent={handleSelectComponent}
            selectedOverview={selectedOverview}
            onSelectOverview={handleSelectOverview}
            isOpenMobile={isMobileSidebarOpen}
            onCloseMobile={() => setIsMobileSidebarOpen(false)}
          />

          {/* Main Docs Content Canvas */}
          <div className="flex-1 min-w-0 min-h-[calc(100vh-4rem)]">
            {selectedOverview ? (
              <OverviewPage
                overviewId={selectedOverview}
                onExploreComponents={() => handleSelectComponent('accordion')}
                onExploreParticles={() => handleTabChange('particles')}
              />
            ) : (
              <ComponentDocsViewer component={currentComponent} />
            )}
          </div>
        </div>
      ) : (
        /* Particles Gallery Page */
        <div className="container relative flex-1 w-full max-w-[1416px]">
          <ParticlesGallery
            components={COMPONENTS_LIST}
            onSelectComponent={handleSelectComponent}
          />
        </div>
      )}

      {/* Global ⌘K Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        components={COMPONENTS_LIST}
        onSelectComponent={handleSelectComponent}
        onSelectParticle={(slug) => handleSelectComponent(slug)}
      />
    </div>
  );
}

export default App;
