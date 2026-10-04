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
        <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-4 space-y-6">
          {/* Overview Group */}
          <div className="space-y-1">
            <div className="flex h-7 items-center rounded-lg font-medium text-xs text-sidebar-accent-foreground">
              Overview
            </div>
            <ul className="flex flex-col gap-0.5">
              {OVERVIEW_ITEMS.map((item) => {
                const isActive = selectedOverview === item.id;
                const href = `/ui/docs/${item.id}`;
                return (
                  <li key={item.id}>
                    <a
                      href={href}
                      onClick={(e) => {
                        if (!e.metaKey && !e.ctrlKey) {
                          e.preventDefault();
                          onSelectOverview(item.id);
                          onCloseMobile();
                        }
                      }}
                      className={`flex w-full items-center justify-between rounded-lg px-3.5 py-1.5 text-left text-sm transition-colors ${
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
          <div className="space-y-1">
            <div className="flex h-7 items-center justify-between rounded-lg font-medium text-xs text-sidebar-accent-foreground">
              <span>Components</span>
            </div>
            <ul className="flex flex-col gap-0.5">
              {filteredComponents.map((comp) => {
                const isActive = selectedOverview === null && selectedSlug === comp.slug;
                const href = `/ui/docs/components/${comp.slug}`;
                return (
                  <li key={comp.slug}>
                    <a
                      href={href}
                      onClick={(e) => {
                        if (!e.metaKey && !e.ctrlKey) {
                          e.preventDefault();
                          onSelectComponent(comp.slug);
                          onCloseMobile();
                        }
                      }}
                      className={`flex w-full items-center justify-between rounded-lg px-3.5 py-1.5 text-left text-sm transition-colors ${
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
