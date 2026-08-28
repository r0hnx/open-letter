/*
  home.js — a tiny, self-contained loop that "writes" a sample line
  into the hero paper card. This is a preview of the real thing:
  the full version (with a pen cursor, envelope opening, and your
  own words) lives on letter.html — see assets/js/letter.js.
*/
(() => {
  const el = document.getElementById("demoText");
  if (!el) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const sample = "Dear Amma,\n\nI know I don't write enough, so here's proof\nthat I still think in your handwriting.";

  if (reduceMotion) {
    el.textContent = sample;
    return;
  }

  const caret = document.createElement("span");
  caret.className = "demo-caret";
  caret.textContent = "\u00A0";

  let i = 0;
  let timer = null;

  function typeNext() {
    if (i <= sample.length) {
      el.textContent = sample.slice(0, i);
      el.appendChild(caret);
      i++;
      const ch = sample[i - 1];
      const delay = ch === "\n" ? 260 : ch === "," ? 180 : 32 + Math.random() * 45;
      timer = setTimeout(typeNext, delay);
    } else {
      timer = setTimeout(resetLoop, 2600);
    }
  }

  function resetLoop() {
    i = 0;
    el.textContent = "";
    timer = setTimeout(typeNext, 500);
  }

  // Pause the loop when off-screen to save battery/CPU.
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        if (!timer) typeNext();
      } else {
        clearTimeout(timer);
        timer = null;
      }
    });
  }, { threshold: 0.1 });
  io.observe(el);
})();
