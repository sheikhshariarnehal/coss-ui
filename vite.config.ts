import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import fs from 'fs';

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
  ],
  resolve: {
    alias: [
      {
        find: /^@\/origin\/(.+)$/,
        replacement: path.resolve(__dirname, 'registry/default/$1'),
      },
      {
        find: /^@\/registry\/default\/ui\/(.+)$/,
        replacement: path.resolve(__dirname, 'components/$1/$1.tsx'),
      },
      {
        find: /^@coss\/ui\/components\/(.+)$/,
        replacement: path.resolve(__dirname, 'components/$1/$1.tsx'),
      },
      {
        find: /^@\/components\/shadcnspace\/(.+)$/,
        replacement: path.resolve(__dirname, 'components/shadcnspace/$1'),
      },
      {
        find: /^@\/components\/ui\/(.+)$/,
        replacement: path.resolve(__dirname, 'registry/default/ui/$1.tsx'),
      },
      {
        find: /^@\/registry\/default\/lib\/(.+)$/,
        replacement: path.resolve(__dirname, 'lib/$1.ts'),
      },
      {
        find: /^@coss\/ui\/lib\/(.+)$/,
        replacement: path.resolve(__dirname, 'lib/$1.ts'),
      },
      {
        find: /^@\/lib\/(.+)$/,
        replacement: path.resolve(__dirname, 'lib/$1.ts'),
      },
      {
        find: /^@\/registry\/default\/hooks\/(.+)$/,
        replacement: path.resolve(__dirname, 'hooks/$1.ts'),
      },
      {
        find: /^@\/hooks\/(.+)$/,
        replacement: path.resolve(__dirname, 'hooks/$1.ts'),
      },
      {
        find: 'next/link',
        replacement: path.resolve(__dirname, 'src/shims/next-link.tsx'),
      },
      {
        find: /^@\/(.*)$/,
        replacement: path.resolve(__dirname, 'src/$1'),
      },
      {
        find: '@coss/ui',
        replacement: path.resolve(__dirname, '.'),
      },
    ],
  },
  server: {
    port: 3000,
    open: false,
  },
});
