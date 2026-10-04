import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Sparkles, SlidersHorizontal, ArrowUpRight, Layers } from 'lucide-react';
import { BLOCKS_DATA, BlockItem } from '../data/blocks-list';
import { BLOCKS_COMPONENTS } from '../blocks';
import { BlockDetailModal } from './BlockDetailModal';

const CATEGORIES = ['All', 'Swipe', 'Press', 'Hover', 'Drag', 'Slide', 'Type', 'Select'] as const;

interface BlocksGalleryProps {
  selectedSlug?: string | null;
  onSelectBlock?: (slug: string | null) => void;
}

export const BlocksGallery: React.FC<BlocksGalleryProps> = ({ selectedSlug, onSelectBlock }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
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
    return BLOCKS_DATA.filter((block) => {
      const matchesCategory = selectedCategory === 'All' || block.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        block.name.toLowerCase().includes(q) ||
        block.description.toLowerCase().includes(q) ||
        block.tags.some((t) => t.toLowerCase().includes(q));
      return matchesCategory && matchesQuery;
    });
  }, [selectedCategory, searchQuery]);

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
    <div className="bencho-scope w-full max-w-[1416px] mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans">
      {/* Header Banner - Bencho Style */}
      <div className="mb-10 text-left">
        <div className="flex items-center gap-2 mb-3">
          <span className="bencho-chip">
            <Sparkles className="w-3 h-3 text-pink-500" /> Bencho Live Primitives
          </span>
          <span className="text-xs text-[var(--bencho-ink-3)] font-mono">
            {BLOCKS_DATA.length} Interactive Blocks
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--bencho-ink)] tracking-tight mb-2.5">
          Interactive UI Blocks & Micro-interactions
        </h1>
        <p className="text-sm sm:text-base text-[var(--bencho-ink-3)] max-w-2xl leading-relaxed">
          Tactile, animated React components you can explore live, tweak parameters with spring physics, and take straight into your apps.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8 pb-6 border-b border-[var(--bencho-border)]">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {CATEGORIES.map((cat) => {
            const count = cat === 'All' ? BLOCKS_DATA.length : BLOCKS_DATA.filter((b) => b.category === cat).length;
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`bencho-pill ${isSelected ? 'active' : ''}`}
              >
                <span>{cat}</span>
                <span className={`text-[10px] font-mono ${isSelected ? 'opacity-70' : 'text-[var(--bencho-ink-4)]'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-[var(--bencho-ink-4)] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search 62 interactive blocks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[var(--bencho-surface)] border border-[var(--bencho-border)] rounded-xl pl-9 pr-4 py-2 text-xs text-[var(--bencho-ink)] placeholder-[var(--bencho-ink-4)] focus:outline-none focus:border-[var(--bencho-ink-3)] transition"
          />
        </div>
      </div>

      {/* Grid of Blocks */}
      {filteredBlocks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBlocks.map((block) => {
            const BlockComp = BLOCKS_COMPONENTS[block.slug] || BLOCKS_COMPONENTS['asset-swap'];
            return (
              <motion.div
                key={block.id}
                layout
                whileHover={{ y: -3 }}
                transition={{ duration: 0.2 }}
                onClick={() => handleOpenBlock(block)}
                className="bencho-gcard p-5 flex flex-col justify-between cursor-pointer"
              >
                {/* Live Card Preview Area */}
                <div className="bencho-stage">
                  <div className="scale-90 pointer-events-none origin-center w-full flex items-center justify-center">
                    <BlockComp />
                  </div>
                </div>

                {/* Card Meta & Title */}
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <h3 className="font-bold text-[var(--bencho-ink)] text-base transition flex items-center gap-1.5">
                      {block.name}
                      <ArrowUpRight className="w-4 h-4 text-[var(--bencho-ink-4)] group-hover:text-[var(--bencho-ink)] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </h3>
                    <span className="bencho-chip">
                      {block.category}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--bencho-ink-3)] line-clamp-2 leading-relaxed">{block.description}</p>

                  <div className="flex flex-wrap gap-1 mt-3">
                    {block.tags.slice(0, 3).map((t) => (
                      <span key={t} className="text-[10px] text-[var(--bencho-ink-4)] font-mono">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 bg-[var(--bencho-surface)] border border-[var(--bencho-border)] rounded-2xl">
          <Layers className="w-8 h-8 text-[var(--bencho-ink-4)] mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-[var(--bencho-ink)] mb-1">No interactive blocks found</h3>
          <p className="text-xs text-[var(--bencho-ink-3)]">Try adjusting your category filter or search terms</p>
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
