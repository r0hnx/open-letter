# Open Letter ✒

Write a letter, in your own hand. Send it as a link. When the person you
sent it to opens it, they don't just read it — they watch it get written,
stroke by stroke, live.

It's free, it has no ads and no accounts, and it's open source (MIT) so
anyone can run their own copy.

## How it's free forever

There's no backend and no database. A letter is small object —

```js
{ to, from, body, hand, ink, paper, theme, date, photo }
```

— that gets compressed and packed directly into the link itself
(`letter.html#d=...`). Opening the link decodes the letter client-side.
Nothing is ever sent to, or stored on, a server. That means:

- Anyone can host this for free on GitHub Pages, Netlify, Vercel, or any
  static file host — there's no server cost to keep it running.
- There's nothing to leak. Whoever holds the link holds the letter.
- The trade-off: a link with a photo embedded in it is a long link.
  Pasting a link to a photo you've already put online instead (rather
  than uploading it) keeps things short — see "Keeping the link short"
  below.

### Privacy: Hash fragments instead of query parameters

The letter data is now stored in the **hash fragment** (`#d=...`) rather than
query parameters (`?d=...`). This means the encoded letter is never sent to a
server or included in HTTP referer headers — it stays entirely on your browser,
making your letters even more private. The app maintains backward compatibility,
so links created with the old format will still work perfectly.

### Keeping the link short

Letters are compressed with the browser's native `deflate-raw` codec
(all current browsers support it), which produces a noticeably shorter
link than plain text — older browsers fall back to
[lz-string](https://github.com/pieroxy/lz-string) automatically, and
either kind of link always opens correctly. Beyond that:

- **Skip the photo, or link to one instead.** The composer lets you
  paste a link to a photo you've already put online (Google Photos,
  imgur, your own site) instead of uploading one. That keeps the letter
  link just as short as a text-only letter, since only the link itself
  — not the image data — gets packed in.
- **Uploaded photos are compressed automatically** (resized and
  re-encoded as WebP, with a JPEG fallback for browsers that can't
  make WebP) before they're embedded, but they'll always make the link
  longer than linking to a photo would.
- **A public URL shortener isn't used on purpose.** It would need to
  store your letter on a third party's server to make the short link
  work — which is exactly the kind of server this project is trying
  not to need. If you want that trade-off for your own deployment, it's
  a small addition (see `buildShareUrl` in `codec.js`).

## Features

- Six occasion themes (Classic, Love, Valentine's, Birthday, Thank You,
  Congrats) that set the wax seal color/icon and the burst of confetti
  or hearts that flies out when the envelope opens.
- A composer with five handwriting fonts, four ink colors, and four paper
  styles, previewed live as you write.
- An optional photo attachment (resized and compressed client-side).
- A recipient view with a wax-sealed envelope: tap to crack the seal,
  watch it swing open with a burst of the theme's flourish and a flash
  of light, then the letter is handwritten in front of you at a slow,
  natural, slightly uneven reading pace — not typed, read.
- Share via WhatsApp, email, the native share sheet, or a plain copyable
  link.
- Respects `prefers-reduced-motion` (the opening flourish and the writing
  animation are both skipped in favor of an instant reveal) and is
  keyboard-navigable throughout.
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
    themes.js             occasion presets (seal color/icon, opening flourish)
    lz-string.min.js      vendored compression library (MIT, see below)
    home.js / write.js / letter.js       page-specific behavior
LICENSE
CONTRIBUTING.md
```

## Adding your own handwriting font, ink, paper, or theme

This is one of the easiest ways to contribute — see
[CONTRIBUTING.md](CONTRIBUTING.md) for the short walkthrough. In short:
add a font token in `tokens.css`, a utility class in `style.css`, and one
entry in the `HANDS`/`INKS`/`PAPERS` list in `write.js` (and the matching
map in `letter.js`). Adding an occasion theme (its seal color/icon and
opening flourish) is a single entry in `assets/js/themes.js`.

## Credits

- Compression via [lz-string](https://github.com/pieroxy/lz-string)
  (MIT license), vendored in `assets/js/lz-string.min.js`.
- Typefaces (Fraunces, Karla, Caveat, Homemade Apple, Kalam, Shadows Into
  Light, Patrick Hand) via [Google Fonts](https://fonts.google.com), all
  open licensed (OFL/Apache).
- Hash fragment implementation suggested by the community on Reddit.

## License

MIT — see [LICENSE](LICENSE). Use it, fork it, put it behind your own
domain, change everything about it.
