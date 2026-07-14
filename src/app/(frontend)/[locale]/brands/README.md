# Brands page update

## Real bugs found and fixed (not just styling)
This page was already well-written content-wise, but had two genuine photo-accuracy problems
worth knowing about regardless of the styling pass:

1. **GRAND's hero photo was actually a Brig boat.** Both GRAND and Brig were pointed at the same
   file, `brig_eagle10_hero-scaled.jpg` — which has "BRIG" printed directly on the boat's hull, so
   it's unambiguously a Brig product shot, not GRAND. Fixed by using `screenshot-31.png`, which I'd
   identified earlier this session as a genuine GRAND "Golden Line G680" render — the model name is
   visible on the hull, and "Golden Line 680" is already listed in this brand's models array, so it's
   an accurate match.
2. **BWA's hero photo was the stale Yamarin promo banner** (`ABG-WEBSITE-BANNERZ_Prancheta-1-11`)
   — the same one I found and removed from the Sell Your Boat page. Wrong brand entirely, and also
   outdated marketing copy baked into the image. No real BWA photo exists in your media library, so
   I set this to a clean "Photo coming soon" placeholder rather than reusing another wrong image.

On a brands page specifically, showing the wrong manufacturer's product would be the kind of
mistake a boat-savvy customer might actually notice and lose confidence over — worth having caught
before this went live.

## What else changed
- Hero swapped to the shared `PageHero` (kept the existing SPX action photo — it's a genuine, good
  photo, no issue there).
- Vanclaes (which already had no image) and now BWA get a proper "Photo coming soon" placeholder
  instead of just silently having no image block at all.
- Removed the globe emoji next to country of origin.
- Added responsive breakpoints — this file had NONE before, despite each brand card being fairly
  content-dense (header, tag, origin, italic highlight, description, model chips).

## Apply
Replace `page.tsx` and `brands.module.css` in `src/app/(frontend)/brands/`, refresh.

## Optional follow-up
If you have (or can get) a real BWA photo, send it over and I'll wire it in the same way as the
others.
