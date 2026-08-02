# mediShop Design System & Brand Guidelines (`design.md`)

> **IMPORTANT & IMMUTABLE DIRECTIVE FOR DEVELOPERS & AI ASSISTANTS**  
> This document establishes the mandatory design rules for the **mediShop** project. No developer or AI coding agent is allowed to bypass, violate, or introduce styles outside the parameters defined here. Project consistency, theme dynamics, and visual integrity depend strictly on adherence to this specification.

---

## 1. Core Design Principles (মূল ডিজাইন নীতিসমূহ)

1. **Single Source of Truth Theme**: Every component, page, logo, icon, and micro-interaction MUST derive its colors, typography, borders, and shadows from central CSS tokens (`src/app/globals.css`).
2. **Instant Brand Re-theming**: Changing the `--color-primary` or branding tokens in `globals.css` MUST automatically re-theme the entire application (including Logo, Headers, Buttons, Active States, and Mobile Navigation) without editing individual component files.
3. **Zero Arbitrary Styles**: No hardcoded hex colors (`#1D4ED8`), arbitrary RGB/HSL values, or arbitrary font imports inside components.
4. **Bilingual Typography Balance**: Seamless support for both English (Inter) and Bengali (SolaimanLipi / Noto Sans Bengali) with strict, unified font scale hierarchy.

---

## 2. Typography Rules (টাইপোগ্রাফি ও ফন্ট সংক্রান্ত নিয়মাবলী)

### Allowed Font Stack (অনুমোদিত ফন্টসমূহ)
The project strictly allows **ONLY 2 primary font families**:

| Purpose | Font Family | Variable / Token | Usage |
| :--- | :--- | :--- | :--- |
| **Primary UI & English Text** | `Inter`, sans-serif | `--font-sans` / `font-sans` | Headings, UI labels, body text, buttons, forms |
| **Bengali Text & Content** | `SolaimanLipi`, `Noto Sans Bengali` | `--font-bengali` / `font-bn` | Bengali titles, medicine Bangla names, BN UI text |

> 🚫 **FORBIDDEN**: 
> - DO NOT introduce third-party fonts (e.g. Serif, Comic Sans, Playfair, custom display fonts) in component files.
> - DO NOT use inline `font-family: ...` styles in TSX/JSX elements.
> - DO NOT use serif fonts for general headers or UI elements.

### Typography Hierarchy Scale
Always use standardized Tailwind / CSS typography size utilities linked to the base font variables:

| Element | Class Name | Weight | Line Height |
| :--- | :--- | :--- | :--- |
| **H1 (Page Heading)** | `text-3xl md:text-4xl` | `font-bold` (700) | `leading-tight` |
| **H2 (Section Header)** | `text-2xl md:text-3xl` | `font-semibold` (600) | `leading-snug` |
| **H3 (Card Title / Sub-header)** | `text-lg md:text-xl` | `font-semibold` (600) | `leading-snug` |
| **Body (Default)** | `text-base` | `font-normal` (400) | `leading-normal` |
| **Small / Helper Text** | `text-sm` | `font-normal` (400) or `font-medium` (500) | `leading-normal` |
| **Caption / Badge** | `text-xs` | `font-medium` (500) or `font-semibold` (600) | `leading-none` |

---

## 3. Color Palette & Token System (কালার প্যালেট ও টোকেন সিস্টেম)

All color references in the application MUST use central CSS theme variables defined in `src/app/globals.css`.

### Central Theme Color Tokens

```css
@theme {
  /* Brand Primary Colors */
  --color-primary: #1D4ED8;         /* Deep Medical Blue (Main Theme Color) */
  --color-primary-dark: #1E3A8A;    /* Primary Hover & Dark Accents */
  --color-primary-light: #3B82F6;   /* Primary Soft Borders & Highlights */
  --color-primary-soft: #EFF6FF;    /* Primary Light Background Fill */

  /* Brand Secondary / Accent Colors */
  --color-accent: #F59E0B;          /* Warm Medical Amber / Call-to-action */
  --color-accent-dark: #D97706;     /* Accent Hover */
  --color-accent-light: #FEF3C7;    /* Accent Background Fill */

  /* Surface & Base Colors */
  --color-background: #FFFFFF;    /* Main Body Background */
  --color-foreground: #0F172A;    /* Primary Text Color */
  --color-muted: #F1F5F9;         /* Neutral Gray Fill for Cards & Bars */
  --color-muted-foreground: #64748B; /* Secondary Muted Text Color */

  /* Structural & Interactive Tokens */
  --color-border: #E2E8F0;        /* Card & Divider Borders */
  --color-input: #E2E8F0;         /* Form Field Borders */
  --color-ring: #1D4ED8;          /* Focus Ring Color */

  /* Status Colors */
  --color-success: #059669;       /* In-Stock, Success Messages */
  --color-success-light: #D1FAE5; /* Success Badge Fill */
  --color-warning: #D97706;       /* Pending, Rx Required Badges */
  --color-warning-light: #FEF3C7; /* Warning Badge Fill */
  --color-danger: #DC2626;        /* Out of Stock, Error Messages */
  --color-danger-light: #FEE2E2;  /* Danger Badge Fill */
}
```

### Color Usage Rules (রঙ ব্যবহারের নিয়মাবলী)
1. **Primary Theme Elements**: Main Navigation bar highlight, Primary Buttons (`bg-primary`), Active Tab indicators, Focus Rings, and Main Brand Logo MUST consume `bg-primary`, `text-primary`, or `border-primary`.
2. **No Arbitrary Tailwind Colors**: Avoid using arbitrary Tailwind colors (e.g. `bg-indigo-600`, `text-purple-700`, `border-teal-400`, `bg-rose-500`). Use design tokens (`bg-primary`, `text-muted-foreground`, `bg-danger-light`, `text-success`) instead.
3. **No Hardcoded Hex Colors**: Hardcoded inline hex styles (like `style={{ color: '#1D4ED8' }}`) are strictly prohibited.

---

## 4. Logo & Branding Consistency (লোগো ও ব্র্যান্ডিং সামঞ্জস্যতা)

1. **Dynamic Logo Styling**: The mediShop logo (SVG or Component) must use `text-primary` and theme token colors.
   ```tsx
   // Correct Dynamic Logo Pattern
   <div className="flex items-center gap-2 font-bold text-xl text-primary">
     <LogoIcon className="w-8 h-8 fill-primary text-primary" />
     <span>medi<span className="text-accent">Shop</span></span>
   </div>
   ```
2. **Branding Cascade**: If `--color-primary` in `globals.css` is modified (e.g. changed from `#1D4ED8` blue to `#0D9488` teal), the logo, primary buttons, links, active navigation items, badges, and focus rings across EVERY page must automatically change to match the new primary theme.

---

## 5. Component Design Standards (কম্পোনেন্ট ডিজাইন নির্দেশিকা)

### Buttons (বাটন নির্দেশিকা)
- **Primary Button**: `bg-primary text-white hover:bg-primary-dark transition-colors duration-200 rounded-lg px-4 py-2 font-medium focus-visible:ring-2 focus-visible:ring-ring`
- **Secondary / Outline Button**: `border border-border text-foreground bg-transparent hover:bg-muted transition-colors duration-200 rounded-lg px-4 py-2 font-medium`
- **Accent CTA Button**: `bg-accent text-white hover:bg-accent-dark transition-colors duration-200 rounded-lg px-4 py-2 font-semibold`
- **Ghost / Muted Button**: `text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg px-3 py-2 transition-colors`

### Cards & Containers (কার্ড ও কন্টেইনার নির্দেশিকা)
- **Standard Card**: `bg-background border border-border rounded-xl shadow-xs hover:shadow-md transition-shadow duration-200 p-4`
- **Interactive Card**: `bg-background border border-border rounded-xl hover:border-primary/50 transition-all duration-200 p-4`
- **Muted Section Container**: `bg-muted/50 rounded-xl p-4 md:p-6 border border-border/50`

### Form Controls (ফর্ম ইনপুট নির্দেশিকা)
- **Text Input / Select**: `w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50`

### Badges & Chips (ব্যাজ নির্দেশিকা)
- **Success Badge**: `bg-success-light text-success font-medium text-xs px-2.5 py-0.5 rounded-full`
- **Warning Badge**: `bg-warning-light text-warning-dark font-medium text-xs px-2.5 py-0.5 rounded-full`
- **Danger Badge**: `bg-danger-light text-danger font-medium text-xs px-2.5 py-0.5 rounded-full`
- **Primary Badge**: `bg-primary-soft text-primary font-medium text-xs px-2.5 py-0.5 rounded-full`

---

## 6. Layout, Spacing & Corner Radius Tokens (লেআউট ও স্পেসিং)

### Corner Radius System
- `rounded-sm` (`0.375rem` / 6px) — Badges, small tooltips
- `rounded-md` (`0.5rem` / 8px) — Buttons, form inputs, dropdown menus
- `rounded-lg` (`0.75rem` / 12px) — Cards, modals, search bars
- `rounded-xl` (`1rem` / 16px) — Feature containers, main product cards
- `rounded-full` (`9999px`) — Avatar circles, pill badges

### Transition & Micro-animations
All interactive states (hover, focus, active, tab transitions) MUST use subtle smooth transitions:
- Fast: `transition-all duration-150 ease-in-out`
- Normal: `transition-all duration-250 ease-in-out`

---

## 7. Strict Directives for AI Assistants (AI সহযোগীদের জন্য কঠোর আদেশ)

> 🚨 **NEVER VIOLATE THE FOLLOWING RULES**:

1. **DO NOT** add custom font imports or introduce serif/display fonts anywhere in `src/app` or `src/components`.
2. **DO NOT** use inline `style={{ color: '...' }}` or arbitrary hex codes in component code.
3. **DO NOT** use arbitrary color class names like `text-purple-600`, `bg-indigo-700`, `border-pink-300`, `text-teal-500` unless these colors are added as formal tokens in `globals.css`.
4. **ALWAYS** use `text-primary`, `bg-primary`, `bg-muted`, `border-border`, `text-muted-foreground`, `text-foreground`, `bg-accent`, `bg-success-light`, etc.
5. **ALWAYS** check that any branding change in `globals.css` dynamically changes the entire app without breaking layout or colors.
6. **ALWAYS** respect the bilingual design: English uses `font-sans`, Bangla uses `font-bn`.

---
*Created and enforced for the mediShop web platform. Last updated: August 2026.*
