import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Sparkles, SlidersHorizontal, ArrowUpRight, Layers, Bookmark, Maximize2, ChevronDown } from 'lucide-react';
import { BLOCKS_DATA, BlockItem } from '../data/blocks-list';
import { BLOCKS_COMPONENTS } from '../blocks';
import { BlockDetailModal } from './BlockDetailModal';

const CATEGORIES = ['All', 'Hover', 'Press', 'Drag', 'Slide', 'Swipe', 'Type', 'Select'] as const;

interface BlocksGalleryProps {
  selectedSlug?: string | null;
  onSelectBlock?: (slug: string | null) => void;
}

export const BlocksGallery: React.FC<BlocksGalleryProps> = ({ selectedSlug, onSelectBlock }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'newest' | 'popular' | 'name'>('newest');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeModalBlock, setActiveModalBlock] = useState<BlockItem | null>(null);

  // Sync with selectedSlug if provided via route
  React.useEffect(() => {
    if (selectedSlug) {
      const match = BLOCKS_DATA.find((b) => b.slug === selectedSlug);
      if (match) setActiveModalBlock(match);
    } else {
      setActiveModalBlock(null);
    }
  }, [selectedSlug]);

  const filteredBlocks = useMemo(() => {
    let items = BLOCKS_DATA.filter((block) => {
      const matchesCategory = selectedCategory === 'All' || block.category.toLowerCase() === selectedCategory.toLowerCase();
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        block.name.toLowerCase().includes(q) ||
        block.description.toLowerCase().includes(q) ||
        block.tags.some((t) => t.toLowerCase().includes(q));
      return matchesCategory && matchesQuery;
    });

    if (sortBy === 'name') {
      items.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'popular') {
      items.sort((a, b) => b.id.localeCompare(a.id));
    }

    return items;
  }, [selectedCategory, searchQuery, sortBy]);

  const handleOpenBlock = (block: BlockItem) => {
    setActiveModalBlock(block);
    if (onSelectBlock) {
      onSelectBlock(block.slug);
    }
  };

  const handleCloseModal = () => {
    setActiveModalBlock(null);
    if (onSelectBlock) {
      onSelectBlock(null);
    }
  };

  return (
    <div className="bencho-root w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 font-sans select-none">
      {/* Hero Section matching bencho.dev */}
      <div className="mb-12 md:mb-16 text-center flex flex-col items-center">
        {/* Count Badge */}
        <div className="mb-5 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white dark:bg-[#18191d] border border-black/5 dark:border-white/10 text-xs font-semibold text-neutral-800 dark:text-neutral-200 shadow-xs">
          <span>{BLOCKS_DATA.length} interactive blocks</span>
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-neutral-950 dark:text-white tracking-tight mb-4">
          Interactive UI Components
        </h1>

        {/* Subtitle */}
        <p className="text-sm sm:text-base text-neutral-500 dark:text-neutral-400 max-w-xl leading-relaxed mb-6">
          A library of interactive React components and micro-interactions you can explore and take straight into your projects.
        </p>

        {/* Action Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              const el = document.getElementById('blocks-grid');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-6 py-2.5 rounded-full bg-neutral-950 text-white dark:bg-white dark:text-black font-semibold text-xs shadow-md hover:opacity-90 transition cursor-pointer"
          >
            Explore live blocks
          </button>
        </div>
      </div>

      {/* Filter Category Pills & Sort Bar */}
      <div id="blocks-grid" className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8 pb-2">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`bencho-filter-pill ${isSelected ? 'active' : ''}`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Right Sort Dropdown & Search */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Search Bar */}
          <div className="relative flex-1 md:w-56">
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search blocks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#f0f1f4] dark:bg-[#1c1d22] border border-black/5 dark:border-white/5 rounded-full pl-9 pr-4 py-1.5 text-xs text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:border-neutral-400 dark:focus:border-neutral-600 transition shadow-xs"
            />
          </div>

          {/* Sort Dropdown Pill */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="appearance-none bg-[#f0f1f4] dark:bg-[#1c1d22] border border-black/5 dark:border-white/5 rounded-full pl-4 pr-8 py-1.5 text-xs font-medium text-neutral-700 dark:text-neutral-300 focus:outline-none cursor-pointer"
            >
              <option value="newest">Newest</option>
              <option value="popular">Popular</option>
              <option value="name">Name (A-Z)</option>
            </select>
            <ChevronDown className="w-3 h-3 text-neutral-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Grid of Exact Bencho Cards */}
      {filteredBlocks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBlocks.map((block) => {
            const BlockComp = BLOCKS_COMPONENTS[block.slug] || BLOCKS_COMPONENTS['asset-swap'];
            return (
              <div
                key={block.id}
                onClick={() => handleOpenBlock(block)}
                className="bencho-card group relative"
              >
                {/* Top-left Chip */}
                <div className="bencho-card-chip">
                  {block.category === 'Press' || block.category === 'Drag' || block.category === 'Hover' ? 'New' : block.category}
                </div>

                {/* Center Live Interactive Component */}
                <div className="w-full flex items-center justify-center pointer-events-auto">
                  <BlockComp />
                </div>

                {/* Bottom-right Hover Actions */}
                <div className="bencho-card-actions">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenBlock(block);
                    }}
                    className="bencho-icon-btn"
                    title="Open block details"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-24 bg-white dark:bg-[#18191d] border border-black/5 dark:border-white/10 rounded-[28px]">
          <Layers className="w-8 h-8 text-neutral-400 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-1">No blocks found</h3>
          <p className="text-xs text-neutral-500">Try searching for a different component or category</p>
        </div>
      )}

      {/* Block Detail Modal */}
      <AnimatePresence>
        {activeModalBlock && (
          <BlockDetailModal block={activeModalBlock} onClose={handleCloseModal} />
        )}
      </AnimatePresence>
    </div>
  );
};
