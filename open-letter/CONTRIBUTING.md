# Contributing to Open Letter

Thanks for considering it. This project is intentionally small and
dependency-free — plain HTML, CSS, and JavaScript, no build step. Please
try to keep it that way; it's what makes it free to host and easy to fork.

## Ways to help

- Add a handwriting font, ink color, or paper texture (see below — this
  is the easiest first contribution).
- Improve accessibility (screen reader labels, keyboard flow, contrast).
- Translate the UI copy.
- Fix a bug or improve the writing-animation pacing.

## Adding a handwriting font

1. Add the font to the Google Fonts `@import` at the top of
   `assets/css/style.css`.
2. Add a token in `assets/css/tokens.css`:
   ```css
   --font-hand-yourkey: "Your Font Name", cursive;
   ```
3. Add a utility class in `assets/css/style.css`, next to the others:
   ```css
   .hand-yourkey { font-family: var(--font-hand-yourkey); }
   ```
4. Register it in the `HANDS` array in `assets/js/write.js`:
   ```js
   { key: "yourkey", label: "Your Font Name", cls: "hand-yourkey" }
   ```
5. Add the matching entry to `HAND_MAP` in `assets/js/letter.js`:
   ```js
   yourkey: "hand-yourkey"
   ```

## Adding an ink color

Same idea: a `--ink-yourcolor` token in `tokens.css`, an `.ink-yourcolor`
and `.dot-yourcolor` class in `style.css`/`write.css`, and an entry in the
`INKS` array (`write.js`) plus `INK_MAP` (`letter.js`).

## Adding a paper style

Add a `.paper--yourstyle` rule in `style.css` (see the existing ones for
the pattern — they're built from gradients, not image files, so the repo
stays lightweight), then add it to the `PAPERS` array in `write.js`.

## Guidelines

- No new frameworks or build tooling without discussion first — the
  zero-dependency setup is a feature, not an oversight.
- Keep letters entirely client-side. Nothing about a specific letter
  should ever need to touch a server.
- Test with `prefers-reduced-motion` enabled and with a keyboard only.
- Keep copy plain and specific — say what happens, not how it works
  internally.

## Reporting issues

Open a GitHub issue with steps to reproduce, your browser, and what you
expected to happen instead.
