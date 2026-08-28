# Open Letter ✒

Write a letter, in your own hand. Send it as a link. When the person you
sent it to opens it, they don't just read it — they watch it get written,
stroke by stroke, live.

It's free, it has no ads and no accounts, and it's open source (MIT) so
anyone can run their own copy.

## How it's free forever

There's no backend and no database. A letter is small object —

```js
{ to, from, body, hand, ink, paper, date, photo }
```

— that gets compressed and packed directly into the link itself
(`letter.html?d=...`). Opening the link decodes the letter client-side.
Nothing is ever sent to, or stored on, a server. That means:

- Anyone can host this for free on GitHub Pages, Netlify, Vercel, or any
  static file host — there's no server cost to keep it running.
- There's nothing to leak. Whoever holds the link holds the letter.
- The trade-off: a link with a photo attached is a long link. Skipping
  the photo keeps it short enough for anything, including SMS.

## Features

- A composer with five handwriting fonts, four ink colors, and four paper
  styles, previewed live as you write.
- An optional photo attachment (resized and compressed client-side).
- A recipient view with an envelope you tap to open, followed by the
  letter being handwritten in front of you in real time, at a natural,
  slightly uneven pace.
- Share via WhatsApp, email, the native share sheet, or a plain copyable
  link.
- Respects `prefers-reduced-motion` (the writing animation is skipped in
  favor of an instant reveal) and is keyboard-navigable throughout.
- Zero build step: plain HTML, CSS, and JavaScript. No framework, no
  bundler, no `node_modules` to install to run it.

## Quick start

Clone the repo and serve the folder with any static file server (opening
`index.html` directly also works in most browsers, but a local server
avoids occasional file:// quirks):

```bash
git clone https://github.com/r0hnx/open-letter.git
cd open-letter
python3 -m http.server 8000
# or: npx serve .
```

Then open `http://localhost:8000`.

## Deploying your own copy

Because it's a static site, deployment is just "upload the files":

- **GitHub Pages** — Settings → Pages → deploy from the `main` branch.
- **Netlify / Vercel** — drag-and-drop the project folder, or connect the
  repo. No build command is needed.
- **Anywhere else** — copy the files to any static host or CDN.

## Project structure

```
index.html            landing page
write.html             the composer (write + style + generate a link)
letter.html            the recipient view (envelope + handwriting reveal)
assets/
  css/
    tokens.css          design tokens (color, type, spacing)
    style.css            shared components (buttons, paper, forms)
    home.css / write.css / letter.css   page-specific layout
  js/
    codec.js             packs/unpacks a letter into a URL
    lz-string.min.js      vendored compression library (MIT, see below)
    home.js / write.js / letter.js       page-specific behavior
LICENSE
CONTRIBUTING.md
```

## Adding your own handwriting font, ink, or paper

This is one of the easiest ways to contribute — see
[CONTRIBUTING.md](CONTRIBUTING.md) for the short walkthrough. In short:
add a font token in `tokens.css`, a utility class in `style.css`, and one
entry in the `HANDS`/`INKS`/`PAPERS` list in `write.js` (and the matching
map in `letter.js`).

## Credits

- Compression via [lz-string](https://github.com/pieroxy/lz-string)
  (MIT license), vendored in `assets/js/lz-string.min.js`.
- Typefaces (Fraunces, Karla, Caveat, Homemade Apple, Kalam, Shadows Into
  Light, Patrick Hand) via [Google Fonts](https://fonts.google.com), all
  open licensed (OFL/Apache).

## License

MIT — see [LICENSE](LICENSE). Use it, fork it, put it behind your own
domain, change everything about it.
