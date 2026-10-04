import * as LucideAll from 'lucide-react';
import React from 'react';

// Fallback Icon component if an icon name doesn't exist
const FallbackIcon = (props: React.SVGProps<SVGSVGElement>) =>
  React.createElement(
    'svg',
    {
      width: 24,
      height: 24,
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      strokeWidth: 2,
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
      ...props,
    },
    React.createElement('circle', { cx: 12, cy: 12, r: 10 }),
    React.createElement('line', { x1: 12, y1: 8, x2: 12, y2: 12 }),
    React.createElement('line', { x1: 12, y1: 16, x2: 12.01, y2: 16 })
  );

// Name aliases
const ALIASES: Record<string, string> = {
  CircleQuestionMarkIcon: 'CircleHelpIcon',
  CircleQuestionMark: 'CircleHelp',
  DotsVerticalIcon: 'MoreVerticalIcon',
  DotsHorizontalIcon: 'MoreHorizontalIcon',
  SlidersHorizontalIcon: 'SlidersHorizontal',
};

export const lucideProxy = new Proxy(LucideAll, {
  get(target, prop: string) {
    if (prop in target) {
      return (target as any)[prop];
    }
    if (ALIASES[prop] && (target as any)[ALIASES[prop]]) {
      return (target as any)[ALIASES[prop]];
    }
    // Try removing or adding 'Icon' suffix
    if (prop.endsWith('Icon')) {
      const base = prop.slice(0, -4);
      if (base in target) return (target as any)[base];
    } else {
      const withIcon = prop + 'Icon';
      if (withIcon in target) return (target as any)[withIcon];
    }

    return FallbackIcon;
  },
});

export * from 'lucide-react';
export default lucideProxy;
