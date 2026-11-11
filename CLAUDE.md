# Skill: Human-Centric UI & Anti-AI Design

Apply these rules whenever generating HTML, JSX, CSS, Tailwind classes, or layouts.

## 1. Absolute Blacklist (Zero AI Slop)

- NO purple, indigo, or violet radial gradient backgrounds (`from-indigo-500 to-purple-600`, glowing orb blurs, `bg-gradient-to-r text-transparent bg-clip-text`).
- NO floating pill badges with sparkle emojis over centered heroes (e.g., `✨ Introducing v2.0`).
- NO generic 3-column card grids with identical rounded corners, faint border strokes, and Lucide icons in colored rounded boxes.
- NO default unconfigured Inter/Roboto typography with low-contrast gray-on-gray subtext (`text-neutral-400` on dark backgrounds failing WCAG AA).
- NO generic template section cadence: (Hero -> Logo ticker -> 3 Features -> Bento Box -> 3-tier Pricing -> FAQ -> Centered CTA banner).

## 2. Human Craft Standards

- Typography First: Pick a deliberate pairing with real personality (e.g., editorial serif headers like Instrument Serif / Newsreader paired with clean sans like Geist / Plus Jakarta Sans, or technical monospaces like JetBrains Mono for utility).
- Concrete Color Systems: Choose an authentic aesthetic anchor (e.g., Swiss high-contrast monochrome, warm editorial paper/ink `#FBF9F5` & `#1C1917`, industrial brutalist technical, or dense Bloomberg-style data layouts). Use sharp functional accents (amber, forest green, vermilion) rather than synthwave pastels.
- Layout Asymmetry & Real Content: Design around real content density instead of placeholder symmetry. Place primary actions where the user naturally converts; use varied column widths, authentic lists, real tables, split views, and distinct edge-to-edge section dividers.
- Tangible UI Details: Use crisp borders (`1px solid #E2E8F0`), purposeful border radiuses (sharp `rounded-sm` or uniform `rounded-none` beats bubbly `rounded-2xl` everywhere), and subtle physical drop shadows instead of massive blurry neon glows.
