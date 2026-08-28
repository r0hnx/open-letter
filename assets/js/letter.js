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
    lightFlash: document.getElementById("lightFlash"),
    paperStage: document.getElementById("paperStage"),
    letterPaper: document.getElementById("letterPaper"),
    letterMotif: document.getElementById("letterMotif"),
    letterDate: document.getElementById("letterDate"),
    letterBody: document.getElementById("letterBody"),
    letterSignature: document.getElementById("letterSignature"),
    letterPhotoWrap: document.getElementById("letterPhotoWrap"),
    letterPhoto: document.getElementById("letterPhoto"),
    penCursor: document.getElementById("penCursor"),
    skipBtn: document.getElementById("skipBtn"),
    emptyState: document.getElementById("emptyState"),
  };

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  (async () => {
    const params = new URLSearchParams(location.search);
    const letter = await OpenLetterCodec.decode(params.get("d"));

    if (!letter || !letter.body) {
      els.emptyState.hidden = false;
      document.title = "No letter here — Open Letter";
      return;
    }

    // Resume audio context on user interaction
    document.addEventListener('click', () => OpenLetterSound.resume(), { once: true, passive: true });

    setupLetter(letter);
  })();

  function setupLetter(letter) {
    document.title = (letter.to ? "A letter for " + letter.to : "You've got a letter") + " — Open Letter";

    const theme = OpenLetterThemes.get(letter.theme);

    els.envelopeStage.hidden = false;
    els.envelopeAddress.textContent = "To, " + (letter.to || "you");
    els.sealBtn.textContent = theme.icon;
    els.sealBtn.style.setProperty("--seal-color", theme.accentVar);

    const handCls = HAND_MAP[letter.hand] || "hand-caveat";
    const inkCls = INK_MAP[letter.ink] || "ink-navy";
    const paperCls = "paper--" + (letter.paper || "parchment");

    HAND_CLASSES.forEach((c) => els.letterBody.classList.remove(c));
    INK_CLASSES.forEach((c) => els.letterBody.classList.remove(c));
    els.letterBody.classList.add(handCls, inkCls);
    els.letterSignature.classList.add(handCls, inkCls);
    els.penCursor.classList.add(inkCls);
    els.letterPaper.className = "paper-card " + paperCls;
    els.letterPaper.appendChild(els.letterMotif);
    els.letterPaper.appendChild(els.penCursor); // keep cursor inside the (re-classed) card

    els.letterMotif.textContent = theme.motif;
    els.letterDate.textContent = formatDate(letter.date);
    els.letterSignature.textContent = letter.from ? "— " + letter.from : "";

    if (letter.photo) {
      els.letterPhoto.src = letter.photo;
      els.letterPhotoWrap.hidden = false;
    }

    const tokens = buildBodyTokens(els.letterBody, letter.body);

    els.sealBtn.addEventListener("click", () => openEnvelope(tokens, theme));
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

  function openEnvelope(tokens, theme) {
    els.sealBtn.disabled = true;

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
      return;
    }

    // Play seal break sound immediately on click
    OpenLetterSound.playSealBreak().catch(() => {});

    // 1. the seal cracks with a slight delay for audio sync
    setTimeout(() => {
      els.sealBtn.classList.add("is-cracking");
    }, 20);

    setTimeout(() => {
      // 2. the envelope lifts, the flap swings open, and the theme's
      //    flourish bursts from where the seal was
      els.envelope.classList.add("is-opening", "is-open");
      spawnParticles(els.envelope, theme);

      // Enhanced light flash - brighter and longer
      setTimeout(() => {
        els.lightFlash.classList.add("is-flashing");
        // Play paper unfold sound as envelope opens
        OpenLetterSound.playPaperUnfold().catch(() => {});
      }, 300);

      setTimeout(() => {
        els.envelope.classList.remove("is-opening");
        revealPaper();
      }, 1100);
    }, 400);
  }

  function spawnParticles(container, theme) {
    const cfg = theme.particles;
    for (let i = 0; i < cfg.count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = 0.5 + Math.random() * 0.5;
      const dx = Math.cos(angle) * cfg.spreadX * dist;
      const dy = -Math.abs(Math.sin(angle)) * cfg.spreadY * dist - cfg.spreadY * 0.3;
      const rot = (Math.random() * 2 - 1) * 70;
      const color = cfg.colors[i % cfg.colors.length];

      const el = document.createElement("span");
      el.className = "flourish-particle" + (cfg.shape === "confetti" ? " confetti" : "");
      el.style.setProperty("--dx", dx.toFixed(1) + "px");
      el.style.setProperty("--dy", dy.toFixed(1) + "px");
      el.style.setProperty("--rot", rot.toFixed(1) + "deg");
      el.style.animationDelay = Math.random() * cfg.spawnJitter + "ms";

      if (cfg.shape === "confetti") {
        const w = cfg.size * (0.6 + Math.random() * 0.5);
        const h = w * (0.4 + Math.random() * 0.5);
        el.style.width = w + "px";
        el.style.height = h + "px";
        el.style.background = color;
      } else {
        el.textContent = cfg.symbols[i % cfg.symbols.length];
        // Random size between 32 and 92
        const randomSize = 32 + Math.random() * 60;
        el.style.fontSize = randomSize.toFixed(0) + "px";
        el.style.color = color;
      }

      container.appendChild(el);
      el.addEventListener("animationend", () => el.remove());
    }
  }

  function startWriting(tokens) {
    if (reduceMotion) {
      finishAll(tokens);
      return;
    }

    // Play pen scratch sound as writing begins
    OpenLetterSound.playPenScratch().catch(() => {});

    els.skipBtn.hidden = false;
    let idx = 0;
    let timer = null;

    function step() {
      if (idx >= tokens.length) {
        finish();
        return;
      }
      const tok = tokens[idx];
      // Paced like reading aloud, not typing — slow and a little uneven.
      let delay = 55 + Math.random() * 45;

      if (tok.type === "char") {
        tok.el.classList.add("revealed");
        positionCursor(tok.el);
        if (tok.value === " ") delay = 35 + Math.random() * 30;
        else if (",;".includes(tok.value)) delay = 260 + Math.random() * 140;
        else if (".!?".includes(tok.value)) delay = 420 + Math.random() * 220;
      } else {
        delay = 520 + Math.random() * 260;
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
