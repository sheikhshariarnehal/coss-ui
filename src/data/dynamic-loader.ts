import React from 'react';

// Vite Glob loaders
const rawComponentCodes = import.meta.glob('/components/*/*.tsx', { query: '?raw', import: 'default' });
const rawParticleCodes = import.meta.glob('/components/*/examples/*.tsx', { query: '?raw', import: 'default' });
const rawDocs = import.meta.glob('/components/*/README.md', { query: '?raw', import: 'default' });

// Dynamic React component modules for live rendering
const particleModules = import.meta.glob('/components/*/examples/*.tsx');
const componentModules = import.meta.glob('/components/*/*.tsx');

export async function getComponentSourceCode(slug: string): Promise<string> {
  const key = `/components/${slug}/${slug}.tsx`;
  if (rawComponentCodes[key]) {
    const code = await rawComponentCodes[key]();
    return typeof code === 'string' ? code : '';
  }
  return '// Source code not found';
}

export async function getParticleSourceCode(slug: string, filename: string): Promise<string> {
  const key = `/components/${slug}/examples/${filename}`;
  if (rawParticleCodes[key]) {
    const code = await rawParticleCodes[key]();
    return typeof code === 'string' ? code : '';
  }
  return '// Example code not found';
}

export async function getComponentDocumentation(slug: string): Promise<string> {
  const key = `/components/${slug}/README.md`;
  if (rawDocs[key]) {
    const doc = await rawDocs[key]();
    return typeof doc === 'string' ? doc : '';
  }
  return '# Documentation not found';
}

export function loadParticleComponent(slug: string, filename: string): React.LazyExoticComponent<React.ComponentType<any>> | null {
  const key = `/components/${slug}/examples/${filename}`;
  if (particleModules[key]) {
    return React.lazy(async () => {
      try {
        const mod: any = await particleModules[key]();
        // Return default export or first component function found
        if (mod.default) {
          return { default: mod.default };
        }
        for (const exp of Object.values(mod)) {
          if (typeof exp === 'function') {
            return { default: exp as React.ComponentType<any> };
          }
        }
        return { default: () => React.createElement('div', null, 'Component loaded') };
      } catch (err: any) {
        console.error(`Failed to load particle ${key}:`, err);
        return {
          default: () =>
            React.createElement(
              'div',
              { className: 'p-4 rounded-lg bg-red-950/20 border border-red-500/20 text-red-400 text-sm' },
              `Preview error: ${err?.message || 'Unable to render component in preview mode.'}`
            ),
        };
      }
    });
  }
  return null;
}
