import React from 'react';
import { ArrowUpRight } from 'lucide-react';

interface OriginTopBannerProps {
  onSwitchToCossUi: () => void;
}

export const OriginTopBanner: React.FC<OriginTopBannerProps> = ({ onSwitchToCossUi }) => {
  return (
    <div className="relative bg-zinc-950 border-b border-zinc-800 text-zinc-300 px-4 py-2.5 text-xs sm:text-sm font-medium">
      <div className="max-w-[1416px] mx-auto flex items-center justify-center gap-1.5 text-center">
        <span>A new, modern UI component library built on top of Base UI. Explore the new</span>
        <button
          onClick={onSwitchToCossUi}
          className="group inline-flex items-center gap-1 font-semibold text-white hover:underline focus:outline-none cursor-pointer"
        >
          <span>coss.com <span className="text-zinc-400">ui</span></span>
          <ArrowUpRight className="size-3.5 text-zinc-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white" />
        </button>
      </div>
    </div>
  );
};
