import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, Check, Copy, Play, RefreshCw, Volume2, Mic, Eye,
  ArrowRight, ArrowDown, ArrowUpDown, ShieldCheck, Heart, Music, Flame,
  Image as ImageIcon, Sliders, Upload, Layers, Trash2, Edit3, X,
  CornerDownLeft, Plus, MoveVertical, SlidersHorizontal, Smartphone,
  Zap, Palette as PaletteIcon, Search, Grid, Compass, ShieldAlert,
  Award, Star, Smile, Share2, Bookmark, ExternalLink, Terminal, Folder
} from 'lucide-react';
import confetti from 'canvas-confetti';

// 1. Asset Swap Block (Exact Bencho Design: You pay / You receive)
export function AssetSwapBlock({ bounce = 0.3, radius = 24, fill = 'light', stroke = true }: any) {
  const [flipped, setFlipped] = useState(false);
  const [payAmount, setPayAmount] = useState('0.05');
  const [receiveAmount, setReceiveAmount] = useState('127.496');

  const handleSwap = () => {
    setFlipped(!flipped);
    const temp = payAmount;
    setPayAmount(receiveAmount);
    setReceiveAmount(temp);
  };

  return (
    <div className="flex flex-col items-center justify-center p-2 w-full max-w-[280px] select-none relative">
      {/* Pay Card */}
      <motion.div
        animate={{ y: flipped ? 4 : 0 }}
        className="w-full bg-white dark:bg-[#1a1b1f] border border-black/5 dark:border-white/10 rounded-[20px] p-4 shadow-sm"
      >
        <div className="text-[11px] text-neutral-400 font-medium mb-1">You pay</div>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xl font-bold text-neutral-900 dark:text-white tracking-tight">
              {flipped ? '127.496' : '0.05'}
            </div>
            <div className="text-[11px] text-neutral-400 mt-0.5">$4,885.00</div>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-xs font-bold text-neutral-900 dark:text-white">
            <span className="w-4 h-4 rounded-full bg-amber-500 text-white flex items-center justify-center text-[10px]">₿</span>
            <span>BTC</span>
          </div>
        </div>
      </motion.div>

      {/* Middle Swap Button */}
      <div className="relative -my-3 z-10">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleSwap}
          className="w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-700 border-2 border-white dark:border-[#16171b] flex items-center justify-center text-neutral-800 dark:text-white shadow-md cursor-pointer"
        >
          <motion.div animate={{ rotate: flipped ? 180 : 0 }}>
            <ArrowDown className="w-3.5 h-3.5 stroke-[2.5]" />
          </motion.div>
        </motion.button>
      </div>

      {/* Receive Card */}
      <motion.div
        animate={{ y: flipped ? -4 : 0 }}
        className="w-full bg-white dark:bg-[#1a1b1f] border border-black/5 dark:border-white/10 rounded-[20px] p-4 shadow-sm"
      >
        <div className="text-[11px] text-neutral-400 font-medium mb-1">You receive</div>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xl font-bold text-neutral-900 dark:text-white tracking-tight">
              {flipped ? '0.05' : '127.496'}
            </div>
            <div className="text-[11px] text-neutral-400 mt-0.5">$4,870.35</div>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-xs font-bold text-neutral-900 dark:text-white">
            <span className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px]">●</span>
            <span>HYPE</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// 2. Heat Map Block (3x6 Interactive Glowing Dot Grid)
export function HeatMapBlock({ radius = 14 }: any) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const dots = Array.from({ length: 18 });

  return (
    <div
      onMouseLeave={() => setHoverIndex(null)}
      className="p-4 flex items-center justify-center select-none"
    >
      <div className="grid grid-cols-6 gap-3 p-4 bg-transparent">
        {dots.map((_, i) => {
          const isHovered = hoverIndex === i;
          const isAdjacent =
            hoverIndex !== null &&
            (Math.abs(hoverIndex - i) === 1 || Math.abs(hoverIndex - i) === 6);

          return (
            <motion.div
              key={i}
              onMouseEnter={() => setHoverIndex(i)}
              animate={{
                scale: isHovered ? 1.35 : isAdjacent ? 1.15 : 1,
                backgroundColor: isHovered
                  ? '#ef4444'
                  : isAdjacent
                  ? '#f59e0b'
                  : '#a1a1aa40',
                boxShadow: isHovered
                  ? '0 0 20px 6px rgba(239, 68, 68, 0.7), 0 0 40px 12px rgba(245, 158, 11, 0.4)'
                  : isAdjacent
                  ? '0 0 12px 3px rgba(245, 158, 11, 0.5)'
                  : 'none',
              }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              className="w-6 h-6 rounded-full cursor-pointer transition-colors"
            />
          );
        })}
      </div>
    </div>
  );
}

// 3. Like Reaction Pill Block (Exact Bencho Design: [Heart] 1,300)
export function LikeBurstBlock({ radius = 24 }: any) {
  const [likes, setLikes] = useState(1300);
  const [liked, setLiked] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!liked) {
      setLikes((l) => l + 1);
      setLiked(true);
      confetti({
        particleCount: 30,
        spread: 50,
        origin: { y: 0.6 },
        colors: ['#ef4444', '#ec4899', '#f43f5e'],
      });
    } else {
      setLikes((l) => l - 1);
      setLiked(false);
    }
  };

  return (
    <div className="flex items-center justify-center p-4 select-none">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleClick}
        className="px-6 py-3 rounded-full bg-white dark:bg-[#1a1b1f] border border-black/5 dark:border-white/10 shadow-lg flex items-center gap-2.5 text-neutral-900 dark:text-white cursor-pointer"
      >
        <motion.div animate={{ scale: liked ? [1, 1.4, 1] : 1 }}>
          <Heart className={`w-5 h-5 ${liked ? 'fill-red-500 text-red-500' : 'text-neutral-800 dark:text-white'}`} />
        </motion.div>
        <span className="font-bold text-base tracking-tight font-sans">
          {likes.toLocaleString()}
        </span>
      </motion.button>
    </div>
  );
}

// 4. Signature Pad Block (Exact Bencho Card with Sign Here)
export function SignaturePadBlock({ radius = 20 }: any) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2.5;
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

  return (
    <div className="flex items-center justify-center p-2 w-full max-w-[280px]">
      <div className="w-full bg-white dark:bg-[#1a1b1f] border border-black/5 dark:border-white/10 rounded-[20px] p-4 h-36 relative flex flex-col justify-end shadow-sm">
        <canvas
          ref={canvasRef}
          width={248}
          height={110}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          className="absolute inset-0 w-full h-full cursor-crosshair z-10"
        />
        <div className="w-full pt-2 border-b border-neutral-200 dark:border-neutral-700 text-center pb-2 pointer-events-none">
          <span className="text-xs text-neutral-400 font-medium">Sign here</span>
        </div>
      </div>
    </div>
  );
}

// 5. Dynamic Island Block (Exact Bencho Timer Pill)
export function DynamicIslandBlock({ radius = 28 }: any) {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="flex items-center justify-center p-4 select-none">
      <motion.div
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        onClick={(e) => {
          e.stopPropagation();
          setIsPlaying(!isPlaying);
        }}
        className="h-14 px-5 bg-black text-white rounded-full flex items-center justify-between gap-6 shadow-2xl border border-white/15 cursor-pointer min-w-[220px]"
      >
        <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-xs font-bold">
          {isPlaying ? '▶' : '❚❚'}
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-xs text-neutral-400 font-medium">Timer</span>
          <span className="text-xl font-bold font-mono text-amber-400">4:46</span>
        </div>
      </motion.div>
    </div>
  );
}

// 6. Image Compare Block (Exact Mountain Split)
export function ImageCompareBlock({ radius = 24 }: any) {
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
    <div className="flex items-center justify-center p-2 w-full max-w-[220px] select-none">
      <div
        ref={containerRef}
        onMouseMove={(e) => e.buttons === 1 && handleMove(e)}
        onTouchMove={handleMove}
        onClick={handleMove}
        className="w-full h-64 relative rounded-[22px] overflow-hidden cursor-ew-resize border border-black/10 dark:border-white/10 shadow-lg"
      >
        {/* Right (Color) */}
        <div className="absolute inset-0 bg-gradient-to-tr from-sky-600 via-rose-400 to-amber-300 flex flex-col justify-between p-3">
          <div className="self-end px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-md text-[10px] font-bold text-white">
            After
          </div>
        </div>

        {/* Left (B&W Grayscale) */}
        <div
          className="absolute inset-0 bg-gradient-to-tr from-neutral-800 via-neutral-600 to-neutral-400 flex flex-col justify-between p-3 overflow-hidden grayscale"
          style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
        >
          <div className="self-start px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-md text-[10px] font-bold text-white">
            Before
          </div>
        </div>

        {/* Handle */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-white shadow-2xl z-10 flex items-center justify-center"
          style={{ left: `${position}%` }}
        >
          <div className="w-6 h-6 rounded-full bg-white text-black shadow-md flex items-center justify-center text-[9px] font-bold">
            ‹›
          </div>
        </div>
      </div>
    </div>
  );
}

// 7. Slide to Confirm Block
export function SlideConfirmBlock({ radius = 24 }: any) {
  const [confirmed, setConfirmed] = useState(false);
  const [dragProgress, setDragProgress] = useState(0);

  const handleDrag = (_: any, info: any) => {
    const maxDrag = 150;
    const current = Math.min(Math.max(info.offset.x, 0), maxDrag);
    setDragProgress(current / maxDrag);
    if (current >= maxDrag * 0.95 && !confirmed) {
      setConfirmed(true);
      confetti({ particleCount: 35, spread: 55, origin: { y: 0.6 } });
    }
  };

  return (
    <div className="flex items-center justify-center p-4 w-full max-w-[260px] select-none">
      <div className="w-full relative h-13 rounded-full bg-white dark:bg-[#1a1b1f] border border-black/5 dark:border-white/10 flex items-center p-1 shadow-sm overflow-hidden">
        <div
          className="absolute inset-0 bg-emerald-500/15 pointer-events-none"
          style={{ opacity: dragProgress }}
        />
        <div className="w-full text-center text-xs font-semibold text-neutral-500">
          {confirmed ? 'Confirmed ✓' : 'Slide to confirm'}
        </div>
        {!confirmed ? (
          <motion.div
            drag="x"
            dragConstraints={{ left: 0, right: 150 }}
            onDrag={handleDrag}
            onDragEnd={() => {
              if (!confirmed) setDragProgress(0);
            }}
            className="absolute left-1 top-1 bottom-1 w-10 bg-neutral-900 dark:bg-white text-white dark:text-black rounded-full flex items-center justify-center shadow-md cursor-grab active:cursor-grabbing font-bold text-xs"
          >
            →
          </motion.div>
        ) : (
          <button
            onClick={() => setConfirmed(false)}
            className="absolute right-2 px-3 py-1 bg-emerald-500 text-black text-xs font-bold rounded-full"
          >
            Reset
          </button>
        )}
      </div>
    </div>
  );
}

// 8. Voice Note Block (Waveform Pill)
export function VoiceNoteBlock({ radius = 24 }: any) {
  const [recording, setRecording] = useState(false);

  return (
    <div className="flex items-center justify-center p-4 select-none">
      <div className="px-5 py-3 rounded-full bg-white dark:bg-[#1a1b1f] border border-black/5 dark:border-white/10 shadow-lg flex items-center gap-3">
        <button
          onClick={() => setRecording(!recording)}
          className={`w-9 h-9 rounded-full flex items-center justify-center text-white transition-colors ${
            recording ? 'bg-red-500 animate-pulse' : 'bg-neutral-900 dark:bg-white dark:text-black'
          }`}
        >
          <Mic className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-1 h-5 w-24">
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.div
              key={i}
              className={`flex-1 rounded-full ${recording ? 'bg-red-500' : 'bg-neutral-300 dark:bg-neutral-600'}`}
              animate={recording ? { height: [4, Math.random() * 18 + 4, 4] } : { height: 6 }}
              transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.05 }}
            />
          ))}
        </div>
        <span className="font-mono text-xs text-neutral-400 font-semibold">0:14</span>
      </div>
    </div>
  );
}

// 9. Holo Foil Card Block
export function HoloCardBlock({ radius = 20 }: any) {
  const [coords, setCoords] = useState({ x: 50, y: 50 });

  return (
    <div className="flex items-center justify-center p-2 w-full max-w-[240px] select-none">
      <div
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          setCoords({
            x: ((e.clientX - rect.left) / rect.width) * 100,
            y: ((e.clientY - rect.top) / rect.height) * 100,
          });
        }}
        className="w-full h-44 rounded-[20px] bg-neutral-900 border border-white/20 p-4 relative overflow-hidden shadow-xl flex flex-col justify-between"
      >
        <div
          className="absolute inset-0 pointer-events-none opacity-60 mix-blend-color-dodge"
          style={{
            background: `linear-gradient(${coords.x * 3.6}deg, #ff0055 0%, #00e1ff 33%, #ffea00 66%, #ff0055 100%)`,
          }}
        />
        <div className="relative z-10 flex justify-between items-center">
          <span className="px-2 py-0.5 rounded bg-white/20 text-[10px] font-mono font-bold text-white">#042</span>
          <Star className="w-4 h-4 text-amber-300 fill-amber-300" />
        </div>
        <div className="relative z-10">
          <div className="font-black text-white text-base">HOLO FOIL</div>
          <div className="text-[10px] text-white/70 font-mono">Special Edition</div>
        </div>
      </div>
    </div>
  );
}

// 10. Generic Dynamic Bencho Primitive
export function GenericBenchoBlock({ name = 'Block', category = 'Interactive', icon = '✨' }: any) {
  return (
    <div className="flex items-center justify-center p-4 select-none">
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="px-6 py-4 rounded-[20px] bg-white dark:bg-[#1a1b1f] border border-black/5 dark:border-white/10 shadow-md flex items-center gap-3"
      >
        <span className="text-2xl">{icon}</span>
        <div>
          <div className="font-bold text-neutral-900 dark:text-white text-sm">{name}</div>
          <div className="text-[10px] text-neutral-400 font-mono">{category} Micro-interaction</div>
        </div>
      </motion.div>
    </div>
  );
}

// Registry map for all 62 blocks
export const BLOCKS_COMPONENTS: Record<string, React.FC<any>> = {
  'asset-swap': AssetSwapBlock,
  'heat-map': HeatMapBlock,
  'like': LikeBurstBlock,
  'signature-pad': SignaturePadBlock,
  'dynamic-island': DynamicIslandBlock,
  'image-compare': ImageCompareBlock,
  'slide-to-confirm': SlideConfirmBlock,
  'slide-confirm': SlideConfirmBlock,
  'voice-note': VoiceNoteBlock,
  'holo-card': HoloCardBlock,
  'swipe-row': (props) => <GenericBenchoBlock name="Swipe Row" category="Swipe" icon="👈" {...props} />,
  'ascii-wake': (props) => <GenericBenchoBlock name="ASCII Wake" category="Hover" icon="░" {...props} />,
  'foggy-glass': (props) => <GenericBenchoBlock name="Foggy Glass" category="Hover" icon="🌫" {...props} />,
  'scratch-card': (props) => <GenericBenchoBlock name="Scratch Card" category="Drag" icon="🎫" {...props} />,
  'spotlight': (props) => <GenericBenchoBlock name="Spotlight Card" category="Hover" icon="🔦" {...props} />,
  'poster-deck': (props) => <GenericBenchoBlock name="Poster Deck" category="Swipe" icon="🖼" {...props} />,
  'before-and-after': ImageCompareBlock,
  'eye-tracker': (props) => <GenericBenchoBlock name="Eye Tracker" category="Hover" icon="👀" {...props} />,
  'emoji-reactions': (props) => <GenericBenchoBlock name="Emoji Reactions" category="Hover" icon="😍" {...props} />,
  'time-scrubber': (props) => <GenericBenchoBlock name="Time Scrubber" category="Slide" icon="⏱" {...props} />,
  'upload-dropzone': (props) => <GenericBenchoBlock name="Upload Dropzone" category="Drag" icon="📤" {...props} />,
  'tag-input': (props) => <GenericBenchoBlock name="Tag Input" category="Type" icon="🏷️" {...props} />,
  'hold-to-delete': (props) => <GenericBenchoBlock name="Hold to Delete" category="Press" icon="🗑" {...props} />,
  'rolling-counter': (props) => <GenericBenchoBlock name="Rolling Counter" category="Drag" icon="🔢" {...props} />,
  'particles': (props) => <GenericBenchoBlock name="Particles Canvas" category="Hover" icon="✨" {...props} />,
  'label-input': (props) => <GenericBenchoBlock name="Floating Label" category="Type" icon="✍️" {...props} />,
  'one-time-code': (props) => <GenericBenchoBlock name="OTP One-Time Code" category="Type" icon="🔑" {...props} />,
  'generate': (props) => <GenericBenchoBlock name="AI Sparkle Generate" category="Press" icon="🪄" {...props} />,
  'step-player': (props) => <GenericBenchoBlock name="Step Player" category="Press" icon="👟" {...props} />,
  'todo-tower': (props) => <GenericBenchoBlock name="Todo Tower" category="Press" icon="🗼" {...props} />,
  'image-accordion': (props) => <GenericBenchoBlock name="Image Accordion" category="Hover" icon="🪗" {...props} />,
  'card-stack': (props) => <GenericBenchoBlock name="Card Stack Fan" category="Hover" icon="🃏" {...props} />,
  'glass-bubble': (props) => <GenericBenchoBlock name="Glass Bubble" category="Drag" icon="🫧" {...props} />,
  'folding-frame': (props) => <GenericBenchoBlock name="Folding Frame" category="Drag" icon="📐" {...props} />,
  'browser-tabs': (props) => <GenericBenchoBlock name="Browser Tabs" category="Drag" icon="📑" {...props} />,
  'action-node': (props) => <GenericBenchoBlock name="Action Node" category="Hover" icon="🔗" {...props} />,
  'assignees': (props) => <GenericBenchoBlock name="Assignees Stack" category="Select" icon="👥" {...props} />,
  'checklist': (props) => <GenericBenchoBlock name="Checklist Progress" category="Press" icon="✅" {...props} />,
  'carousel': (props) => <GenericBenchoBlock name="Kinetic Carousel" category="Swipe" icon="🎠" {...props} />,
  'palette': (props) => <GenericBenchoBlock name="Palette Generator" category="Press" icon="🎨" {...props} />,
  'aspect-ratio': (props) => <GenericBenchoBlock name="Aspect Ratio" category="Select" icon="📐" {...props} />,
  'tilt-card': (props) => <GenericBenchoBlock name="3D Tilt Card" category="Hover" icon="🧊" {...props} />,
  'now-playing': (props) => <GenericBenchoBlock name="Now Playing Bar" category="Press" icon="🎵" {...props} />,
  'dragging-ball': (props) => <GenericBenchoBlock name="Dragging Ball" category="Drag" icon="⚽" {...props} />,
  'search': (props) => <GenericBenchoBlock name="Expanding Search" category="Press" icon="🔍" {...props} />,
  'pull-to-refresh': (props) => <GenericBenchoBlock name="Pull to Refresh" category="Drag" icon="🔄" {...props} />,
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
  'progress-ticks': (props) => <GenericBenchoBlock name="Progress Ticks" category="Hover" icon="📈" {...props} />,
  'wheel': (props) => <GenericBenchoBlock name="Rotary Wheel" category="Drag" icon="☸️" {...props} />,
  'command-bar': (props) => <GenericBenchoBlock name="Command Bar" category="Type" icon="⚡" {...props} />,
  'selection-list': (props) => <GenericBenchoBlock name="Selection List" category="Select" icon="📋" {...props} />,
  'range-dial': (props) => <GenericBenchoBlock name="Range Dial" category="Drag" icon="🧭" {...props} />,
  'liquid-toggle': (props) => <GenericBenchoBlock name="Liquid Toggle" category="Press" icon="💧" {...props} />,
};
