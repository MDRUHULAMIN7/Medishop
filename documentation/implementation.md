# Implementation Roadmap: mediShop (SRS v1.2 Revision)

## Project Overview
**mediShop** is an online pharmacy and digital healthcare platform tailored for the Bangladesh market (inspired by MedEasy.health with enhanced UX, BD trust signals, and Bangla-first localization).

> [!IMPORTANT]
> **Architecture Clarification (SRS v1.2)**: 
> **`shadcn/ui` + `beUI` Extension Integration**: `beUI` (https://beui.dev/) is an extension registry built directly on top of `shadcn/ui` semantic tokens and Radix primitives. Components are installed via the shadcn CLI under the `@beui` namespace (`npx shadcn@latest add @beui/...`). `shadcn/ui` serves as the underlying base system, while `beUI` supplies animated blocks and interactive UI components.

---

## Technical Stack & Configuration

| Layer | Choice | Technical Note |
| :--- | :--- | :--- |
| **Framework** | Next.js 16 (App Router, Strict TypeScript) | Strict mode, no `any` in shared contracts |
| **Styling** | Tailwind CSS v4 | CSS-first `@theme` token configuration |
| **UI System** | **shadcn/ui (Base) + beUI Registry Add-ons** | Base primitives + `@beui` animated blocks |
| **Icons** | Lucide React | |
| **Server / Async State** | TanStack Query v5 (React Query) | Mocked data in Phase 1, ready for API swap in Phase 2 |
| **Client State** | Redux Toolkit (`@reduxjs/toolkit` + `react-redux`) | Cart items, Auth modal, Search history |
| **Forms & Validation** | React Hook Form + Zod (`@hookform/resolvers`) | Bangla + English validation error messages |
| **Animations** | Framer Motion (+ beUI Motion primitives) | Autoplay hero slider, drawer & dialog transitions |
| **Toasts & Feedback** | Sonner | |
| **Theme Colors** | Primary Blue (`#1D4ED8`), Dark (`#1E3A8A`), Accent Amber (`#F59E0B`) | Defined under Tailwind v4 `@theme` in `globals.css` |
| **Typography** | Inter (Body) + Roboto Slab (Titles) + Noto Sans Bengali | Zero-layout-shift `next/font` configuration |

---

## System Folder Structure

```
src/
├── app/               # Next.js 16 App Router pages
├── components/
│   ├── ui/            # shadcn/ui base & beUI primitive wrappers
│   ├── layout/        # Navbar, Footer, Category Sidebar
│   ├── home/          # Hero Slider, Trust Badges, Section Carousels
│   ├── auth/          # Auth Modal (Sign In, Sign Up, OTP, Forgot Password)
│   ├── product/       # Product Card, Filter Sidebar, Sort, Autocomplete
│   ├── pdp/           # Image Gallery, Spec Tabs, Cross-Sell Rail
│   └── cart/          # Cart Drawer, Cart Item, Free Delivery Bar
├── store/             # Redux slices (cart, auth, searchHistory)
├── hooks/             # TanStack Query custom hooks (mocked data sources)
├── lib/               # Utility functions & helpers
├── types/             # Shared TypeScript types (Product, Category, CartItem, Order, User)
└── mocks/             # Static mock catalog, categories, users, orders
```

---

## Detailed Phase-by-Phase Implementation Roadmap

### Phase 0: Project Scaffolding & Component Setup
- **Goal**: Initialize Next.js 16 App Router with strict TypeScript, Tailwind v4, shadcn/ui base, beUI registry configuration, and foundational state management.
- **Key Tasks**:
  1. Scaffold Next.js 16 App Router project with `--typescript --tailwind --app --src-dir`.
  2. Initialize shadcn/ui (`npx shadcn@latest init`).
  3. Install core dependencies: `@tanstack/react-query`, `@reduxjs/toolkit`, `react-redux`, `react-hook-form`, `zod`, `@hookform/resolvers`, `framer-motion`, `lucide-react`, `sonner`.
  4. Test adding beUI component blocks (e.g., `npx shadcn@latest add @beui/otp-input`, `npx shadcn@latest add @beui/animated-side-panel`).
  5. Establish folder hierarchy and mock data foundation (`src/mocks/`, `src/types/`).
- **Exit Criteria**: `npm run dev` builds without errors, shadcn and `@beui/*` packages resolve, empty page placeholders created.

---

### Phase 1: Design Tokens, Root Layout & Global Shell
- **Goal**: Build global layout shell, load brand fonts, set up Tailwind v4 theme variables, and wrap global providers.
- **Key Tasks**:
  1. `globals.css`: Define `@theme` tokens (`--primary: #1D4ED8`, `--primary-dark: #1E3A8A`, `--accent: #F59E0B`, `--muted: #F1F5F9`).
  2. `app/layout.tsx`: Load `Inter`, `Roboto Slab`, and `Noto Sans Bengali` fonts; configure `QueryClientProvider`, `ReduxProvider`, and `Sonner Toaster`.
  3. **Sticky Navbar (64px mobile / 72px desktop)**:
     - Brand Logo (`mediShop` in Roboto Slab Bold, linking to `/`).
     - Global Search Input (Inline desktop, expandable full-screen overlay on mobile).
     - Cart Icon with animated live badge bound to Redux cart selector.
     - Account button showing "Sign In" for guests or Avatar dropdown for authenticated users.
  4. **Footer**: 4-column desktop layout (About, Categories, Support, Contact) / stacked accordion mobile layout + trust icons & copyright.
- **Exit Criteria**: Responsive Navbar & Footer across mobile (360px), tablet (768px), and desktop (1024px+).

---

### Phase 2: Homepage Core (Hero, Sidebar, Products & Trust Badges)
- **Goal**: Deliver MedEasy-inspired homepage with enhanced Bangladeshi trust signals and interactive product sections.
- **Key Tasks**:
  1. **Hero Slider**: Framer Motion 5-slide carousel, 5000ms autoplay with hover/touch pause, touch swipe support, Bangla+English banners.
  2. **Category Sidebar**: Desktop 240px sticky column; mobile horizontal scrollable chip bar.
  3. **Trust Badge Row**: 4 static badges (DGDA Licensed, 100% Authentic, Same-Day Dhaka Delivery, 24/7 Pharmacist Support).
  4. **Product Card (`ProductCard.tsx`)**: Thumbnail, Amber discount badge, brand name, dual Bangla/English name, price + MRP strikethrough, full-width "Add to Cart" button with Sonner toast.
  5. **Product Sections**: "Exclusive Deals", "Fast-Moving OTC", "Diabetic Care", "Women's Choice", "Baby Care" with independent query loading.
  6. **Prescription Upload Banner**: 4-step visual workflow guide linking to prescription upload flow.
- **Exit Criteria**: Homepage fully populated from mock data, lazy loaded sections, zero layout shift.

---

### Phase 3: Authentication Modal System (beUI Dialog)
- **Goal**: Non-navigating modal authentication supporting BD Phone + OTP & Email options.
- **Key Tasks**:
  1. **Redux Auth Slice**: State for `user`, `isAuthenticated`, `isAuthModalOpen`, and `authModalView` (`signin` | `signup` | `otp` | `forgot`).
  2. **Auth Modal (`beUI` Dialog component)**:
     - **Sign In**: Dual Email/Phone input field, password with toggle eye icon, "Forgot Password?" link.
     - **Sign Up**: Full Name, Email/Phone toggle, Password, Confirm Password, mandatory T&C checkbox.
     - **OTP View**: 6-box `beUI` OTP input block, 60s countdown timer for resend code, demo auto-verify PIN `123456`.
     - **Forgot Password**: Simulated reset link confirmation.
  3. **Validation**: React Hook Form + Zod with dual Bangla & English localized error messages.
- **Exit Criteria**: Full authentication loop completable without page refresh, preserving entered state on unmount.

---

### Phase 4: Product Listing Pages (PLP) & Search Autocomplete
- **Goal**: Complete product catalog browsing with instant search, autocomplete, URL-synced filters, and sorting.
- **Key Tasks**:
  1. **Search Integration (SRS §3.4)**:
     - 300ms debounced query execution.
     - Autocomplete dropdown: top 5 product matches (thumbnail, title, price) + "See all results for '{query}'".
     - `/search?q={query}` results page with pre-filled query and empty state handling.
     - Recent searches (last 5, stored in Redux, clearable).
  2. **PLP Routes**: `/products`, `/category/[slug]`, `/search`.
  3. **Filter Sidebar (260px Sticky Desktop / Bottom Sheet Mobile)**:
     - Category tree checklist
     - Searchable Brand checklist
     - Dual-thumb price slider (`beUI` slider) + synchronized Min/Max number inputs
     - Discount percentage radios (10%+, 20%+, 30%+, 50%+)
     - In-Stock toggle
     - Prescription requirement filter (All / Required / OTC)
  4. **Active Filter Chips**: Removable chips above grid + "Clear All" action.
  5. **Sort Dropdown**: Popularity, Price Low→High, Price High→Low, Discount %, Newest, Name A-Z.
- **Exit Criteria**: Filters & sorting URL-synced via query params, shareable links, debounced search working cleanly.

---

### Phase 4.5: Product Detail Page (PDP)
- **Goal**: Full product detail view at `/product/[slug]` with prescription indicators and cross-sell rails.
- **Key Tasks**:
  1. **Route `/product/[slug]` Layout**:
     - Image gallery with thumbnail strip + main view (pinch-zoom on mobile).
     - Dual Bangla + English title, brand name link, price, MRP strikethrough, discount badge.
  2. **Prescription Required Badge**: Prominent notice if `product.requiresRx === true`.
  3. **Actions & Sticky Mobile Bar**: Quantity stepper + "Add to Cart" button (fixed to bottom viewport on mobile scroll).
  4. **Tabs Component**: Description, Dosage & Usage, Side Effects & Warnings, Reviews (Phase 1 placeholder).
  5. **"You May Also Need" Rail**: Cross-sell recommendations based on category/tag relationships.
  6. **SEO Metadata**: Per-product dynamic metadata generation via Next.js Metadata API.
- **Exit Criteria**: PDP reachable from any product card, mobile sticky action bar functional, dynamic metadata present.

---

### Phase 5: Cart System (Icon, Badge, Drawer & Cart Page)
- **Goal**: Reactive cart management with real-time updates and free delivery progress tracking.
- **Key Tasks**:
  1. **Redux Cart Slice**: `items[]`, `addToCart`, `removeFromCart`, `updateQuantity`, `clearCart`, memoized subtotal & total selectors.
  2. **Cart Icon Badge**: Animated quantity badge in Navbar updating instantly.
  3. **Cart Drawer (`beUI` Side Panel)**:
     - Right slide-in drawer.
     - Cart item list with thumbnail, title, unit price, quantity steppers, remove button.
     - **Free Delivery Bar**: Interactive progress bar (`"আরও ৳{remaining} যোগ করুন ফ্রি ডেলিভারির জন্য"`, threshold ৳1,000).
     - Sticky footer with Subtotal, "View Cart", and "Proceed to Checkout" actions.
  4. **`/cart` Page**: 2-column desktop view, coupon code input field (mock code `MEDI10`), order breakdown, empty-cart illustration.
- **Exit Criteria**: Cart state synchronized across Navbar badge, Cart Drawer, and `/cart` page.

---

### Phase 6: Checkout & Mock Payment Simulation
- **Goal**: Single-page checkout with delivery address management, delivery fees, and Bangladeshi payment method simulation.
- **Key Tasks**:
  1. **Guarded Route `/checkout`**: Unauthenticated users trigger Auth Modal without losing cart state.
  2. **Delivery Address Form**: Saved addresses list + "Add New Address" modal/form (Name, Mobile, Thana, District dropdown, Full Address, Default toggle).
  3. **Delivery Speed Options**:
     - Same-Day Dhaka Express (৳ 60)
     - Standard Nationwide (৳ 30, free ≥ ৳ 1,000)
  4. **Payment Method Selection**:
     - MFS (bKash, Nagad, Rocket) with wallet-number input validation.
     - Credit/Debit Card mock form (Luhn algorithm check, no PAN persistence).
     - Cash on Delivery (COD).
  5. **Mock Payment Flow**:
     - Click "Place Order" → 1.5s–2s loading spinner state.
     - 90% Success path → Redirect to `/order-success?id=MED-XXXXX`.
     - 10% Failure path → Sonner error toast, cart preserved for retry.
- **Exit Criteria**: Complete end-to-end checkout flow from cart to order success screen with live fee calculation.

---

### Phase 7: Polish, Responsive Matrix, SEO & Launch Readiness
- **Goal**: Production-level UX refinement, accessibility pass, skeleton loaders, and quick mobile ordering options.
- **Key Tasks**:
  1. **Floating Mobile Action Buttons**: Fixed bottom-right "Call to Order" & "WhatsApp Order" buttons for mobile viewports.
  2. **Skeleton Loader Pass**: Skeleton screens for Homepage grids, Category sidebar, PLP filters, and PDP.
  3. **Localization Check**: Default Bangla copy with English fallbacks for all critical flows.
  4. **SEO & Performance Audit**: Next.js Metadata API, OpenGraph headers, Web manifest, LCP optimization with `next/image`.
- **Exit Criteria**: Zero layout shift, a11y score ≥ 90, smooth performance on mobile network profiles.

---

## Recommended Execution Order for Phase-by-Phase Prompts

We will execute implementation phase-by-phase according to this sequence:

1. **Prompt Phase 0**: Project Scaffolding, `shadcn/ui` base init, `beUI` registry setup, Next.js 16 config, dependencies & Redux/Query Store init.
2. **Prompt Phase 1**: Design system tokens (`@theme`), root layout, Google Fonts, Navbar & Footer shell.
3. **Prompt Phase 2**: Homepage features (Hero Slider, Category Sidebar, Trust Badges, Product Card & Grids, Prescription CTA).
4. **Prompt Phase 3**: Authentication Modal (Sign In, Sign Up, OTP, Forgot Password with Redux state).
5. **Prompt Phase 4**: Search Autocomplete, `/search` route, Product Listing page, sticky Filter Sidebar & Sorting.
6. **Prompt Phase 4.5**: Product Detail Page (`/product/[slug]`), Image Gallery, Specs Tabs, Cross-Sell Rail & SEO metadata.
7. **Prompt Phase 5**: Redux Cart Slice, Navbar Cart Badge, `beUI` Cart Drawer, Free Delivery progress bar, and `/cart` Page.
8. **Prompt Phase 6**: Guarded Checkout (`/checkout`), Address form, Delivery calculation, BD Payment selectors & Order Success screen.
9. **Prompt Phase 7**: Skeleton loaders, SEO Metadata, Floating Call/WhatsApp buttons & final responsive polish.

---

## User Review Required

> [!NOTE]
> The implementation plan has been updated to align 100% with **SRS v1.2**, specifying **Next.js 16 App Router**, **shadcn/ui + beUI registry architecture**, **Search Autocomplete (Phase 4)**, and **Product Detail Page (Phase 4.5)**.
> 
