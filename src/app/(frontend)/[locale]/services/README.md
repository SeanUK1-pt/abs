# Services page update

## What changed
- Swapped the flat navy hero for the shared `PageHero` component, using a real photo of your
  workshop (a GRAND RIB on a trailer, with Yamarin/SPX RIB branding visible in the background) —
  much stronger than the previous 25%-opacity background treatment.
- Replaced emoji icons with the same numbered-badge style used on the About page, for visual
  consistency site-wide.
- **Found and fixed a real bug**: the WhatsApp button linked to `https://wa.me/` with no number
  at all — completely non-functional. Checked the rest of the codebase and confirmed
  `+351963692451` is the number used consistently elsewhere (homepage, contact page, footer
  default), so used that here too.
- Added a sub-480px breakpoint for tighter card/CTA padding on small phones (the original only
  had one breakpoint at 768px).

## Content
Left the six service cards' copy and feature lists untouched — they were already well-written
and specific, nothing needed rewriting here.

## Apply
Replace `src/app/(frontend)/services/page.tsx` and `services.module.css`, refresh.
