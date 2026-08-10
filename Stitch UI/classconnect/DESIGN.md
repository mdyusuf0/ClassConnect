---
name: ClassConnect
colors:
  surface: '#fcf9f8'
  surface-dim: '#dcd9d9'
  surface-bright: '#fcf9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f2'
  surface-container: '#f0eded'
  surface-container-high: '#eae7e7'
  surface-container-highest: '#e5e2e1'
  on-surface: '#1b1b1b'
  on-surface-variant: '#444651'
  inverse-surface: '#303030'
  inverse-on-surface: '#f3f0ef'
  outline: '#747782'
  outline-variant: '#c4c6d2'
  surface-tint: '#3e5ca2'
  primary: '#001845'
  on-primary: '#ffffff'
  primary-container: '#002b70'
  on-primary-container: '#7995e0'
  inverse-primary: '#b1c5ff'
  secondary: '#a93100'
  on-secondary: '#ffffff'
  secondary-container: '#d44000'
  on-secondary-container: '#fffbff'
  tertiary: '#101e00'
  on-tertiary: '#ffffff'
  tertiary-container: '#203500'
  on-tertiary-container: '#74a52a'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2ff'
  primary-fixed-dim: '#b1c5ff'
  on-primary-fixed: '#001847'
  on-primary-fixed-variant: '#244488'
  secondary-fixed: '#ffdbd0'
  secondary-fixed-dim: '#ffb59e'
  on-secondary-fixed: '#3a0b00'
  on-secondary-fixed-variant: '#842500'
  tertiary-fixed: '#bdf370'
  tertiary-fixed-dim: '#a2d657'
  on-tertiary-fixed: '#111f00'
  on-tertiary-fixed-variant: '#324f00'
  background: '#fcf9f8'
  on-background: '#1b1b1b'
  surface-variant: '#e5e2e1'
  surface-alt: '#F5F9FA'
  border-muted: '#DEDEDE'
  success-green: '#76A72C'
  action-blue: '#5C88D5'
typography:
  display-lg:
    fontFamily: Hanken Grotesk
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-md:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  title-md:
    fontFamily: Hanken Grotesk
    fontSize: 18px
    fontWeight: '500'
    lineHeight: 24px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  caption:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '400'
    lineHeight: 14px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 64px
---

## Brand & Style

The design system for ClassConnect is built on a foundation of **Corporate Modernism**, prioritizing reliability and clarity for educational environments. It translates the energetic palette of the Skaarvi brand into a structured, professional interface that facilitates learning and administration without distraction.

The visual language balances the authority of a deep navy base with the high-energy motivation of orange and green accents. The overall mood is "Professional Achievement"—it feels like a high-end educational tool that is both accessible to students and robust enough for faculty.

- **Minimalist Structure:** Heavy use of white space and a systematic grid ensures that complex course data remains legible.
- **Functional Accents:** Vibrant colors are reserved for interactive elements, status indicators, and progress tracking.
- **Precision:** The aesthetic favors sharp lines and consistent, mathematical spacing to evoke a sense of order and academic discipline.

## Colors

The color palette is anchored by **Navy Blue (#002B70)**, used for primary navigation and structural branding to establish trust. **Orange (#EE4A03)** serves as the primary interactive accent, used for Call-to-Actions (CTAs) and critical alerts, providing a high-contrast focal point against the deep blue.

**Green (#76A72C)** is introduced as a tertiary color specifically for educational progress, "completed" states, and positive feedback loops. The neutral scale is grounded in **Charcoal (#1D1D1D)** for typography, while the background utilizes a very subtle **Ice Blue (#F5F9FA)** to reduce eye strain during long study sessions compared to pure white.

## Typography

This design system employs a dual-font strategy to maximize both character and legibility. 

- **Hanken Grotesk** is used for headlines and titles. Its sharp, contemporary geometry provides a "clean and professional" look that feels modern and authoritative.
- **Inter** is used for all body copy, labels, and UI elements. Chosen for its exceptional readability at small sizes and neutral tone, it ensures that instructional content is easily digestible.

Hierarchy is maintained through consistent weight application: bold for primary headers, medium for sub-headers, and regular for long-form reading. All labels use a slightly tighter tracking and semi-bold weight for immediate recognition in densly packed UI.

## Layout & Spacing

The layout utilizes a **12-column Fixed Grid** on desktop (max-width 1280px) and a **4-column Fluid Grid** on mobile devices. 

A strict 4px baseline grid ensures vertical rhythm. Spacing is used to group related educational content—smaller gaps (8px) for input-label pairs and larger gaps (24px) between distinct modules or course cards. 

**Breakpoints:**
- **Mobile (<600px):** Single column stack, 16px side margins.
- **Tablet (600px - 1024px):** 2-column card layouts, 24px margins.
- **Desktop (>1024px):** 12-column grid with 24px gutters.

## Elevation & Depth

ClassConnect uses **Tonal Layering** supplemented by high-precision **Ambient Shadows** to create hierarchy. 

- **Level 0 (Base):** The Ice Blue background (#F5F9FA).
- **Level 1 (Cards/Containers):** White surfaces with a subtle 1px border (#DEDEDE). No shadow.
- **Level 2 (Active/Hover):** Cards on hover receive a soft, expansive shadow: `0px 4px 20px rgba(0, 0, 0, 0.08)`.
- **Level 3 (Modals/Overlays):** These use the "2xl" shadow style from the reference: `0px 5px 40px rgba(0, 0, 0, 0.16)`. 

Depth is primarily communicated through color shifts (e.g., a darker blue for a pressed button) rather than physical extrusion, keeping the interface feeling flat and modern.

## Shapes

The shape language is **Soft (0.25rem)**. This subtle rounding provides a friendly, approachable feel while maintaining the professional rigor of a "sharp" corporate system.

- **Standard Radius:** 4px (0.25rem) for buttons, input fields, and checkboxes.
- **Large Radius:** 8px (0.5rem) for cards and container modules.
- **Extra Large Radius:** 12px (0.75rem) for global navigation elements and feature banners.

Avatars and status pips remain fully circular (pill-shaped) to distinguish human elements and dynamic states from static UI containers.

## Components

### Buttons
- **Primary:** Navy Blue (#002B70) background with white text. 4px border radius.
- **Secondary/CTA:** Orange (#EE4A03) background with white text. Reserved for high-priority actions like "Enroll" or "Submit."
- **Ghost:** Navy Blue outline with transparent background for secondary navigation actions.

### Input Fields
- White background with a 1px border (#DEDEDE).
- Labels are positioned above the field in Inter Semi-bold 12px.
- Focus state: Border changes to Action Blue (#5C88D5) with a 2px soft glow.

### Cards
- White background, 8px radius, 1px border. 
- Header section of the card uses a light tint of the primary color to separate title information from the card body.

### Chips & Tags
- Used for course categories (e.g., "Math", "Live").
- Backgrounds use 10% opacity versions of the brand colors (Navy, Orange, Green) with 100% opacity text of the same hue for a "tonal" look.

### Lists
- Standard list items use a 16px padding and a subtle bottom border.
- Active list items in sidebars use a left-edge 4px accent bar in Orange.