import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, Check, Copy, Play, RefreshCw, Volume2, Mic, Eye,
  ArrowRight, ShieldCheck, Heart, Music, Flame, Image, Sliders,
  Upload, Layers, Trash2, Edit3, X, CornerDownLeft, Plus, MoveVertical
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
    <div className="flex flex-col items-center justify-center p-6 w-full max-w-sm">
      <motion.div
        className="w-full relative overflow-hidden transition-all duration-200 cursor-pointer select-none"
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
    const maxDrag = 200;
    const current = Math.min(Math.max(info.offset.x, 0), maxDrag);
    setDragProgress(current / maxDrag);
    if (current >= maxDrag * 0.95 && !confirmed) {
      setConfirmed(true);
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 w-full max-w-sm select-none">
      <div
        className="w-full relative h-14 overflow-hidden flex items-center p-1.5 transition-colors"
        style={{
          borderRadius: `${radius}px`,
          backgroundColor: confirmed ? '#052e16' : fill ? '#171717' : 'transparent',
          border: stroke ? `1px solid ${confirmed ? '#16a34a' : 'rgba(255,255,255,0.1)'}` : 'none',
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
    <div className="flex flex-col items-center justify-center p-6 w-full max-w-md min-h-[160px]">
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
      <span className="text-[11px] text-neutral-500 mt-4">Click island to cycle status</span>
    </div>
  );
}

// 4. Signature Pad Block
export function SignaturePadBlock({ radius = 12, strokeWidth = 3, color = '#f4f4f5' }: any) {
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

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 w-full max-w-md">
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
          height={160}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          className="w-full h-40 cursor-crosshair bg-neutral-950/60 block"
        />
        {!hasDrawn && (
          <div className="absolute inset-0 top-10 pointer-events-none flex items-center justify-center text-xs text-neutral-600 font-mono">
            Draw signature with cursor
          </div>
        )}
      </div>
    </div>
  );
}

// 5. Image Compare Block
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
    <div className="flex flex-col items-center justify-center p-6 w-full max-w-md select-none">
      <div
        ref={containerRef}
        onMouseMove={(e) => e.buttons === 1 && handleMove(e)}
        onTouchMove={handleMove}
        onClick={handleMove}
        className="w-full h-56 relative overflow-hidden cursor-ew-resize border border-white/10 shadow-xl"
        style={{ borderRadius: `${radius}px` }}
      >
        {/* After (Full) */}
        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-900 via-teal-800 to-indigo-950 flex items-center justify-center">
          <div className="text-center">
            <span className="text-emerald-400 font-bold text-lg">Retouched Master</span>
            <p className="text-xs text-emerald-200/70 mt-1">100% Crisp 4K Resolution</p>
          </div>
        </div>

        {/* Before (Clipped) */}
        <div
          className="absolute inset-0 bg-gradient-to-tr from-neutral-900 via-neutral-800 to-neutral-950 flex items-center justify-center overflow-hidden"
          style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
        >
          <div className="text-center w-full">
            <span className="text-neutral-400 font-bold text-lg">Original RAW</span>
            <p className="text-xs text-neutral-500 mt-1">Unprocessed Input</p>
          </div>
        </div>

        {/* Divider Bar */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-white shadow-2xl z-10 flex items-center justify-center"
          style={{ left: `${position}%` }}
        >
          <div className="w-7 h-7 rounded-full bg-white text-black shadow-lg flex items-center justify-center text-[10px] font-bold">
            ↔
          </div>
        </div>
      </div>
      <span className="text-[11px] text-neutral-500 mt-3">Drag horizontal divider to compare</span>
    </div>
  );
}

// 6. 3D Tilt Card Block
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

    const rotX = ((y - centerY) / centerY) * -maxTilt;
    const rotY = ((x - centerX) / centerX) * maxTilt;

    setRotateX(rotX);
    setRotateY(rotY);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 w-full max-w-sm" style={{ perspective: 800 }}>
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        animate={{ rotateX, rotateY }}
        transition={{ type: 'spring', damping: 15, stiffness: 200 }}
        style={{ borderRadius: `${radius}px`, transformStyle: 'preserve-3d' }}
        className="w-full bg-gradient-to-b from-neutral-800/80 to-neutral-900 border border-white/15 p-6 shadow-2xl cursor-pointer relative overflow-hidden"
      >
        <div className="w-10 h-10 rounded-xl bg-violet-500/20 border border-violet-500/30 flex items-center justify-center text-violet-400 mb-4">
          <Sparkles className="w-5 h-5" />
        </div>
        <h3 className="text-lg font-bold text-white mb-1">Spatial 3D Canvas</h3>
        <p className="text-xs text-neutral-400 leading-relaxed">
          Hover your cursor across the card to experience reactive physics and dynamic perspective depth.
        </p>
        <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono text-neutral-500">
          <span>X: {rotateX.toFixed(1)}°</span>
          <span>Y: {rotateY.toFixed(1)}°</span>
        </div>
      </motion.div>
    </div>
  );
}

// 7. Magnetic Select Block
export function MagneticSelectBlock({ radius = 12 }: any) {
  const options = ['Daily', 'Weekly', 'Monthly', 'Yearly'];
  const [selected, setSelected] = useState('Monthly');

  return (
    <div className="flex flex-col items-center justify-center p-6 w-full max-w-sm">
      <div
        className="p-1 bg-neutral-900 border border-white/10 flex items-center gap-1 relative shadow-inner"
        style={{ borderRadius: `${radius}px` }}
      >
        {options.map((opt) => {
          const isSelected = selected === opt;
          return (
            <button
              key={opt}
              onClick={() => setSelected(opt)}
              className={`relative px-4 py-2 text-xs font-semibold transition-colors duration-200 z-10 ${
                isSelected ? 'text-white' : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              {isSelected && (
                <motion.div
                  layoutId="magneticPill"
                  className="absolute inset-0 bg-white/10 border border-white/15 shadow-sm"
                  style={{ borderRadius: `${radius - 3}px` }}
                  transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                />
              )}
              <span className="relative z-10">{opt}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// 8. One-Time Code Block
export function OneTimeCodeBlock({ digits = 6, radius = 12 }: any) {
  const [values, setValues] = useState<string[]>(Array(digits).fill(''));
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const newVals = [...values];
    newVals[index] = val.slice(-1);
    setValues(newVals);
    if (val && index < digits - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !values[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 w-full max-w-sm">
      <div className="flex items-center gap-2">
        {values.map((v, i) => (
          <input
            key={i}
            ref={(el) => (inputsRef.current[i] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={v}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            className="w-11 h-13 text-center text-lg font-bold font-mono bg-neutral-900 border border-white/15 text-white focus:outline-none focus:border-white/40 focus:ring-2 focus:ring-white/10 transition-all"
            style={{ borderRadius: `${radius}px` }}
          />
        ))}
      </div>
      <p className="text-xs text-neutral-500 mt-4">Enter confirmation code</p>
    </div>
  );
}

// 9. Like Reaction Burst Block
export function LikeBurstBlock({ bounce = 0.6, radius = 20 }: any) {
  const [likes, setLikes] = useState(42);
  const [liked, setLiked] = useState(false);

  const handleClick = () => {
    if (!liked) {
      setLikes((l) => l + 1);
      setLiked(true);
      confetti({
        particleCount: 25,
        spread: 45,
        origin: { y: 0.6 },
        colors: ['#ef4444', '#f43f5e', '#fb7185', '#fda4af'],
      });
    } else {
      setLikes((l) => l - 1);
      setLiked(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 w-full max-w-sm select-none">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleClick}
        className={`flex items-center gap-3 px-6 py-3.5 border transition-all duration-200 shadow-xl ${
          liked
            ? 'bg-red-500/15 border-red-500/40 text-red-400'
            : 'bg-neutral-900 border-white/10 text-neutral-300 hover:border-white/20'
        }`}
        style={{ borderRadius: `${radius}px` }}
      >
        <motion.div
          animate={{ scale: liked ? [1, 1.4, 1] : 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 15 }}
        >
          <Heart className={`w-5 h-5 ${liked ? 'fill-red-500 text-red-500' : 'text-neutral-400'}`} />
        </motion.div>
        <span className="font-mono font-bold text-sm text-white">{likes}</span>
      </motion.button>
    </div>
  );
}

// 10. Voice Note Block
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
    <div className="flex flex-col items-center justify-center p-6 w-full max-w-sm">
      <div
        className="w-full bg-neutral-900 border border-white/10 p-4 flex items-center justify-between gap-4 shadow-xl"
        style={{ borderRadius: `${radius}px` }}
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.92 }}
          onClick={() => setRecording(!recording)}
          className={`w-11 h-11 rounded-full flex items-center justify-center transition-colors shadow-md ${
            recording ? 'bg-red-500 text-white animate-pulse' : 'bg-white text-black'
          }`}
        >
          <Mic className="w-5 h-5" />
        </motion.button>

        <div className="flex-1 flex items-center gap-1 h-6">
          {Array.from({ length: 18 }).map((_, i) => (
            <motion.div
              key={i}
              className={`flex-1 rounded-full ${recording ? 'bg-red-400' : 'bg-neutral-700'}`}
              animate={recording ? { height: [4, Math.random() * 22 + 4, 4] } : { height: 6 }}
              transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.04 }}
            />
          ))}
        </div>

        <div className="font-mono text-xs font-semibold text-neutral-300 w-12 text-right">
          {formatTime(seconds)}
        </div>
      </div>
    </div>
  );
}

// 11. Interactive Checklist Block
export function ChecklistProgressBlock({ radius = 14 }: any) {
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Extract Bencho interactive blocks', done: true },
    { id: 2, title: 'Configure TypeScript components', done: true },
    { id: 3, title: 'Add parameter control playground', done: false },
    { id: 4, title: 'Deploy live update to Vercel', done: false },
  ]);

  const toggleTask = (id: number) => {
    const updated = tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t));
    setTasks(updated);
    if (updated.every((t) => t.done)) {
      confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
    }
  };

  const completedCount = tasks.filter((t) => t.done).length;
  const percent = Math.round((completedCount / tasks.length) * 100);

  return (
    <div className="flex flex-col items-center justify-center p-6 w-full max-w-sm">
      <div
        className="w-full bg-neutral-900 border border-white/10 p-5 shadow-2xl"
        style={{ borderRadius: `${radius}px` }}
      >
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold text-white uppercase tracking-wider">Launch Checklist</span>
          <span className="text-xs font-mono text-emerald-400 font-bold">{percent}%</span>
        </div>
        <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden mb-4">
          <motion.div
            className="h-full bg-emerald-500 rounded-full"
            animate={{ width: `${percent}%` }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          />
        </div>
        <div className="space-y-2.5">
          {tasks.map((t) => (
            <div
              key={t.id}
              onClick={() => toggleTask(t.id)}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer transition select-none"
            >
              <div
                className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${
                  t.done ? 'bg-emerald-500 border-emerald-500 text-black' : 'border-neutral-600 bg-neutral-800'
                }`}
              >
                {t.done && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>
              <span className={`text-xs ${t.done ? 'line-through text-neutral-500' : 'text-neutral-200'}`}>
                {t.title}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// 12. Sparkle AI Generate Button Block
export function GenerateButtonBlock({ bounce = 0.4, radius = 16 }: any) {
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      confetti({ particleCount: 30, spread: 50, origin: { y: 0.6 } });
    }, 1200);
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 w-full max-w-sm">
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={handleClick}
        disabled={loading}
        className="relative group p-[1px] overflow-hidden shadow-2xl transition-all disabled:opacity-80"
        style={{ borderRadius: `${radius}px` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-violet-500 via-pink-500 to-amber-500 rounded-2xl animate-spin [animation-duration:3s] group-hover:[animation-duration:1.5s]" />
        <div
          className="relative bg-neutral-950 px-6 py-3.5 flex items-center gap-2.5 font-semibold text-xs text-white"
          style={{ borderRadius: `${radius - 1}px` }}
        >
          {loading ? (
            <RefreshCw className="w-4 h-4 animate-spin text-pink-400" />
          ) : (
            <Sparkles className="w-4 h-4 text-pink-400 group-hover:rotate-12 transition-transform" />
          )}
          <span>{loading ? 'Synthesizing magic...' : 'Generate with AI'}</span>
        </div>
      </motion.button>
    </div>
  );
}

// Map of all blocks by slug
export const BLOCKS_COMPONENTS: Record<string, React.FC<any>> = {
  'asset-swap': AssetSwapBlock,
  'slide-confirm': SlideConfirmBlock,
  'dynamic-island': DynamicIslandBlock,
  'signature-pad': SignaturePadBlock,
  'image-compare': ImageCompareBlock,
  'tilt-card': TiltCardBlock,
  'magnetic-select': MagneticSelectBlock,
  'one-time-code': OneTimeCodeBlock,
  'like-burst': LikeBurstBlock,
  'voice-note': VoiceNoteBlock,
  'checklist-progress': ChecklistProgressBlock,
  'generate-button': GenerateButtonBlock,
};
