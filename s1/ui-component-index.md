# SolutionBridge UI Component Index

Two source files:
- **A** = `1788665083380_code.html` → Challenge Detail page
- **B** = `1788665091448_code.html` → Overview / Dashboard page

Both share the same sidebar + top header shell. Give Antigravity the index number(s) below and it can pull the exact block by its file + line range.

## Shared Shell (appears in both A & B)
1. **Left Sidebar Nav** — logo, portal name, nav links (Overview/Challenges/Applications/Evaluations/Pilots/Procurement/Payments/Reports) with unread-count pill badges, bottom Settings/Help links, user profile footer card (avatar, name, role, dept).
2. **Top Header Bar** — logo (mobile), breadcrumb trail, global search bar with `⌘K` shortcut, "NIC Cloud: Active" status pill, notification bell (badge count), help icon, ministry switcher dropdown, profile avatar with online-status dot.

## File A — Challenge Detail Page
3. **Top Institutional Alignment Strip** (line 6) — small govt/scheme badges row.
4. **Page Header Dossier Anchor** (line 25) — challenge title block, ID, status tag, key actions.
5. **Financial & Timetable Quick Ledger** (line 52) — budget/date summary strip.
6. **Horizontal Stage Progression Track** (line 82) — procurement lifecycle stepper.
7. **Challenge Overview Card** (line 88) — description/summary card.
8. **Metric Target Cards Grid** (line 111) — small KPI/target stat cards.
9. **Technical Requirements & Startup Eligibility Grid** (line 130) — two sub-columns:
   - 9a. Technical Spec (line 140)
   - 9b. Startup Qualification (line 177)
10. **Pilot Requirements & Sandbox Specification** (line 212) — pilot terms card.
11. **Application Funnel & Status Card** (line 256) — sidebar funnel widget.
12. **Evaluation Criteria & Rubric Weightage** (line 294) — weighted breakdown list (line 303).
13. **Procurement Milestone Timeline** (line 368) — vertical timeline widget.
14. **Official Documents & Evidence Repository** (line 379) — 5 document row items (lines 389–433).
15. **Audit Trail & Cryptographic Governance Record** (line 446) — audit log list.
16. **Bottom Action Footer Bar** (line 489) — back link, export button, "Review Applications" CTA.

## File B — Overview / Dashboard Page
17. **Page Banner & Title Area** (line 35).
18. **Summary KPI Row** (line 79) — 4 stat cards (lines 81, 98, 115, 132).
19. **Status Tabs** (line 152) — tab bar over the data table.
20. **Filter & Search Bar** (line 183):
    - 20a. Search input (185)
    - 20b. Department filter dropdown (192)
    - 20c. Domain filter dropdown (204)
    - 20d. Budget range filter (216)
    - 20e. Stage filter (226)
    - 20f. Reset button (238)
    - 20g. Sort selector (243)
21. **Data Table** (line 257) — 7 example rows (lines 274–689), each a full challenge record row.
22. **Table Footer & Pagination** (line 690).
23. **Bottom System Status Bar** (line 722) — uptime/integration status strip.

---
### How to use with Antigravity
Tell it something like: *"Take UI #1 and #2 (shell) plus #18 and #21 from ui-component-index.md and adapt them into my project's dashboard, keeping the same Tailwind classes but using my color tokens."*

Note: both files use Tailwind CDN + custom CSS variables (colors like `primary`, `on-surface`, `surface-container-*`) defined in the inline `tailwind.config` — Antigravity will need that token map too if you want the exact look, since it's not part of default Tailwind.
