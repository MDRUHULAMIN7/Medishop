# Workspace Rules & Constraints for mediShop

## Design & UI Consistency Guidelines
All UI development, component edits, and styling in this repository must strictly adhere to [`design.md`](file:///d:/Restart/CodeClub/Medishop/design.md).

### Key Rules:
1. **Typography**: Only use approved fonts (`font-sans` for English UI, `font-bn` for Bengali UI). Do not introduce arbitrary serif fonts or new Google fonts.
2. **Color Tokens**: NEVER hardcode hex codes or use arbitrary Tailwind color utility classes (e.g. `text-purple-600`, `bg-indigo-500`). Use central CSS design tokens from `globals.css` (`bg-primary`, `text-primary`, `bg-muted`, `border-border`, `text-muted-foreground`, `bg-accent`, etc.).
3. **Single Point of Truth**: Theme and branding changes made in `globals.css` must dynamically cascade across all components (logo, buttons, navigation, cards, badges) without needing inline component modifications.
