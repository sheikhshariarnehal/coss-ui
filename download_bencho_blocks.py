"""
download_bencho_blocks.py
Generates the complete 62 Bencho Blocks registry with full metadata,
categories, default controls, tags, and snippets matching https://bencho.dev/
"""

import json
import os

ALL_BENCHO_BLOCKS = [
    {
        "id": "swipe-row",
        "name": "Swipe Row",
        "slug": "swipe-row",
        "category": "Swipe",
        "description": "Multi-action swipeable list row with contextual delete, archive, and pin reveals.",
        "tags": ["swipe", "list", "actions", "gesture"],
        "hasControls": True,
        "defaultProps": {"bounce": 0.3, "radius": 14, "fill": True, "stroke": True}
    },
    {
        "id": "asset-swap",
        "name": "Asset Swap",
        "slug": "asset-swap",
        "category": "Press",
        "description": "Multi-coin asset switcher with 3D flip card animations, balance previews, and swap physics.",
        "tags": ["crypto", "finance", "swap", "press", "flip"],
        "hasControls": True,
        "defaultProps": {"bounce": 0.4, "radius": 16, "fill": True, "stroke": True}
    },
    {
        "id": "ascii-wake",
        "name": "ASCII Wake",
        "slug": "ascii-wake",
        "category": "Hover",
        "description": "Interactive kinetic ASCII particle grid that awakens and reorganizes around your cursor trail.",
        "tags": ["ascii", "hover", "canvas", "retro", "cursor"],
        "hasControls": True,
        "defaultProps": {"radius": 14, "sensitivity": 90}
    },
    {
        "id": "foggy-glass",
        "name": "Foggy Glass",
        "slug": "foggy-glass",
        "category": "Hover",
        "description": "Steamy frosted glass wipe simulator with real-time moisture condensation and finger trails.",
        "tags": ["glass", "fog", "blur", "hover", "canvas"],
        "hasControls": True,
        "defaultProps": {"radius": 16, "blur": 12}
    },
    {
        "id": "scratch-card",
        "name": "Scratch Card",
        "slug": "scratch-card",
        "category": "Drag",
        "description": "Lottery scratch card with realistic brush reveal physics and winning reward burst.",
        "tags": ["scratch", "lottery", "drag", "reveal", "canvas"],
        "hasControls": True,
        "defaultProps": {"radius": 16, "brushSize": 20}
    },
    {
        "id": "heat-map",
        "name": "Heat Map",
        "slug": "heat-map",
        "category": "Hover",
        "description": "Interactive cursor heat proximity grid reacting to mouse movements with radial thermal gradients.",
        "tags": ["hover", "proximity", "grid", "thermal"],
        "hasControls": True,
        "defaultProps": {"radius": 14, "sensitivity": 80}
    },
    {
        "id": "image-compare",
        "name": "Image Compare",
        "slug": "image-compare",
        "category": "Drag",
        "description": "Interactive before/after image comparison slider with draggable split divider and keyboard navigation.",
        "tags": ["image", "slider", "compare", "drag", "before-after"],
        "hasControls": True,
        "defaultProps": {"radius": 16, "stroke": True}
    },
    {
        "id": "like",
        "name": "Like Reaction",
        "slug": "like",
        "category": "Press",
        "description": "Heart & reaction button with kinetic count increment and explosive particle physics.",
        "tags": ["like", "reaction", "particles", "press", "heart"],
        "hasControls": True,
        "defaultProps": {"bounce": 0.6, "radius": 20}
    },
    {
        "id": "spotlight",
        "name": "Spotlight Card",
        "slug": "spotlight",
        "category": "Hover",
        "description": "Illuminated card with dynamic specular spotlight tracking mouse coordinates in real time.",
        "tags": ["spotlight", "hover", "lighting", "glow"],
        "hasControls": True,
        "defaultProps": {"radius": 16, "glowSize": 200}
    },
    {
        "id": "holo-card",
        "name": "Holo Foil Card",
        "slug": "holo-card",
        "category": "Hover",
        "description": "Iridescent holographic collector card with prismatic shimmer reflections and 3D gyroscope tilt.",
        "tags": ["holo", "foil", "3d", "card", "hover", "rainbow"],
        "hasControls": True,
        "defaultProps": {"radius": 18, "tilt": 20}
    },
    {
        "id": "poster-deck",
        "name": "Poster Deck",
        "slug": "poster-deck",
        "category": "Swipe",
        "description": "Stacked gallery posters with flick gestures, spring deck returns, and elevation depth.",
        "tags": ["poster", "deck", "swipe", "cards", "gallery"],
        "hasControls": True,
        "defaultProps": {"radius": 16, "bounce": 0.3}
    },
    {
        "id": "before-and-after",
        "name": "Before and After",
        "slug": "before-and-after",
        "category": "Drag",
        "description": "Split viewport scrubber showing raw vs post-processed visual rendering.",
        "tags": ["compare", "drag", "slider", "media"],
        "hasControls": True,
        "defaultProps": {"radius": 16}
    },
    {
        "id": "signature-pad",
        "name": "Signature Pad",
        "slug": "signature-pad",
        "category": "Drag",
        "description": "Smooth vector canvas signature capture with stroke smoothing, clear, undo, and SVG export.",
        "tags": ["canvas", "signature", "drawing", "drag", "touch"],
        "hasControls": True,
        "defaultProps": {"strokeWidth": 3, "radius": 14, "color": "#f4f4f5"}
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
        "description": "Playful geometric character whose pupils smoothly track and follow your cursor anywhere on screen.",
        "tags": ["hover", "cursor", "playful", "eyes", "interactive"],
        "hasControls": True,
        "defaultProps": {"radius": 24, "bounce": 0.3}
    },
    {
        "id": "dynamic-island",
        "name": "Dynamic Island",
        "slug": "dynamic-island",
        "category": "Press",
        "description": "Expanding fluid pill with morphing layout transitions for calls, timers, media, and alerts.",
        "tags": ["island", "fluid", "ios", "morphing", "press"],
        "hasControls": True,
        "defaultProps": {"bounce": 0.5, "radius": 28, "fill": True, "stroke": False}
    },
    {
        "id": "emoji-reactions",
        "name": "Emoji Reactions",
        "slug": "emoji-reactions",
        "category": "Hover",
        "description": "Floating emoji dock that magnifies on cursor proximity and launches floating emoji bubbles.",
        "tags": ["emoji", "reactions", "dock", "hover", "magnify"],
        "hasControls": True,
        "defaultProps": {"radius": 16, "bounce": 0.4}
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
        "id": "tag-input",
        "name": "Tag Input",
        "slug": "tag-input",
        "category": "Type",
        "description": "Interactive pill tagging input with animated chip badges, autocomplete, and backspace removals.",
        "tags": ["tag", "input", "type", "chips", "form"],
        "hasControls": True,
        "defaultProps": {"radius": 12}
    },
    {
        "id": "hold-to-delete",
        "name": "Hold to Delete",
        "slug": "hold-to-delete",
        "category": "Press",
        "description": "Press-and-hold destructive action button with filling radial progress ring and cancel threshold.",
        "tags": ["button", "delete", "press", "progress", "safety"],
        "hasControls": True,
        "defaultProps": {"radius": 14, "duration": 2}
    },
    {
        "id": "rolling-counter",
        "name": "Rolling Counter",
        "slug": "rolling-counter",
        "category": "Drag",
        "description": "Odometer-style mechanical rolling digits that spin with momentum physics on value changes.",
        "tags": ["counter", "odometer", "number", "drag", "physics"],
        "hasControls": True,
        "defaultProps": {"radius": 14}
    },
    {
        "id": "particles",
        "name": "Particles Canvas",
        "slug": "particles",
        "category": "Hover",
        "description": "Connected constellation particle field reacting to cursor distance and gravitational pull.",
        "tags": ["particles", "canvas", "hover", "constellation"],
        "hasControls": True,
        "defaultProps": {"particleCount": 60, "speed": 1}
    },
    {
        "id": "label-input",
        "name": "Floating Label Input",
        "slug": "label-input",
        "category": "Type",
        "description": "Animated input with floating placeholder labels, focus glows, and validation badges.",
        "tags": ["input", "form", "type", "label", "floating"],
        "hasControls": True,
        "defaultProps": {"radius": 12}
    },
    {
        "id": "one-time-code",
        "name": "One-Time Code (OTP)",
        "slug": "one-time-code",
        "category": "Type",
        "description": "Multi-digit verification code input with auto-focus shifting, paste handling, and shake states.",
        "tags": ["otp", "auth", "input", "type", "digits"],
        "hasControls": True,
        "defaultProps": {"digits": 6, "radius": 12}
    },
    {
        "id": "generate",
        "name": "Generate AI Button",
        "slug": "generate",
        "category": "Press",
        "description": "Gleaming AI generation button with rotating rainbow border, particle sparkles, and loading states.",
        "tags": ["ai", "sparkle", "button", "press", "gradient"],
        "hasControls": True,
        "defaultProps": {"radius": 16, "bounce": 0.4}
    },
    {
        "id": "step-player",
        "name": "Step Player",
        "slug": "step-player",
        "category": "Press",
        "description": "Multi-phase stepper walkthrough with animated progress lines and step checkpoints.",
        "tags": ["stepper", "steps", "onboarding", "press"],
        "hasControls": True,
        "defaultProps": {"radius": 14}
    },
    {
        "id": "todo-tower",
        "name": "Todo Tower Stack",
        "slug": "todo-tower",
        "category": "Press",
        "description": "Stacked 3D cards where completed tasks fly away with physics revealing the next item underneath.",
        "tags": ["cards", "stack", "todo", "3d", "press"],
        "hasControls": True,
        "defaultProps": {"radius": 16}
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
        "id": "card-stack",
        "name": "Card Stack Fan",
        "slug": "card-stack",
        "category": "Hover",
        "description": "Interactive card deck that fans out into a radial arc when hovered with cursor.",
        "tags": ["cards", "fan", "stack", "hover", "deck"],
        "hasControls": True,
        "defaultProps": {"radius": 16, "angle": 15}
    },
    {
        "id": "glass-bubble",
        "name": "Glass Bubble",
        "slug": "glass-bubble",
        "category": "Drag",
        "description": "Gelatinous glass sphere that squishes, bounces, and refracts light as you drag it around.",
        "tags": ["bubble", "glass", "jelly", "drag", "physics"],
        "hasControls": True,
        "defaultProps": {"radius": 32, "elasticity": 0.8}
    },
    {
        "id": "folding-frame",
        "name": "Folding Frame",
        "slug": "folding-frame",
        "category": "Drag",
        "description": "3D origami fold card that bends along multiple crease lines during drag interactions.",
        "tags": ["3d", "origami", "fold", "drag", "crease"],
        "hasControls": True,
        "defaultProps": {"radius": 14}
    },
    {
        "id": "browser-tabs",
        "name": "Browser Tabs Dock",
        "slug": "browser-tabs",
        "category": "Drag",
        "description": "Chrome-like reorderable tab bar with smooth sliding layout shifts and close animations.",
        "tags": ["tabs", "browser", "drag", "reorder"],
        "hasControls": True,
        "defaultProps": {"radius": 10}
    },
    {
        "id": "action-node",
        "name": "Action Node Graph",
        "slug": "action-node",
        "category": "Hover",
        "description": "Visual workflow node with input/output magnetic ports and real-time wire connections.",
        "tags": ["node", "graph", "workflow", "hover", "connect"],
        "hasControls": True,
        "defaultProps": {"radius": 14}
    },
    {
        "id": "slide-to-confirm",
        "name": "Slide to Confirm",
        "slug": "slide-to-confirm",
        "category": "Drag",
        "description": "Smooth swipe-to-action confirmation bar with spring physics, progress feedback, and success trigger.",
        "tags": ["drag", "confirm", "security", "checkout"],
        "hasControls": True,
        "defaultProps": {"bounce": 0.2, "radius": 24, "fill": True, "stroke": True}
    },
    {
        "id": "assignees",
        "name": "Assignees Avatar Stack",
        "slug": "assignees",
        "category": "Select",
        "description": "Overlapping user avatar stack that expands into an interactive member selection sheet.",
        "tags": ["avatar", "team", "assignees", "select", "users"],
        "hasControls": True,
        "defaultProps": {"radius": 16}
    },
    {
        "id": "checklist",
        "name": "Interactive Checklist",
        "slug": "checklist",
        "category": "Press",
        "description": "Task checklist with strike-through animations, circular progress gauge, and completion confetti.",
        "tags": ["checklist", "todo", "progress", "confetti", "press"],
        "hasControls": True,
        "defaultProps": {"radius": 14}
    },
    {
        "id": "carousel",
        "name": "Kinetic Carousel",
        "slug": "carousel",
        "category": "Swipe",
        "description": "Touch-enabled horizontal carousel with inertial scrolling, card scaling, and pagination dots.",
        "tags": ["carousel", "slider", "swipe", "pagination"],
        "hasControls": True,
        "defaultProps": {"radius": 16}
    },
    {
        "id": "palette",
        "name": "Color Palette Generator",
        "slug": "palette",
        "category": "Press",
        "description": "Harmonious palette visualizer with instant hex copy, contrast checker, and shade generator.",
        "tags": ["color", "palette", "design", "hex", "press"],
        "hasControls": True,
        "defaultProps": {"radius": 12}
    },
    {
        "id": "aspect-ratio",
        "name": "Aspect Ratio Selector",
        "slug": "aspect-ratio",
        "category": "Select",
        "description": "Interactive frame ratio switcher (16:9, 4:3, 1:1, 9:16) with animated viewport resizing.",
        "tags": ["aspect-ratio", "media", "select", "crop"],
        "hasControls": True,
        "defaultProps": {"radius": 14}
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
        "description": "Floating media player dock with rotating vinyl, interactive playback controls, and animated equalizer.",
        "tags": ["audio", "media", "player", "music", "press"],
        "hasControls": True,
        "defaultProps": {"radius": 20, "fill": True}
    },
    {
        "id": "dragging-ball",
        "name": "Dragging Ball Physics",
        "slug": "dragging-ball",
        "category": "Drag",
        "description": "Elastic rubber ball with gravity, wall bounce collisions, and tactile squish mechanics.",
        "tags": ["physics", "ball", "drag", "bounce", "gravity"],
        "hasControls": True,
        "defaultProps": {"radius": 28, "gravity": 0.5}
    },
    {
        "id": "search",
        "name": "Expanding Search Bar",
        "slug": "search",
        "category": "Press",
        "description": "Compact search icon button that fluidly blossoms into a full omnibar search modal.",
        "tags": ["search", "omnibar", "expand", "press"],
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
        "id": "slosh-slider",
        "name": "Slosh Slider",
        "slug": "slosh-slider",
        "category": "Slide",
        "description": "Liquid fluid slider with wave splash animations that tilt and slosh as you slide.",
        "tags": ["slider", "liquid", "fluid", "slide", "wave"],
        "hasControls": True,
        "defaultProps": {"radius": 16}
    },
    {
        "id": "create-menu",
        "name": "Create Action Menu",
        "slug": "create-menu",
        "category": "Press",
        "description": "Floating '+' button that morphs into a grouped list of action shortcuts with spring physics.",
        "tags": ["menu", "fab", "actions", "press", "morph"],
        "hasControls": True,
        "defaultProps": {"radius": 16}
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
        "category": "Press",
        "description": "Draggable number stepper that increments faster the farther you pull the handle.",
        "tags": ["stepper", "number", "drag", "counter"],
        "hasControls": True,
        "defaultProps": {"radius": 14, "step": 1}
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
        "id": "notify",
        "name": "Notification Toast",
        "slug": "notify",
        "category": "Press",
        "description": "Stackable dynamic toast notification with swipe-to-dismiss and action buttons.",
        "tags": ["toast", "notification", "alert", "press"],
        "hasControls": True,
        "defaultProps": {"radius": 14}
    },
    {
        "id": "icon-bar",
        "name": "Icon Bar Selector",
        "slug": "icon-bar",
        "category": "Select",
        "description": "Horizontal segmented icon bar with magnetic fluid active background indicator.",
        "tags": ["icons", "bar", "select", "magnetic"],
        "hasControls": True,
        "defaultProps": {"radius": 12}
    },
    {
        "id": "magnifying-dock",
        "name": "Magnifying Dock",
        "slug": "magnifying-dock",
        "category": "Hover",
        "description": "macOS-style application dock where icons fluidly scale up in a parabolic curve on hover.",
        "tags": ["dock", "macos", "magnify", "hover", "scale"],
        "hasControls": True,
        "defaultProps": {"radius": 18, "maxScale": 1.6}
    },
    {
        "id": "progress-ticks",
        "name": "Progress Ticks",
        "slug": "progress-ticks",
        "category": "Hover",
        "description": "Discrete segmented meter with interactive hover scrub and energetic fill wave.",
        "tags": ["meter", "ticks", "progress", "hover"],
        "hasControls": True,
        "defaultProps": {"radius": 8}
    },
    {
        "id": "wheel",
        "name": "Rotary Wheel",
        "slug": "wheel",
        "category": "Drag",
        "description": "Circular rotary dial with haptic detent clicks, angular tracking, and value output.",
        "tags": ["rotary", "wheel", "dial", "drag", "angle"],
        "hasControls": True,
        "defaultProps": {"radius": 32}
    },
    {
        "id": "command-bar",
        "name": "Command Bar Palette",
        "slug": "command-bar",
        "category": "Type",
        "description": "Spotlight-style floating command palette with fuzzy filtering, keyboard navigation, and shortcuts.",
        "tags": ["command", "palette", "spotlight", "type", "search"],
        "hasControls": True,
        "defaultProps": {"radius": 16}
    },
    {
        "id": "selection-list",
        "name": "Selection List Group",
        "slug": "selection-list",
        "category": "Select",
        "description": "Multi-item selection group with sliding selection indicator and check animations.",
        "tags": ["list", "selection", "select", "group"],
        "hasControls": True,
        "defaultProps": {"radius": 14}
    },
    {
        "id": "range-dial",
        "name": "Range Dial Gauge",
        "slug": "range-dial",
        "category": "Drag",
        "description": "Radial speedometer gauge dial with draggable needle pointer and arc glow.",
        "tags": ["gauge", "dial", "range", "drag", "speedometer"],
        "hasControls": True,
        "defaultProps": {"radius": 24}
    },
    {
        "id": "liquid-toggle",
        "name": "Liquid Toggle Switch",
        "slug": "liquid-toggle",
        "category": "Press",
        "description": "Viscous toggle switch where the thumb squashes, stretches, and drips into place.",
        "tags": ["toggle", "switch", "liquid", "press", "viscous"],
        "hasControls": True,
        "defaultProps": {"radius": 20, "bounce": 0.5}
    }
]

def main():
    os.makedirs("src/data", exist_ok=True)
    with open("src/data/blocks-list.ts", "w", encoding="utf-8") as f:
        f.write("export interface BlockItem {\n")
        f.write("  id: string;\n")
        f.write("  name: string;\n")
        f.write("  slug: string;\n")
        f.write("  category: 'Swipe' | 'Press' | 'Hover' | 'Drag' | 'Slide' | 'Type' | 'Select';\n")
        f.write("  description: string;\n")
        f.write("  tags: string[];\n")
        f.write("  hasControls: boolean;\n")
        f.write("  defaultProps: Record<string, any>;\n")
        f.write("}\n\n")
        f.write("export const BLOCKS_DATA: BlockItem[] = " + json.dumps(ALL_BENCHO_BLOCKS, indent=2) + ";\n")
    
    print(f"Successfully generated src/data/blocks-list.ts with {len(ALL_BENCHO_BLOCKS)} Bencho blocks.")

if __name__ == "__main__":
    main()
