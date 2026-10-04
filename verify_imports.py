import glob
import re
import os

missing = []

for f in glob.glob('components/*/*.tsx') + glob.glob('components/*/examples/*.tsx'):
    content = open(f, encoding='utf-8', errors='ignore').read()
    
    # UI imports
    for m in re.findall(r'from\s+["\']@/registry/default/ui/([^"\']+)["\']', content) + re.findall(r'from\s+["\']@coss/ui/components/([^"\']+)["\']', content):
        target = f'components/{m}/{m}.tsx'
        if not os.path.exists(target):
            missing.append((f, m, target))

    # Lib imports
    for m in re.findall(r'from\s+["\']@/registry/default/lib/([^"\']+)["\']', content) + re.findall(r'from\s+["\']@coss/ui/lib/([^"\']+)["\']', content):
        target1 = f'lib/{m}.ts'
        target2 = f'lib/{m}.tsx'
        if not os.path.exists(target1) and not os.path.exists(target2):
            missing.append((f, m, target1))

    # Hook imports
    for m in re.findall(r'from\s+["\']@/registry/default/hooks/([^"\']+)["\']', content) + re.findall(r'from\s+["\']@coss/ui/hooks/([^"\']+)["\']', content):
        target1 = f'hooks/{m}.ts'
        target2 = f'hooks/{m}.tsx'
        if not os.path.exists(target1) and not os.path.exists(target2):
            missing.append((f, m, target1))

print(f"Total missing: {len(missing)}")
for src, m, tgt in missing[:20]:
    print(f"  {src} -> wants '{m}', expected '{tgt}'")
