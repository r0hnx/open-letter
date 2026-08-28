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
    k  theme (occasion — love, birthday, etc. — see themes.js)
    d  date (ISO date string)
    img  photo (data URL, or a plain https:// link, optional)

  Compression: browsers that support the native Compression Streams API
  (CompressionStream/DecompressionStream — all current browsers as of
  2026) get "deflate-raw", which produces a noticeably shorter link than
  the older LZString library, especially for longer letters. Browsers
  without it fall back to LZString automatically. A one-letter marker
  ("B" or "A") is prepended so a link always decodes correctly no matter
  which scheme made it — including links generated before this feature
  existed, which had no marker at all.
*/

const OpenLetterCodec = (() => {
  const CURRENT_VERSION = 1;
  const MARKER_DEFLATE = "B";
  const MARKER_LZSTRING = "A";

  function supportsDeflate() {
    return typeof CompressionStream !== "undefined" && typeof DecompressionStream !== "undefined";
  }

  async function deflateCompress(str) {
    const bytes = new TextEncoder().encode(str);
    const stream = new Blob([bytes]).stream().pipeThrough(new CompressionStream("deflate-raw"));
    const buffer = await new Response(stream).arrayBuffer();
    return new Uint8Array(buffer);
  }

  async function deflateDecompress(bytes) {
    const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream("deflate-raw"));
    const buffer = await new Response(stream).arrayBuffer();
    return new TextDecoder().decode(buffer);
  }

  function bytesToBase64Url(bytes) {
    let binary = "";
    const chunk = 0x8000;
    for (let i = 0; i < bytes.length; i += chunk) {
      binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunk));
    }
    return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }

  function base64UrlToBytes(str) {
    let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
    while (base64.length % 4) base64 += "=";
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return bytes;
  }

  function toPayload(letter) {
    return {
      v: CURRENT_VERSION,
      t: letter.to || "",
      f: letter.from || "",
      b: letter.body || "",
      h: letter.hand || "caveat",
      i: letter.ink || "navy",
      p: letter.paper || "parchment",
      k: letter.theme || "classic",
      d: letter.date || new Date().toISOString().slice(0, 10),
      img: letter.photo || null,
    };
  }

  function fromPayload(payload) {
    return {
      to: payload.t || "",
      from: payload.f || "",
      body: payload.b || "",
      hand: payload.h || "caveat",
      ink: payload.i || "navy",
      paper: payload.p || "parchment",
      theme: payload.k || "classic",
      date: payload.d || "",
      photo: payload.img || null,
    };
  }

  async function encode(letter) {
    const json = JSON.stringify(toPayload(letter));

    if (supportsDeflate()) {
      try {
        const compressed = await deflateCompress(json);
        return MARKER_DEFLATE + bytesToBase64Url(compressed);
      } catch (err) {
        console.error("Falling back to LZString:", err);
      }
    }
    return MARKER_LZSTRING + LZString.compressToEncodedURIComponent(json);
  }

  async function decode(encoded) {
    if (!encoded) return null;
    try {
      const marker = encoded.charAt(0);
      const rest = encoded.slice(1);
      let json = null;

      if (marker === MARKER_DEFLATE) {
        if (!supportsDeflate()) {
          console.error("This letter needs a newer browser to open.");
          return null;
        }
        json = await deflateDecompress(base64UrlToBytes(rest));
      } else if (marker === MARKER_LZSTRING) {
        json = LZString.decompressFromEncodedURIComponent(rest);
      } else {
        // Links made before this feature existed had no marker at all —
        // the whole string is LZString-encoded.
        json = LZString.decompressFromEncodedURIComponent(encoded);
      }

      if (!json) return null;
      return fromPayload(JSON.parse(json));
    } catch (err) {
      console.error("Could not read this letter link:", err);
      return null;
    }
  }

  async function buildShareUrl(letter, baseUrl) {
    const encoded = await encode(letter);
    const url = new URL(baseUrl || (location.origin + location.pathname.replace(/write\.html$/, "letter.html")));
    url.search = "?d=" + encoded;
    return url.toString();
  }

  return { encode, decode, buildShareUrl };
})();
