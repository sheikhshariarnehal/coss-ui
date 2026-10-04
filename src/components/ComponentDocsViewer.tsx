import React, { useState, useEffect, Suspense, useMemo } from 'react';
import { ComponentMeta } from '../data/components-list';
import {
  getComponentSourceCode,
  getParticleSourceCode,
  getComponentDocumentation,
  loadParticleComponent,
} from '../data/dynamic-loader';
import { CodeBlock } from './CodeBlock';
import {
  ExternalLink,
  Copy,
  Check,
  Sparkles,
  BookOpen,
} from 'lucide-react';

interface ComponentDocsViewerProps {
  component: ComponentMeta;
}

interface TocItem {
  title: string;
  url: string;
  depth: number;
}

interface ApiRefItem {
  name: string;
  slug: string;
  description: string;
}

interface ExampleItem {
  title: string;
  slug: string;
  particleName: string;
}

export const ComponentDocsViewer: React.FC<ComponentDocsViewerProps> = ({ component }) => {
  const [componentCode, setComponentCode] = useState<string>('');
  const [docContent, setDocContent] = useState<string>('');
  const [primaryParticleCode, setPrimaryParticleCode] = useState<string>('');
  const [activeMainTab, setActiveMainTab] = useState<'preview' | 'code'>('preview');
  const [installTab, setInstallTab] = useState<'cli' | 'manual'>('cli');
  const [copiedMd, setCopiedMd] = useState(false);
  const [exampleCodes, setExampleCodes] = useState<Record<string, string>>({});
  const [exampleTabs, setExampleTabs] = useState<Record<string, 'preview' | 'code'>>({});
  const [activeHeading, setActiveHeading] = useState<string>('installation');

  // Load code and documentation when component changes
  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      const [src, doc] = await Promise.all([
        getComponentSourceCode(component.slug),
        getComponentDocumentation(component.slug),
      ]);

      if (!isMounted) return;
      setComponentCode(src);
      setDocContent(doc);

      if (component.examples.length > 0) {
        const primaryEx = component.examples[0];
        const exCode = await getParticleSourceCode(component.slug, primaryEx.filename);
        if (isMounted) setPrimaryParticleCode(exCode);

        // Load all example codes in background
        const codesMap: Record<string, string> = { [primaryEx.id]: exCode };
        for (const ex of component.examples.slice(1)) {
          const c = await getParticleSourceCode(component.slug, ex.filename);
          codesMap[ex.id] = c;
        }
        if (isMounted) setExampleCodes(codesMap);
      } else {
        setPrimaryParticleCode(src);
      }
    }

    loadData();
    setActiveMainTab('preview');
    return () => {
      isMounted = false;
    };
  }, [component]);

  // Parse Markdown for TOC, API Reference items, and Example items
  const { toc, apiRefs, parsedExamples } = useMemo(() => {
    const tocList: TocItem[] = [];
    const apiList: ApiRefItem[] = [];
    const exList: ExampleItem[] = [];

    if (!docContent) {
      tocList.push({ title: 'Installation', url: '#installation', depth: 2 });
      tocList.push({ title: 'Usage', url: '#usage', depth: 2 });
      if (component.examples.length > 0) {
        tocList.push({ title: 'Examples', url: '#examples', depth: 2 });
      }
      return { toc: tocList, apiRefs: apiList, parsedExamples: exList };
    }

    const lines = docContent.split('\n');
    let currentH2 = '';
    let currentH3 = '';
    let currentH3Slug = '';
    let currentDesc = '';

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      if (line.startsWith('## ')) {
        if (currentH2 === 'api reference' && currentH3) {
          apiList.push({
            name: currentH3,
            slug: currentH3Slug,
            description: currentDesc.trim(),
          });
          currentH3 = '';
          currentDesc = '';
        }

        const h2Title = line.replace('## ', '').trim();
        const slug = h2Title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        currentH2 = h2Title.toLowerCase();
        tocList.push({ title: h2Title, url: `#${slug}`, depth: 2 });
      } else if (line.startsWith('### ')) {
        const h3Title = line.replace('### ', '').trim();
        const slug = h3Title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

        if (currentH2 === 'api reference') {
          if (currentH3) {
            apiList.push({
              name: currentH3,
              slug: currentH3Slug,
              description: currentDesc.trim(),
            });
            currentDesc = '';
          }
          currentH3 = h3Title;
          currentH3Slug = slug;
        }

        tocList.push({ title: h3Title, url: `#${slug}`, depth: 3 });

        if (currentH2 === 'examples') {
          let pName = '';
          for (let j = i + 1; j < Math.min(i + 8, lines.length); j++) {
            const nextL = lines[j];
            if (nextL.startsWith('## ') || nextL.startsWith('### ')) break;
            const m = nextL.match(/<ComponentPreview\s+name=["']([^"']+)["']/);
            if (m) {
              pName = m[1];
              break;
            }
          }
          exList.push({
            title: h3Title,
            slug: slug,
            particleName: pName || (component.examples[exList.length]?.id || ''),
          });
        }
      } else if (currentH2 === 'api reference' && currentH3) {
        if (!line.startsWith('<') && !line.startsWith('```')) {
          currentDesc += (currentDesc ? '\n' : '') + line;
        }
      }
    }

    if (currentH2 === 'api reference' && currentH3) {
      apiList.push({
        name: currentH3,
        slug: currentH3Slug,
        description: currentDesc.trim(),
      });
    }

    return { toc: tocList, apiRefs: apiList, parsedExamples: exList };
  }, [docContent, component]);

  // Scroll spy for Right TOC
  useEffect(() => {
    const handleScroll = () => {
      const itemIds = toc.map((item) => item.url.replace('#', ''));
      const scrollPos = window.scrollY + 160;

      for (let i = itemIds.length - 1; i >= 0; i--) {
        const id = itemIds[i];
        const el = document.getElementById(id);
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY;
          if (top <= scrollPos) {
            setActiveHeading(id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [toc]);

  const handleCopyMarkdown = async () => {
    try {
      await navigator.clipboard.writeText(docContent || `# ${component.title}\n\n${component.description}`);
      setCopiedMd(true);
      setTimeout(() => setCopiedMd(false), 2000);
    } catch (err) {
      console.error('Failed to copy markdown:', err);
    }
  };

  const primaryExample = component.examples[0];
  const PrimaryLiveComponent = primaryExample
    ? loadParticleComponent(component.slug, primaryExample.filename)
    : null;

  const displayExamples =
    parsedExamples.length > 0
      ? parsedExamples
      : component.examples.map((ex) => ({
          title: ex.title,
          slug: `example-${ex.id}`,
          particleName: ex.id,
        }));

  return (
    <div className="flex items-start xl:w-full" data-slot="docs">
      {/* Central Content Card */}
      <div className="relative flex w-full min-w-0 flex-1 flex-col lg:my-8 lg:mx-4">
        <div className="relative flex flex-col rounded-2xl border border-sidebar-border bg-card not-dark:bg-clip-padding text-card-foreground shadow-xs/5 max-lg:rounded-none! dark:bg-background overflow-hidden">
          <div className="px-4 py-6 sm:px-6 lg:p-8">
            <div className="mx-auto w-full max-w-3xl">
              <div className="flex min-w-0 flex-col gap-8">
                {/* Header Title & Subtitle */}
                <div className="flex flex-col gap-2">
                  <div className="flex flex-col gap-2">
                    <h1 className="scroll-m-20 font-bold font-heading text-3xl xl:text-4xl text-foreground">
                      {component.title}
                    </h1>
                    {component.description && (
                      <p className="text-muted-foreground sm:text-lg">
                        {component.description}
                      </p>
                    )}
                  </div>

                  {/* Action Badges */}
                  <div className="flex items-center space-x-2 pt-4">
                    <a
                      href={`https://base-ui.com/react/components/${component.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="relative inline-flex shrink-0 cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap rounded-md border border-input bg-popover text-foreground shadow-xs/5 hover:bg-accent/50 h-7 px-2.5 sm:h-6 text-xs font-medium transition-colors"
                    >
                      <ExternalLink className="size-3.5 opacity-80" />
                      API Reference
                    </a>

                    <button
                      type="button"
                      onClick={handleCopyMarkdown}
                      className="relative inline-flex shrink-0 cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap rounded-md border border-input bg-popover text-foreground shadow-xs/5 hover:bg-accent/50 h-7 px-2.5 sm:h-6 text-xs font-medium transition-colors"
                    >
                      {copiedMd ? (
                        <Check className="size-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="size-3.5 opacity-80" />
                      )}
                      Copy Markdown
                    </button>
                  </div>
                </div>

                {/* Primary Preview Card */}
                <div className="group relative mt-2 mb-8 flex flex-col gap-2 **:data-[slot=preview]:w-full sm:**:data-[slot=preview]:max-w-[80%]">
                  <div className="flex items-center justify-between">
                    <div className="relative z-0 flex w-fit items-center justify-center gap-x-0.5 rounded-lg text-muted-foreground/72 bg-transparent p-0">
                      <button
                        type="button"
                        onClick={() => setActiveMainTab('preview')}
                        className={`relative flex shrink-0 grow cursor-pointer items-center justify-center whitespace-nowrap border border-transparent font-medium text-sm gap-1.5 h-8 px-2.5 rounded-lg transition-colors ${
                          activeMainTab === 'preview'
                            ? 'bg-accent text-foreground'
                            : 'text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        Preview
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveMainTab('code')}
                        className={`relative flex shrink-0 grow cursor-pointer items-center justify-center whitespace-nowrap border border-transparent font-medium text-sm gap-1.5 h-8 px-2.5 rounded-lg transition-colors ${
                          activeMainTab === 'code'
                            ? 'bg-accent text-foreground'
                            : 'text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        Code
                      </button>
                    </div>
                  </div>

                  {/* Preview Container Frame */}
                  <div
                    className="relative rounded-xl border border-border not-dark:bg-card overflow-hidden"
                    data-tab={activeMainTab}
                  >
                    {activeMainTab === 'preview' ? (
                      <div className="flex min-h-[450px] w-full justify-center items-center overflow-y-auto p-10 max-sm:px-6">
                        <div data-slot="preview" className="w-full flex items-center justify-center">
                          {PrimaryLiveComponent ? (
                            <Suspense
                              fallback={
                                <div className="text-sm text-muted-foreground animate-pulse">
                                  Rendering component...
                                </div>
                              }
                            >
                              <PrimaryLiveComponent />
                            </Suspense>
                          ) : (
                            <div className="text-sm text-muted-foreground">
                              No preview available
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="overflow-hidden">
                        <CodeBlock
                          code={primaryParticleCode || componentCode}
                          language="tsx"
                          showLineNumbers={true}
                          className="border-0 rounded-none bg-transparent"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Installation Section */}
                <section id="installation" className="space-y-4 pt-2">
                  <h2 className="scroll-m-20 font-semibold font-heading text-2xl tracking-tight text-foreground border-b border-border/40 pb-2">
                    Installation
                  </h2>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setInstallTab('cli')}
                      className={`relative flex shrink-0 grow cursor-pointer items-center justify-center whitespace-nowrap border border-transparent font-medium text-sm gap-1.5 h-8 px-2.5 rounded-lg transition-colors ${
                        installTab === 'cli'
                          ? 'bg-accent text-foreground'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      CLI
                    </button>
                    <button
                      type="button"
                      onClick={() => setInstallTab('manual')}
                      className={`relative flex shrink-0 grow cursor-pointer items-center justify-center whitespace-nowrap border border-transparent font-medium text-sm gap-1.5 h-8 px-2.5 rounded-lg transition-colors ${
                        installTab === 'manual'
                          ? 'bg-accent text-foreground'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      Manual
                    </button>
                  </div>

                  {installTab === 'cli' ? (
                    <CodeBlock
                      code={`npx shadcn@latest add @coss/${component.slug}`}
                      language="bash"
                      showLineNumbers={false}
                    />
                  ) : (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                          Install Base UI and dependencies:
                        </p>
                        <CodeBlock
                          code="npm install @base-ui/react lucide-react clsx tailwind-merge class-variance-authority"
                          language="bash"
                          showLineNumbers={false}
                        />
                      </div>

                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                          Copy and paste component code to <code className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">components/ui/{component.slug}.tsx</code>:
                        </p>
                        <CodeBlock
                          code={componentCode}
                          language="tsx"
                          filename={`components/ui/${component.slug}.tsx`}
                          showLineNumbers={true}
                        />
                      </div>
                    </div>
                  )}
                </section>

                {/* Usage Section */}
                <section id="usage" className="space-y-4 pt-4">
                  <h2 className="scroll-m-20 font-semibold font-heading text-2xl tracking-tight text-foreground border-b border-border/40 pb-2">
                    Usage
                  </h2>
                  <CodeBlock
                    code={`import { ${component.title.replace(/\s+/g, '')} } from "@/components/ui/${component.slug}";\n\nexport default function Example() {\n  return (\n    <${component.title.replace(/\s+/g, '')}>\n      {/* Content */}\n    </${component.title.replace(/\s+/g, '')}>\n  );\n}`}
                    language="tsx"
                    showLineNumbers={true}
                  />
                </section>

                {/* API Reference Section */}
                {apiRefs.length > 0 && (
                  <section id="api-reference" className="space-y-6 pt-4">
                    <h2 className="scroll-m-20 font-semibold font-heading text-2xl tracking-tight text-foreground border-b border-border/40 pb-2">
                      API Reference
                    </h2>

                    <div className="space-y-6">
                      {apiRefs.map((item) => (
                        <div
                          key={item.name}
                          id={item.slug}
                          className="rounded-xl border border-border bg-card/30 p-5 space-y-2"
                        >
                          <h3 className="font-semibold text-lg text-foreground font-mono">
                            {item.name}
                          </h3>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {item.description || `Primitive component for ${item.name}.`}
                          </p>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Interactive Examples Section - EXACT COSS UI DESIGN */}
                {displayExamples.length > 0 && (
                  <section id="examples" className="space-y-8 pt-4">
                    <h2 className="scroll-m-20 font-semibold font-heading text-2xl tracking-tight text-foreground border-b border-border/40 pb-2">
                      Examples
                    </h2>

                    <div className="space-y-10">
                      {displayExamples.map((ex) => {
                        const LiveComp = loadParticleComponent(component.slug, `${ex.particleName}.tsx`);
                        const currentTab = exampleTabs[ex.particleName] || 'preview';
                        const exCode = exampleCodes[ex.particleName] || primaryParticleCode;

                        return (
                          <div key={ex.slug} className="w-full flex-1">
                            <h3
                              id={ex.slug}
                              className="mt-8 scroll-m-20 font-semibold text-lg text-foreground"
                            >
                              {ex.title}
                            </h3>

                            <div className="group relative mt-4 mb-8 flex flex-col gap-2 **:data-[slot=preview]:w-full sm:**:data-[slot=preview]:max-w-[80%]">
                              {/* Preview / Code Tabs */}
                              <div className="flex items-center justify-between">
                                <div className="relative z-0 flex w-fit items-center justify-center gap-x-0.5 rounded-lg text-muted-foreground/72 bg-transparent p-0">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setExampleTabs((prev) => ({ ...prev, [ex.particleName]: 'preview' }))
                                    }
                                    className={`relative flex shrink-0 grow cursor-pointer items-center justify-center whitespace-nowrap border border-transparent font-medium text-sm gap-1.5 h-8 px-2.5 rounded-lg transition-colors ${
                                      currentTab === 'preview'
                                        ? 'bg-accent text-foreground'
                                        : 'text-muted-foreground hover:text-foreground'
                                    }`}
                                  >
                                    Preview
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setExampleTabs((prev) => ({ ...prev, [ex.particleName]: 'code' }))
                                    }
                                    className={`relative flex shrink-0 grow cursor-pointer items-center justify-center whitespace-nowrap border border-transparent font-medium text-sm gap-1.5 h-8 px-2.5 rounded-lg transition-colors ${
                                      currentTab === 'code'
                                        ? 'bg-accent text-foreground'
                                        : 'text-muted-foreground hover:text-foreground'
                                    }`}
                                  >
                                    Code
                                  </button>
                                </div>
                              </div>

                              {/* Example Preview Container Frame */}
                              <div
                                className="relative rounded-xl border border-border not-dark:bg-card overflow-hidden"
                                data-tab={currentTab}
                              >
                                {currentTab === 'preview' ? (
                                  <div className="flex min-h-[450px] w-full justify-center items-center overflow-y-auto p-10 max-sm:px-6">
                                    <div data-slot="preview" className="w-full flex items-center justify-center">
                                      {LiveComp ? (
                                        <Suspense
                                          fallback={
                                            <div className="text-sm text-muted-foreground animate-pulse">
                                              Rendering component...
                                            </div>
                                          }
                                        >
                                          <LiveComp />
                                        </Suspense>
                                      ) : (
                                        <div className="text-sm text-muted-foreground">
                                          Preview unavailable
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                ) : (
                                  <div className="overflow-hidden">
                                    <CodeBlock
                                      code={exCode || '// Loading code...'}
                                      language="tsx"
                                      showLineNumbers={true}
                                      className="border-0 rounded-none bg-transparent"
                                    />
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </section>
                )}
              </div>
            </div>
          </div>

          {/* Footer exactly matching Coss UI site footer */}
          <div className="border-t border-sidebar-border px-4 py-6 lg:rounded-b-2xl lg:px-8 mt-12">
            <div className="space-y-1">
              <div className="font-bold text-sm text-foreground">coss.com ui</div>
              <div className="text-xs text-muted-foreground">
                Built by and for the team of Cal.com, Inc. — the leading commercial open source company ("coss").
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar ("On This Page" Table of Contents matching docs-toc.tsx) */}
      <div className="sticky top-16 z-30 ms-auto hidden h-[calc(100vh-4rem)] w-64 flex-col overflow-y-auto no-scrollbar overscroll-none xl:flex self-start py-8">
        <div className="z-10 flex flex-col gap-1 py-2 ps-4 pe-4 text-sm">
          <p className="flex h-7 items-center font-medium text-xs text-foreground">
            On This Page
          </p>
          <div className="relative ms-3.5 flex flex-col gap-0.5 before:absolute before:inset-y-0 before:-left-3.25 before:w-px before:bg-border">
            {toc.map((item) => {
              const itemId = item.url.replace('#', '');
              const isActive = activeHeading === itemId;

              return (
                <a
                  key={item.url}
                  href={item.url}
                  data-active={isActive}
                  data-depth={item.depth}
                  className={`relative py-1 text-[.8125rem] text-sidebar-foreground leading-4.5 no-underline transition-colors before:absolute before:inset-y-px before:-left-3.25 before:w-px before:rounded-full hover:bg-transparent hover:text-foreground data-[active=true]:bg-transparent data-[active=true]:text-foreground data-[active=true]:font-medium data-[active=true]:before:w-0.5 data-[active=true]:before:bg-primary ${
                    item.depth === 3 ? 'ps-3.5 text-muted-foreground' : 'font-medium'
                  }`}
                >
                  {item.title}
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
