

## 🇬🇧 PROMPT IN ENGLISH

Add a small interactive element to the site — a question-mark icon button that, when clicked, opens a popover card explaining why STONE STORE can be trusted. Place it next to the text that discusses originals vs. replicas (in the `about` block and/or in `brands-footer`, depending on where that copy ended up after the previous edits). Build it as a reusable component — if the icon needs to appear in more than one spot, reuse the same HTML/CSS/JS pattern rather than duplicating hand-written code for each instance.

### 1. Functional requirements

1. **Icon** — a small round "?" button next to the originals/replicas text. Style it to match the existing design system (`--accent` green background, white text, rounded corners, subtle shadow) so it doesn't look out of place.
2. **Open/close on click, not on hover.** Hover doesn't work on touch devices, and the site needs to work equally well on mobile and desktop. Clicking the icon opens the card; clicking it again, clicking outside the card, a "×" close button inside the card, and the `Escape` key should all close it.
3. **Accessibility:**
   - The icon must be a real `<button>`, not a `<div>` with a click handler, so it's keyboard-accessible (Tab, Enter/Space).
   - The button needs `aria-label` with a clear description (e.g. "Store honesty information"), `aria-expanded="true/false"` matching its state, and `aria-haspopup="dialog"`.
   - The card itself needs `role="dialog"` (or `role="note"` if it's a non-modal info tooltip rather than a true dialog) and an `aria-hidden` attribute kept in sync with visibility.
   - When the card opens, focus should either stay on the trigger button or move to the close button inside the card; when closed via Escape, focus returns to the icon button.
4. **Positioning and mobile behavior:**
   - On desktop, the card can open as a popover anchored near the icon (optionally with a small arrow/tail pointing at it).
   - On mobile screens (same breakpoint logic as the existing `max-width: 600px` query in `style.css`), the card must never overflow the viewport edges. Either constrain its width and add repositioning logic to keep it on-screen, or — more robust — render it as a centered modal with a dimmed background overlay on mobile instead of trying to anchor a popover next to a tiny icon on a narrow screen.
   - Check it doesn't conflict (z-index-wise) with the mobile hamburger menu when both could theoretically be open.
5. **Animation** — reuse the existing `--transition` CSS variable for a smooth fade/scale-in and fade-out, consistent with the site's other hover effects.
6. The icon must not break the layout of the paragraph it sits next to — place it either inline right after the text, or as a small standalone button in a corner of the block (`position: relative` on the parent + `position: absolute` on the button), whichever fits better in that specific block (`about-text` or `brands-footer`).

### 2. Copy inside the card

The point of this text is to honestly explain to the customer why the store can be trusted, without legal overreach. Here's the content to work from (feel free to lightly adjust the phrasing to match the site's tone, but don't distort the meaning and don't add extra legal citations beyond the one listed below):

- We always clearly state whether an item is an original or a replica. No product is ever misrepresented as something it isn't.
- For items sold as originals, we guarantee their authenticity — each one is verified before it ships.
- We honor the customer's right to complete and accurate information about a product — this is directly established by Article 10 of Law of the Russian Federation No. 2300-I dated 07.02.1992, "On Protection of Consumer Rights."
- No hidden markups or misleading descriptions — the price and the item type (original/replica) are always clear before you buy.
- If you have any doubts about a specific item, you can ask a manager directly on Telegram before purchasing.

Suggested final wording for the card (a draft — Claude Code can lightly polish it to match the brand voice, but must keep the meaning intact and keep the legal citation):

> **Why you can trust us**
> We always tell you honestly whether an item is an original or a replica — we never pass one off as the other. Original items are verified for authenticity before shipping, and we guarantee that. Your right to complete and accurate product information is protected under Article 10 of the Russian Consumer Protection Law (No. 2300-I, dated 07.02.1992) — and we honor it. Questions about a specific item? Just ask our manager on Telegram before you buy.

### 3. Reference implementation (a starting point — adapt class names and mounting points to the actual `index.html` structure)

```html
<!-- Icon button -->
<button
  class="trust-info-btn"
  aria-label="Store honesty information"
  aria-haspopup="dialog"
  aria-expanded="false"
  aria-controls="trustInfoPopover"
>?</button>

<!-- Info card -->
<div
  class="trust-info-popover"
  id="trustInfoPopover"
  role="dialog"
  aria-hidden="true"
  aria-label="Store honesty information"
>
  <button class="trust-info-close" aria-label="Close">×</button>
  <p><strong>Why you can trust us</strong></p>
  <p>
    We always tell you honestly whether an item is an original or a replica —
    we never pass one off as the other. Original items are verified for
    authenticity before shipping, and we guarantee that. Your right to
    complete and accurate product information is protected under Article 10
    of the Russian Consumer Protection Law (No. 2300-I, dated 07.02.1992) —
    and we honor it. Questions about a specific item? Just ask our manager
    on Telegram before you buy.
  </p>
</div>
```

```css
.trust-info-btn {
  width: 24px;
  height: 24px;
  min-width: 44px; /* actual tap target is larger than the visual circle — see mobile checklist from the previous prompt */
  min-height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: var(--accent);
  color: var(--white);
  border: none;
  font-weight: 700;
  cursor: pointer;
  transition: var(--transition);
}

.trust-info-btn:hover,
.trust-info-btn:focus-visible {
  background: var(--accent-dark);
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

.trust-info-popover {
  position: absolute;
  max-width: 320px;
  background: var(--dark-light);
  border: 1px solid rgba(45, 95, 46, 0.3);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
  opacity: 0;
  transform: translateY(8px);
  pointer-events: none;
  transition: var(--transition);
  z-index: 1200;
}

.trust-info-popover.active {
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
}

/* On mobile — centered modal instead of an anchored popover */
@media (max-width: 600px) {
  .trust-info-popover {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -45%);
    width: calc(100% - 40px);
    max-width: 360px;
  }

  .trust-info-popover.active {
    transform: translate(-50%, -50%);
  }
}
```

```js
function initTrustInfoPopover(buttonEl, popoverEl) {
  function open() {
    popoverEl.classList.add('active');
    popoverEl.setAttribute('aria-hidden', 'false');
    buttonEl.setAttribute('aria-expanded', 'true');
    document.addEventListener('keydown', onKeydown);
    document.addEventListener('click', onOutsideClick);
  }

  function close() {
    popoverEl.classList.remove('active');
    popoverEl.setAttribute('aria-hidden', 'true');
    buttonEl.setAttribute('aria-expanded', 'false');
    document.removeEventListener('keydown', onKeydown);
    document.removeEventListener('click', onOutsideClick);
    buttonEl.focus();
  }

  function onKeydown(e) {
    if (e.key === 'Escape') close();
  }

  function onOutsideClick(e) {
    if (!popoverEl.contains(e.target) && e.target !== buttonEl) close();
  }

  buttonEl.addEventListener('click', function (e) {
    e.stopPropagation();
    popoverEl.classList.contains('active') ? close() : open();
  });

  const closeBtn = popoverEl.querySelector('.trust-info-close');
  if (closeBtn) closeBtn.addEventListener('click', close);
}
```

This is a functional starting skeleton, not a final drop-in — Claude Code should adapt class names and mount points to match the real structure of `index.html` rather than pasting it in blindly.

### 4. Do NOT

- Don't invent additional legal citations or blanket phrases like "we fully comply with all laws" — use only the Article 10 / Law No. 2300-I reference given above.
- Don't rely on `hover` as the only way to open it — click/tap must work.
- Don't lock page scroll unless the card becomes a full-screen mobile modal (if you do build it as a `position: fixed` modal with a dimmed backdrop on mobile, then yes — lock background scroll while it's open, the same way as the mobile nav menu).
- Don't break the existing layout of whichever block the icon is inserted into.
- Don't add external libraries — vanilla HTML/CSS/JS only, consistent with the rest of the project.

### 5. Verification

- Keyboard navigation: Tab reaches the button, Enter/Space opens the card, Escape closes it and returns focus to the button.
- Mobile (320–600px): the card never gets clipped by the screen edge, is fully readable, and closes easily with a tap.
- Desktop: the popover opens next to the icon without overlapping adjacent content.
- Screen reader (verify logically via the ARIA attributes if you can't test with an actual screen reader): open/closed state is announced correctly.
