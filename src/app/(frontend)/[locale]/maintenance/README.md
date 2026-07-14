# Maintenance page update

## What I found checking the live old site
The old WordPress Maintenance page covers 6 real service categories via an accordion (Mechanical
Services, Mechanical Systems Overhaul, Hull Repair & Gel Coat Restoration, Antifouling &
Protective Coating, Certifications & Compliance, Guardenage & Daily Care) — your new page only had
4, and two of those four (Electrical Systems, Renovation & Restoration) don't quite match anything
on the old site. Expanded to the real 6, with freshly written copy (not copied from the old site —
I read it for context, then wrote original descriptions).

The old site also has a "Schedule Service" booking form (boat make/model, HIN number, etc.) that
doesn't exist on your new page at all. I haven't added this yet — it would need its own form
component and likely a backend handler, which felt like a bigger, separate piece of work rather
than something to fold into a styling pass. Flagging it in case you want that built out next.

## What changed
- Hero swapped to the shared `PageHero`, using a real photo of a hull on stands being prepped for
  work (confirmed already in your project, also used on the live old site for this exact context).
- Expanded from 4 to 6 service cards matching the real scope above.
- 2 of the 6 cards have real photos already in your project (Mechanical Services uses the engine
  bay photo, Hull Repair uses the hull-on-stands shot — different crop than the hero). The other 4
  show a clean "Photo coming soon" placeholder rather than nothing.
- Removed all emoji (cert badge, seasonal care headers) in favor of plain text/a star glyph for
  the cert badge, consistent with About and Services pages.
- Added a sub-480px breakpoint.

## Apply
Replace `page.tsx` and `maintenance.module.css` in `src/app/(frontend)/maintenance/`, refresh.

## Optional next steps
If you'd like the 4 missing photo slots filled and/or the Schedule Service form built, let me know
and I'll scope those as their own pieces of work.
