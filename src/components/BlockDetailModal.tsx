import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check, Sliders, Code2, Sparkles, Terminal, ArrowUpRight } from 'lucide-react';
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

  // Dynamic parameters state
  const [bounce, setBounce] = useState(0.4);
  const [radius, setRadius] = useState(16);
  const [fill, setFill] = useState(true);
  const [stroke, setStroke] = useState(true);

  useEffect(() => {
    if (block?.defaultProps) {
      if (block.defaultProps.bounce !== undefined) setBounce(block.defaultProps.bounce);
      if (block.defaultProps.radius !== undefined) setRadius(block.defaultProps.radius);
      if (block.defaultProps.fill !== undefined) setFill(block.defaultProps.fill);
      if (block.defaultProps.stroke !== undefined) setStroke(block.defaultProps.stroke);
    }
  }, [block]);

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
    code: `// ${block.name} interactive implementation\n// Full source code available on coss UI registry`,
  };

  const copyInstall = () => {
    navigator.clipboard.writeText(snippet.install);
    setCopiedInstall(true);
    setTimeout(() => setCopiedInstall(false), 2000);
  };

  const copyPrompt = () => {
    const promptText = `Create a React component named "${block.name}" with Tailwind CSS and Framer Motion based on the Bencho micro-interaction block:\n\nDescription: ${block.description}\nCategory: ${block.category}\nTags: ${block.tags.join(', ')}`;
    navigator.clipboard.writeText(promptText);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-5xl max-h-[90vh] bg-[#141414] border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-[#111111]">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-white/10 text-white font-mono">
              {block.category}
            </span>
            <h2 className="text-lg font-bold text-white tracking-tight">{block.name}</h2>
          </div>

          {/* Tab Selector & Close */}
          <div className="flex items-center gap-3">
            <div className="flex items-center p-1 bg-white/5 rounded-lg border border-white/5">
              <button
                onClick={() => setActiveTab('preview')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition ${
                  activeTab === 'preview' ? 'bg-white/15 text-white' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Preview
              </button>
              <button
                onClick={() => setActiveTab('code')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition flex items-center gap-1.5 ${
                  activeTab === 'code' ? 'bg-white/15 text-white' : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Code2 className="w-3.5 h-3.5" /> Code
              </button>
            </div>

            <button
              onClick={copyPrompt}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-medium text-neutral-300 transition"
            >
              {copiedPrompt ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Sparkles className="w-3.5 h-3.5 text-pink-400" />}
              {copiedPrompt ? 'Copied prompt!' : 'Copy prompt'}
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-white/10 text-neutral-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col lg:flex-row gap-6">
          {activeTab === 'preview' ? (
            <>
              {/* Live Canvas */}
              <div className="flex-1 min-h-[380px] bg-[#0c0c0c] border border-white/5 rounded-xl flex flex-col items-center justify-center p-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
                <div className="relative z-10 w-full flex items-center justify-center">
                  <BlockComponent bounce={bounce} radius={radius} fill={fill} stroke={stroke} />
                </div>
              </div>

              {/* Controls Sidebar */}
              <div className="w-full lg:w-72 bg-[#111111] border border-white/5 rounded-xl p-5 flex flex-col gap-5">
                <div className="flex items-center gap-2 text-xs font-bold text-neutral-300 uppercase tracking-wider">
                  <Sliders className="w-4 h-4 text-neutral-400" /> Block Parameters
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs text-neutral-400 mb-1.5">
                      <span>Corner Radius</span>
                      <span className="font-mono text-white">{radius}px</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="32"
                      value={radius}
                      onChange={(e) => setRadius(Number(e.target.value))}
                      className="w-full accent-white cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs text-neutral-400 mb-1.5">
                      <span>Spring Bounce</span>
                      <span className="font-mono text-white">{bounce.toFixed(2)}</span>
                    </div>
                    <input
                      type="range"
                      min="0.1"
                      max="0.8"
                      step="0.05"
                      value={bounce}
                      onChange={(e) => setBounce(Number(e.target.value))}
                      className="w-full accent-white cursor-pointer"
                    />
                  </div>

                  <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                    <span className="text-xs text-neutral-400">Background Fill</span>
                    <button
                      onClick={() => setFill(!fill)}
                      className={`w-9 h-5 rounded-full transition-colors relative ${
                        fill ? 'bg-white' : 'bg-neutral-800'
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 bottom-0.5 w-4 rounded-full transition-transform ${
                          fill ? 'right-0.5 bg-black' : 'left-0.5 bg-neutral-400'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-neutral-400">Border Stroke</span>
                    <button
                      onClick={() => setStroke(!stroke)}
                      className={`w-9 h-5 rounded-full transition-colors relative ${
                        stroke ? 'bg-white' : 'bg-neutral-800'
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 bottom-0.5 w-4 rounded-full transition-transform ${
                          stroke ? 'right-0.5 bg-black' : 'left-0.5 bg-neutral-400'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                <div className="mt-auto pt-4 border-t border-white/5">
                  <p className="text-xs text-neutral-400 leading-relaxed">{block.description}</p>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {block.tags.map((t) => (
                      <span key={t} className="px-2 py-0.5 text-[10px] rounded bg-white/5 text-neutral-400">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* Code Tab */
            <div className="flex-1 space-y-6">
              {/* Install CLI */}
              <div>
                <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5" /> Installation
                </h4>
                <div className="flex items-center justify-between bg-black/60 border border-white/10 rounded-lg px-4 py-3 font-mono text-xs text-neutral-200">
                  <span>{snippet.install}</span>
                  <button
                    onClick={copyInstall}
                    className="p-1 hover:bg-white/10 rounded transition text-neutral-400 hover:text-white"
                  >
                    {copiedInstall ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Usage */}
              <div>
                <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">Usage</h4>
                <CodeBlock code={snippet.usage} language="tsx" />
              </div>

              {/* Source Code */}
              <div>
                <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">
                  Component Source Code
                </h4>
                <CodeBlock code={snippet.code} language="tsx" />
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
