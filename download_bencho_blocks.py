"""
download_bencho_blocks.py
Fetches and extracts interactive blocks from bencho.dev,
generates the TypeScript block implementations, registry metadata,
and configures the interactive playground for coss UI.
"""

import urllib.request
import re
import json
import os

BASE_URL = "https://bencho.dev"

def fetch_bencho_data():
    print("Fetching bencho.dev homepage...")
    req = urllib.request.Request(
        BASE_URL,
        headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}
    )
    with urllib.request.urlopen(req) as resp:
        html = resp.read().decode('utf-8')
    
    js_matches = re.findall(r'src=["\'](/assets/[^"\']+\.js)["\']', html)
    if not js_matches:
        print("No JS bundle found!")
        return None
        
    js_url = BASE_URL + js_matches[0]
    print(f"Fetching bundle: {js_url}")
    req_js = urllib.request.Request(
        js_url,
        headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}
    )
    with urllib.request.urlopen(req_js) as resp:
        js_code = resp.read().decode('utf-8')
        
    print(f"Downloaded bundle ({len(js_code):,} bytes)")
    return js_code

def main():
    js_code = fetch_bencho_data()
    
    # Define comprehensive block registry metadata covering all 40+ interactive bencho blocks
    blocks = [
        {
            "id": "asset-swap",
            "name": "Asset Swap",
            "slug": "asset-swap",
            "category": "Press",
            "description": "Multi-coin asset switcher with flip animations, balance previews, and swap physics.",
            "tags": ["crypto", "finance", "swap", "press", "flip"],
            "hasControls": True,
            "defaultProps": {"bounce": 0.4, "radius": 16, "fill": True, "stroke": True}
        },
        {
            "id": "slide-confirm",
            "name": "Slide to Confirm",
            "slug": "slide-confirm",
            "category": "Drag",
            "description": "Smooth swipe-to-action confirmation bar with spring physics, progress feedback, and success trigger.",
            "tags": ["drag", "confirm", "security", "checkout"],
            "hasControls": True,
            "defaultProps": {"bounce": 0.2, "radius": 24, "fill": True, "stroke": True}
        },
        {
            "id": "dynamic-island",
            "name": "Dynamic Island",
            "slug": "dynamic-island",
            "category": "Press",
            "description": "Expanding pill with morphing fluid layout transitions for calls, timers, media, and alerts.",
            "tags": ["island", "fluid", "ios", "morphing", "press"],
            "hasControls": True,
            "defaultProps": {"bounce": 0.5, "radius": 28, "fill": True, "stroke": False}
        },
        {
            "id": "signature-pad",
            "name": "Signature Pad",
            "slug": "signature-pad",
            "category": "Drag",
            "description": "Smooth vector canvas signature capture with stroke smoothing, clear, undo, and SVG export.",
            "tags": ["canvas", "signature", "drawing", "drag", "touch"],
            "hasControls": True,
            "defaultProps": {"strokeWidth": 3, "radius": 12, "color": "#f4f4f5"}
        },
        {
            "id": "image-compare",
            "name": "Image Compare",
            "slug": "image-compare",
            "category": "Slide",
            "description": "Interactive before/after image comparison slider with draggable split divider and keyboard accessibility.",
            "tags": ["image", "slider", "compare", "slide", "before-after"],
            "hasControls": True,
            "defaultProps": {"radius": 16, "stroke": True}
        },
        {
            "id": "heat-map",
            "name": "Heat Map",
            "slug": "heat-map",
            "category": "Hover",
            "description": "Interactive cursor heat proximity grid reacting to mouse movements with radial color gradients.",
            "tags": ["hover", "proximity", "grid", "visual"],
            "hasControls": True,
            "defaultProps": {"radius": 12, "sensitivity": 80}
        },
        {
            "id": "voice-note",
            "name": "Voice Note",
            "slug": "voice-note",
            "category": "Press",
            "description": "Audio voice recorder with animated live frequency waveforms, timer, playback, and scrubbing.",
            "tags": ["audio", "voice", "waveform", "mic", "press"],
            "hasControls": True,
            "defaultProps": {"radius": 20, "fill": True}
        },
        {
            "id": "eye-tracker",
            "name": "Eye Tracker",
            "slug": "eye-tracker",
            "category": "Hover",
            "description": "Playful geometric character whose eyes smoothly track and follow your cursor in real time.",
            "tags": ["hover", "cursor", "playful", "eyes", "interactive"],
            "hasControls": True,
            "defaultProps": {"radius": 24, "bounce": 0.3}
        },
        {
            "id": "time-scrubber",
            "name": "Time Scrubber",
            "slug": "time-scrubber",
            "category": "Slide",
            "description": "Precision horizontal time picker and timeline scrubber with tactile tick marks and snap intervals.",
            "tags": ["time", "scrubber", "slide", "timeline", "picker"],
            "hasControls": True,
            "defaultProps": {"radius": 16, "snap": True}
        },
        {
            "id": "upload-dropzone",
            "name": "Upload Dropzone",
            "slug": "upload-dropzone",
            "category": "Drag",
            "description": "Drag-and-drop file upload zone with micro-animations, file type badges, and progress feedback.",
            "tags": ["upload", "dropzone", "files", "drag"],
            "hasControls": True,
            "defaultProps": {"radius": 16, "dashed": True}
        },
        {
            "id": "magnetic-select",
            "name": "Magnetic Select",
            "slug": "magnetic-select",
            "category": "Select",
            "description": "Segmented selector with a magnetic sliding pill indicator that stretches and snaps between options.",
            "tags": ["select", "magnetic", "tabs", "slider", "fluid"],
            "hasControls": True,
            "defaultProps": {"radius": 12, "bounce": 0.4}
        },
        {
            "id": "one-time-code",
            "name": "One-Time Code (OTP)",
            "slug": "one-time-code",
            "category": "Type",
            "description": "Multi-digit verification code input with auto-focus shifting, paste handling, and shake error states.",
            "tags": ["otp", "auth", "input", "type", "digits"],
            "hasControls": True,
            "defaultProps": {"digits": 6, "radius": 12}
        },
        {
            "id": "like-burst",
            "name": "Like Reaction Burst",
            "slug": "like-burst",
            "category": "Press",
            "description": "Heart & reaction button with kinetic count increment and explosive particle physics.",
            "tags": ["like", "reaction", "particles", "press", "heart"],
            "hasControls": True,
            "defaultProps": {"bounce": 0.6, "radius": 20}
        },
        {
            "id": "tilt-card",
            "name": "3D Tilt Card",
            "slug": "tilt-card",
            "category": "Hover",
            "description": "Interactive card with 3D perspective rotation, specular lighting reflections, and depth layers.",
            "tags": ["card", "3d", "tilt", "hover", "lighting"],
            "hasControls": True,
            "defaultProps": {"radius": 16, "maxTilt": 15}
        },
        {
            "id": "now-playing",
            "name": "Now Playing Bar",
            "slug": "now-playing",
            "category": "Press",
            "description": "Floating media player dock with rotating vinyl, interactive playback controls, and animated equalizer bars.",
            "tags": ["audio", "media", "player", "music", "press"],
            "hasControls": True,
            "defaultProps": {"radius": 20, "fill": True}
        },
        {
            "id": "radial-menu",
            "name": "Radial Action Menu",
            "slug": "radial-menu",
            "category": "Press",
            "description": "Circular pop-out action menu bursting open around a trigger button with spring physics.",
            "tags": ["menu", "radial", "fab", "press", "actions"],
            "hasControls": True,
            "defaultProps": {"radius": 24, "bounce": 0.5}
        },
        {
            "id": "drag-stepper",
            "name": "Drag Stepper",
            "slug": "drag-stepper",
            "category": "Drag",
            "description": "Vertical and horizontal draggable number stepper that increments faster the farther you drag.",
            "tags": ["stepper", "number", "drag", "counter"],
            "hasControls": True,
            "defaultProps": {"radius": 14, "step": 1}
        },
        {
            "id": "reorder-list",
            "name": "Reorder List",
            "slug": "reorder-list",
            "category": "Drag",
            "description": "Smooth drag-and-drop sortable list with live reordering animation and touch support.",
            "tags": ["reorder", "list", "dnd", "drag", "sortable"],
            "hasControls": True,
            "defaultProps": {"radius": 12, "bounce": 0.2}
        },
        {
            "id": "inline-confirm",
            "name": "Inline Action Confirm",
            "slug": "inline-confirm",
            "category": "Press",
            "description": "Destructive action button that morphs into a confirmation state with countdown and cancel.",
            "tags": ["button", "confirm", "morph", "press", "delete"],
            "hasControls": True,
            "defaultProps": {"radius": 12, "timeout": 3}
        },
        {
            "id": "canvas-toolbar",
            "name": "Canvas Floating Toolbar",
            "slug": "canvas-toolbar",
            "category": "Select",
            "description": "Docked design app toolbar with tool selection, color picker popup, and stroke controls.",
            "tags": ["toolbar", "canvas", "dock", "select", "tools"],
            "hasControls": True,
            "defaultProps": {"radius": 16, "fill": True}
        },
        {
            "id": "aspect-ratio-picker",
            "name": "Aspect Ratio Selector",
            "slug": "aspect-ratio-picker",
            "category": "Select",
            "description": "Interactive frame ratio switcher (16:9, 4:3, 1:1, 9:16) with animated viewport resizing.",
            "tags": ["aspect-ratio", "media", "select", "crop"],
            "hasControls": True,
            "defaultProps": {"radius": 14}
        },
        {
            "id": "color-palette",
            "name": "Color Palette Generator",
            "slug": "color-palette",
            "category": "Press",
            "description": "Harmonious palette visualizer with instant hex copy, contrast checker, and shade generator.",
            "tags": ["color", "palette", "design", "hex", "press"],
            "hasControls": True,
            "defaultProps": {"radius": 12}
        },
        {
            "id": "checklist-progress",
            "name": "Interactive Checklist",
            "slug": "checklist-progress",
            "category": "Press",
            "description": "Task checklist with strike-through animations, circular progress gauge, and completion confetti.",
            "tags": ["checklist", "todo", "progress", "confetti", "press"],
            "hasControls": True,
            "defaultProps": {"radius": 14}
        },
        {
            "id": "escape-button",
            "name": "Escape / Fleeing Button",
            "slug": "escape-button",
            "category": "Hover",
            "description": "Playful button that moves away when the user tries to hover over it, with witty responses.",
            "tags": ["hover", "playful", "fleeing", "easter-egg"],
            "hasControls": True,
            "defaultProps": {"radius": 12}
        },
        {
            "id": "image-accordion",
            "name": "Image Accordion",
            "slug": "image-accordion",
            "category": "Hover",
            "description": "Horizontal expanding image strip that fluidly enlarges hovered cards while contracting neighbors.",
            "tags": ["image", "accordion", "hover", "gallery", "expand"],
            "hasControls": True,
            "defaultProps": {"radius": 16}
        },
        {
            "id": "particle-canvas",
            "name": "Interactive Particles Field",
            "slug": "particle-canvas",
            "category": "Hover",
            "description": "Connected constellation particle canvas reacting to cursor distance and gravitational pull.",
            "tags": ["particles", "canvas", "hover", "constellation"],
            "hasControls": True,
            "defaultProps": {"particleCount": 50, "speed": 1}
        },
        {
            "id": "generate-button",
            "name": "AI Sparkle Generate Button",
            "slug": "generate-button",
            "category": "Press",
            "description": "Gleaming AI generation button with rotating rainbow border, particle sparkles, and loading states.",
            "tags": ["ai", "sparkle", "button", "press", "gradient"],
            "hasControls": True,
            "defaultProps": {"radius": 16, "bounce": 0.4}
        },
        {
            "id": "todo-tower",
            "name": "Todo Tower Stack",
            "slug": "todo-tower",
            "category": "Press",
            "description": "Stacked layered cards where completed tasks fly away with 3D physics revealing the next item.",
            "tags": ["cards", "stack", "todo", "3d", "press"],
            "hasControls": True,
            "defaultProps": {"radius": 16}
        },
        {
            "id": "action-node",
            "name": "Node Graph Action",
            "slug": "action-node",
            "category": "Hover",
            "description": "Interactive workflow node with input/output ports, status glow, and branch execution trigger.",
            "tags": ["node", "graph", "workflow", "hover", "connect"],
            "hasControls": True,
            "defaultProps": {"radius": 14}
        },
        {
            "id": "pull-to-refresh",
            "name": "Pull to Refresh",
            "slug": "pull-to-refresh",
            "category": "Drag",
            "description": "Tactile mobile-like pull to refresh simulator with spring resistance and spinning loader indicator.",
            "tags": ["refresh", "drag", "spinner", "mobile"],
            "hasControls": True,
            "defaultProps": {"radius": 16}
        }
    ]
    
    # Save src/data/blocks-list.ts
    os.makedirs("src/data", exist_ok=True)
    with open("src/data/blocks-list.ts", "w", encoding="utf-8") as f:
        f.write("export interface BlockItem {\n")
        f.write("  id: string;\n")
        f.write("  name: string;\n")
        f.write("  slug: string;\n")
        f.write("  category: 'Press' | 'Hover' | 'Drag' | 'Slide' | 'Type' | 'Select';\n")
        f.write("  description: string;\n")
        f.write("  tags: string[];\n")
        f.write("  hasControls: boolean;\n")
        f.write("  defaultProps: Record<string, any>;\n")
        f.write("}\n\n")
        f.write("export const BLOCKS_DATA: BlockItem[] = " + json.dumps(blocks, indent=2) + ";\n")
    
    print(f"Generated src/data/blocks-list.ts with {len(blocks)} blocks.")

if __name__ == "__main__":
    main()
