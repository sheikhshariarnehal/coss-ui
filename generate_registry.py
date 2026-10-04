import os
import glob
import json
import re

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
COMPONENTS_DIR = os.path.join(BASE_DIR, "components")

def extract_frontmatter(readme_path):
    title = ""
    description = ""
    if os.path.exists(readme_path):
        with open(readme_path, "r", encoding="utf-8", errors="ignore") as f:
            content = f.read()
            m_title = re.search(r"^#\s+(.+)$", content, re.MULTILINE)
            if m_title:
                title = m_title.group(1).strip()
            m_desc = re.search(r"^>\s+(.+)$", content, re.MULTILINE)
            if m_desc:
                description = m_desc.group(1).strip()
    return title, description

components_data = []

# Scan all component directories
for comp_folder in sorted(os.listdir(COMPONENTS_DIR)):
    comp_path = os.path.join(COMPONENTS_DIR, comp_folder)
    if not os.path.isdir(comp_path):
        continue

    stem = comp_folder
    title, desc = extract_frontmatter(os.path.join(comp_path, "README.md"))
    if not title:
        title = stem.replace("-", " ").title()

    has_code = os.path.exists(os.path.join(comp_path, f"{stem}.tsx"))
    has_doc = os.path.exists(os.path.join(comp_path, "README.md"))

    examples_dir = os.path.join(comp_path, "examples")
    examples = []
    if os.path.exists(examples_dir):
        for ex_file in sorted(os.listdir(examples_dir)):
            if ex_file.endswith(".tsx"):
                ex_name = ex_file.replace(".tsx", "")
                ex_path = os.path.join(examples_dir, ex_file)
                ex_title = ""
                
                if ex_file.startswith("origin-comp-"):
                    try:
                        with open(ex_path, "r", encoding="utf-8", errors="ignore") as ef:
                            code = ef.read()
                        m_label = re.search(r'<Label[^>]*>([^<]+)</Label>', code)
                        if m_label:
                            txt = re.sub(r'\s+', ' ', m_label.group(1).strip())
                            if 2 < len(txt) < 45:
                                ex_title = txt
                    except Exception:
                        pass
                    if not ex_title:
                        num = ex_name.replace("origin-comp-", "")
                        ex_title = f"{title} #{num}"
                else:
                    clean = re.sub(r'^p-', '', ex_name)
                    ex_title = clean.replace('-', ' ').title()

                examples.append({
                    "id": ex_name,
                    "filename": ex_file,
                    "title": ex_title
                })

    components_data.append({
        "slug": stem,
        "title": title,
        "description": desc or f"Customizable {title} component.",
        "hasCode": has_code,
        "hasDoc": has_doc,
        "examples": examples,
        "exampleCount": len(examples),
    })

# Write to src/data/components-list.ts
out_file = os.path.join(BASE_DIR, "src", "data", "components-list.ts")
os.makedirs(os.path.dirname(out_file), exist_ok=True)

ts_content = f"""// Auto-generated component registry data
export interface ComponentExample {{
  id: string;
  filename: string;
  title: string;
}}

export interface ComponentMeta {{
  slug: string;
  title: string;
  description: string;
  hasCode: boolean;
  hasDoc: boolean;
  examples: ComponentExample[];
  exampleCount: number;
}}

export const COMPONENTS_LIST: ComponentMeta[] = {json.dumps(components_data, indent=2)};

export const TOTAL_COMPONENTS = {len(components_data)};
export const TOTAL_PARTICLES = {sum(len(c['examples']) for c in components_data)};
"""

with open(out_file, "w", encoding="utf-8") as f:
    f.write(ts_content)

print(f"Generated {out_file} with {len(components_data)} components and {sum(len(c['examples']) for c in components_data)} particle examples.")
