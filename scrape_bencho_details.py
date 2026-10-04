import re

with open('bencho_bundle.js', 'r', encoding='utf-8') as f:
    js = f.read()

# Search for dynamic import patterns or asset chunk references
dynamic_imports = re.findall(r'import\("([^"]+)"\)', js)
print("Dynamic imports count:", len(dynamic_imports))
print("Sample dynamic imports:", dynamic_imports[:10])

# Search for file references like .tsx or /blocks/
tsx_refs = re.findall(r'["\'](/[^"\']+\.(?:tsx|ts|js|json|css))["\']', js)
print("File refs:", set(tsx_refs))

# Search for network fetch or code endpoints
fetches = re.findall(r'fetch\([`"\']([^`"\']+)[\'"`]\)', js)
print("Fetches:", fetches)
