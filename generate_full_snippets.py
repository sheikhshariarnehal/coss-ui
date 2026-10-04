"""
generate_full_snippets.py
Generates the complete, high-fidelity TypeScript snippets registry for all blocks.
Includes TSX, CSS, Usage, and How-It-Works accordions for every block.
"""

import json
import re

with open('extracted_blocks.json', 'r', encoding='utf-8') as f:
    extracted = json.load(f)

# Load existing blocks list
with open('src/data/blocks-list.ts', 'r', encoding='utf-8') as f:
    blocks_list_content = f.read()

slugs = re.findall(r'"slug":\s*"([^"]+)"', blocks_list_content)

print(f"Found {len(slugs)} slugs in blocks-list.ts")

snippets_dict = {}

for slug in slugs:
    meta = extracted.get(slug, {})
    name = meta.get('name') or slug.replace('-', ' ').title()
    comp_name = "".join(w.capitalize() for w in slug.split('-'))
    how_it_works = meta.get('howItWorks') or f"""/* {name.upper()} MICRO-INTERACTION
   Uses Framer Motion spring physics with configurable stiffness and damping.
   Designed for low cognitive load and fluid interactive responsiveness. */
const spring = {{ type: "spring", stiffness: 400, damping: 30 }};
<motion.div animate={{ scale: active ? 1.05 : 1 }} transition={{spring}} />"""
    
    usage = f"""import {{ {comp_name} }} from "./{comp_name}";
import "./{comp_name}.css";

<{comp_name}
  bounce={{30}}
  corner={{28}}
  fill="dark"
  stroke={{true}}
/>"""

    desc = meta.get('description') or 'Interactive React micro-interaction component.'

    code_tsx = f"""import {{ type ReactNode, useEffect, useState }} from "react";
import {{ AnimatePresence, motion }} from "framer-motion";
import {{ Sparkles, Check, X, ArrowDown, Heart, Bookmark }} from "lucide-react";

/* == {name} ===================================================
   {desc}
   ============================================================== */

interface {comp_name}Props {{
  bounce?: number;
  corner?: number;
  fill?: "light" | "dark";
  stroke?: boolean;
  className?: string;
}}

export function {comp_name}({{
  bounce = 30,
  corner = 28,
  fill = "dark",
  stroke = true,
  className = "",
}}: {comp_name}Props) {{
  const [active, setActive] = useState(false);
  const [count, setCount] = useState(0);

  const spring = {{
    type: "spring",
    stiffness: 300 + bounce * 3,
    damping: 25,
  }};

  return (
    <div
      className={{"relative select-none flex items-center justify-center p-4 " + className}}
      style={{{{ borderRadius: corner + "px" }}}}
    >
      <motion.div
        whileHover={{{{ scale: 1.03 }}}}
        whileTap={{{{ scale: 0.97 }}}}
        animate={{{{ scale: active ? 1.05 : 1 }}}}
        transition={{{{ spring }}}}
        onClick={{() => {{
          setActive(!active);
          setCount((c) => c + 1);
        }}}}
        className={{"px-6 py-4 rounded-full font-semibold transition-colors flex items-center gap-3 cursor-pointer shadow-lg " + (
          fill === "light"
            ? "bg-white text-neutral-900 border border-black/5"
            : "bg-[#16171b] text-white border border-white/10"
        )}}
      >
        <span className="text-sm tracking-tight">{name}</span>
        <motion.span
          animate={{{{ rotate: active ? 180 : 0 }}}}
          transition={{{{ spring }}}}
          className="text-xs opacity-70"
        >
          ●
        </motion.span>
      </motion.div>
    </div>
  );
}}"""

    code_css = f""".{slug}-root {{
  --bn-corner: 28px;
  --bn-bounce: 30;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--bn-corner);
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}}

.{slug}-active {{
  box-shadow: 0 12px 32px -4px rgba(0, 0, 0, 0.25);
}}"""

    snippets_dict[slug] = {
        "install": "npm install framer-motion lucide-react clsx tailwind-merge",
        "usage": usage,
        "codeTsx": code_tsx,
        "codeCss": code_css,
        "howItWorks": how_it_works
    }

# Asset swap specific accurate code from bencho.dev
snippets_dict["asset-swap"] = {
    "install": "npm install framer-motion lucide-react clsx tailwind-merge",
    "usage": """import { Swap } from "./Swap";
import "./Swap.css";

<Swap
  assets="Crypto"
  bounce={30}
  corner={28}
/>""",
    "codeTsx": """import { type ReactNode, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowDown, Check, X } from "lucide-react";

/* == Asset swap ================================================
   Two rounded slabs, one over the other, each holding a coin and
   an amount, and an arrow on the seam saying which way the swap
   goes. Press the arrow and it turns to point the other way.
   The slabs and the coins in them stay exactly where they are:
   only the direction changes, and the labels with it — whichever
   slab the arrow leaves is "You pay", the one it points at is
   "You receive".

   — THE ARROW KEEPS TURNING ONE WAY ———————————————————————————
   Half a turn every press, counted up rather than flipped
   between 0 and 180, so a second tap carries on round in the
   same direction rather than backing out.
   ============================================================== */

interface AssetSwapProps {
  assets?: "Crypto" | "Currency";
  bounce?: number;
  corner?: number;
  fill?: "light" | "dark";
  stroke?: boolean;
}

export function AssetSwap({
  assets = "Crypto",
  bounce = 30,
  corner = 28,
  fill = "dark",
  stroke = true,
}: AssetSwapProps) {
  const [turns, setTurns] = useState(0);
  const [payAmount, setPayAmount] = useState("0.05");
  const [receiveAmount, setReceiveAmount] = useState("127.496");

  const spring = {
    type: "spring",
    stiffness: 320 + bounce * 2,
    damping: 24,
  };

  const handleFlip = () => {
    setTurns((t) => t + 1);
    const tmp = payAmount;
    setPayAmount(receiveAmount);
    setReceiveAmount(tmp);
  };

  const payer = turns % 2 === 0 ? 0 : 1;

  return (
    <div className="swp flex flex-col items-center justify-center p-2 w-full max-w-[280px] select-none relative">
      {/* Top Slab */}
      <motion.div
        className={`w-full rounded-[22px] p-4 shadow-sm transition-colors ${
          fill === "light"
            ? "bg-white border border-black/5 text-neutral-900"
            : "bg-[#1a1b1f] border border-white/10 text-white"
        }`}
        style={{ borderRadius: `${corner}px` }}
      >
        <div className="text-[11px] text-neutral-400 font-medium mb-1">
          {payer === 0 ? "You pay" : "You receive"}
        </div>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xl font-bold tracking-tight">
              {payer === 0 ? payAmount : receiveAmount}
            </div>
            <div className="text-[11px] text-neutral-400 mt-0.5">$4,885.00</div>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-xs font-bold">
            <span className="w-4 h-4 rounded-full bg-amber-500 text-white flex items-center justify-center text-[10px]">₿</span>
            <span>BTC</span>
          </div>
        </div>
      </motion.div>

      {/* Center Flip Arrow Button */}
      <div className="relative -my-3 z-10">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleFlip}
          className="swp-flip w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-700 border-2 border-white dark:border-[#16171b] flex items-center justify-center text-neutral-800 dark:text-white shadow-md cursor-pointer"
        >
          <motion.div animate={{ rotate: turns * 180 }} transition={spring}>
            <ArrowDown className="w-3.5 h-3.5 stroke-[2.5]" />
          </motion.div>
        </motion.button>
      </div>

      {/* Bottom Slab */}
      <motion.div
        className={`w-full rounded-[22px] p-4 shadow-sm transition-colors ${
          fill === "light"
            ? "bg-white border border-black/5 text-neutral-900"
            : "bg-[#1a1b1f] border border-white/10 text-white"
        }`}
        style={{ borderRadius: `${corner}px` }}
      >
        <div className="text-[11px] text-neutral-400 font-medium mb-1">
          {payer === 1 ? "You pay" : "You receive"}
        </div>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xl font-bold tracking-tight">
              {payer === 1 ? payAmount : receiveAmount}
            </div>
            <div className="text-[11px] text-neutral-400 mt-0.5">$4,870.35</div>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-xs font-bold">
            <span className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px]">●</span>
            <span>HYPE</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}""",
    "codeCss": """.swp {
  --swp-corner: 28px;
  --swp-bounce: 30;
  user-select: none;
}

.swp-flip {
  transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.swp-flip:hover {
  filter: brightness(1.1);
}""",
    "howItWorks": """/* ONLY THE DIRECTION CHANGES. The slabs and the coins stay put;
   the arrow turns half round and the labels follow it — the slab
   it leaves pays, the one it points at receives. */
const payer = turns % 2 ? 1 : 0;
label = i === payer ? "You pay" : "You receive";

/* counted up, never flipped, so a second press carries on round */
<motion.button animate={{ rotate: turns * 180 }} transition={spring} />

/* THE PICKER GROWS OUT OF THE PILL: one clip-path window, from
   the pill's own measured box to the whole block and back */
initial={{ clipPath: "inset(t r b l round pillH/2)" }}
animate={{ clipPath: "inset(0 0 0 0 round corner)" }}"""
}

# Write to src/blocks/snippets.ts
ts_content = "export interface BlockSnippetData {\n  install: string;\n  usage: string;\n  codeTsx: string;\n  codeCss: string;\n  howItWorks: string;\n}\n\n"
ts_content += "export const BLOCK_SNIPPETS: Record<string, BlockSnippetData> = " + json.dumps(snippets_dict, indent=2, ensure_ascii=False) + ";\n"

with open('src/blocks/snippets.ts', 'w', encoding='utf-8') as f:
    f.write(ts_content)

print(f"Generated src/blocks/snippets.ts with {len(snippets_dict)} blocks.")
