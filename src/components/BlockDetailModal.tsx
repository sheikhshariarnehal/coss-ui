import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  X, Copy, Check, Box, Code2, Sparkles, Bookmark, Volume2,
  Share2, Play, ChevronDown, ChevronRight, CornerDownLeft
} from 'lucide-react';
import { BlockItem } from '../data/blocks-list';
import { BLOCKS_COMPONENTS } from '../blocks';
import { BLOCK_SNIPPETS } from '../blocks/snippets';
import { CodeBlock } from './CodeBlock';

interface BlockDetailModalProps {
  block: BlockItem | null;
  onClose: () => void;
}

export const BlockDetailModal: React.FC<BlockDetailModalProps> = ({ block, onClose }) => {
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');
  const [copiedInstall, setCopiedInstall] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [addedToBench, setAddedToBench] = useState(false);

  // Accordion open states
  const [openSection, setOpenSection] = useState<'install' | 'usage' | 'code' | 'how' | null>('install');

  // Interactive controls
  const [fillState, setFillState] = useState<'light' | 'dark'>('light');
  const [strokeState, setStrokeState] = useState<'off' | 'on'>('on');
  const [bounce, setBounce] = useState(30);
  const [corner, setCorner] = useState(28);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!block) return null;

  const BlockComponent = BLOCKS_COMPONENTS[block.slug] || BLOCKS_COMPONENTS['asset-swap'];
  const snippet = BLOCK_SNIPPETS[block.slug] || {
    install: 'npm install framer-motion lucide-react clsx tailwind-merge',
    usage: `import { ${block.name.replace(/\s+/g, '')} } from '@/components/blocks/${block.slug}';\n\nexport default function Example() {\n  return <${block.name.replace(/\s+/g, '')} />;\n}`,
    code: `// ${block.name} implementation\n// Exported from coss.com UI & bencho.dev`,
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  const copyPrompt = () => {
    const promptText = `Create a React component named "${block.name}" with Tailwind CSS and Framer Motion based on Bencho micro-interaction block:\n\nDescription: ${block.description}\nCategory: ${block.category}\nTags: ${block.tags.join(', ')}`;
    navigator.clipboard.writeText(promptText);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.2 }}
        className="bencho-root w-full max-w-5xl flex flex-col md:flex-row gap-4 max-h-[90vh] overflow-y-auto"
      >
        {/* Left Stage Canvas Card */}
        <div className="flex-1 bg-[#e5e7eb] dark:bg-[#1b1c20] border border-black/5 dark:border-white/10 rounded-[28px] p-6 flex flex-col justify-between min-h-[460px] relative shadow-2xl">
          {/* Top Stage Bar */}
          <div className="flex items-center justify-between z-10">
            {/* View Switcher: Cube (Preview) & Code (<>) */}
            <div className="flex items-center p-1 bg-white/70 dark:bg-black/40 backdrop-blur-md rounded-full border border-black/5 dark:border-white/10 shadow-sm">
              <button
                onClick={() => setActiveTab('preview')}
                className={`p-1.5 px-2.5 rounded-full transition flex items-center gap-1 text-xs font-semibold ${
                  activeTab === 'preview'
                    ? 'bg-white dark:bg-[#25262c] text-neutral-950 dark:text-white shadow-xs'
                    : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                }`}
                title="Interactive Preview"
              >
                <Box className="w-4 h-4" />
              </button>
              <button
                onClick={() => setActiveTab('code')}
                className={`p-1.5 px-2.5 rounded-full transition flex items-center gap-1 text-xs font-semibold ${
                  activeTab === 'code'
                    ? 'bg-white dark:bg-[#25262c] text-neutral-950 dark:text-white shadow-xs'
                    : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                }`}
                title="View Code"
              >
                <Code2 className="w-4 h-4" />
              </button>
            </div>

            {/* Right Stage Controls */}
            {activeTab === 'preview' ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsBookmarked(!isBookmarked)}
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition ${
                    isBookmarked
                      ? 'bg-neutral-900 text-white dark:bg-white dark:text-black'
                      : 'bg-white/70 dark:bg-black/40 text-neutral-600 dark:text-neutral-300 hover:bg-white dark:hover:bg-black/60'
                  }`}
                  title="Bookmark"
                >
                  <Bookmark className="w-4 h-4" />
                </button>
                <button
                  className="w-9 h-9 rounded-full bg-white/70 dark:bg-black/40 text-neutral-600 dark:text-neutral-300 flex items-center justify-center hover:bg-white dark:hover:bg-black/60 transition"
                  title="Sound"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={copyPrompt}
                className="px-4 py-1.5 rounded-full bg-neutral-900 text-white dark:bg-white dark:text-black text-xs font-semibold shadow-md flex items-center gap-1.5 hover:opacity-90 transition"
              >
                {copiedPrompt ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Sparkles className="w-3.5 h-3.5" />}
                {copiedPrompt ? 'Copied prompt!' : 'Copy prompt'}
              </button>
            )}
          </div>

          {/* Canvas Center Stage / Code View */}
          {activeTab === 'preview' ? (
            <div className="flex-1 flex items-center justify-center my-6 relative">
              <BlockComponent
                bounce={bounce / 100}
                radius={corner}
                fill={fillState}
                stroke={strokeState === 'on'}
              />
            </div>
          ) : (
            <div className="flex-1 my-6 space-y-3 overflow-y-auto max-h-[340px] pr-2">
              {/* Install Accordion */}
              <div className="bg-white/80 dark:bg-black/40 border border-black/5 dark:border-white/10 rounded-2xl overflow-hidden shadow-xs">
                <div
                  onClick={() => setOpenSection(openSection === 'install' ? null : 'install')}
                  className="px-4 py-3 flex items-center justify-between cursor-pointer text-xs font-bold text-neutral-800 dark:text-neutral-200 select-none"
                >
                  <div className="flex items-center gap-2">
                    {openSection === 'install' ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                    <span>Install</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigator.clipboard.writeText(snippet.install);
                      setCopiedInstall(true);
                      setTimeout(() => setCopiedInstall(false), 2000);
                    }}
                    className="p-1 text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                  >
                    {copiedInstall ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                {openSection === 'install' && (
                  <div className="px-4 pb-3 font-mono text-xs text-neutral-600 dark:text-neutral-300">
                    <div className="p-2.5 bg-neutral-100 dark:bg-neutral-800 rounded-xl">
                      {snippet.install}
                    </div>
                  </div>
                )}
              </div>

              {/* Usage Accordion */}
              <div className="bg-white/80 dark:bg-black/40 border border-black/5 dark:border-white/10 rounded-2xl overflow-hidden shadow-xs">
                <div
                  onClick={() => setOpenSection(openSection === 'usage' ? null : 'usage')}
                  className="px-4 py-3 flex items-center justify-between cursor-pointer text-xs font-bold text-neutral-800 dark:text-neutral-200 select-none"
                >
                  <div className="flex items-center gap-2">
                    {openSection === 'usage' ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                    <span>Usage</span>
                  </div>
                  <Copy className="w-3.5 h-3.5 text-neutral-400" />
                </div>
                {openSection === 'usage' && (
                  <div className="px-4 pb-3">
                    <CodeBlock code={snippet.usage} language="tsx" />
                  </div>
                )}
              </div>

              {/* Code Accordion */}
              <div className="bg-white/80 dark:bg-black/40 border border-black/5 dark:border-white/10 rounded-2xl overflow-hidden shadow-xs">
                <div
                  onClick={() => setOpenSection(openSection === 'code' ? null : 'code')}
                  className="px-4 py-3 flex items-center justify-between cursor-pointer text-xs font-bold text-neutral-800 dark:text-neutral-200 select-none"
                >
                  <div className="flex items-center gap-2">
                    {openSection === 'code' ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                    <span>Code</span>
                  </div>
                  <Copy className="w-3.5 h-3.5 text-neutral-400" />
                </div>
                {openSection === 'code' && (
                  <div className="px-4 pb-3">
                    <CodeBlock code={snippet.code} language="tsx" />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Bottom Stage Play Action */}
          <div className="flex justify-end z-10">
            <button
              onClick={() => {
                confetti({ particleCount: 20, spread: 45, origin: { y: 0.6 } });
              }}
              className="w-9 h-9 rounded-full bg-white/80 dark:bg-black/50 text-neutral-800 dark:text-white flex items-center justify-center hover:scale-105 transition shadow-sm"
              title="Replay Animation"
            >
              <Play className="w-4 h-4 fill-current ml-0.5" />
            </button>
          </div>
        </div>

        {/* Right Controls Panel Card */}
        <div className="w-full md:w-[310px] bg-white dark:bg-[#141518] border border-black/5 dark:border-white/10 rounded-[28px] p-6 flex flex-col justify-between shadow-2xl">
          <div>
            {/* Header: Title & Close */}
            <div className="flex items-start justify-between gap-3 mb-2">
              <h3 className="text-xl font-bold text-neutral-900 dark:text-white tracking-tight">
                {block.name}
              </h3>
              <button
                onClick={onClose}
                className="w-7 h-7 rounded-full bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-500 hover:text-neutral-900 dark:hover:text-white flex items-center justify-center transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed mb-6">
              {block.description}
            </p>

            {/* Segmented Controls */}
            <div className="space-y-3.5 mb-6">
              {/* Fill Control */}
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-600 dark:text-neutral-400 font-medium">Fill</span>
                <div className="bencho-seg-bar w-32">
                  <button
                    onClick={() => setFillState('light')}
                    className={`bencho-seg-btn ${fillState === 'light' ? 'active' : ''}`}
                  >
                    Light
                  </button>
                  <button
                    onClick={() => setFillState('dark')}
                    className={`bencho-seg-btn ${fillState === 'dark' ? 'active' : ''}`}
                  >
                    Dark
                  </button>
                </div>
              </div>

              {/* Stroke Control */}
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-600 dark:text-neutral-400 font-medium">Stroke</span>
                <div className="bencho-seg-bar w-32">
                  <button
                    onClick={() => setStrokeState('off')}
                    className={`bencho-seg-btn ${strokeState === 'off' ? 'active' : ''}`}
                  >
                    Off
                  </button>
                  <button
                    onClick={() => setStrokeState('on')}
                    className={`bencho-seg-btn ${strokeState === 'on' ? 'active' : ''}`}
                  >
                    On
                  </button>
                </div>
              </div>

              {/* Bounce Slider Pill */}
              <div className="bencho-ctrl-pill">
                <span className="text-xs font-semibold text-neutral-600 dark:text-neutral-400">Bounce</span>
                <input
                  type="range"
                  min="10"
                  max="60"
                  value={bounce}
                  onChange={(e) => setBounce(Number(e.target.value))}
                  className="w-24 accent-neutral-900 dark:accent-white cursor-pointer"
                />
                <span className="font-mono text-xs font-bold text-neutral-900 dark:text-white w-6 text-right">
                  {bounce}
                </span>
              </div>

              {/* Corner Slider Pill */}
              <div className="bencho-ctrl-pill">
                <span className="text-xs font-semibold text-neutral-600 dark:text-neutral-400">Corner</span>
                <input
                  type="range"
                  min="8"
                  max="36"
                  value={corner}
                  onChange={(e) => setCorner(Number(e.target.value))}
                  className="w-24 accent-neutral-900 dark:accent-white cursor-pointer"
                />
                <span className="font-mono text-xs font-bold text-neutral-900 dark:text-white w-8 text-right">
                  {corner}px
                </span>
              </div>
            </div>
          </div>

          {/* Footer CTAs: Share & Add to Bench */}
          <div className="space-y-2 pt-4 border-t border-black/5 dark:border-white/5">
            <button
              onClick={handleShare}
              className="w-full py-2.5 rounded-full border border-black/10 dark:border-white/15 text-xs font-semibold text-neutral-800 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition flex items-center justify-center gap-1.5"
            >
              <Share2 className="w-3.5 h-3.5" />
              {copiedShare ? 'Link copied!' : 'Share'}
            </button>

            <button
              onClick={() => {
                setAddedToBench(!addedToBench);
                confetti({ particleCount: 30, spread: 60, origin: { y: 0.7 } });
              }}
              className={`w-full py-2.5 rounded-full text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-md ${
                addedToBench
                  ? 'bg-emerald-500 text-black'
                  : 'bg-neutral-900 text-white dark:bg-white dark:text-black hover:opacity-95'
              }`}
            >
              {addedToBench ? 'Added to bench ✓' : 'Add to bench 1'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
