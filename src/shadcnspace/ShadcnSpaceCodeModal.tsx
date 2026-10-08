import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  Copy,
  Check,
  ChevronDown,
  ChevronRight,
  Folder,
  FolderOpen,
  FileCode,
  FileText,
  Loader2,
} from 'lucide-react';
import Prism from 'prismjs';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-json';
import { ShadcnSpaceComponent } from '../data/shadcnspace-list';
import { getShadcnSpaceComponentSource } from './shadcnspace-loader';

interface ShadcnSpaceCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  component: ShadcnSpaceComponent | null;
}

type PkgManager = 'pnpm' | 'npm' | 'yarn' | 'bun';

// Package Manager SVG Icons
const PnpmIcon = () => (
  <svg className="size-3.5 shrink-0" viewBox="0 0 24 24" fill="none">
    <rect x="2" y="2" width="5.5" height="5.5" rx="0.5" fill="#F69220" />
    <rect x="9.25" y="2" width="5.5" height="5.5" rx="0.5" fill="#F69220" />
    <rect x="16.5" y="2" width="5.5" height="5.5" rx="0.5" fill="#F69220" />
    <rect x="9.25" y="9.25" width="5.5" height="5.5" rx="0.5" fill="#F69220" />
    <rect x="16.5" y="9.25" width="5.5" height="5.5" rx="0.5" fill="#F69220" />
    <rect x="16.5" y="16.5" width="5.5" height="5.5" rx="0.5" fill="#F69220" />
    <rect x="2" y="9.25" width="5.5" height="5.5" rx="0.5" fill="#707070" />
    <rect x="2" y="16.5" width="5.5" height="5.5" rx="0.5" fill="#707070" />
  </svg>
);

const NpmIcon = () => (
  <svg className="size-3.5 shrink-0" viewBox="0 0 24 24" fill="none">
    <rect width="24" height="24" rx="2" fill="#CB3837" />
    <path d="M4 5h16v14H4V5zm3.5 3.5v7H11v-4.5h2.5V15.5h3.5V8.5H7.5z" fill="#FFFFFF" />
  </svg>
);

const YarnIcon = () => (
  <svg className="size-3.5 shrink-0" viewBox="0 0 24 24" fill="#2C8EBB">
    <circle cx="12" cy="12" r="10" />
    <path
      d="M7 10c1-2 4-3 6-2s3 3 2 5-3 3-5 3-4-2-4-4 1-2 1-2"
      stroke="#fff"
      strokeWidth="1.5"
      fill="none"
    />
  </svg>
);

const BunIcon = () => (
  <svg className="size-3.5 shrink-0" viewBox="0 0 24 24" fill="none">
    <ellipse cx="12" cy="14" rx="9" ry="7" fill="#FBF0DF" stroke="#D4A373" strokeWidth="1.2" />
    <circle cx="9" cy="13" r="1.1" fill="#4A3E3D" />
    <circle cx="15" cy="13" r="1.1" fill="#4A3E3D" />
    <path d="M11 16c.5.5 1.5.5 2 0" stroke="#4A3E3D" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

export const ShadcnSpaceCodeModal: React.FC<ShadcnSpaceCodeModalProps> = ({
  isOpen,
  onClose,
  component,
}) => {
  const [pkgManager, setPkgManager] = useState<PkgManager>('pnpm');
  const [copiedCli, setCopiedCli] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string>('');
  const [code, setCode] = useState<string>('');
  const [loadingCode, setLoadingCode] = useState<boolean>(false);

  // Tree collapse state
  const [isComponentsOpen, setIsComponentsOpen] = useState(true);
  const [isShadcnSpaceOpen, setIsShadcnSpaceOpen] = useState(true);
  const [isCategoryOpen, setIsCategoryOpen] = useState(true);

  // Files list for current component
  const filesList = useMemo(() => {
    if (!component) return [];
    if (component.files && component.files.length > 0) {
      return component.files.map((f) => f.name);
    }
    return [`${component.slug}.tsx`];
  }, [component]);

  // Set default selected file whenever component opens
  useEffect(() => {
    if (component) {
      const initialFile = filesList[0] || `${component.slug}.tsx`;
      setSelectedFile(initialFile);
      setIsComponentsOpen(true);
      setIsShadcnSpaceOpen(true);
      setIsCategoryOpen(true);
    }
  }, [component, filesList]);

  // Load code when component or selected file changes
  useEffect(() => {
    if (!component || !selectedFile) return;

    let isMounted = true;
    setLoadingCode(true);

    getShadcnSpaceComponentSource(component.category, selectedFile)
      .then((src) => {
        if (isMounted) {
          setCode(src);
          setLoadingCode(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.error('Failed to load code:', err);
          setCode('// Failed to load source code');
          setLoadingCode(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [component, selectedFile]);

  // CLI Command based on selected package manager
  const cliCommand = useMemo(() => {
    if (!component) return '';
    const name = `@shadcn-space/${component.slug}`;
    switch (pkgManager) {
      case 'pnpm':
        return `pnpm dlx shadcn@latest add ${name}`;
      case 'npm':
        return `npx shadcn@latest add ${name}`;
      case 'yarn':
        return `yarn dlx shadcn@latest add ${name}`;
      case 'bun':
        return `bunx --bun shadcn@latest add ${name}`;
    }
  }, [component, pkgManager]);

  const handleCopyCli = async () => {
    if (!cliCommand) return;
    try {
      await navigator.clipboard.writeText(cliCommand);
      setCopiedCli(true);
      setTimeout(() => setCopiedCli(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCopyCode = async () => {
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  // Syntax highlighted lines
  const highlightedLines = useMemo(() => {
    if (!code) return [];
    try {
      const ext = selectedFile.split('.').pop() || 'tsx';
      let lang = 'tsx';
      if (ext === 'css') lang = 'css';
      else if (ext === 'json') lang = 'json';
      else if (ext === 'js' || ext === 'jsx') lang = 'jsx';
      else if (ext === 'ts') lang = 'typescript';

      const grammar = Prism.languages[lang] || Prism.languages.tsx || Prism.languages.javascript;
      const html = Prism.highlight(code, grammar, lang);
      return html.split('\n');
    } catch {
      return code.split('\n');
    }
  }, [code, selectedFile]);

  if (!isOpen || !component) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs p-3 sm:p-6 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative flex flex-col w-full max-w-4xl lg:max-w-5xl max-h-[92vh] rounded-2xl border border-border bg-card shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="flex items-center justify-between border-b border-border/70 px-5 py-4 bg-muted/15">
          <h2 className="text-base sm:text-lg font-bold tracking-tight text-foreground">
            CLI Command
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="size-8 inline-flex items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Top CLI Action Section */}
        <div className="p-4 sm:p-5 border-b border-border/70 bg-muted/5 space-y-3">
          {/* Package Manager Selection Bar */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 p-1 rounded-lg border border-border/80 bg-muted/30">
              <button
                type="button"
                onClick={() => setPkgManager('pnpm')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
                  pkgManager === 'pnpm'
                    ? 'bg-background text-foreground shadow-xs font-semibold'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <PnpmIcon />
                <span>pnpm</span>
              </button>

              <button
                type="button"
                onClick={() => setPkgManager('npm')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
                  pkgManager === 'npm'
                    ? 'bg-background text-foreground shadow-xs font-semibold'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <NpmIcon />
                <span>npm</span>
              </button>

              <button
                type="button"
                onClick={() => setPkgManager('yarn')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
                  pkgManager === 'yarn'
                    ? 'bg-background text-foreground shadow-xs font-semibold'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <YarnIcon />
                <span>yarn</span>
              </button>

              <button
                type="button"
                onClick={() => setPkgManager('bun')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
                  pkgManager === 'bun'
                    ? 'bg-background text-foreground shadow-xs font-semibold'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <BunIcon />
                <span>bun</span>
              </button>
            </div>

            {/* Right indicator pill (matching reference style) */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-border/70 bg-muted/20 text-xs font-mono text-muted-foreground">
              <span className="size-1.5 rounded-full bg-emerald-500" />
              <span>shadcn/ui</span>
            </div>
          </div>

          {/* Command input box with copy button */}
          <div className="flex items-center justify-between rounded-lg border border-border/80 bg-background px-3.5 py-2.5 font-mono text-xs text-foreground shadow-2xs">
            <span className="truncate select-all">{cliCommand}</span>
            <button
              type="button"
              onClick={handleCopyCli}
              className="shrink-0 ml-3 inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-sans text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
              title="Copy CLI command"
            >
              {copiedCli ? (
                <>
                  <Check className="size-3.5 text-emerald-500" />
                  <span className="text-emerald-500 font-medium">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="size-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Two-Column Explorer & Code Split View */}
        <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
          {/* Left Column: Explorer Tree */}
          <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-border/70 bg-muted/10 shrink-0 flex flex-col select-none">
            <div className="px-4 py-2.5 border-b border-border/60 bg-muted/15">
              <span className="text-xs font-semibold text-foreground tracking-tight">
                Explorer
              </span>
            </div>

            <div className="flex-1 overflow-y-auto p-2 text-xs font-mono">
              {/* Root Folder: components */}
              <div>
                <button
                  type="button"
                  onClick={() => setIsComponentsOpen((prev) => !prev)}
                  className="w-full flex items-center gap-1.5 px-1.5 py-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors text-left"
                >
                  {isComponentsOpen ? (
                    <ChevronDown className="size-3.5 shrink-0 text-muted-foreground/60" />
                  ) : (
                    <ChevronRight className="size-3.5 shrink-0 text-muted-foreground/60" />
                  )}
                  {isComponentsOpen ? (
                    <FolderOpen className="size-3.5 shrink-0 text-amber-500 fill-amber-500/20" />
                  ) : (
                    <Folder className="size-3.5 shrink-0 text-amber-500 fill-amber-500/20" />
                  )}
                  <span className="font-medium text-foreground">components</span>
                </button>

                {/* Level 2: shadcn-space */}
                {isComponentsOpen && (
                  <div className="ml-4 pl-1.5 border-l border-border/50 space-y-0.5 mt-0.5">
                    <button
                      type="button"
                      onClick={() => setIsShadcnSpaceOpen((prev) => !prev)}
                      className="w-full flex items-center gap-1.5 px-1.5 py-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors text-left"
                    >
                      {isShadcnSpaceOpen ? (
                        <ChevronDown className="size-3.5 shrink-0 text-muted-foreground/60" />
                      ) : (
                        <ChevronRight className="size-3.5 shrink-0 text-muted-foreground/60" />
                      )}
                      {isShadcnSpaceOpen ? (
                        <FolderOpen className="size-3.5 shrink-0 text-amber-500 fill-amber-500/20" />
                      ) : (
                        <Folder className="size-3.5 shrink-0 text-amber-500 fill-amber-500/20" />
                      )}
                      <span className="font-medium text-foreground">shadcn-space</span>
                    </button>

                    {/* Level 3: [category] */}
                    {isShadcnSpaceOpen && (
                      <div className="ml-4 pl-1.5 border-l border-border/50 space-y-0.5 mt-0.5">
                        <button
                          type="button"
                          onClick={() => setIsCategoryOpen((prev) => !prev)}
                          className="w-full flex items-center gap-1.5 px-1.5 py-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors text-left"
                        >
                          {isCategoryOpen ? (
                            <ChevronDown className="size-3.5 shrink-0 text-muted-foreground/60" />
                          ) : (
                            <ChevronRight className="size-3.5 shrink-0 text-muted-foreground/60" />
                          )}
                          {isCategoryOpen ? (
                            <FolderOpen className="size-3.5 shrink-0 text-amber-500 fill-amber-500/20" />
                          ) : (
                            <Folder className="size-3.5 shrink-0 text-amber-500 fill-amber-500/20" />
                          )}
                          <span className="font-medium text-foreground">{component.category}</span>
                        </button>

                        {/* Level 4: Files */}
                        {isCategoryOpen && (
                          <div className="ml-4 pl-1.5 border-l border-border/50 space-y-0.5 mt-0.5">
                            {filesList.map((fileName) => {
                              const isSelected = selectedFile === fileName;
                              const isCss = fileName.endsWith('.css');
                              return (
                                <button
                                  key={fileName}
                                  type="button"
                                  onClick={() => setSelectedFile(fileName)}
                                  className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md transition-colors text-left truncate cursor-pointer ${
                                    isSelected
                                      ? 'bg-muted text-foreground font-semibold shadow-2xs'
                                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
                                  }`}
                                >
                                  {isCss ? (
                                    <FileText className="size-3.5 shrink-0 text-blue-400" />
                                  ) : (
                                    <FileCode className="size-3.5 shrink-0 text-muted-foreground" />
                                  )}
                                  <span className="truncate">{fileName}</span>
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Code Viewer */}
          <div className="flex-1 flex flex-col min-w-0 bg-card">
            {/* Code Header Bar */}
            <div className="h-10 flex items-center justify-between border-b border-border/60 bg-muted/15 px-4 text-xs font-mono text-muted-foreground">
              <div className="flex items-center gap-2 truncate min-w-0">
                <FileCode className="size-3.5 shrink-0 text-muted-foreground" />
                <span className="truncate text-foreground font-medium">
                  components/shadcn-space/{component.category}/{selectedFile}
                </span>
              </div>

              <button
                type="button"
                onClick={handleCopyCode}
                className="shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-sans text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                title="Copy code to clipboard"
              >
                {copiedCode ? (
                  <>
                    <Check className="size-3.5 text-emerald-500" />
                    <span className="text-emerald-500 font-medium">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="size-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            {/* Code Content Arena */}
            <div className="flex-1 overflow-auto p-4 max-h-[480px] bg-background/50 [scrollbar-width:thin] [scrollbar-color:rgba(150,150,150,0.25)_transparent]">
              {loadingCode ? (
                <div className="flex items-center justify-center py-24 text-muted-foreground">
                  <Loader2 className="size-6 animate-spin text-foreground/40" />
                </div>
              ) : (
                <div className="w-full font-mono text-xs sm:text-[13px] leading-relaxed">
                  {highlightedLines.map((lineHtml, idx) => (
                    <div
                      key={idx}
                      className="flex min-w-full hover:bg-muted/30 transition-colors py-0.5 rounded-xs"
                    >
                      <span className="w-10 shrink-0 text-right pr-4 select-none text-muted-foreground/35 font-mono text-xs">
                        {idx + 1}
                      </span>
                      <span
                        className="flex-1 whitespace-pre pr-6 text-foreground font-mono"
                        dangerouslySetInnerHTML={{ __html: lineHtml || '&nbsp;' }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
