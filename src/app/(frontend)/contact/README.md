# Contact page update

## Real content gap found and fixed
Checked the live old site and it has an embedded Google Map showing exactly where the office is —
genuinely useful for "how do I find you," more so than a static photo. Your new page didn't have
this at all (just a small photo). Added a proper map embed using a no-API-key-required Google Maps
iframe (the kind you get from Maps' "Share → Embed" feature) — this avoids needing you to set up
billing/API keys just for a location pin, while still being a real interactive embedded map.

## Verified the UK phone number — left it alone
I checked whether `(+44) 330 808 0317` was real or possibly fabricated, since I couldn't find it
anywhere on the live old site or elsewhere in the codebase. You confirmed it's real, so no change.

## What else changed
- Removed emoji icons from the contact detail items (person, pin, phone, clock, chat) for
  consistency with the rest of the site.
- Fixed the hero photo's alt text — it claimed "Marina de Lagos" but this is the same RIB-formation
  photo used on the About page, which (per our earlier conversation) is likely actually photographed
  in Italy/Sicily, not Portugal. You'd confirmed it's fine to use the photo itself; this just stops
  the alt text from asserting an inaccurate location, which felt like a more concrete claim
  appropriate to fix given this is literally the "where to find us" page.
- Found and fixed a pre-existing CSS gap: `.formWrap` was referenced in the page but never defined
  anywhere in the stylesheet. Added it with sticky positioning (desktop only — disabled on mobile
  where the layout stacks to one column) so the enquiry form stays visible while scrolling the
  longer info column.
- Added a sub-480px breakpoint.

## Apply
Replace `page.tsx` and `contact.module.css` in `src/app/(frontend)/contact/`, refresh.
