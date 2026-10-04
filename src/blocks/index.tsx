import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, Check, Copy, Play, RefreshCw, Volume2, Mic, Eye,
  ArrowRight, ShieldCheck, Heart, Music, Flame, Image as ImageIcon, Sliders,
  Upload, Layers, Trash2, Edit3, X, CornerDownLeft, Plus, MoveVertical,
  SlidersHorizontal, Smartphone, Zap, Palette as PaletteIcon, Search,
  Grid, Compass, ShieldAlert, Award, Star, Compass as CompassIcon,
  Smile, Share2, Bookmark, ExternalLink, Terminal, Folder, CheckCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

// 1. Asset Swap Block
export function AssetSwapBlock({ bounce = 0.4, radius = 16, fill = true, stroke = true }: any) {
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
    <div className="flex flex-col items-center justify-center p-4 w-full max-w-sm select-none">
      <motion.div
        className="w-full relative overflow-hidden transition-all duration-200 cursor-pointer"
        style={{
          borderRadius: `${radius}px`,
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
              style={{ backgroundColor: `${current.color}20`, color: current.color, border: `1px solid ${current.color}40` }}
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
    </div>
  );
}

// 2. Slide to Confirm Block
export function SlideConfirmBlock({ bounce = 0.2, radius = 24, fill = true, stroke = true }: any) {
  const [confirmed, setConfirmed] = useState(false);
  const [dragProgress, setDragProgress] = useState(0);

  const handleDrag = (_: any, info: any) => {
    const maxDrag = 180;
    const current = Math.min(Math.max(info.offset.x, 0), maxDrag);
    setDragProgress(current / maxDrag);
    if (current >= maxDrag * 0.95 && !confirmed) {
      setConfirmed(true);
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 w-full max-w-sm select-none">
      <div
        className="w-full relative h-14 overflow-hidden flex items-center p-1.5 transition-colors"
        style={{
          borderRadius: `${radius}px`,
          backgroundColor: confirmed ? '#052e16' : fill ? '#171717' : 'transparent',
          border: stroke ? `1px solid ${confirmed ? '#16a34a' : 'rgba(255,255,255,0.1)'}` : 'none',
        }}
      >
        <div
          className="absolute inset-0 bg-emerald-500/15 pointer-events-none transition-opacity"
          style={{ opacity: dragProgress }}
        />
        <div className="w-full text-center text-xs font-medium text-neutral-400 tracking-wider uppercase">
          {confirmed ? 'Payment Complete ✓' : 'Slide to Confirm'}
        </div>
        {!confirmed ? (
          <motion.div
            drag="x"
            dragConstraints={{ left: 0, right: 180 }}
            dragElastic={bounce}
            onDrag={handleDrag}
            onDragEnd={() => {
              if (!confirmed) setDragProgress(0);
            }}
            className="absolute left-1.5 top-1.5 bottom-1.5 w-11 bg-white rounded-full flex items-center justify-center shadow-lg cursor-grab active:cursor-grabbing text-neutral-950 font-bold"
            style={{ borderRadius: `${radius - 4}px` }}
          >
            <ArrowRight className="w-5 h-5 text-neutral-900" />
          </motion.div>
        ) : (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            onClick={() => {
              setConfirmed(false);
              setDragProgress(0);
            }}
            className="absolute right-2 px-3 py-1 bg-emerald-500 text-black text-xs font-semibold rounded-full hover:bg-emerald-400 transition"
          >
            Reset
          </motion.button>
        )}
      </div>
    </div>
  );
}

// 3. Dynamic Island Block
export function DynamicIslandBlock({ radius = 28 }: any) {
  const [state, setState] = useState<'idle' | 'call' | 'music' | 'timer'>('idle');

  return (
    <div className="flex flex-col items-center justify-center p-4 w-full max-w-md min-h-[140px] select-none">
      <motion.div
        layout
        transition={{ type: 'spring', stiffness: 400, damping: 28 }}
        style={{ borderRadius: `${radius}px` }}
        className="bg-black border border-white/15 text-white shadow-2xl flex items-center justify-between px-4 py-3 cursor-pointer overflow-hidden"
        onClick={() => {
          const states: ('idle' | 'call' | 'music' | 'timer')[] = ['idle', 'call', 'music', 'timer'];
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
              <div className="flex gap-2">
                <div className="w-7 h-7 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center text-xs">✕</div>
                <div className="w-7 h-7 rounded-full bg-emerald-500 text-black flex items-center justify-center text-xs">✓</div>
              </div>
            </motion.div>
          )}
          {state === 'music' && (
            <motion.div
              key="music"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex items-center justify-between gap-6 w-72"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                  <Music className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold">Starboy</div>
                  <div className="text-[10px] text-neutral-400">The Weeknd</div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {[12, 20, 16, 24, 8].map((h, i) => (
                  <motion.div
                    key={i}
                    animate={{ height: [8, h, 6, h] }}
                    transition={{ repeat: Infinity, duration: 1, delay: i * 0.15 }}
                    className="w-1 bg-indigo-400 rounded-full"
                  />
                ))}
              </div>
            </motion.div>
          )}
          {state === 'timer' && (
            <motion.div
              key="timer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-between gap-6 w-64"
            >
              <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                Timer
              </div>
              <div className="font-mono text-sm text-white font-bold">04:59.2</div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

// 4. Spotlight Card Block
export function SpotlightCardBlock({ radius = 16 }: any) {
  const [coords, setCoords] = useState({ x: 150, y: 100 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 w-full max-w-sm select-none">
      <div
        onMouseMove={handleMouseMove}
        className="w-full relative overflow-hidden bg-neutral-950 border border-white/10 p-6 shadow-2xl group cursor-pointer"
        style={{ borderRadius: `${radius}px` }}
      >
        <div
          className="pointer-events-none absolute -inset-px transition duration-300 opacity-60"
          style={{
            background: `radial-gradient(300px circle at ${coords.x}px ${coords.y}px, rgba(56, 189, 248, 0.25), transparent 70%)`,
          }}
        />
        <div className="relative z-10">
          <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-sky-400 mb-3">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white mb-1">Specular Spotlight</h3>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Move your cursor across this card to illuminate the dynamic radial specular highlight.
          </p>
        </div>
      </div>
    </div>
  );
}

// 5. Swipe Row Block
export function SwipeRowBlock({ radius = 14 }: any) {
  const [offset, setOffset] = useState(0);

  return (
    <div className="flex flex-col items-center justify-center p-4 w-full max-w-sm select-none">
      <div
        className="w-full relative h-16 bg-red-500/20 border border-red-500/30 overflow-hidden flex items-center justify-between px-5"
        style={{ borderRadius: `${radius}px` }}
      >
        <div className="text-xs font-semibold text-red-400 flex items-center gap-1.5">
          <Trash2 className="w-4 h-4" /> Delete
        </div>
        <motion.div
          drag="x"
          dragConstraints={{ left: -100, right: 0 }}
          onDrag={(_, info) => setOffset(info.offset.x)}
          className="absolute inset-0 bg-neutral-900 border border-white/10 flex items-center justify-between px-4 cursor-grab active:cursor-grabbing shadow-lg"
          style={{ borderRadius: `${radius}px` }}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-pink-500/20 text-pink-400 flex items-center justify-center text-xs font-bold">
              NW
            </div>
            <div>
              <div className="text-xs font-semibold text-white">Nora Wilder</div>
              <div className="text-[11px] text-neutral-400">Design review update</div>
            </div>
          </div>
          <span className="text-[10px] text-neutral-500 font-mono">Swipe ←</span>
        </motion.div>
      </div>
    </div>
  );
}

// 6. Holo Card Block
export function HoloCardBlock({ radius = 18 }: any) {
  const [coords, setCoords] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setCoords({ x, y });
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 w-full max-w-sm select-none">
      <div
        onMouseMove={handleMouseMove}
        className="w-full h-48 relative overflow-hidden bg-neutral-900 border border-white/15 p-6 shadow-2xl cursor-pointer flex flex-col justify-between"
        style={{ borderRadius: `${radius}px` }}
      >
        <div
          className="absolute inset-0 pointer-events-none opacity-50 mix-blend-color-dodge transition-opacity"
          style={{
            background: `linear-gradient(${coords.x * 3.6}deg, #ff0055 0%, #00e1ff 33%, #ffea00 66%, #ff0055 100%)`,
          }}
        />
        <div className="relative z-10 flex items-center justify-between">
          <span className="text-xs font-mono font-bold text-white px-2.5 py-1 rounded bg-black/40 backdrop-blur-sm border border-white/20">
            HOLO #042
          </span>
          <Award className="w-5 h-5 text-amber-300" />
        </div>
        <div className="relative z-10">
          <h4 className="text-base font-extrabold text-white">Prismatic Astral</h4>
          <p className="text-[11px] text-neutral-300 font-mono">Legendary Edition</p>
        </div>
      </div>
    </div>
  );
}

// 7. Scratch Card Block
export function ScratchCardBlock({ radius = 16 }: any) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#3f3f46';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#71717a';
    ctx.font = 'bold 13px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Scratch with cursor to reveal prize', canvas.width / 2, canvas.height / 2 + 5);
  }, []);

  const handleScratch = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (e.buttons !== 1) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 18, 0, Math.PI * 2);
    ctx.fill();
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 w-full max-w-sm select-none">
      <div
        className="w-full h-36 relative overflow-hidden bg-gradient-to-r from-amber-500 via-pink-500 to-violet-600 flex items-center justify-center shadow-xl"
        style={{ borderRadius: `${radius}px` }}
      >
        <div className="text-center text-white">
          <span className="text-2xl font-black tracking-tight">🎁 YOU WON $500!</span>
          <p className="text-xs text-white/80 font-mono mt-0.5">Code: BENCHO-PROMO</p>
        </div>
        <canvas
          ref={canvasRef}
          width={320}
          height={144}
          onMouseMove={handleScratch}
          className="absolute inset-0 w-full h-full cursor-pointer"
        />
      </div>
    </div>
  );
}

// 8. Liquid Toggle Block
export function LiquidToggleBlock({ radius = 20 }: any) {
  const [on, setOn] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center p-4 w-full max-w-sm select-none">
      <motion.button
        onClick={() => setOn(!on)}
        className={`w-20 h-11 p-1 flex items-center rounded-full transition-colors duration-300 border shadow-inner ${
          on ? 'bg-emerald-500 border-emerald-400' : 'bg-neutral-800 border-white/10'
        }`}
      >
        <motion.div
          layout
          transition={{ type: 'spring', stiffness: 500, damping: 22 }}
          className={`h-9 w-9 rounded-full bg-white shadow-lg flex items-center justify-center font-bold text-xs ${
            on ? 'ml-auto text-emerald-600' : 'mr-auto text-neutral-400'
          }`}
        >
          {on ? '✓' : ''}
        </motion.div>
      </motion.button>
    </div>
  );
}

// 9. Emoji Reactions Dock Block
export function EmojiReactionsBlock({ radius = 16 }: any) {
  const emojis = ['🔥', '❤️', '🚀', '🎉', '👏', '😍'];
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="flex flex-col items-center justify-center p-4 w-full max-w-sm select-none">
      <div
        className="p-2 bg-neutral-900 border border-white/10 flex items-center gap-1.5 shadow-2xl"
        style={{ borderRadius: `${radius}px` }}
      >
        {emojis.map((emoji) => (
          <motion.button
            key={emoji}
            whileHover={{ scale: 1.45, y: -6 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              setSelected(emoji);
              confetti({ particleCount: 20, spread: 45, origin: { y: 0.6 } });
            }}
            className="w-10 h-10 rounded-xl hover:bg-white/10 flex items-center justify-center text-xl transition-colors"
          >
            {emoji}
          </motion.button>
        ))}
      </div>
    </div>
  );
}

// 10. Tag Input Block
export function TagInputBlock({ radius = 12 }: any) {
  const [tags, setTags] = useState(['React', 'Tailwind', 'Motion']);
  const [input, setInput] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && input.trim()) {
      e.preventDefault();
      if (!tags.includes(input.trim())) {
        setTags([...tags, input.trim()]);
      }
      setInput('');
    } else if (e.key === 'Backspace' && !input && tags.length > 0) {
      setTags(tags.slice(0, -1));
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 w-full max-w-sm select-none">
      <div
        className="w-full bg-neutral-900 border border-white/10 p-3 flex flex-wrap items-center gap-1.5 min-h-12 shadow-inner"
        style={{ borderRadius: `${radius}px` }}
      >
        {tags.map((t) => (
          <span
            key={t}
            className="px-2.5 py-1 bg-white/10 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 border border-white/5"
          >
            {t}
            <button
              onClick={() => setTags(tags.filter((x) => x !== t))}
              className="text-neutral-400 hover:text-white"
            >
              ×
            </button>
          </span>
        ))}
        <input
          type="text"
          placeholder="Add tag..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="bg-transparent text-xs text-white placeholder-neutral-500 focus:outline-none flex-1 min-w-20"
        />
      </div>
    </div>
  );
}

// 11. Generic Animated Placeholder for remaining blocks
export function GenericBenchoBlock({ name = 'Block', category = 'Interactive', icon = '✨' }: any) {
  const [active, setActive] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center p-4 w-full max-w-sm select-none">
      <motion.div
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => setActive(!active)}
        className="w-full bg-neutral-900 border border-white/10 p-6 rounded-2xl shadow-xl flex items-center justify-between cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 text-white flex items-center justify-center text-lg font-bold">
            {icon}
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">{name}</h4>
            <span className="text-[10px] text-neutral-400 font-mono">{category} Micro-interaction</span>
          </div>
        </div>
        <div className={`px-2.5 py-1 rounded-full text-[10px] font-mono ${active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-neutral-400'}`}>
          {active ? 'Active' : 'Tap'}
        </div>
      </motion.div>
    </div>
  );
}

// 12. Signature Pad Block
export function SignaturePadBlock({ radius = 14, strokeWidth = 3, color = '#f4f4f5' }: any) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = color;
    ctx.lineWidth = strokeWidth;
  }, [color, strokeWidth]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    setIsDrawing(true);
    setHasDrawn(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => setIsDrawing(false);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 w-full max-w-md">
      <div
        className="w-full bg-neutral-900 border border-white/10 overflow-hidden relative shadow-lg"
        style={{ borderRadius: `${radius}px` }}
      >
        <div className="p-3 border-b border-white/5 flex items-center justify-between text-xs text-neutral-400">
          <span className="flex items-center gap-1.5 font-medium">
            <Edit3 className="w-3.5 h-3.5 text-neutral-400" /> Sign below
          </span>
          {hasDrawn && (
            <button
              onClick={clearCanvas}
              className="text-xs text-red-400 hover:text-red-300 font-medium px-2 py-0.5 rounded bg-red-500/10 transition"
            >
              Clear
            </button>
          )}
        </div>
        <canvas
          ref={canvasRef}
          width={380}
          height={140}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          className="w-full h-36 cursor-crosshair bg-neutral-950/60 block"
        />
      </div>
    </div>
  );
}

// 13. Image Compare Block
export function ImageCompareBlock({ radius = 16 }: any) {
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const pos = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.min(Math.max(pos, 0), 100));
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 w-full max-w-md select-none">
      <div
        ref={containerRef}
        onMouseMove={(e) => e.buttons === 1 && handleMove(e)}
        onTouchMove={handleMove}
        onClick={handleMove}
        className="w-full h-48 relative overflow-hidden cursor-ew-resize border border-white/10 shadow-xl"
        style={{ borderRadius: `${radius}px` }}
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-900 via-teal-800 to-indigo-950 flex items-center justify-center">
          <div className="text-center">
            <span className="text-emerald-400 font-bold text-base">Retouched Master</span>
          </div>
        </div>
        <div
          className="absolute inset-0 bg-gradient-to-tr from-neutral-900 via-neutral-800 to-neutral-950 flex items-center justify-center overflow-hidden"
          style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
        >
          <div className="text-center w-full">
            <span className="text-neutral-400 font-bold text-base">Original RAW</span>
          </div>
        </div>
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-white shadow-2xl z-10 flex items-center justify-center"
          style={{ left: `${position}%` }}
        >
          <div className="w-6 h-6 rounded-full bg-white text-black shadow-lg flex items-center justify-center text-[10px] font-bold">
            ↔
          </div>
        </div>
      </div>
    </div>
  );
}

// 14. 3D Tilt Card Block
export function TiltCardBlock({ radius = 16, maxTilt = 15 }: any) {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    setRotateX(((y - centerY) / centerY) * -maxTilt);
    setRotateY(((x - centerX) / centerX) * maxTilt);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 w-full max-w-sm" style={{ perspective: 800 }}>
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        animate={{ rotateX, rotateY }}
        transition={{ type: 'spring', damping: 15, stiffness: 200 }}
        style={{ borderRadius: `${radius}px`, transformStyle: 'preserve-3d' }}
        className="w-full bg-gradient-to-b from-neutral-800/80 to-neutral-900 border border-white/15 p-5 shadow-2xl cursor-pointer"
      >
        <div className="w-9 h-9 rounded-xl bg-violet-500/20 border border-violet-500/30 flex items-center justify-center text-violet-400 mb-3">
          <Sparkles className="w-4 h-4" />
        </div>
        <h3 className="text-base font-bold text-white mb-1">Spatial 3D Canvas</h3>
        <p className="text-xs text-neutral-400">
          Reactive physics and dynamic perspective depth.
        </p>
      </motion.div>
    </div>
  );
}

// 15. Voice Note Block
export function VoiceNoteBlock({ radius = 20 }: any) {
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    let timer: any;
    if (recording) {
      timer = setInterval(() => setSeconds((s) => s + 1), 1000);
    } else {
      setSeconds(0);
    }
    return () => clearInterval(timer);
  }, [recording]);

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 w-full max-w-sm select-none">
      <div
        className="w-full bg-neutral-900 border border-white/10 p-3.5 flex items-center justify-between gap-3 shadow-xl"
        style={{ borderRadius: `${radius}px` }}
      >
        <button
          onClick={() => setRecording(!recording)}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors shadow-md ${
            recording ? 'bg-red-500 text-white animate-pulse' : 'bg-white text-black'
          }`}
        >
          <Mic className="w-4 h-4" />
        </button>

        <div className="flex-1 flex items-center gap-1 h-5">
          {Array.from({ length: 16 }).map((_, i) => (
            <motion.div
              key={i}
              className={`flex-1 rounded-full ${recording ? 'bg-red-400' : 'bg-neutral-700'}`}
              animate={recording ? { height: [4, Math.random() * 18 + 4, 4] } : { height: 5 }}
              transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.04 }}
            />
          ))}
        </div>

        <div className="font-mono text-xs font-semibold text-neutral-300 w-10 text-right">
          {formatTime(seconds)}
        </div>
      </div>
    </div>
  );
}

// Component Registry Mapping for all 62 Bencho Blocks
export const BLOCKS_COMPONENTS: Record<string, React.FC<any>> = {
  'swipe-row': SwipeRowBlock,
  'asset-swap': AssetSwapBlock,
  'ascii-wake': (props) => <GenericBenchoBlock name="ASCII Wake" category="Hover" icon="░" {...props} />,
  'foggy-glass': (props) => <GenericBenchoBlock name="Foggy Glass" category="Hover" icon="🌫" {...props} />,
  'scratch-card': ScratchCardBlock,
  'heat-map': (props) => <GenericBenchoBlock name="Heat Map" category="Hover" icon="🔥" {...props} />,
  'image-compare': ImageCompareBlock,
  'like': (props) => <GenericBenchoBlock name="Like Reaction" category="Press" icon="❤️" {...props} />,
  'spotlight': SpotlightCardBlock,
  'holo-card': HoloCardBlock,
  'poster-deck': (props) => <GenericBenchoBlock name="Poster Deck" category="Swipe" icon="🖼" {...props} />,
  'before-and-after': ImageCompareBlock,
  'signature-pad': SignaturePadBlock,
  'voice-note': VoiceNoteBlock,
  'eye-tracker': (props) => <GenericBenchoBlock name="Eye Tracker" category="Hover" icon="👀" {...props} />,
  'dynamic-island': DynamicIslandBlock,
  'emoji-reactions': EmojiReactionsBlock,
  'time-scrubber': (props) => <GenericBenchoBlock name="Time Scrubber" category="Slide" icon="⏱" {...props} />,
  'upload-dropzone': (props) => <GenericBenchoBlock name="Upload Dropzone" category="Drag" icon="📤" {...props} />,
  'tag-input': TagInputBlock,
  'hold-to-delete': (props) => <GenericBenchoBlock name="Hold to Delete" category="Press" icon="🗑" {...props} />,
  'rolling-counter': (props) => <GenericBenchoBlock name="Rolling Counter" category="Drag" icon="🔢" {...props} />,
  'particles': (props) => <GenericBenchoBlock name="Particles Canvas" category="Hover" icon="✨" {...props} />,
  'label-input': (props) => <GenericBenchoBlock name="Floating Label" category="Type" icon="✍️" {...props} />,
  'one-time-code': (props) => <GenericBenchoBlock name="OTP Code" category="Type" icon="🔑" {...props} />,
  'generate': (props) => <GenericBenchoBlock name="AI Sparkle" category="Press" icon="✨" {...props} />,
  'step-player': (props) => <GenericBenchoBlock name="Step Player" category="Press" icon="👟" {...props} />,
  'todo-tower': (props) => <GenericBenchoBlock name="Todo Tower" category="Press" icon="🗼" {...props} />,
  'image-accordion': (props) => <GenericBenchoBlock name="Image Accordion" category="Hover" icon="🪗" {...props} />,
  'card-stack': (props) => <GenericBenchoBlock name="Card Stack" category="Hover" icon="🃏" {...props} />,
  'glass-bubble': (props) => <GenericBenchoBlock name="Glass Bubble" category="Drag" icon="🫧" {...props} />,
  'folding-frame': (props) => <GenericBenchoBlock name="Folding Frame" category="Drag" icon="📐" {...props} />,
  'browser-tabs': (props) => <GenericBenchoBlock name="Browser Tabs" category="Drag" icon="📑" {...props} />,
  'action-node': (props) => <GenericBenchoBlock name="Action Node" category="Hover" icon="🔗" {...props} />,
  'slide-to-confirm': SlideConfirmBlock,
  'slide-confirm': SlideConfirmBlock,
  'assignees': (props) => <GenericBenchoBlock name="Assignees Stack" category="Select" icon="👥" {...props} />,
  'checklist': (props) => <GenericBenchoBlock name="Checklist" category="Press" icon="✅" {...props} />,
  'carousel': (props) => <GenericBenchoBlock name="Carousel" category="Swipe" icon="🎠" {...props} />,
  'palette': (props) => <GenericBenchoBlock name="Color Palette" category="Press" icon="🎨" {...props} />,
  'aspect-ratio': (props) => <GenericBenchoBlock name="Aspect Ratio" category="Select" icon="📐" {...props} />,
  'tilt-card': TiltCardBlock,
  'now-playing': (props) => <GenericBenchoBlock name="Now Playing" category="Press" icon="🎵" {...props} />,
  'dragging-ball': (props) => <GenericBenchoBlock name="Dragging Ball" category="Drag" icon="⚽" {...props} />,
  'search': (props) => <GenericBenchoBlock name="Expanding Search" category="Press" icon="🔍" {...props} />,
  'pull-to-refresh': (props) => <GenericBenchoBlock name="Pull Refresh" category="Drag" icon="🔄" {...props} />,
  'escape-button': (props) => <GenericBenchoBlock name="Escape Button" category="Hover" icon="🏃" {...props} />,
  'slosh-slider': (props) => <GenericBenchoBlock name="Slosh Slider" category="Slide" icon="🌊" {...props} />,
  'create-menu': (props) => <GenericBenchoBlock name="Create Menu" category="Press" icon="➕" {...props} />,
  'reorder-list': (props) => <GenericBenchoBlock name="Reorder List" category="Drag" icon="☰" {...props} />,
  'canvas-toolbar': (props) => <GenericBenchoBlock name="Canvas Toolbar" category="Select" icon="🛠" {...props} />,
  'radial-menu': (props) => <GenericBenchoBlock name="Radial Menu" category="Press" icon="⭕" {...props} />,
  'drag-stepper': (props) => <GenericBenchoBlock name="Drag Stepper" category="Press" icon="🎚" {...props} />,
  'inline-confirm': (props) => <GenericBenchoBlock name="Inline Confirm" category="Press" icon="⚠️" {...props} />,
  'notify': (props) => <GenericBenchoBlock name="Notify Toast" category="Press" icon="🔔" {...props} />,
  'icon-bar': (props) => <GenericBenchoBlock name="Icon Bar" category="Select" icon="📊" {...props} />,
  'magnifying-dock': (props) => <GenericBenchoBlock name="Magnifying Dock" category="Hover" icon="🔍" {...props} />,
  'progress-ticks': (props) => <GenericBenchoBlock name="Progress Ticks" category="Hover" icon="📊" {...props} />,
  'wheel': (props) => <GenericBenchoBlock name="Rotary Wheel" category="Drag" icon="☸️" {...props} />,
  'command-bar': (props) => <GenericBenchoBlock name="Command Bar" category="Type" icon="⚡" {...props} />,
  'selection-list': (props) => <GenericBenchoBlock name="Selection List" category="Select" icon="📋" {...props} />,
  'range-dial': (props) => <GenericBenchoBlock name="Range Dial" category="Drag" icon="🧭" {...props} />,
  'liquid-toggle': LiquidToggleBlock,
};
