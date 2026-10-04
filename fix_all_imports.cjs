const fs = require('fs');
const path = require('path');

async function main() {
  const lucide = await import('lucide-react');
  const lucideKeys = new Set(Object.keys(lucide));

  console.log(`Loaded ${lucideKeys.size} valid Lucide exports.`);

  const iconReplacements = {
    FunnelIcon: 'FilterIcon',
    Funnel: 'Filter',
    CircleQuestionMarkIcon: 'CircleHelpIcon',
    CircleQuestionMark: 'CircleHelp',
    DotsVerticalIcon: 'MoreVerticalIcon',
    DotsHorizontalIcon: 'MoreHorizontalIcon',
  };

  let fixedFiles = 0;

  function scan(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const e of entries) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) {
        scan(full);
      } else if (e.name.endsWith('.tsx') || e.name.endsWith('.ts')) {
        let content = fs.readFileSync(full, 'utf8');
        let modified = false;

        // Check Lucide imports
        const lucideMatches = [...content.matchAll(/import\s*\{([^}]+)\}\s*from\s*['"]lucide-react['"]/g)];
        for (const m of lucideMatches) {
          const names = m[1].split(',').map((s) => s.trim()).filter(Boolean);
          for (const raw of names) {
            const name = raw.split(' as ')[0].trim();
            if (name && !name.startsWith('type ') && !lucideKeys.has(name)) {
              console.log(`Unknown icon in ${full}: ${name}`);
              // Check if replacement exists
              if (iconReplacements[name]) {
                const rep = iconReplacements[name];
                content = content.replace(new RegExp(`\\b${name}\\b`, 'g'), rep);
                modified = true;
                console.log(`  -> replaced with ${rep}`);
              } else if (name.endsWith('Icon')) {
                const base = name.slice(0, -4);
                if (lucideKeys.has(base)) {
                  content = content.replace(new RegExp(`\\b${name}\\b`, 'g'), `${base} as ${name}`);
                  modified = true;
                }
              }
            }
          }
        }

        // Check zod imports (e.g. flattenError)
        if (content.includes('flattenError') && content.includes('from "zod"') || content.includes("from 'zod'")) {
          content = content.replace(/import\s*\{[^}]*flattenError[^}]*\}\s*from\s*['"]zod['"];?/g, "import { z } from 'zod';");
          content = content.replace(/flattenError\(([^)]+)\)/g, "($1).flatten()");
          modified = true;
          console.log(`Fixed zod flattenError in ${full}`);
        }

        if (modified) {
          fs.writeFileSync(full, content, 'utf8');
          fixedFiles++;
        }
      }
    }
  }

  scan('components');
  console.log(`Finished. Fixed ${fixedFiles} files.`);
}

main();
