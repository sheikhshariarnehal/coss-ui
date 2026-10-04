import glob
import re
import os
import subprocess
import json

# Get list of valid lucide exports via node
node_script = """
import('lucide-react').then(lucide => {
    console.log(JSON.stringify(Object.keys(lucide)));
});
"""

proc = subprocess.Popen(["node", "-e", node_script], stdout=subprocess.PIPE, stderr=subprocess.PIPE, cwd=os.getcwd())
out, err = proc.communicate()
valid_icons = set(json.loads(out.decode('utf-8')))

print(f"Total valid Lucide exports: {len(valid_icons)}")

replacements = {
    "CircleQuestionMarkIcon": "CircleHelpIcon",
    "CircleQuestionMark": "CircleHelp",
    "SlidersHorizontalIcon": "SlidersHorizontal",
    "DotsVerticalIcon": "MoreVerticalIcon",
    "DotsHorizontalIcon": "MoreHorizontalIcon"
}

fixed_count = 0
for f in glob.glob("components/*/*.tsx") + glob.glob("components/*/examples/*.tsx"):
    with open(f, "r", encoding="utf-8", errors="ignore") as fp:
        content = fp.read()
    
    modified = False
    for bad, good in replacements.items():
        if bad in content:
            content = content.replace(bad, good)
            modified = True
            print(f"Replacing {bad} -> {good} in {f}")

    if modified:
        with open(f, "w", encoding="utf-8") as fp:
            fp.write(content)
        fixed_count += 1

print(f"Fixed {fixed_count} files.")
