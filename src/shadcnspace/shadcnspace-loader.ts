import React from 'react';

// Vite glob loaders for Shadcn Space components
const shadcnSpaceModules = import.meta.glob('/components/shadcnspace/*/*.tsx');
const shadcnSpaceRawCodes = import.meta.glob('/components/shadcnspace/**/*.{tsx,ts,css,jsx,json}', {
  query: '?raw',
  import: 'default',
});

export async function getShadcnSpaceComponentSource(category: string, filename: string): Promise<string> {
  let file = filename;
  if (!file.includes('.')) {
    file = `${file}.tsx`;
  }
  const key = `/components/shadcnspace/${category}/${file}`;
  if (shadcnSpaceRawCodes[key]) {
    const code = await shadcnSpaceRawCodes[key]();
    return typeof code === 'string' ? code : '';
  }
  return '// Source code not found';
}

export function loadShadcnSpaceComponent(
  category: string,
  filename: string
): React.LazyExoticComponent<React.ComponentType<any>> | null {
  const file = filename.endsWith('.tsx') ? filename : `${filename}.tsx`;
  const key = `/components/shadcnspace/${category}/${file}`;

  if (shadcnSpaceModules[key]) {
    return React.lazy(async () => {
      try {
        const mod: any = await shadcnSpaceModules[key]();
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
        console.error(`Failed to load shadcn space component ${key}:`, err);
        return {
          default: () =>
            React.createElement(
              'div',
              { className: 'p-4 text-xs text-red-400 border border-red-500/20 rounded bg-red-500/5' },
              `Error loading component ${key}: ${err?.message || 'Unknown error'}`
            ),
        };
      }
    });
  }
  return null;
}
