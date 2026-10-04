import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import { cn } from '@coss/ui/lib/utils';

export const buttonVariants = cva(
  'relative inline-flex items-center justify-center font-semibold cursor-pointer select-none overflow-hidden transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/50 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.97] hover:-translate-y-0.5 whitespace-nowrap',
  {
    variants: {
      variant: {
        // Skeuomorphic Primary Blue (Crisp Top Specular Rim, No Ambient Drop Glow)
        primary:
          'bg-gradient-to-b from-blue-500 to-blue-600 text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.38)] hover:brightness-110 border-none',
        // Standard Neutral Default
        default:
          'bg-gradient-to-b from-zinc-800 to-zinc-950 text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2)] hover:brightness-110 border-none',
        // Skeuomorphic Emerald Green
        emerald:
          'bg-gradient-to-b from-emerald-500 to-emerald-600 text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.38)] hover:brightness-110 border-none',
        // Skeuomorphic Dark Slate
        dark:
          'bg-gradient-to-b from-[#2e2e34] to-[#18181c] text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.25)] hover:brightness-115 border-none',
        // YouTube Dark Skeuomorphic Pill (Exact YouTube Action Button)
        youtube:
          'bg-gradient-to-b from-[#3a3a40] via-[#29292d] to-[#1c1c20] text-white border border-white/[0.14] shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.32),inset_0_0_0_1px_rgba(255,255,255,0.06),0_4px_16px_rgba(0,0,0,0.45)] hover:from-[#45454c] hover:via-[#323237] hover:to-[#222226] hover:border-white/[0.22] hover:text-white active:scale-[0.97]',
        // YouTube High-Contrast Subscribe Pill
        'youtube-subscribe':
          'bg-white text-[#0f0f0f] font-semibold hover:bg-zinc-200 shadow-sm border-none active:scale-[0.97]',
        // YouTube Red CTA
        'youtube-red':
          'bg-[#ff0000] text-white font-semibold hover:bg-[#cc0000] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.3)] border-none active:scale-[0.97]',
        // Animated Rainbow Prismatic Border
        rainbow:
          'relative text-white border-2 border-transparent bg-zinc-950 shadow-[0_0_24px_rgba(255,27,107,0.35)] animate-rainbow hover:brightness-110 active:scale-[0.98]',
        // Pure Black
        black:
          'bg-gradient-to-b from-zinc-800 to-black text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.25)] hover:brightness-110 border-none',
        // Frosted Glassmorphic
        glass:
          'bg-white/[0.08] backdrop-blur-xl text-white border border-white/[0.14] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.22)] hover:bg-white/[0.14] hover:border-white/[0.24]',
        // Skeuomorphic Destructive Red
        destructive:
          'bg-gradient-to-b from-red-500 to-red-600 text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.38)] hover:brightness-110 border-none',
        // Crisp White Pill
        white:
          'bg-white text-zinc-950 font-semibold hover:bg-zinc-100 shadow-sm border-none',
      },
      size: {
        sm: 'h-9 px-4 text-xs font-semibold gap-2',
        default: 'h-12 px-7 py-2.5 text-base font-semibold gap-3.5',
        lg: 'h-14 px-9 text-lg font-semibold gap-4',
        icon: 'h-11 w-11 p-0',
      },
      shape: {
        pill: 'rounded-full',
        rounded: 'rounded-xl',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
      shape: 'pill',
    },
  }
);

export const skeuomorphicButtonVariants = buttonVariants;

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export interface SkeuomorphicButtonProps extends ButtonProps {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      shape,
      asChild = false,
      loading = false,
      leftIcon,
      rightIcon,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, shape, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin shrink-0" />
          ) : leftIcon ? (
            <span className="shrink-0 inline-flex items-center justify-center [&>svg]:h-4 [&>svg]:w-4">
              {leftIcon}
            </span>
          ) : null}
          {children}
          {!loading && rightIcon && (
            <span className="shrink-0 inline-flex items-center justify-center [&>svg]:h-4 [&>svg]:w-4">
              {rightIcon}
            </span>
          )}
        </span>
      </Comp>
    );
  }
);

Button.displayName = 'Button';

export const SkeuomorphicButton = Button;
