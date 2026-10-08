"use client";

import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Bell,
  BookOpen,
  LayoutDashboard,
  Settings,
  Shield,
  X,
  ArrowRight,
  Check,
  AlertCircle,
  type LucideIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface DockItem {
  id: string;
  icon: LucideIcon;
  label: string;
  badge?: number;
}

const DOCK_ITEMS: DockItem[] = [
  { id: "notifications", icon: Bell, label: "Notifications", badge: 2 },
  { id: "changelog", icon: BookOpen, label: "Changelog" },
  { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { id: "settings", icon: Settings, label: "Settings" },
  { id: "security", icon: Shield, label: "Security" },
];

function DockButton({
  isActive,
  onClick,
  children,
  className,
}: {
  isActive: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative flex size-10 items-center justify-center rounded-full transition-colors hover:bg-muted/80 cursor-pointer",
        className
      )}
    >
      {isActive && (
        <motion.div
          layoutId="dock-active-bg"
          className="absolute inset-0 rounded-full bg-muted"
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
      )}
      <span className="relative z-10">{children}</span>
    </button>
  );
}

function SettingsContent() {
  const [switches, setSwitches] = useState([true, false, true]);
  const labels = ["Email notifications", "Two-factor auth", "Public profile"];

  return (
    <div className="flex flex-col gap-3">
      {labels.map((label, idx) => (
        <div key={label} className="flex items-center justify-between">
          <span className="text-sm">{label}</span>
          <Switch
            checked={switches[idx]}
            onCheckedChange={(val) =>
              setSwitches((prev) =>
                prev.map((item, i) => (i === idx ? val : item))
              )
            }
            className="cursor-pointer"
          />
        </div>
      ))}
      <div className="mt-1">
        <Button variant="outline" size="sm" className="w-full cursor-pointer">
          Advanced Settings
        </Button>
      </div>
    </div>
  );
}

function ChangelogContent() {
  const logs = [
    {
      version: "v2.4.0",
      date: "Today",
      note: "New dashboard layout & performance improvements",
    },
    {
      version: "v2.3.1",
      date: "Yesterday",
      note: "Bug fixes for mobile navigation",
    },
    {
      version: "v2.3.0",
      date: "3 days ago",
      note: "Added dark mode support across all panels",
    },
  ];

  return (
    <div className="flex flex-col">
      {logs.map((log, idx) => (
        <div key={log.version} className="flex gap-3">
          <div className="flex flex-col items-center">
            <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-foreground" />
            {idx < logs.length - 1 && (
              <span className="mt-1 w-px flex-1 bg-border" />
            )}
          </div>
          <div className="pb-4">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="h-5 text-xs">
                {log.version}
              </Badge>
              <span className="text-xs text-muted-foreground">{log.date}</span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{log.note}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

const PANELS: Record<
  string,
  {
    title: string;
    badge?: number;
    content: React.ReactNode;
    viewAllLabel?: string;
  }
> = {
  notifications: {
    title: "Notifications",
    badge: 2,
    content: (
      <div className="flex flex-col gap-1">
        {[
          { title: "New comment on your post", time: "2m ago", unread: true },
          {
            title: "Your export is ready to download",
            time: "1h ago",
            unread: true,
          },
          {
            title: "Team member joined your workspace",
            time: "3h ago",
            unread: false,
          },
        ].map((item, idx) => (
          <div
            key={idx}
            className="flex cursor-pointer items-start gap-3 rounded-lg p-2 transition-colors hover:bg-muted"
          >
            <span
              className={cn(
                "mt-1.5 h-2 w-2 shrink-0 rounded-full",
                item.unread ? "bg-blue-500" : "bg-transparent"
              )}
            />
            <div className="flex-1">
              <p className="text-sm leading-snug">{item.title}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{item.time}</p>
            </div>
          </div>
        ))}
        <div className="mt-1">
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-xs cursor-pointer"
          >
            Mark all as read
          </Button>
        </div>
      </div>
    ),
    viewAllLabel: "View all notifications",
  },
  changelog: {
    title: "What's New",
    content: <ChangelogContent />,
    viewAllLabel: "Full changelog",
  },
  dashboard: {
    title: "Dashboard",
    content: (
      <div className="grid grid-cols-2 gap-2">
        {[
          { label: "Total Users", value: "12,482", change: "+12%" },
          { label: "Revenue", value: "$48.2K", change: "+8%" },
          { label: "Active Now", value: "342", change: "+3%" },
          { label: "Uptime", value: "99.9%", change: "stable" },
        ].map((item, idx) => (
          <div key={idx} className="rounded-lg bg-muted p-3">
            <p className="text-xs text-muted-foreground">{item.label}</p>
            <p className="mt-0.5 text-base font-semibold">{item.value}</p>
            <p className="mt-0.5 text-xs text-teal-400">{item.change}</p>
          </div>
        ))}
      </div>
    ),
    viewAllLabel: "Open dashboard",
  },
  settings: {
    title: "Settings",
    content: <SettingsContent />,
  },
  security: {
    title: "Security",
    content: (
      <div className="flex flex-col divide-y divide-border">
        {[
          { label: "Password", status: "Strong", ok: true },
          { label: "2FA", status: "Not enabled", ok: false },
          { label: "Last login", status: "2 hours ago", ok: true },
          { label: "Active sessions", status: "1 device", ok: true },
        ].map((item, idx) => (
          <div key={idx} className="flex items-center justify-between py-2">
            <span className="text-sm">{item.label}</span>
            <div className="flex items-center gap-1.5">
              {item.ok ? (
                <Check className="h-3.5 w-3.5 text-teal-400" />
              ) : (
                <AlertCircle className="h-3.5 w-3.5 text-orange-400" />
              )}
              <span
                className={cn(
                  "text-xs",
                  item.ok ? "text-muted-foreground" : "text-orange-400"
                )}
              >
                {item.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    ),
    viewAllLabel: "Security settings",
  },
};

const slideVariants = {
  hidden: (dir: number) => ({
    opacity: 0,
    x: dir > 0 ? 20 : -20,
  }),
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.15 },
  },
};

export default function AppleDock02() {
  const [activeTab, setActiveTab] = useState<string | null>(DOCK_ITEMS[0].id);
  const [direction, setDirection] = useState<number>(1);
  const [contentHeight, setContentHeight] = useState<number | "auto">("auto");
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.offsetHeight);
    }
  }, [activeTab]);

  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setActiveTab(null);
      }
    };
    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, []);

  const handleSelectTab = (id: string) => {
    if (activeTab === id) {
      setActiveTab(null);
      return;
    }
    const currentIdx = DOCK_ITEMS.findIndex((item) => item.id === activeTab);
    const newIdx = DOCK_ITEMS.findIndex((item) => item.id === id);
    setDirection(newIdx > currentIdx ? 1 : -1);
    setActiveTab(id);
  };

  return (
    <div className="flex min-h-[420px] items-end justify-center bg-background p-6">
      <div ref={containerRef} className="relative flex items-center justify-center">
        <AnimatePresence>
          {activeTab && PANELS[activeTab] && (
            <motion.div
              key="panel"
              initial={{ opacity: 0, y: 8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="absolute bottom-full mb-3 w-72 overflow-hidden rounded-2xl border bg-popover shadow-lg"
            >
              <div className="flex items-center justify-between border-b px-4 py-3">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={`${activeTab}-title`}
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    transition={{ duration: 0.12 }}
                    className="flex items-center gap-2"
                  >
                    <p className="text-sm font-medium">
                      {PANELS[activeTab].title}
                    </p>
                    {PANELS[activeTab].badge && (
                      <Badge
                        variant="secondary"
                        className="h-5 px-1.5 text-xs"
                      >
                        {PANELS[activeTab].badge}
                      </Badge>
                    )}
                  </motion.div>
                </AnimatePresence>
                <Button
                  variant="ghost"
                  onClick={() => setActiveTab(null)}
                  className="rounded-full p-1 size-6 cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <motion.div
                animate={{ height: contentHeight }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="overflow-hidden"
              >
                <div ref={contentRef} className="overflow-hidden p-4">
                  <motion.div
                    key={activeTab}
                    custom={direction}
                    initial="hidden"
                    animate="visible"
                    variants={slideVariants}
                  >
                    {PANELS[activeTab].content}
                    {PANELS[activeTab].viewAllLabel && (
                      <div className="mt-3 border-t border-border pt-3">
                        <a
                          href="#"
                          className="flex items-center justify-between text-xs text-muted-foreground transition-colors hover:text-foreground"
                        >
                          {PANELS[activeTab].viewAllLabel}
                          <ArrowRight className="h-3 w-3" />
                        </a>
                      </div>
                    )}
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex h-14 w-max items-center justify-center gap-2 rounded-2xl border bg-white/10 p-2 backdrop-blur-md supports-backdrop-filter:bg-white/10 dark:bg-black/10">
          {DOCK_ITEMS.map(({ id, icon: Icon, label, badge }) => (
            <Tooltip key={id}>
              <TooltipTrigger asChild>
                <div className="relative">
                  <DockButton
                    isActive={activeTab === id}
                    onClick={() => handleSelectTab(id)}
                  >
                    <Icon className="h-5 w-5" />
                  </DockButton>
                  {badge && (
                    <span className="pointer-events-none absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
                      {badge}
                    </span>
                  )}
                </div>
              </TooltipTrigger>
              <TooltipContent side="top" className="text-xs">
                {label}
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </div>
    </div>
  );
}
