/*
  codec.js
  Turns a letter object into a compressed, URL-safe string (and back).
  There is no server: the entire letter lives inside the link you share.
  That's what makes this free to run forever — a link IS the letter.

  Schema (kept short on purpose — short keys keep the link shorter):
    t  to (recipient name)
    f  from (signature name)
    b  body (the letter text)
    h  hand (handwriting font key)
    i  ink (ink color key)
    p  paper (paper style key)
    d  date (ISO date string)
    img  photo (data URL, optional)
*/

const OpenLetterCodec = (() => {
  const CURRENT_VERSION = 1;

  function encode(letter) {
    const payload = {
      v: CURRENT_VERSION,
      t: letter.to || "",
      f: letter.from || "",
      b: letter.body || "",
      h: letter.hand || "caveat",
      i: letter.ink || "navy",
      p: letter.paper || "parchment",
      th: letter.theme || "",
      d: letter.date || new Date().toISOString().slice(0, 10),
      img: letter.photo || null,
    };
    const json = JSON.stringify(payload);
    return LZString.compressToEncodedURIComponent(json);
  }

  function decode(encoded) {
    if (!encoded) return null;
    try {
      const json = LZString.decompressFromEncodedURIComponent(encoded);
      if (!json) return null;
      const payload = JSON.parse(json);
      return {
        to: payload.t || "",
        from: payload.f || "",
        body: payload.b || "",
        hand: payload.h || "caveat",
        ink: payload.i || "navy",
        paper: payload.p || "parchment",
        theme: payload.th || "",
        date: payload.d || "",
        photo: payload.img || null,
      };
    } catch (err) {
      console.error("Could not read this letter link:", err);
      return null;
    }
  }

  function buildShareUrl(letter, baseUrl) {
    const encoded = encode(letter);
    const url = new URL(baseUrl || (location.origin + location.pathname.replace(/write\.html$/, "letter.html")));
    url.search = "?d=" + encoded;
    return url.toString();
  }

  return { encode, decode, buildShareUrl };
})();
