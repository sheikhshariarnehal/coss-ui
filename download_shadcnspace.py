#!/usr/bin/env python3
"""
download_shadcnspace.py
=======================
Downloads all available components from https://shadcnspace.com/components,
organizes them into `components/shadcnspace/<category>/`,
saves all accompanying assets/css, generates a comprehensive `registry.json`,
and creates `src/data/shadcnspace-list.ts` for live browsing in Coss UI.
"""

import os
import re
import sys
import json
import time
import urllib.request
import urllib.error
from concurrent.futures import ThreadPoolExecutor, as_completed

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
TARGET_DIR = os.path.join(BASE_DIR, "components", "shadcnspace")
REGISTRY_JSON_PATH = os.path.join(TARGET_DIR, "registry.json")
TS_OUTPUT_PATH = os.path.join(BASE_DIR, "src", "data", "shadcnspace-list.ts")

BASE_URL = "https://shadcnspace.com"
COMPONENTS_URL = f"{BASE_URL}/components"
REGISTRY_ITEM_URL = f"{BASE_URL}/r/{{slug}}.json"

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
}

def fetch_url(url, retries=3, timeout=15):
    """Fetch URL with retries and exponential backoff."""
    for attempt in range(retries):
        try:
            req = urllib.request.Request(url, headers=HEADERS)
            with urllib.request.urlopen(req, timeout=timeout) as resp:
                return resp.read()
        except urllib.error.HTTPError as e:
            # If 403 or 404, don't retry, re-raise immediately
            if e.code in (403, 404):
                raise e
            if attempt < retries - 1:
                time.sleep(1.0 * (attempt + 1))
            else:
                raise e
        except Exception as e:
            if attempt < retries - 1:
                time.sleep(1.0 * (attempt + 1))
            else:
                raise e

def get_categories():
    """Scrapes all component categories from shadcnspace.com/components."""
    print("[*] Fetching category list from shadcnspace.com/components...")
    content = fetch_url(COMPONENTS_URL).decode("utf-8")
    categories = sorted(list(set(re.findall(r'href=["\'](/components/[a-zA-Z0-9_-]+)["\']', content))))
    print(f"[+] Found {len(categories)} categories.")
    return categories

def scrape_category_components(cat_path):
    """Scrapes component slugs for a given category."""
    url = f"{BASE_URL}{cat_path}"
    cat_name = cat_path.split("/")[-1]
    try:
        content = fetch_url(url).decode("utf-8")
        items = list(dict.fromkeys(re.findall(r"@shadcn-space/([a-zA-Z0-9_-]+)", content)))
        return cat_name, items
    except Exception as e:
        print(f"[-] Failed to scrape category {cat_name}: {e}")
        return cat_name, []

def fetch_component_json(slug, category):
    """Fetches component registry JSON by slug."""
    url = REGISTRY_ITEM_URL.format(slug=slug)
    try:
        raw = fetch_url(url)
        data = json.loads(raw.decode("utf-8"))
        data["category"] = category
        data["isPro"] = False
        return slug, data, None
    except urllib.error.HTTPError as e:
        if e.code == 403:
            # Pro item
            return slug, {
                "name": slug,
                "title": slug.replace("-", " ").title(),
                "category": category,
                "description": "Pro component on shadcnspace.com (requires Pro subscription)",
                "dependencies": [],
                "registryDependencies": [],
                "files": [],
                "isPro": True,
                "meta": {"isPro": True},
                "type": "registry:component"
            }, "403_PRO"
        return slug, None, f"HTTP Error {e.code}"
    except Exception as e:
        return slug, None, str(e)

def normalize_code_content(code_str: str) -> str:
    """
    Normalizes import paths:
    - Replaces `@/components/shadcn-space/` with `@/components/shadcnspace/`
    - Preserves standard `@/components/ui/` and `@/lib/utils`
    """
    if not code_str:
        return code_str
    
    cleaned = code_str.replace("@/components/shadcn-space/", "@/components/shadcnspace/")
    cleaned = cleaned.replace("components/shadcn-space/", "components/shadcnspace/")
    return cleaned

def main():
    start_time = time.time()
    os.makedirs(TARGET_DIR, exist_ok=True)
    os.makedirs(os.path.dirname(TS_OUTPUT_PATH), exist_ok=True)

    # 1. Discover all categories
    cat_paths = get_categories()

    # 2. Discover all component slugs across all categories concurrently
    print("[*] Discovering component slugs across all categories...")
    cat_map = {} # slug -> category
    category_slugs = {} # category -> list of slugs

    with ThreadPoolExecutor(max_workers=10) as executor:
        future_to_cat = {executor.submit(scrape_category_components, path): path for path in cat_paths}
        for future in as_completed(future_to_cat):
            cat_name, slugs = future.result()
            category_slugs[cat_name] = slugs
            for slug in slugs:
                cat_map[slug] = cat_name

    total_slugs = len(cat_map)
    print(f"[+] Discovered {total_slugs} unique components across {len(category_slugs)} categories.")

    # 3. Concurrently download all component registry JSON items
    print(f"[*] Downloading {total_slugs} component definitions from registry...")
    components_data = {}
    pro_slugs = []
    errors = []

    with ThreadPoolExecutor(max_workers=15) as executor:
        futures = {
            executor.submit(fetch_component_json, slug, cat_map[slug]): slug 
            for slug in cat_map
        }
        completed = 0
        for future in as_completed(futures):
            slug, data, err = future.result()
            completed += 1
            if err == "403_PRO":
                pro_slugs.append(slug)
                components_data[slug] = data
            elif err:
                errors.append((slug, err))
                print(f"  [{completed}/{total_slugs}] [FAIL] {slug}: {err}")
            else:
                components_data[slug] = data
                if completed % 50 == 0 or completed == total_slugs:
                    print(f"  [{completed}/{total_slugs}] Downloaded {slug}...")

    print(f"[+] Successfully fetched {len(components_data) - len(pro_slugs)} open-source components.")
    if pro_slugs:
        print(f"[i] Found {len(pro_slugs)} Pro components (cataloged in registry as Pro): {', '.join(sorted(pro_slugs)[:5])}...")
    if errors:
        print(f"[-] Encountered {len(errors)} non-Pro errors:")
        for s, err in errors:
            print(f"    - {s}: {err}")

    # 4. Save component files into components/shadcnspace/<category>/
    print(f"[*] Saving component files into {TARGET_DIR}...")
    saved_files_count = 0
    all_registry_items = []

    for cat_name, slugs in sorted(category_slugs.items()):
        cat_dir = os.path.join(TARGET_DIR, cat_name)
        os.makedirs(cat_dir, exist_ok=True)

        for slug in slugs:
            if slug not in components_data:
                continue
            item = components_data[slug]
            files = item.get("files", [])

            processed_files = []
            for file_obj in files:
                raw_target = file_obj.get("target") or file_obj.get("path") or f"{slug}.tsx"
                filename = os.path.basename(raw_target)
                file_content = file_obj.get("content", "")
                
                # Normalize content and line endings
                normalized_content = normalize_code_content(file_content).replace("\r\n", "\n").replace("\r", "\n")

                out_path = os.path.join(cat_dir, filename)
                with open(out_path, "w", encoding="utf-8", newline="\n") as f:
                    f.write(normalized_content)

                rel_target = f"components/shadcnspace/{cat_name}/{filename}"
                processed_files.append({
                    "name": filename,
                    "target": rel_target,
                    "path": rel_target,
                    "type": file_obj.get("type", "registry:component")
                })
                saved_files_count += 1

            all_registry_items.append({
                "id": slug,
                "name": item.get("title") or item.get("name") or slug,
                "slug": slug,
                "category": cat_name,
                "description": item.get("description", ""),
                "dependencies": item.get("dependencies", []),
                "devDependencies": item.get("devDependencies", []),
                "registryDependencies": item.get("registryDependencies", []),
                "files": processed_files,
                "isPro": item.get("isPro", False),
                "meta": item.get("meta", {}),
                "type": item.get("type", "registry:component")
            })

    # 5. Write components/shadcnspace/registry.json
    print(f"[*] Writing complete registry to {REGISTRY_JSON_PATH}...")
    with open(REGISTRY_JSON_PATH, "w", encoding="utf-8") as f:
        json.dump(all_registry_items, f, indent=2, ensure_ascii=False)
    print(f"[+] Saved registry.json ({len(all_registry_items)} items, {os.path.getsize(REGISTRY_JSON_PATH):,} bytes).")

    # 6. Generate src/data/shadcnspace-list.ts
    print(f"[*] Generating TypeScript registry index at {TS_OUTPUT_PATH}...")
    ts_code = f"""// Generated by download_shadcnspace.py - Do not edit directly
export interface ShadcnSpaceFile {{
  name: string;
  target: string;
  path: string;
  type: string;
}}

export interface ShadcnSpaceComponent {{
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  dependencies: string[];
  devDependencies?: string[];
  registryDependencies: string[];
  files: ShadcnSpaceFile[];
  isPro?: boolean;
  meta?: Record<string, any>;
  type: string;
}}

export const SHADCNSPACE_COMPONENTS: ShadcnSpaceComponent[] = {json.dumps(all_registry_items, indent=2, ensure_ascii=False)};

export const SHADCNSPACE_CATEGORIES: string[] = Array.from(
  new Set(SHADCNSPACE_COMPONENTS.map(c => c.category))
).sort();

export const SHADCNSPACE_BY_SLUG: Record<string, ShadcnSpaceComponent> = SHADCNSPACE_COMPONENTS.reduce(
  (acc, comp) => {{
    acc[comp.slug] = comp;
    return acc;
  }},
  {{}} as Record<string, ShadcnSpaceComponent>
);
"""
    with open(TS_OUTPUT_PATH, "w", encoding="utf-8") as f:
        f.write(ts_code)

    elapsed = time.time() - start_time
    print("\n" + "=" * 60)
    print("DOWNLOAD & CATALOGING COMPLETE")
    print(f"  * Total categories: {len(category_slugs)}")
    print(f"  * Total components: {len(all_registry_items)}")
    print(f"  * Total files saved: {saved_files_count}")
    print(f"  * Pro components: {len(pro_slugs)}")
    print(f"  * Free components: {len(all_registry_items) - len(pro_slugs)}")
    print(f"  * Registry JSON: components/shadcnspace/registry.json")
    print(f"  * TypeScript index: src/data/shadcnspace-list.ts")
    print(f"  * Elapsed time: {elapsed:.2f} seconds")
    print("=" * 60)

if __name__ == "__main__":
    main()
