# Sell Your Boat page update

## Context
No equivalent page exists on the old WordPress site (genuine 404, like About) — this content was
written fresh for the new site, and it was already good: a clear 5-step process, a solid "why sell
with us" list, and a working `EnquiryForm` already wired in. No copy rewrite needed here.

## Important catch: the hero image was actively wrong
The previous hero used `ABG-WEBSITE-BANNERZ_Prancheta-1-10-scaled.png` as a faint background.
I opened it directly and it's a flattened old homepage slider banner announcing a *specific GRAND
boat model* with copy like "worldwide announcement in 2025" and its own unrelated "Learn More"
button baked into the image. That's not just an unrelated photo — it's actively wrong messaging
for a "sell your boat" page, and the announcement is presumably stale by now regardless. I checked
the other two files in that same "BANNERZ" set and they're the same pattern (Yamarin product
promo) — worth treating any filename containing "BANNER" with suspicion going forward, as a rule.

Replaced with a real, clean marina photo (a different angle of the same boat used on the About
page, so the two pages don't feel repetitive) via the shared `PageHero` component.

## What changed
- Hero swapped to `PageHero` with the corrected photo.
- Removed the old `.hero` CSS block entirely (including the reference to the stale banner file).
- Added a sub-480px breakpoint for the process steps and form padding on small phones.
- No content/copy changes — it was already well-written.

## Apply
Replace `page.tsx` and `sell.module.css` in `src/app/(frontend)/sell-your-boat/`, refresh.
