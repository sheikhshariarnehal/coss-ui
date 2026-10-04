#!/usr/bin/env python3
"""
coss UI Component Downloader & Organizer
========================================
Downloads all components, documentation, particle examples, hooks, and utilities
from coss.com UI (cosscom/coss repository on GitHub) and organizes them into
clean, standalone, developer-friendly component folders.

Structure:
  components/
    <component-name>/
      <component-name>.tsx   -> Component source code
      README.md              -> Markdown documentation
      examples/              -> All particle / interactive example files
        p-<component-name>-1.tsx
        p-<component-name>-2.tsx
        ...
  lib/                       -> Shared utilities (e.g., utils.ts / cn helper)
  hooks/                     -> Custom React hooks
  base-ui/                   -> Base UI wrapper primitives
  styles/                    -> Theme & CSS styles
  README.md                  -> Complete index of all components
"""

import io
import os
import re
import sys
import json
import shutil
import zipfile
import urllib.request

REPO_ZIP_URL = "https://github.com/cosscom/coss/archive/refs/heads/main.zip"
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

COMPONENTS_DIR = os.path.join(BASE_DIR, "components")
LIB_DIR = os.path.join(BASE_DIR, "lib")
HOOKS_DIR = os.path.join(BASE_DIR, "hooks")
BASE_UI_DIR = os.path.join(BASE_DIR, "base-ui")
STYLES_DIR = os.path.join(BASE_DIR, "styles")

def download_and_extract_archive():
    print(f"[*] Downloading latest coss UI repository from {REPO_ZIP_URL}...")
    req = urllib.request.Request(
        REPO_ZIP_URL,
        headers={"User-Agent": "coss-ui-downloader/1.0"}
    )
    with urllib.request.urlopen(req) as resp:
        content = resp.read()
    print(f"[+] Downloaded {len(content):,} bytes successfully.")
    return zipfile.ZipFile(io.BytesIO(content))

def clean_mdx_frontmatter(content_str):
    """
    Cleans MDX frontmatter and converts component tags into clean markdown.
    """
    # Parse frontmatter if present
    title = ""
    description = ""
    body = content_str
    
    if content_str.startswith("---"):
        parts = content_str.split("---", 2)
        if len(parts) >= 3:
            fm_text = parts[1]
            body = parts[2].strip()
            
            title_match = re.search(r"^title:\s*(.+)$", fm_text, re.MULTILINE)
            if title_match:
                title = title_match.group(1).strip()
            
            desc_match = re.search(r"^description:\s*(.+)$", fm_text, re.MULTILINE)
            if desc_match:
                description = desc_match.group(1).strip()

    header = ""
    if title:
        header += f"# {title}\n\n"
    if description:
        header += f"> {description}\n\n"
        
    return header + body

def organize_components(zf: zipfile.ZipFile):
    print("[*] Parsing files and organizing components...")
    
    # 1. Map all files in zip
    files_by_path = {}
    for name in zf.namelist():
        if not name.endswith("/"):
            files_by_path[name] = name

    # Root prefix in zip (e.g. coss-main/)
    root_prefix = zf.namelist()[0].split("/")[0] + "/"

    # 2. Collect documentation files (apps/ui/content/docs/components/*.mdx)
    doc_files = {}
    docs_prefix = root_prefix + "apps/ui/content/docs/components/"
    for full_path in files_by_path:
        if full_path.startswith(docs_prefix) and full_path.endswith(".mdx"):
            stem = os.path.basename(full_path)[:-4]
            doc_files[stem] = full_path

    # 3. Collect component source files (packages/ui/src/components/*.tsx or apps/ui/registry/default/ui/*.tsx)
    comp_files = {}
    comp_prefix = root_prefix + "packages/ui/src/components/"
    comp_prefix_alt = root_prefix + "apps/ui/registry/default/ui/"
    for full_path in files_by_path:
        if (full_path.startswith(comp_prefix) or full_path.startswith(comp_prefix_alt)) and full_path.endswith(".tsx"):
            stem = os.path.basename(full_path)[:-4]
            comp_files[stem] = full_path

    # 4. Collect particle/example files (apps/ui/registry/default/particles/p-*.tsx)
    particle_files = {}
    particle_prefix = root_prefix + "apps/ui/registry/default/particles/"
    for full_path in files_by_path:
        if full_path.startswith(particle_prefix) and full_path.endswith(".tsx"):
            filename = os.path.basename(full_path)
            particle_files[filename] = full_path

    # All unique component stems
    all_stems = sorted(list(set(list(doc_files.keys()) + list(comp_files.keys()))))
    
    # Also check if any particles belong to additional stems (e.g. navigation)
    for p_filename in particle_files.keys():
        match = re.match(r"^p-(.+)-\d+\.tsx$", p_filename)
        if match:
            p_stem = match.group(1)
            if p_stem not in all_stems:
                all_stems.append(p_stem)
    
    all_stems = sorted(all_stems)

    # 5. Extract shared resources (lib, hooks, base-ui, styles)
    os.makedirs(LIB_DIR, exist_ok=True)
    os.makedirs(HOOKS_DIR, exist_ok=True)
    os.makedirs(BASE_UI_DIR, exist_ok=True)
    os.makedirs(STYLES_DIR, exist_ok=True)

    shared_counts = {"lib": 0, "hooks": 0, "base-ui": 0, "styles": 0}

    # Extract Libs
    for full_path in files_by_path:
        if (root_prefix + "packages/ui/src/lib/" in full_path or 
            root_prefix + "apps/ui/registry/default/lib/" in full_path) and not full_path.endswith("/"):
            fname = os.path.basename(full_path)
            data = zf.read(full_path)
            with open(os.path.join(LIB_DIR, fname), "wb") as f:
                f.write(data)
            shared_counts["lib"] += 1

    # Extract Hooks
    for full_path in files_by_path:
        if (root_prefix + "packages/ui/src/hooks/" in full_path or 
            root_prefix + "apps/ui/registry/default/hooks/" in full_path) and not full_path.endswith("/"):
            fname = os.path.basename(full_path)
            data = zf.read(full_path)
            with open(os.path.join(HOOKS_DIR, fname), "wb") as f:
                f.write(data)
            shared_counts["hooks"] += 1

    # Extract Base UI wrappers
    for full_path in files_by_path:
        if root_prefix + "packages/ui/src/base-ui/" in full_path and not full_path.endswith("/"):
            fname = os.path.basename(full_path)
            data = zf.read(full_path)
            with open(os.path.join(BASE_UI_DIR, fname), "wb") as f:
                f.write(data)
            shared_counts["base-ui"] += 1

    # Extract Styles
    for full_path in files_by_path:
        if (root_prefix + "packages/ui/src/styles/" in full_path or 
            root_prefix + "apps/ui/registry/default/styles/" in full_path) and not full_path.endswith("/"):
            fname = os.path.basename(full_path)
            data = zf.read(full_path)
            with open(os.path.join(STYLES_DIR, fname), "wb") as f:
                f.write(data)
            shared_counts["styles"] += 1

    # 6. Extract each component into components/<name>/
    os.makedirs(COMPONENTS_DIR, exist_ok=True)
    component_summaries = []

    for stem in all_stems:
        comp_dir = os.path.join(COMPONENTS_DIR, stem)
        examples_dir = os.path.join(comp_dir, "examples")
        os.makedirs(comp_dir, exist_ok=True)

        has_code = False
        has_doc = False
        example_count = 0

        # Component source code
        if stem in comp_files:
            source_code = zf.read(comp_files[stem])
            dest_file = os.path.join(comp_dir, f"{stem}.tsx")
            with open(dest_file, "wb") as f:
                f.write(source_code)
            has_code = True

        # Documentation markdown
        doc_raw_text = ""
        if stem in doc_files:
            raw_content = zf.read(doc_files[stem]).decode("utf-8", errors="replace")
            doc_raw_text = clean_mdx_frontmatter(raw_content)
            with open(os.path.join(comp_dir, "README.md"), "w", encoding="utf-8") as f:
                f.write(doc_raw_text)
            has_doc = True
        else:
            # Generate fallback README if no MDX exists
            doc_title = stem.replace("-", " ").title()
            fallback_md = f"# {doc_title}\n\nComponent implementation for `{stem}`.\n\n"
            if has_code:
                fallback_md += f"## Source\nSee [{stem}.tsx](./{stem}.tsx).\n"
            with open(os.path.join(comp_dir, "README.md"), "w", encoding="utf-8") as f:
                f.write(fallback_md)
            has_doc = True

        # Find matching particle examples
        # Stems map to particles like p-<stem>-<id>.tsx
        matching_particles = []
        for p_fname, p_path in particle_files.items():
            # Match p-<stem>-<id>.tsx exactly
            prefix = f"p-{stem}-"
            if p_fname.startswith(prefix) and p_fname.endswith(".tsx"):
                matching_particles.append((p_fname, p_path))

        if matching_particles:
            os.makedirs(examples_dir, exist_ok=True)
            for p_fname, p_path in matching_particles:
                p_code = zf.read(p_path)
                with open(os.path.join(examples_dir, p_fname), "wb") as f:
                    f.write(p_code)
                example_count += 1

        # Collect summary metadata
        title_str = stem.replace("-", " ").title()
        component_summaries.append({
            "stem": stem,
            "title": title_str,
            "has_code": has_code,
            "has_doc": has_doc,
            "example_count": example_count
        })

    # 7. Generate Master README.md
    generate_master_readme(component_summaries, shared_counts)
    
    print("\n" + "=" * 60)
    print(f"[+] Download & Organization Complete!")
    print(f"    - Total Components: {len(all_stems)}")
    print(f"    - Component Code Files: {sum(1 for c in component_summaries if c['has_code'])}")
    print(f"    - Documentation Readmes: {sum(1 for c in component_summaries if c['has_doc'])}")
    print(f"    - Particle Examples: {sum(c['example_count'] for c in component_summaries)}")
    print(f"    - Shared Lib Files: {shared_counts['lib']}")
    print(f"    - Shared Hook Files: {shared_counts['hooks']}")
    print(f"    - Shared Base UI Files: {shared_counts['base-ui']}")
    print(f"    - Shared Style Files: {shared_counts['styles']}")
    print("=" * 60)

def generate_master_readme(component_summaries, shared_counts):
    total_examples = sum(c['example_count'] for c in component_summaries)
    
    readme = [
        "# coss.com UI Components Library",
        "",
        "> Complete collection of accessible, styled UI components, documentation, and interactive particle examples from [coss.com UI](https://coss.com/ui).",
        "",
        "## Overview",
        "",
        f"- **Components:** {len(component_summaries)}",
        f"- **Interactive Particle Examples:** {total_examples}",
        f"- **Shared Utilities & Hooks:** {shared_counts['lib']} libs, {shared_counts['hooks']} hooks, {shared_counts['base-ui']} base-ui wrappers",
        "",
        "## Project Structure",
        "",
        "```",
        "coss UI/",
        "├── components/              # Individual component packages",
        "│   ├── accordion/",
        "│   │   ├── accordion.tsx    # Source code",
        "│   │   ├── README.md        # Documentation & API reference",
        "│   │   └── examples/        # Particle demo variations (e.g. p-accordion-1.tsx)",
        "│   ├── alert/",
        "│   ├── button/",
        "│   └── ...",
        "├── lib/                     # Utility helpers (utils.ts, cn)",
        "├── hooks/                   # React custom hooks",
        "├── base-ui/                 # Base UI primitives",
        "├── styles/                  # Theme & CSS variables",
        "└── download_components.py   # Downloader script to refresh/update",
        "```",
        "",
        "## Components List",
        "",
        "| Component | Source Code | Documentation | Examples / Particles |",
        "| :--- | :---: | :---: | :---: |"
    ]

    for item in component_summaries:
        stem = item["stem"]
        title = item["title"]
        code_link = f"[`{stem}.tsx`](./components/{stem}/{stem}.tsx)" if item["has_code"] else "-"
        doc_link = f"[`README.md`](./components/{stem}/README.md)" if item["has_doc"] else "-"
        ex_link = f"[{item['example_count']} examples](./components/{stem}/examples/)" if item["example_count"] > 0 else "-"
        
        readme.append(f"| **[{title}](./components/{stem}/)** | {code_link} | {doc_link} | {ex_link} |")

    readme.append("")
    readme.append("## Usage")
    readme.append("")
    readme.append("To re-download or update components to the latest version from upstream:")
    readme.append("```bash")
    readme.append("python download_components.py")
    readme.append("```")
    readme.append("")

    with open(os.path.join(BASE_DIR, "README.md"), "w", encoding="utf-8") as f:
        f.write("\n".join(readme))

def main():
    try:
        zf = download_and_extract_archive()
        organize_components(zf)
    except Exception as e:
        print(f"[!] Error: {e}", file=sys.stderr)
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == "__main__":
    main()
