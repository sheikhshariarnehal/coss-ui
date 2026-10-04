import React from 'react';

// Vite glob loaders for Origin components
const originModules = import.meta.glob('/registry/default/components/comp-*.tsx');
const originRawCodes = import.meta.glob('/registry/default/components/comp-*.tsx', {
  query: '?raw',
  import: 'default',
});

export async function getOriginComponentSource(name: string): Promise<string> {
  const key = `/registry/default/components/${name}.tsx`;
  if (originRawCodes[key]) {
    const code = await originRawCodes[key]();
    return typeof code === 'string' ? code : '';
  }
  return '// Source code not found';
}

export function loadOriginComponent(name: string): React.LazyExoticComponent<React.ComponentType<any>> | null {
  const key = `/registry/default/components/${name}.tsx`;
  if (originModules[key]) {
    return React.lazy(async () => {
      try {
        const mod: any = await originModules[key]();
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
        console.error(`Failed to load origin component ${name}:`, err);
        return {
          default: () =>
            React.createElement(
              'div',
              { className: 'p-4 text-xs text-red-400 border border-red-500/20 rounded bg-red-500/5' },
              `Error loading component ${name}: ${err?.message || 'Unknown error'}`
            ),
        };
      }
    });
  }
  return null;
}
