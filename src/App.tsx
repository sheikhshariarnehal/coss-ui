import React, { useState, useEffect } from 'react';
import { COMPONENTS_LIST, TOTAL_PARTICLES } from './data/components-list';
import { BLOCKS_DATA } from './data/blocks-list';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { ComponentDocsViewer } from './components/ComponentDocsViewer';
import { ParticlesGallery } from './components/ParticlesGallery';
import { BlocksGallery } from './components/BlocksGallery';
import { SearchModal } from './components/SearchModal';
import { OverviewPage } from './components/OverviewPage';
import { OriginPage } from './origin/OriginPage';

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
  tab: 'docs' | 'particles' | 'blocks' | 'origin';
  componentSlug: string;
  overviewId: string | null;
  blockSlug: string | null;
  originCategory: string | null;
} {
  const pathname = window.location.pathname.replace(/\/$/, '') || '/';

  // Check /origin or /origin/:category
  const originMatch = pathname.match(/^\/origin(?:\/([a-z0-9-]+))?/i);
  if (originMatch) {
    const cat = originMatch[1] ? originMatch[1].toLowerCase() : null;
    return { tab: 'origin', componentSlug: 'accordion', overviewId: null, blockSlug: null, originCategory: cat };
  }

  if (
    pathname === '/ui/particles' ||
    pathname === '/particles' ||
    pathname.startsWith('/ui/particles') ||
    pathname.startsWith('/particles')
  ) {
    return { tab: 'particles', componentSlug: 'accordion', overviewId: null, blockSlug: null, originCategory: null };
  }

  // Check /ui/blocks or /blocks or /ui/blocks/:slug
  const blockMatch = pathname.match(/^(?:\/ui)?\/blocks(?:\/([a-z0-9-]+))?/i);
  if (blockMatch) {
    const slug = blockMatch[1] ? blockMatch[1].toLowerCase() : null;
    return { tab: 'blocks', componentSlug: 'accordion', overviewId: null, blockSlug: slug, originCategory: null };
  }

  // Check /ui/docs/components/:slug or /docs/components/:slug or /components/:slug
  const compMatch = pathname.match(/^(?:\/ui)?(?:\/docs)?\/components\/([a-z0-9-]+)/i);
  if (compMatch) {
    const slug = compMatch[1].toLowerCase();
    if (COMPONENTS_LIST.some((c) => c.slug === slug)) {
      return { tab: 'docs', componentSlug: slug, overviewId: null, blockSlug: null, originCategory: null };
    }
  }

  // Check /ui/docs/:overviewId or /docs/:overviewId
  const overviewMatch = pathname.match(/^(?:\/ui)?(?:\/docs)?\/([a-z0-9-]+)/i);
  if (overviewMatch) {
    const id = overviewMatch[1].toLowerCase();
    if (OVERVIEW_SLUGS.includes(id)) {
      return { tab: 'docs', componentSlug: 'accordion', overviewId: id, blockSlug: null, originCategory: null };
    }
    if (COMPONENTS_LIST.some((c) => c.slug === id)) {
      return { tab: 'docs', componentSlug: id, overviewId: null, blockSlug: null, originCategory: null };
    }
  }

  return { tab: 'docs', componentSlug: 'accordion', overviewId: null, blockSlug: null, originCategory: null };
}

export function App() {
  const initialRoute = parseCurrentRoute();
  const [activeTab, setActiveTab] = useState<'docs' | 'particles' | 'blocks' | 'origin'>(initialRoute.tab);
  const [selectedSlug, setSelectedSlug] = useState<string>(initialRoute.componentSlug);
  const [selectedOverview, setSelectedOverview] = useState<string | null>(initialRoute.overviewId);
  const [selectedBlockSlug, setSelectedBlockSlug] = useState<string | null>(initialRoute.blockSlug);
  const [selectedOriginCategory, setSelectedOriginCategory] = useState<string | null>(initialRoute.originCategory);
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
      setSelectedBlockSlug(route.blockSlug);
      setSelectedOriginCategory(route.originCategory);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Sync document title
  useEffect(() => {
    if (activeTab === 'origin') {
      if (selectedOriginCategory) {
        const formatted = selectedOriginCategory
          .split('-')
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(' ');
        document.title = `${formatted} - coss.com origin`;
      } else {
        document.title = 'Origin - Beautiful UI components - coss.com';
      }
    } else if (activeTab === 'particles') {
      document.title = 'Particles - coss ui';
    } else if (activeTab === 'blocks') {
      if (selectedBlockSlug) {
        const blk = BLOCKS_DATA.find((b) => b.slug === selectedBlockSlug);
        document.title = `${blk ? blk.name : 'Block'} - Blocks - coss ui`;
      } else {
        document.title = 'Interactive Blocks - coss ui';
      }
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
  }, [activeTab, selectedOverview, selectedSlug, selectedBlockSlug]);

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
    setSelectedBlockSlug(null);
    setActiveTab('docs');
    window.history.pushState(null, '', `/ui/docs/components/${slug}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectOverview = (id: string) => {
    setSelectedOverview(id);
    setSelectedBlockSlug(null);
    setActiveTab('docs');
    window.history.pushState(null, '', `/ui/docs/${id}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectBlock = (slug: string | null) => {
    setSelectedBlockSlug(slug);
    if (slug) {
      window.history.pushState(null, '', `/ui/blocks/${slug}`);
    } else {
      window.history.pushState(null, '', '/ui/blocks');
    }
  };

  const handleSelectOriginCategory = (slug: string | null) => {
    setSelectedOriginCategory(slug);
    setActiveTab('origin');
    if (slug) {
      window.history.pushState(null, '', `/origin/${slug}`);
    } else {
      window.history.pushState(null, '', '/origin');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTabChange = (tab: 'docs' | 'particles' | 'blocks' | 'origin') => {
    setActiveTab(tab);
    if (tab === 'origin') {
      setSelectedBlockSlug(null);
      const url = selectedOriginCategory ? `/origin/${selectedOriginCategory}` : '/origin';
      window.history.pushState(null, '', url);
    } else if (tab === 'particles') {
      setSelectedBlockSlug(null);
      window.history.pushState(null, '', '/ui/particles');
    } else if (tab === 'blocks') {
      window.history.pushState(null, '', '/ui/blocks');
    } else {
      setSelectedBlockSlug(null);
      const url = selectedOverview
        ? `/ui/docs/${selectedOverview}`
        : `/ui/docs/components/${selectedSlug}`;
      window.history.pushState(null, '', url);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentComponent =
    COMPONENTS_LIST.find((c) => c.slug === selectedSlug) || COMPONENTS_LIST[0];

  // If in Origin tab, render the full authentic 1:1 Origin UI Experience
  if (activeTab === 'origin') {
    return (
      <div className={isDark ? 'dark' : ''}>
        <OriginPage
          selectedCategory={selectedOriginCategory}
          onSelectCategory={handleSelectOriginCategory}
          onSwitchToCossUi={() => handleTabChange('docs')}
          darkMode={isDark}
          onToggleDarkMode={toggleTheme}
          onOpenSearch={() => setIsSearchOpen(true)}
        />
        {/* Global ⌘K Search Modal */}
        <SearchModal
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
          components={COMPONENTS_LIST}
          onSelectComponent={handleSelectComponent}
          onSelectParticle={(slug) => handleSelectComponent(slug)}
          onSelectBlock={(slug) => {
            setActiveTab('blocks');
            handleSelectBlock(slug);
          }}
        />
      </div>
    );
  }

  return (
    <div className="relative isolate flex min-h-screen flex-col bg-sidebar font-sans text-foreground antialiased selection:bg-neutral-800 selection:text-white">
      {/* Crisp subtle vertical boundary lines matching coss.com */}
      <div
        aria-hidden="true"
        className="container pointer-events-none fixed inset-0 z-45 before:absolute before:inset-y-0 before:-left-3 before:w-px before:bg-border/64 after:absolute after:inset-y-0 after:-right-3 after:w-px after:bg-border/64 hidden sm:block"
      >
        {/* Decorative corner anchor boxes at the header line intersection */}
        <div className="absolute top-[calc(4rem-4.5px)] -left-[15.5px] size-2 rounded-[2px] border border-border bg-popover shadow-xs/5" />
        <div className="absolute top-[calc(4rem-4.5px)] -right-[15.5px] size-2 rounded-[2px] border border-border bg-popover shadow-xs/5" />
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
        totalBlocks={BLOCKS_DATA.length}
      />

      {/* Main Container */}
      {activeTab === 'docs' ? (
        <main className="flex flex-1 flex-col">
          <div className="group/sidebar-wrapper flex w-full container min-h-min flex-1 items-start px-0 lg:grid lg:grid-cols-[16rem_minmax(0,1fr)]">
            {/* Left Sidebar */}
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
            <div className="h-full w-full min-w-0">
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
        </main>
      ) : activeTab === 'blocks' ? (
        /* Blocks Gallery Page */
        <div className="container relative flex-1 w-full max-w-[1416px] px-4 sm:px-6">
          <BlocksGallery
            selectedSlug={selectedBlockSlug}
            onSelectBlock={handleSelectBlock}
          />
        </div>
      ) : (
        /* Particles Gallery Page */
        <div className="container relative flex-1 w-full max-w-[1416px] px-4 sm:px-6">
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
        onSelectBlock={(slug) => {
          setActiveTab('blocks');
          handleSelectBlock(slug);
        }}
      />
    </div>
  );
}

export default App;
