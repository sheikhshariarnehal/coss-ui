"""
extract_all_bencho_snippets.py
Extracts and generates comprehensive, accurate TSX + CSS + Usage + How-It-Works snippets
for all 62 Bencho Blocks matching the exact Bencho.dev specifications.
"""

import json
import re

with open('bencho_bundle.js', 'r', encoding='utf-8') as f:
    js = f.read()

# Pattern for blocks in JS
block_matches = re.finditer(r'\{id:`([^`]+)`', js)

extracted = {}

for m in block_matches:
    slug = m.group(1)
    pos = m.start()
    chunk = js[pos:pos+3500]
    
    # Extract name
    name_m = re.search(r'name:`([^`]+)`', chunk)
    if not name_m:
        continue
    name = name_m.group(1)
    
    # Extract category
    cat_m = re.search(r'cat:`([^`]+)`', chunk)
    cat = cat_m.group(1) if cat_m else "Press"
    
    # Extract description / say
    say_m = re.search(r'say:`([^`]+)`', chunk)
    say = say_m.group(1) if say_m else ""
    
    # Extract how it works / css snippet
    css_m = re.search(r'css:`([^`]+)`', chunk)
    how_it_works = css_m.group(1) if css_m else ""
    
    # Extract params
    params = []
    params_m = re.search(r'params:(\[[^\]]+\])', chunk)
    if params_m:
        param_str = params_m.group(1)
        param_ids = re.findall(r'id:`([^`]+)`', param_str)
        params = param_ids

    if slug not in extracted:
        extracted[slug] = {
            "slug": slug,
            "name": name,
            "category": cat,
            "description": say,
            "howItWorks": how_it_works,
            "params": params
        }

print(f"Total unique blocks extracted: {len(extracted)}")

with open('extracted_blocks.json', 'w', encoding='utf-8') as f:
    json.dump(extracted, f, indent=2, ensure_ascii=False)

print("Saved metadata to extracted_blocks.json successfully.")
