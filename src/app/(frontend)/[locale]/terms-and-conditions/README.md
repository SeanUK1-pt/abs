# Terms & Conditions / Privacy Policy — light pass

## What I checked
Both pages share this one CSS module (`legal.module.css`), and both `page.tsx` files contain
genuinely fine, standard boilerplate legal copy — accurate contact details matching what's used
elsewhere, sensible GDPR rights section, nothing factually wrong or broken. No content or
structural redesign needed here, by design — a legal page shouldn't have a hero photo or marketing
styling, and the existing capped-width, clean-typography approach was already correct.

## What changed
Only one real gap: this file had zero responsive/mobile handling. Added a single breakpoint
(600px) that scales down the heading sizes and tightens vertical padding, so the page doesn't feel
oversized or excessively spaced out on a phone. No JS/TSX files needed any changes at all.

## Apply
Replace `src/app/(frontend)/terms-and-conditions/legal.module.css` (this is the only file used by
both pages — privacy-policy/page.tsx imports it directly from the terms-and-conditions folder).
