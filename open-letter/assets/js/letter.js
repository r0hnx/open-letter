(() => {
  const HAND_CLASSES = ["hand-caveat", "hand-apple", "hand-kalam", "hand-shadows", "hand-patrick"];
  const INK_CLASSES = ["ink-navy", "ink-charcoal", "ink-sepia", "ink-oxblood"];
  const HAND_MAP = { caveat: "hand-caveat", apple: "hand-apple", kalam: "hand-kalam", shadows: "hand-shadows", patrick: "hand-patrick" };
  const INK_MAP = { navy: "ink-navy", charcoal: "ink-charcoal", sepia: "ink-sepia", oxblood: "ink-oxblood" };

  const els = {
    envelopeStage: document.getElementById("envelopeStage"),
    envelope: document.getElementById("envelope"),
    envelopeAddress: document.getElementById("envelopeAddress"),
    sealBtn: document.getElementById("sealBtn"),
    paperStage: document.getElementById("paperStage"),
    letterPaper: document.getElementById("letterPaper"),
    letterDate: document.getElementById("letterDate"),
    letterBody: document.getElementById("letterBody"),
    letterSignature: document.getElementById("letterSignature"),
    letterPhotoWrap: document.getElementById("letterPhotoWrap"),
    letterPhoto: document.getElementById("letterPhoto"),
    penCursor: document.getElementById("penCursor"),
    skipBtn: document.getElementById("skipBtn"),
    emptyState: document.getElementById("emptyState"),
  };

  const params = new URLSearchParams(location.search);
  const letter = OpenLetterCodec.decode(params.get("d"));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!letter || !letter.body) {
    els.emptyState.hidden = false;
    document.title = "No letter here — Open Letter";
    return;
  }

  setupLetter(letter);

  function setupLetter(letter) {
    document.title = (letter.to ? "A letter for " + letter.to : "You've got a letter") + " — Open Letter";

    els.envelopeStage.hidden = false;
    els.envelopeAddress.textContent = "To, " + (letter.to || "you");

    const handCls = HAND_MAP[letter.hand] || "hand-caveat";
    const inkCls = INK_MAP[letter.ink] || "ink-navy";
    const paperCls = "paper--" + (letter.paper || "parchment");

    HAND_CLASSES.forEach((c) => els.letterBody.classList.remove(c));
    INK_CLASSES.forEach((c) => els.letterBody.classList.remove(c));
    els.letterBody.classList.add(handCls, inkCls);
    els.letterSignature.classList.add(handCls, inkCls);
    els.penCursor.classList.add(inkCls);
    els.letterPaper.className = "paper-card " + paperCls;
    els.letterPaper.appendChild(els.penCursor); // keep cursor inside the (re-classed) card

    els.letterDate.textContent = formatDate(letter.date);
    els.letterSignature.textContent = letter.from ? "— " + letter.from : "";

    if (letter.photo) {
      els.letterPhoto.src = letter.photo;
      els.letterPhotoWrap.hidden = false;
    }

    const tokens = buildBodyTokens(els.letterBody, letter.body);

    els.sealBtn.addEventListener("click", () => openEnvelope(tokens));
  }

  function formatDate(iso) {
    const d = iso ? new Date(iso + "T00:00:00") : new Date();
    if (isNaN(d.getTime())) return "";
    return d.toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" });
  }

  function buildBodyTokens(container, text) {
    container.textContent = "";
    const tokens = [];
    for (const ch of text) {
      if (ch === "\n") {
        container.appendChild(document.createElement("br"));
        tokens.push({ type: "br" });
      } else {
        const span = document.createElement("span");
        span.className = "ch";
        span.textContent = ch;
        container.appendChild(span);
        tokens.push({ type: "char", el: span, value: ch });
      }
    }
    return tokens;
  }

  function openEnvelope(tokens) {
    els.envelope.classList.add("is-open");
    const revealPaper = () => {
      els.envelopeStage.hidden = true;
      els.paperStage.hidden = false;
      requestAnimationFrame(() => {
        els.paperStage.classList.add("is-visible");
        startWriting(tokens);
      });
    };
    if (reduceMotion) {
      revealPaper();
    } else {
      setTimeout(revealPaper, 850);
    }
  }

  function startWriting(tokens) {
    if (reduceMotion) {
      finishAll(tokens);
      return;
    }

    els.skipBtn.hidden = false;
    let idx = 0;
    let timer = null;

    function step() {
      if (idx >= tokens.length) {
        finish();
        return;
      }
      const tok = tokens[idx];
      let delay = 22 + Math.random() * 26;

      if (tok.type === "char") {
        tok.el.classList.add("revealed");
        positionCursor(tok.el);
        if (tok.value === " ") delay = 12 + Math.random() * 16;
        else if (",;".includes(tok.value)) delay = 170 + Math.random() * 90;
        else if (".!?".includes(tok.value)) delay = 260 + Math.random() * 150;
      } else {
        delay = 320 + Math.random() * 160;
      }

      idx++;
      timer = setTimeout(step, delay);
    }

    function finish() {
      els.penCursor.style.opacity = 0;
      els.skipBtn.hidden = true;
      revealExtras();
    }

    els.skipBtn.onclick = () => {
      clearTimeout(timer);
      finishAll(tokens);
    };

    step();
  }

  function finishAll(tokens) {
    tokens.forEach((t) => t.type === "char" && t.el.classList.add("revealed"));
    els.penCursor.style.opacity = 0;
    els.skipBtn.hidden = true;
    revealExtras();
  }

  function revealExtras() {
    if (!els.letterPhotoWrap.hidden) {
      setTimeout(() => els.letterPhotoWrap.classList.add("is-shown"), 150);
    }
    setTimeout(() => els.letterSignature.classList.add("is-shown"), els.letterPhotoWrap.hidden ? 150 : 450);
  }

  function positionCursor(spanEl) {
    const sr = spanEl.getBoundingClientRect();
    const cr = els.letterPaper.getBoundingClientRect();
    els.penCursor.style.opacity = 1;
    els.penCursor.style.left = sr.right - cr.left + "px";
    els.penCursor.style.top = sr.top - cr.top + "px";
    els.penCursor.style.height = sr.height * 0.9 + "px";
  }
})();
