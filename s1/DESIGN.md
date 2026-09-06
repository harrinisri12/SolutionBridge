---
name: Sovereign Civic Modern
colors:
  surface: '#f8f9ff'
  surface-dim: '#ccdbf3'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e6eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d5e3fc'
  on-surface: '#0d1c2e'
  on-surface-variant: '#43474d'
  inverse-surface: '#233144'
  inverse-on-surface: '#eaf1ff'
  outline: '#74777e'
  outline-variant: '#c3c6ce'
  surface-tint: '#49607c'
  primary: '#001428'
  on-primary: '#ffffff'
  primary-container: '#0f2942'
  on-primary-container: '#7991af'
  inverse-primary: '#b0c9e8'
  secondary: '#045eb2'
  on-secondary: '#ffffff'
  secondary-container: '#67a4fd'
  on-secondary-container: '#003971'
  tertiary: '#001714'
  on-tertiary: '#ffffff'
  tertiary-container: '#002e29'
  on-tertiary-container: '#269f93'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d1e4ff'
  primary-fixed-dim: '#b0c9e8'
  on-primary-fixed: '#011d35'
  on-primary-fixed-variant: '#314863'
  secondary-fixed: '#d5e3ff'
  secondary-fixed-dim: '#a8c8ff'
  on-secondary-fixed: '#001b3c'
  on-secondary-fixed-variant: '#004689'
  tertiary-fixed: '#89f5e7'
  tertiary-fixed-dim: '#6bd8cb'
  on-tertiary-fixed: '#00201d'
  on-tertiary-fixed-variant: '#005049'
  background: '#f8f9ff'
  on-background: '#0d1c2e'
  surface-variant: '#d5e3fc'
typography:
  headline-xl:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: Inter
    fontSize: 26px
    fontWeight: '700'
    lineHeight: 34px
    letterSpacing: -0.015em
  headline-lg:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: 0em
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0em
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
    letterSpacing: 0.005em
  metric-display:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.02em
  tabular-label:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
    letterSpacing: 0.01em
  label-caps:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.06em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  space-2xs: 0.125rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-base: 1rem
  space-lg: 1.25rem
  space-xl: 1.5rem
  space-2xl: 2rem
  gutter-desktop: 1.5rem
  gutter-tablet: 1rem
  gutter-mobile: 0.75rem
  margin-desktop: 2rem
  margin-mobile: 1rem
---

## Brand & Style

This design system delivers an authoritative, high-density digital interface tailored for senior Indian administrative officers, procurement directors, and technical committee evaluators. The interface communicates institutional stability, rigorous auditability, and modern bureaucratic efficiency.

The aesthetic follows an institutional Corporate Modern ethos engineered for high cognitive throughput:
- **Zero Decorative Noise:** Elimination of playful illustrations, gratuitous gradients, and consumer-grade floating cards. Every pixel represents status, data, or action.
- **Architectonic Precision:** Clear structural compartmentalization through fine hairline borders, deliberate column tracks, and explicit tabular data alignment.
- **Auditable Authority:** State-level transparency reinforced by high-contrast typographic balance, clear state representations (e.g., sanction levels, stage clearances, fund releases), and predictable interaction patterns.

## Colors

The palette balances administrative gravitas with accessible, scannable data visualization:

- **Primary (`#0F2942`):** Institutional Deep Navy. Used for primary navigation infrastructure, top-level headings, key brand identifiers, and primary system buttons.
- **Secondary (`#1D68BD`):** Executive Blue. Designates interactive states, verified stages, links, and secondary interactive components.
- **Tertiary (`#0D9488`):** Verified Forest Emerald. Used for sanction confirmations, compliant status tags, on-track procurement phases, and positive delta values.
- **Neutral (`#475569`):** Slate Gray. Provides calibrated mid-tone contrast for metadata, secondary field labels, column headers, and structural divides.
- **Surface Foundations:**
  - Base Canvas: `#F4F6F9` (cool slate foundation that minimizes eye fatigue during prolonged shift operations).
  - Card & Container Fill: `#FFFFFF` with hairlines rendered in `#E2E8F0`.
  - Contrast Data Typography: Deep Navy Slate (`#0F172A`) for non-negotiable legibility.

### Semantic Triage Roles
- **Critical / Blocked:** `#DC2626` (Red 600) with `#FEF2F2` (Red 50) fill.
- **Pending / Action Required:** `#D97706` (Amber 600) with `#FFFBEB` (Amber 50) fill.
- **On Track / Sanctioned:** `#0D9488` (Teal 600) with `#F0FDFA` (Teal 50) fill.
- **Pilot / Sandbox / Stage Evaluation:** `#4F46E5` (Indigo 600) with `#EEF2FF` (Indigo 50) fill.

## Typography

The type system prioritizes structural stability and high-density numeric processing using Inter.

- **Tabular Numerics Rule:** All data grids, budget allocation ledgers, rupee indicators (`₹`), percentages, and operational counts must enable font-feature-settings: `"tnum"` on, `"cv05"` on (l-variant), and `"zero"` on (slashed zero) to guarantee uninterrupted vertical alignment across thousands of financial rows.
- **Hierarchy Structure:**
  - `metric-display` for top-level summary cards (e.g., Total Sanctioned Outlay, Active RFP Pipeline).
  - `tabular-label` and `label-caps` for strict administrative table heads, meta tags, and audit trails.
- **Punctuation & Symbols:** The Indian Rupee symbol (`₹`) is rendered at medium weight matching adjacent numbers rather than default system glyphs to prevent baseline jumping.

## Layout & Spacing

A compact, information-dense layout optimized for administrative oversight:

- **Grid Architecture:** 12-column fluid grid system pinned to a maximum container width of `1600px`.
  - Desktop (`≥1280px`): `gutter-desktop` (24px) with fixed `margin-desktop` (32px).
  - Tablet (`768px - 1279px`): 8-column layout with `gutter-tablet` (16px).
  - Mobile (`<768px`): 4-column reflow with `gutter-mobile` (12px) and `margin-mobile` (16px).
- **Vertical Density Standards:**
  - Table row height standard: Compact at 40px, regular at 48px, never exceeding 56px.
  - Card interior padding: Fixed `16px` (`space-base`) or `20px` (`space-lg`) to balance screen real estate across multi-metric dashboards.
- **Split-Panel Architecture:** Two-column split-view for procurement review workflows (60% dossier/proposal reader on left, 40% evaluation rubric & approval workflow pinned right).

## Elevation & Depth

Visual hierarchy is communicated through sharp structural layering and low-contrast outlines rather than deep ambient drops:

- **Ghost Framing:** All modular containers use a 1px solid border (`#E2E8F0`) on a pure white surface (`#FFFFFF`).
- **Surface Elevation Levels:**
  - **Flat / Base:** Canvas `#F4F6F9`. No shadow.
  - **Level 1 (Cards & Data Sections):** `box-shadow: 0 1px 2px 0 rgba(15, 23, 42, 0.04); border: 1px solid #E2E8F0`.
  - **Level 2 (Hover States, Action Bars):** `box-shadow: 0 2px 4px -1px rgba(15, 23, 42, 0.06), 0 1px 2px -1px rgba(15, 23, 42, 0.04); border: 1px solid #CBD5E1`.
  - **Level 3 (Modal Sheets & Context Menus):** `box-shadow: 0 10px 15px -3px rgba(15, 23, 42, 0.08), 0 4px 6px -2px rgba(15, 23, 42, 0.03); border: 1px solid #CBD5E1`.
- **Dividers:** Heavy visual breaks use 1px solid `#E2E8F0`; secondary internal list separators use 1px solid `#F1F5F9`.

## Shapes

The design uses a conservative, disciplined shape profile:
- Primary UI elements (cards, input fields, operational buttons, status tags) utilize an exact corner radius of 6px to 8px (`roundedness: 1`).
- Avoid pill buttons (`9999px`) or ultra-soft corners (`>12px`), which dilute institutional rigor.
- Micro-indicators: Status pips, stage progression checkpoints, and timeline step badges use strict circular nodes (50% radius) nested inside structured rectangular frames.

## Components

### Buttons
- **Primary:** Background `#0F2942`, text `#FFFFFF`, 1px border `#0A192F`. Hover state `#1E3E61`. Active `#0A192F`. Height: 36px (compact) / 40px (default). Radius: 6px.
- **Secondary:** Background `#FFFFFF`, text `#0F2942`, border 1px solid `#CBD5E1`. Hover: `#F8FAFC`.
- **Tertiary / Subdued:** Background transparent, text `#1D68BD`, no border.
- **Destructive Action:** Background `#DC2626`, text `#FFFFFF`. Used strictly for final stage rejections or tender cancellations.

### Data Tables & Ledgers
- Header row: Background `#F8FAFC`, uppercase `label-caps` text `#475569`, border-bottom 1px solid `#CBD5E1`.
- Rows: Background `#FFFFFF`, bottom hairline `#E2E8F0`. Hover highlight: `#F8FAFC`.
- Metric Cells: Right-aligned tabular layout with numeric weights set to 500 or 600.

### Status Badges
- Structured pill-corner tags (height: 22px, radius: 4px) containing an explicit leading 6px circular indicator dot:
  - *Sanctioned / Approved:* Dot `#0D9488`, fill `#F0FDFA`, border `#CCFBF1`, text `#0F766E`.
  - *Evaluation / Review:* Dot `#D97706`, fill `#FFFBEB`, border `#FEF3C7`, text `#B45309`.
  - *Urgent Action / Non-Compliant:* Dot `#DC2626`, fill `#FEF2F2`, border `#FEE2E2`, text `#B91C1C`.
  - *Pilot / Staging:* Dot `#4F46E5`, fill `#EEF2FF`, border `#E0E7FF`, text `#4338CA`.

### Form Fields & Validation
- Height: 38px. Background `#FFFFFF`, border 1px solid `#CBD5E1`, text `#0F172A`.
- Focus state: Border `#1D68BD` with `0 0 0 1px #1D68BD`.
- Required fields marked by precise text note `(Mandatory)` in secondary slate rather than ambiguous asterisks.

### Progress Meters & Step Trackers
- Horizontal track height: 6px. Background `#E2E8F0`, filled track `#1D68BD` or `#0D9488`.
- Multi-step governance stages: Connected sequence of numbered square nodes (24x24px, 4px radius) connected by 2px hairline lines. Completed steps feature a `#0D9488` fill with white checkmarks; active steps show `#0F2942` borders with deep navy text.