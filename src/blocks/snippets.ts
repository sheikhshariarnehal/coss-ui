export const BLOCK_SNIPPETS: Record<string, { install: string; usage: string; code: string }> = {
  'asset-swap': {
    install: 'npm install framer-motion lucide-react clsx tailwind-merge',
    usage: `import { AssetSwapBlock } from '@/components/blocks/AssetSwapBlock';

export default function Example() {
  return <AssetSwapBlock bounce={0.4} radius={16} fill={true} stroke={true} />;
}`,
    code: `'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';

export function AssetSwapBlock({ bounce = 0.4, radius = 16, fill = true, stroke = true }) {
  const coins = [
    { name: 'Ethereum', symbol: 'ETH', balance: '3.421 ETH', usd: '$8,420.50', color: '#627EEA', icon: 'Ξ' },
    { name: 'Bitcoin', symbol: 'BTC', balance: '0.245 BTC', usd: '$16,210.00', color: '#F7931A', icon: '₿' },
    { name: 'Solana', symbol: 'SOL', balance: '48.12 SOL', usd: '$6,830.20', color: '#14F195', icon: '◎' },
  ];
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const handleSwap = () => {
    setFlipped(true);
    setTimeout(() => {
      setIndex((prev) => (prev + 1) % coins.length);
      setFlipped(false);
    }, 180);
  };

  const current = coins[index];

  return (
    <motion.div
      className="w-full max-w-sm relative overflow-hidden transition-all duration-200 cursor-pointer select-none"
      style={{
        borderRadius: \`\${radius}px\`,
        backgroundColor: fill ? '#171717' : 'transparent',
        border: stroke ? '1px solid rgba(255,255,255,0.1)' : 'none',
      }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleSwap}
      animate={{ rotateX: flipped ? 90 : 0 }}
      transition={{ type: 'spring', damping: 20 - bounce * 10, stiffness: 300 }}
    >
      <div className="p-5 flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold shadow-md"
            style={{ backgroundColor: \`\${current.color}20\`, color: current.color, border: \`1px solid \${current.color}40\` }}
          >
            {current.icon}
          </div>
          <div>
            <div className="font-semibold text-white text-base flex items-center gap-2">
              {current.name}
              <span className="text-xs px-2 py-0.5 rounded bg-white/10 text-neutral-400 font-mono">
                {current.symbol}
              </span>
            </div>
            <div className="text-xs text-neutral-400 mt-0.5">{current.usd}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-neutral-500 uppercase font-mono tracking-wider">Balance</div>
          <div className="font-semibold text-white font-mono mt-0.5">{current.balance}</div>
        </div>
      </div>
      <div className="bg-white/[0.03] px-5 py-2.5 border-t border-white/5 flex items-center justify-between text-xs text-neutral-400">
        <span>Tap card to switch asset</span>
        <RefreshCw className="w-3.5 h-3.5 text-neutral-500" />
      </div>
    </motion.div>
  );
}`
  },
  'slide-confirm': {
    install: 'npm install framer-motion lucide-react canvas-confetti',
    usage: `import { SlideConfirmBlock } from '@/components/blocks/SlideConfirmBlock';

export default function Example() {
  return <SlideConfirmBlock bounce={0.2} radius={24} fill={true} stroke={true} />;
}`,
    code: `'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export function SlideConfirmBlock({ bounce = 0.2, radius = 24, fill = true, stroke = true }) {
  const [confirmed, setConfirmed] = useState(false);
  const [dragProgress, setDragProgress] = useState(0);

  const handleDrag = (_: any, info: any) => {
    const maxDrag = 200;
    const current = Math.min(Math.max(info.offset.x, 0), maxDrag);
    setDragProgress(current / maxDrag);
    if (current >= maxDrag * 0.95 && !confirmed) {
      setConfirmed(true);
    }
  };

  return (
    <div
      className="w-full max-w-sm relative h-14 overflow-hidden flex items-center p-1.5 transition-colors select-none"
      style={{
        borderRadius: \`\${radius}px\`,
        backgroundColor: confirmed ? '#052e16' : fill ? '#171717' : 'transparent',
        border: stroke ? \`1px solid \${confirmed ? '#16a34a' : 'rgba(255,255,255,0.1)'}\` : 'none',
      }}
    >
      <div
        className="absolute inset-0 bg-emerald-500/10 pointer-events-none transition-opacity"
        style={{ opacity: dragProgress }}
      />
      <div className="w-full text-center text-xs font-medium text-neutral-400 tracking-wider uppercase">
        {confirmed ? 'Payment Complete ✓' : 'Slide to Confirm'}
      </div>
      {!confirmed ? (
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 200 }}
          dragElastic={bounce}
          onDrag={handleDrag}
          onDragEnd={() => {
            if (!confirmed) setDragProgress(0);
          }}
          className="absolute left-1.5 top-1.5 bottom-1.5 w-11 bg-white rounded-full flex items-center justify-center shadow-lg cursor-grab active:cursor-grabbing text-neutral-950 font-bold"
          style={{ borderRadius: \`\${radius - 4}px\` }}
        >
          <ArrowRight className="w-5 h-5 text-neutral-900" />
        </motion.div>
      ) : (
        <button
          onClick={() => {
            setConfirmed(false);
            setDragProgress(0);
          }}
          className="absolute right-2 px-3 py-1 bg-emerald-500 text-black text-xs font-semibold rounded-full"
        >
          Reset
        </button>
      )}
    </div>
  );
}`
  },
  'dynamic-island': {
    install: 'npm install framer-motion lucide-react',
    usage: `import { DynamicIslandBlock } from '@/components/blocks/DynamicIslandBlock';

export default function Example() {
  return <DynamicIslandBlock radius={28} />;
}`,
    code: `'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music } from 'lucide-react';

export function DynamicIslandBlock({ radius = 28 }) {
  const [state, setState] = useState<'idle' | 'call' | 'music' | 'timer'>('idle');

  return (
    <motion.div
      layout
      transition={{ type: 'spring', stiffness: 400, damping: 28 }}
      style={{ borderRadius: \`\${radius}px\` }}
      className="bg-black border border-white/15 text-white shadow-2xl flex items-center justify-between px-4 py-3 cursor-pointer overflow-hidden"
      onClick={() => {
        const states = ['idle', 'call', 'music', 'timer'] as const;
        const next = states[(states.indexOf(state) + 1) % states.length];
        setState(next);
      }}
    >
      <AnimatePresence mode="wait">
        {state === 'idle' && (
          <motion.div
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-3 text-xs w-48 justify-between"
          >
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-neutral-400 font-mono">Silent mode</span>
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
          </motion.div>
        )}
        {state === 'call' && (
          <motion.div
            key="call"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex items-center justify-between gap-6 w-72"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm">
                JD
              </div>
              <div>
                <div className="text-xs font-semibold">John Doe</div>
                <div className="text-[10px] text-emerald-400 font-mono">01:24 • Incoming</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}`
  }
};
