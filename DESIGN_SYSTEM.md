# Design System & Development Rules

**This document contains all design system rules and standards for this project. LLMs and developers MUST follow these rules when working on this codebase.**

---

## Table of Contents

1. [Button Standards](#button-standards)
2. [Icon Standards](#icon-standards)
3. [Color System](#color-system)
4. [Typography](#typography)
5. [Selector Component](#selector-component)

---

## Button Standards

### Overview

**CRITICAL RULE**: This project uses standardized button classes for ALL buttons across the site. **All buttons MUST use these standardized classes** - no custom button styles are allowed.

### Available Button Types

#### Primary Buttons (Blurple Gradient)
- `.btn-primary-large` - Large primary button (~42px height, 16px font)
- `.btn-primary` - Default primary button (~38px height, 16px font)
- `.btn-primary-small` - Small primary button (32px height, 14px font, pill shape)
- `.btn-primary-xs` - Extra small primary button (24px height, 12px font, pill shape)

#### Secondary Buttons (Gray66 Background)
- `.btn-secondary-large` - Large secondary button (~42px height, 16px font)
- `.btn-secondary` - Default secondary button (~38px height, 16px font)
- `.btn-secondary-small` - Small secondary button (32px height, 14px font, pill shape)
- `.btn-secondary-xs` - Extra small secondary button (24px height, 12px font, pill shape)

#### Glass Buttons (Backdrop Blur with Border)
- `.btn-glass-large` - Large glass button (~42px height, 16px font)
- `.btn-glass` - Default glass button (~38px height, 16px font)
- `.btn-glass-small` - Small glass button (32px height, 14px font, pill shape)
- `.btn-glass-xs` - Extra small glass button (24px height, 12px font, pill shape)

#### Glass Button Chevron Variant
- `.btn-glass-with-chevron` - Modifier class for glass buttons with chevron icons
  - Reduces right padding for better visual balance
  - Adds 12px gap between text and chevron
  - Available for `.btn-glass-large` and `.btn-glass` sizes
  - **Standard chevron styling**: Use `ChevronRight` icon with `color="hsl(var(--white33))"` and `size={18}`

### Usage Rules

1. **ALWAYS use standardized button classes** - Never create custom button styles

2. **CRITICAL: Primary CTA Button Sizing Rules**:
   - **Landing page (`/` route)**: All primary CTAs MUST use `.btn-primary-large` at all screen sizes (always large)
   - **Desktop (≥768px)**: All primary CTAs MUST use `.btn-primary-large` 
   - **Mobile (<768px)**: Primary CTAs on non-landing pages should use `.btn-primary` (default size)
   - Use responsive classes: `btn-primary-large md:btn-primary-large` for landing page, `btn-primary md:btn-primary-large` for other pages

3. **Choose the appropriate size** based on context:
   - Large: Hero sections, primary CTAs (desktop), landing page CTAs (all sizes)
   - Default: Standard actions, forms, primary CTAs on mobile (non-landing pages)
   - Small: Secondary actions, compact spaces
   - Extra Small: Dense UIs, inline actions

4. **Choose the appropriate type**:
   - Primary: Main actions, important CTAs (blurple gradient)
   - Secondary: Secondary actions, alternative options (gray66 background)
   - Glass: Overlays, hero sections, transparent backgrounds (backdrop blur)

5. **Add utility classes as needed**:
   - `w-full` for full-width buttons
   - `disabled:opacity-70 disabled:cursor-not-allowed` for disabled states
   - `group` for hover effects on child elements
   - Gap utilities for spacing icons/text

6. **Glass buttons with chevrons**:
   - Use `.btn-glass-with-chevron` modifier class (available for `.btn-glass-large` and `.btn-glass`)
   - Always use `ChevronRight` icon with standard styling: `color="hsl(var(--white33))"` and `size={18}`
   - Add `group` class for chevron hover animation
   - Add mouse tracking handler (`on:mousemove`) for glass reflection effect (see examples)

### Examples

```svelte
<!-- Landing page CTA (always large) -->
<button class="btn-primary-large w-full">Get Started</button>

<!-- Other pages CTA (large on desktop, default on mobile) -->
<button class="btn-primary md:btn-primary-large w-full">Download</button>

<!-- Standard primary button (non-CTA) -->
<button class="btn-primary">Click me</button>

<!-- Glass button with chevron (standard pattern) -->
<script>
  import { ChevronRight } from "$lib/components/icons";
  
  let buttonElement;
  
  function handleMouseMove(event) {
    if (!buttonElement) return;
    const rect = buttonElement.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    buttonElement.style.setProperty("--mouse-x", `${mouseX}px`);
    buttonElement.style.setProperty("--mouse-y", `${mouseY}px`);
  }
</script>

<button
  bind:this={buttonElement}
  class="btn-glass-large btn-glass-with-chevron flex items-center group"
  on:mousemove={handleMouseMove}
>
  Discover Apps
  <ChevronRight
    variant="outline"
    color="hsl(var(--white33))"
    size={18}
    className="transition-transform group-hover:translate-x-0.5"
  />
</button>

<!-- Glass button without chevron -->
<button class="btn-glass">Learn More</button>

<!-- Disabled button -->
<button class="btn-primary" disabled>Processing...</button>
```

### Special Cases

Some components have specialized button styles that are exceptions:
- `.split-button-*` - SplitButton component (combines two buttons with dropdown)
- `.search-bar-btn` - Search bar input button
- `.profile-avatar-btn` - Profile avatar button

These are acceptable exceptions, but new components should use standardized button classes.

### Implementation Notes

- **All buttons MUST have `cursor: pointer`** - This is enforced in the CSS classes
- All buttons include hover and active scale effects
- Primary buttons have glow effects on hover
- Border radius: 16px for large/default, 9999px (pill) for small/xs
- All buttons use consistent transform transitions
- Glass buttons use `backdrop-blur-lg` for the blur effect
- Glass buttons have `white4` background (4% opacity) for subtle depth
- Glass buttons with chevrons include a cursor-following reflection effect (blurred white circle)
- Chevron hover animation: slides right slightly on button hover (`group-hover:translate-x-0.5`)

---

## Icon Standards

### Overview

This project uses a custom SVG icon system with components stored in `src/lib/components/icons/`. Icons support both fill and outline variants with configurable stroke widths.

### Icon Storage Location

**All custom icon components go in:** `src/lib/components/icons/`

Each icon gets its own Svelte component file (`.svelte`) in this directory.

### Creating a New Icon Component

1. **Export SVG from Figma** with these settings:
   - Format: SVG
   - Include "id" attribute: OFF
   - Outline stroke: ON (if you want outline variants)
   - Simplify stroke: OFF (to preserve paths)

2. **Create a new component** in `src/lib/components/icons/`:
   ```svelte
   <!-- ArrowDown.svelte -->
   <script>
     import BaseIcon from "./BaseIcon.svelte";
     
     export let variant = "outline"; // Default to outline
     export let strokeWidth = 1.4; // Default stroke width
     export let color = "hsl(var(--foreground))";
     export let size = 24;
     export let className = "";
   </script>
   
   <BaseIcon {variant} {strokeWidth} {color} {size} {className}>
     <svg
       width={size}
       height={size}
       viewBox="0 0 8 14"
       fill={variant === "fill" ? color : "none"}
       stroke={variant === "outline" ? color : "none"}
       stroke-width={variant === "outline" ? strokeWidth : 0}
       stroke-linecap="round"
       stroke-linejoin="round"
       xmlns="http://www.w3.org/2000/svg"
     >
       <path d="..." />
     </svg>
   </BaseIcon>
   ```

3. **Export from index** (for easier imports):
   ```js
   // src/lib/components/icons/index.js
   export { default as ArrowDown } from './ArrowDown.svelte';
   ```

### Icon Props

All icon components accept these props:

- `variant`: `"fill"` | `"outline"` (default: `"outline"` for most icons)
- `strokeWidth`: `1.4` | `2.8` (default: `1.4`, only applies to outline variant)
- `color`: CSS color value (default: `"hsl(var(--foreground))"`)
- `size`: number in pixels (default: `24`)
- `className`: Additional CSS classes (note: uses `className` instead of `class`)

### Usage Examples

```svelte
<!-- Outline icon (default, 1.4px stroke) -->
<ChevronRight variant="outline" color="hsl(var(--white16))" size={20} />

<!-- Fill icon -->
<Download variant="fill" color="hsl(var(--white66))" size={24} />

<!-- With custom classes -->
<ChevronLeft variant="outline" color="hsl(var(--white33))" size={20} className="transition-transform group-hover:translate-x-0.5" />
```

### Color Reference

Common CSS variables for icons:
- `hsl(var(--foreground))` - Default text color
- `hsl(var(--white16))` - Subtle (16% opacity white)
- `hsl(var(--white33))` - Medium (33% opacity white)
- `hsl(var(--white66))` - Strong (66% opacity white)
- `hsl(var(--primary))` - Primary accent color
- `hsl(var(--muted-foreground))` - Muted text

### Best Practices

1. **Default to outline variant** - Most icons should default to `variant="outline"`
2. **Use 1.4px stroke width** - Standard stroke width for most icons
3. **Consistent sizing**: Use standard sizes (16, 20, 24, 32px)
4. **Color**: Always use CSS variables for theme consistency
5. **Stroke width**: Use 1.4px for small icons (<24px), 2.8px for larger icons if needed

### Fallback to Lucide Icons

**You can fall back to `lucide-svelte` icons** if you don't have a custom icon yet:

```svelte
import { Download, Search, User } from "lucide-svelte";
<Download class="h-5 w-5" />
```

**When to use custom icons vs Lucide:**
- ✅ **Custom icons**: Brand-specific icons, unique designs from Figma, chevrons/navigation
- ✅ **Lucide icons**: Generic UI icons for quick prototyping (gradually replace with custom)

---

## Color System

### Base Colors

The project uses HSL color variables defined in `src/app.css`:

- `--white`, `--white66`, `--white33`, `--white16`, `--white8`, `--white4` - White variants with opacity
- `--black`, `--black66`, `--black33`, `--black16`, `--black8` - Black variants with opacity
- `--gray`, `--gray66`, `--gray44`, `--gray33` - Gray variants with opacity
- `--blurpleColor`, `--blurpleColor66`, `--blurpleColor33` - Primary blurple color
- `--goldColor`, `--goldColor66` - Secondary gold color

### Semantic Colors

- `--background` - Page background
- `--foreground` - Primary text color
- `--card` - Card background (gray66)
- `--primary` - Primary accent (blurple)
- `--secondary` - Secondary accent (gold)
- `--muted-foreground` - Muted text
- `--border` - Border color (white16)

### Usage

Always use CSS variables:
```css
color: hsl(var(--foreground));
background-color: hsl(var(--card));
border-color: hsl(var(--white16));
```

---

## Typography

### Font Families

- **Inter** - Primary body and heading font
- **Geist Mono** - Code/monospace font

### Font Sizes

- Display: `text-display-lg` (large headings)
- Body: Default 1.125rem (18px)
- Small: `text-sm` (14px)
- Extra Small: `text-xs` (12px)

### Font Weights

- 650 - Bold for large headings
- 600 - Semibold for smaller headings
- 500 - Medium for buttons and emphasis
- 400 - Regular for body text

---

## Selector Component

### Overview

The `Selector` component is a standardized tab/option selector used for filtering or switching between different views. It displays options as buttons with the selected option using primary button styling and unselected options using secondary button styling.

### Location

**Component file**: `src/lib/components/Selector.svelte`

### Usage

```svelte
<script>
  import Selector from "$lib/components/Selector.svelte";
  
  let selectedTab = "Forum";
  const tabs = ["Forum", "Articles", "Events", "Apps"];
  
  function handleTabSelect(tab) {
    selectedTab = tab;
    // Update content based on selection
  }
</script>

<Selector
  options={tabs}
  selectedOption={selectedTab}
  onSelect={handleTabSelect}
/>
```

### Props

- `options` (array, required): Array of option strings to display
- `selectedOption` (string, required): Currently selected option (must match one of the options)
- `onSelect` (function, required): Callback function called when an option is selected, receives the selected option as parameter

### Styling

- **Container**: `gray33` background color (`hsl(var(--gray33))`), fully rounded (`rounded-2xl`)
- **Selected option**: Uses `.btn-primary-small` class (blurple gradient)
- **Unselected options**: Uses `.btn-secondary-small` class (gray66 background)
- **Layout**: Flexbox with gap-2, equal-width buttons (`flex-1`)

### Examples

**Platform Selection:**
```svelte
<Selector
  options={["Android", "iOS", "Web"]}
  selectedOption={selectedPlatform}
  onSelect={(platform) => handlePlatformSelect(platform)}
/>
```

**Tab Navigation:**
```svelte
<Selector
  options={["Forum", "Articles", "Events", "Apps"]}
  selectedOption={selectedTab}
  onSelect={(tab) => handleTabSelect(tab)}
/>
```

### Standardization

**CRITICAL**: All tab/option selectors MUST use the `Selector` component. Do not create custom selector components. The existing `PlatformSelector` component has been updated to use `Selector` internally.

---

## General Rules

1. **Always use standardized classes** - Don't create custom styles for buttons, icons, or common UI elements
2. **Use CSS variables** - Always use design tokens (CSS variables) for colors, spacing, etc.
3. **Follow the design system** - Check this document before creating new components
4. **Document exceptions** - If you need a specialized component, document it here
5. **Consistency first** - Prefer reusing existing patterns over creating new ones
6. **Cursor pointer on clickable elements** - **ALL clickable elements MUST have `cursor: pointer`**. This includes buttons, links, cards that navigate, toggles, and any other interactive elements. Users must always have clear visual feedback that an element is clickable.

---

## Maintenance

When adding new components or styles:

1. Check this document first
2. Use standardized classes and patterns
3. Never create custom button styles (use button classes)
4. Never create custom icon styles (use icon components)
5. Update this document if new standards are needed
6. Document any exceptions here

---

**Last Updated**: This document should be updated whenever new design system rules are established.

