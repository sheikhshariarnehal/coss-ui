import glob
import re

imps = set()
for f in glob.glob('components/*/*.tsx') + glob.glob('components/*/examples/*.tsx'):
    content = open(f, encoding='utf-8', errors='ignore').read()
    for m in re.findall(r'from\s+["\']([^"\']+)["\']', content):
        imps.add(m)

print("--- UNIQUE IMPORTS ---")
for imp in sorted(imps):
    print(imp)
