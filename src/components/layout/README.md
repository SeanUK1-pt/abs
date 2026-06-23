# Header fix — mobile menu invisible, Enquire Now button overflowing

## Root cause (confirmed live, not guessed)
This is the same category of bug as the boat-storage hero title issue: a CSS rule inside a
`.module.css` file used a combinator targeting a *global* class (`.btn`, from `globals.css`)
instead of a module-scoped one.

The original rule was:
```css
.actions .btn {
  display: none;
}
```

I inspected the actual compiled stylesheet on your running localhost page and confirmed this
compiled to `.Header-module__lnUIdW__actions .Header-module__lnUIdW__btn` — Next.js's CSS Modules
scoped BOTH class names, including `.btn`. But the real `<Link>` element renders with the literal
global class `btn btn-gold`, never `Header-module__lnUIdW__btn`. So the selector matched nothing,
the Enquire Now button was never hidden on mobile, and it overflowed past the viewport — which
also shoved the hamburger menu icon off to the side, making it look like there was no menu at all
(it's actually there and correctly coded, just visually displaced by the overflowing button next
to it).

## The fix
Added a dedicated module-scoped class (`.enquireBtn`) applied directly to the Enquire Now Link,
alongside its existing global `btn btn-gold` classes — same pattern used to fix the hero title bug
on the Boat Storage page. The mobile media query now hides `.enquireBtn` directly instead of
relying on a combinator that could never resolve.

## I also checked for more of the same bug
Searched all `.module.css` files in the project for any other selector combining a local class
with a bare global one (`.btn`, `.container`, `.richtext-content`). Found none beyond the two
already fixed (this one, and the boat-storage hero). So this should be the last instance of this
particular mistake — but if you spot a similar "the CSS rule exists but nothing happens" issue
elsewhere, this is the first thing worth checking.

## Apply
Replace `src/components/layout/Header.tsx` and `src/components/layout/Header.module.css` with the
files here, restart `npm run dev` if needed, and refresh. At mobile widths you should now see: the
Enquire Now button disappears, and the hamburger icon is visible and clickable in its place.

This is a global component, so the fix applies site-wide, not just to the Boat Storage page.
