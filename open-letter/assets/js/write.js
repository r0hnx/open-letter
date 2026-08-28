(() => {
  const HANDS = [
    { key: "caveat", label: "Caveat", cls: "hand-caveat" },
    { key: "apple", label: "Homemade Apple", cls: "hand-apple" },
    { key: "kalam", label: "Kalam", cls: "hand-kalam" },
    { key: "shadows", label: "Shadows Into Light", cls: "hand-shadows" },
    { key: "patrick", label: "Patrick Hand", cls: "hand-patrick" },
  ];
  const INKS = [
    { key: "navy", label: "Navy", cls: "ink-navy", dot: "dot-navy" },
    { key: "charcoal", label: "Charcoal", cls: "ink-charcoal", dot: "dot-charcoal" },
    { key: "sepia", label: "Sepia", cls: "ink-sepia", dot: "dot-sepia" },
    { key: "oxblood", label: "Oxblood", cls: "ink-oxblood", dot: "dot-oxblood" },
  ];
  const PAPERS = [
    { key: "parchment", label: "Parchment" },
    { key: "lined", label: "Lined" },
    { key: "kraft", label: "Kraft" },
    { key: "aged", label: "Aged" },
  ];
  const MAX_PHOTO_DIM = 480;
  const LONG_LINK_THRESHOLD = 1800;

  const state = { hand: "caveat", ink: "navy", paper: "parchment", photo: null };

  const els = {
    toName: document.getElementById("toName"),
    fromName: document.getElementById("fromName"),
    body: document.getElementById("body"),
    lengthHint: document.getElementById("lengthHint"),
    handRow: document.getElementById("handRow"),
    inkRow: document.getElementById("inkRow"),
    paperRow: document.getElementById("paperRow"),
    photoInput: document.getElementById("photoInput"),
    photoPreview: document.getElementById("photoPreview"),
    photoPreviewImg: document.getElementById("photoPreviewImg"),
    removePhotoBtn: document.getElementById("removePhotoBtn"),
    generateBtn: document.getElementById("generateBtn"),
    previewCard: document.getElementById("previewCard"),
    previewDate: document.getElementById("previewDate"),
    previewBody: document.getElementById("previewBody"),
    previewSignature: document.getElementById("previewSignature"),
    previewPhotoWrap: document.getElementById("previewPhotoWrap"),
    previewPhoto: document.getElementById("previewPhoto"),
    resultOverlay: document.getElementById("resultOverlay"),
    shareLink: document.getElementById("shareLink"),
    copyLinkBtn: document.getElementById("copyLinkBtn"),
    lengthWarning: document.getElementById("lengthWarning"),
    whatsappShare: document.getElementById("whatsappShare"),
    emailShare: document.getElementById("emailShare"),
    webShareBtn: document.getElementById("webShareBtn"),
    previewLetterLink: document.getElementById("previewLetterLink"),
    writeAnotherBtn: document.getElementById("writeAnotherBtn"),
  };

  function buildSwatches() {
    HANDS.forEach((h) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "swatch";
      btn.dataset.key = h.key;
      btn.setAttribute("aria-pressed", h.key === state.hand ? "true" : "false");
      btn.innerHTML = `<span class="swatch-hand-sample ${h.cls}">Aa</span> ${h.label}`;
      btn.addEventListener("click", () => {
        state.hand = h.key;
        refreshSwatchGroup(els.handRow, h.key);
        updatePreview();
      });
      els.handRow.appendChild(btn);
    });

    INKS.forEach((c) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "swatch";
      btn.dataset.key = c.key;
      btn.setAttribute("aria-pressed", c.key === state.ink ? "true" : "false");
      btn.innerHTML = `<span class="swatch-dot ${c.dot}"></span> ${c.label}`;
      btn.addEventListener("click", () => {
        state.ink = c.key;
        refreshSwatchGroup(els.inkRow, c.key);
        updatePreview();
      });
      els.inkRow.appendChild(btn);
    });

    PAPERS.forEach((p) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "swatch";
      btn.dataset.key = p.key;
      btn.setAttribute("aria-pressed", p.key === state.paper ? "true" : "false");
      btn.innerHTML = `<span class="swatch-paper-mini paper--${p.key}"></span> ${p.label}`;
      btn.addEventListener("click", () => {
        state.paper = p.key;
        refreshSwatchGroup(els.paperRow, p.key);
        updatePreview();
      });
      els.paperRow.appendChild(btn);
    });
  }

  function refreshSwatchGroup(row, activeKey) {
    [...row.children].forEach((btn) => {
      btn.setAttribute("aria-pressed", btn.dataset.key === activeKey ? "true" : "false");
    });
  }

  function updatePreview() {
    HANDS.forEach((h) => els.previewBody.classList.remove(h.cls));
    INKS.forEach((c) => els.previewBody.classList.remove(c.cls));
    PAPERS.forEach((p) => els.previewCard.classList.remove("paper--" + p.key));

    els.previewBody.classList.add(HANDS.find((h) => h.key === state.hand).cls);
    els.previewBody.classList.add(INKS.find((c) => c.key === state.ink).cls);
    els.previewCard.classList.add("paper--" + state.paper);
    els.previewSignature.className = "preview-signature " + INKS.find((c) => c.key === state.ink).cls + " " + HANDS.find((h) => h.key === state.hand).cls;

    els.previewBody.textContent = els.body.value;
    els.previewSignature.textContent = els.fromName.value ? "— " + els.fromName.value : "";

    if (state.photo) {
      els.previewPhotoWrap.hidden = false;
      els.previewPhoto.src = state.photo;
    } else {
      els.previewPhotoWrap.hidden = true;
    }
  }

  function updateLengthHint() {
    const n = els.body.value.length;
    els.lengthHint.textContent = n + " / 4000 characters";
  }

  function today() {
    return new Date().toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" });
  }

  function handlePhotoFile(file) {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, MAX_PHOTO_DIM / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        state.photo = canvas.toDataURL("image/jpeg", 0.6);
        els.photoPreview.hidden = false;
        els.photoPreviewImg.src = state.photo;
        updatePreview();
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  function removePhoto() {
    state.photo = null;
    els.photoInput.value = "";
    els.photoPreview.hidden = true;
    updatePreview();
  }

  function generateLetter() {
    const letter = {
      to: els.toName.value.trim(),
      from: els.fromName.value.trim(),
      body: els.body.value,
      hand: state.hand,
      ink: state.ink,
      paper: state.paper,
      date: new Date().toISOString().slice(0, 10),
      photo: state.photo,
    };

    if (!letter.body.trim()) {
      els.body.focus();
      return;
    }

    const url = OpenLetterCodec.buildShareUrl(letter);
    els.shareLink.value = url;
    els.previewLetterLink.href = url;

    els.lengthWarning.hidden = url.length <= LONG_LINK_THRESHOLD;

    const message = "I wrote you a letter: " + url;
    els.whatsappShare.href = "https://wa.me/?text=" + encodeURIComponent(message);
    els.emailShare.href = "mailto:?subject=" + encodeURIComponent("A letter for you") + "&body=" + encodeURIComponent(message);

    if (navigator.share) {
      els.webShareBtn.hidden = false;
      els.webShareBtn.onclick = () => {
        navigator.share({ title: "A letter for you", text: "I wrote you a letter.", url }).catch(() => {});
      };
    }

    els.resultOverlay.hidden = false;
  }

  function copyLink() {
    els.shareLink.select();
    navigator.clipboard?.writeText(els.shareLink.value).then(() => {
      els.copyLinkBtn.textContent = "Copied!";
      setTimeout(() => (els.copyLinkBtn.textContent = "Copy"), 1600);
    }).catch(() => {
      document.execCommand("copy");
    });
  }

  function init() {
    buildSwatches();
    els.previewDate.textContent = today();
    updatePreview();
    updateLengthHint();

    els.toName.addEventListener("input", updatePreview);
    els.fromName.addEventListener("input", updatePreview);
    els.body.addEventListener("input", () => { updatePreview(); updateLengthHint(); });
    els.photoInput.addEventListener("change", (e) => handlePhotoFile(e.target.files[0]));
    els.removePhotoBtn.addEventListener("click", removePhoto);
    els.generateBtn.addEventListener("click", generateLetter);
    els.copyLinkBtn.addEventListener("click", copyLink);
    els.writeAnotherBtn.addEventListener("click", () => { els.resultOverlay.hidden = true; });
    els.resultOverlay.addEventListener("click", (e) => {
      if (e.target === els.resultOverlay) els.resultOverlay.hidden = true;
    });
  }

  init();
})();
