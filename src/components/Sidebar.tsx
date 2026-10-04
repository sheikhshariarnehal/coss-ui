import React, { useState, useMemo } from 'react';
import { ComponentMeta } from '../data/components-list';
import { X } from 'lucide-react';

interface SidebarProps {
  components: ComponentMeta[];
  selectedSlug: string;
  onSelectComponent: (slug: string) => void;
  selectedOverview: string | null;
  onSelectOverview: (id: string) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

const OVERVIEW_ITEMS = [
  { id: 'introduction', label: 'Introduction' },
  { id: 'get-started', label: 'Get Started' },
  { id: 'styling', label: 'Styling' },
  { id: 'radix-migration', label: 'Migrating from Radix' },
  { id: 'skills', label: 'Skills' },
  { id: 'changelog', label: 'Changelog' },
  { id: 'roadmap', label: 'Roadmap' },
];

export const Sidebar: React.FC<SidebarProps> = ({
  components,
  selectedSlug,
  onSelectComponent,
  selectedOverview,
  onSelectOverview,
  isOpenMobile,
  onCloseMobile,
}) => {
  const [filterQuery, setFilterQuery] = useState('');

  const filteredComponents = useMemo(() => {
    if (!filterQuery.trim()) return components;
    const q = filterQuery.toLowerCase();
    return components.filter(
      (c) => c.title.toLowerCase().includes(q) || c.slug.toLowerCase().includes(q)
    );
  }, [components, filterQuery]);

  return (
    <>
      {/* Mobile backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-16 bottom-0 z-50 flex w-64 shrink-0 flex-col bg-sidebar/95 lg:bg-transparent transition-transform duration-300 lg:sticky lg:top-16 lg:z-30 lg:h-[calc(100vh-4rem)] lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Mobile Header */}
        <div className="flex items-center justify-between border-b border-border/64 p-4 lg:hidden">
          <span className="font-semibold text-sm">Navigation</span>
          <button
            type="button"
            onClick={onCloseMobile}
            className="flex size-8 items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col gap-2 px-4 py-2">
          <div className="h-4 shrink-0 hidden lg:block" />

          {/* Overview Group */}
          <div className="relative flex w-full min-w-0 flex-col p-2 gap-1">
            <div className="flex shrink-0 items-center rounded-lg font-medium text-xs h-7 px-0 text-sidebar-accent-foreground">
              Overview
            </div>
            <ul className="flex w-full min-w-0 flex-col gap-0.5">
              {OVERVIEW_ITEMS.map((item) => {
                const isActive = selectedOverview === item.id;
                const href = `/ui/docs/${item.id}`;
                return (
                  <li key={item.id} className="relative">
                    <a
                      href={href}
                      onClick={(e) => {
                        if (!e.metaKey && !e.ctrlKey) {
                          e.preventDefault();
                          onSelectOverview(item.id);
                          onCloseMobile();
                        }
                      }}
                      className={`peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-lg p-2 text-left h-8 text-sm transition-colors ps-3.5 ${
                        isActive
                          ? 'bg-sidebar-accent font-medium text-sidebar-accent-foreground'
                          : 'text-muted-foreground hover:text-sidebar-accent-foreground hover:bg-transparent'
                      }`}
                    >
                      <span className="truncate">{item.label}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Components Group */}
          <div className="relative flex w-full min-w-0 flex-col p-2 gap-1">
            <div className="flex shrink-0 items-center rounded-lg font-medium text-xs h-7 px-0 text-sidebar-accent-foreground">
              <span>Components</span>
            </div>
            <ul className="flex w-full min-w-0 flex-col gap-0.5">
              {filteredComponents.map((comp) => {
                const isActive = selectedOverview === null && selectedSlug === comp.slug;
                const href = `/ui/docs/components/${comp.slug}`;
                return (
                  <li key={comp.slug} className="relative">
                    <a
                      href={href}
                      onClick={(e) => {
                        if (!e.metaKey && !e.ctrlKey) {
                          e.preventDefault();
                          onSelectComponent(comp.slug);
                          onCloseMobile();
                        }
                      }}
                      className={`peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-lg p-2 text-left h-8 text-sm transition-colors ps-3.5 ${
                        isActive
                          ? 'bg-sidebar-accent font-medium text-sidebar-accent-foreground'
                          : 'text-muted-foreground hover:text-sidebar-accent-foreground hover:bg-transparent'
                      }`}
                    >
                      <span className="truncate">{comp.title}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </aside>
    </>
  );
};
