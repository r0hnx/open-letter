/*
  themes.js
  A "theme" is the occasion behind the letter — Love, Valentine's,
  Birthday, and so on. It controls the wax seal color/icon, a small
  corner motif stamped on the paper, and the burst of particles that
  flies out when the envelope is opened. It's independent of
  handwriting/ink/paper, which stay under the writer's control.

  Shared by write.js (to render the picker + preview) and letter.js
  (to style the envelope/paper and drive the opening flourish).
*/
const OpenLetterThemes = (() => {
  const THEMES = [
    {
      key: "classic",
      label: "Classic",
      accentVar: "var(--accent)",
      icon: "✒",
      motif: "✒",
      particles: { shape: "glyph", symbols: ["●"], colors: ["#2b3a55", "#8c2f39"], count: 6, spreadX: 36, spreadY: 60, spawnJitter: 120, size: 8 },
    },
    {
      key: "love",
      label: "Love",
      accentVar: "var(--c-love)",
      icon: "♥",
      motif: "♥",
      particles: { shape: "glyph", symbols: ["♥"], colors: ["#b83b5e", "#d97f97"], count: 10, spreadX: 60, spreadY: 110, spawnJitter: 260, size: 16 },
    },
    {
      key: "valentine",
      label: "Valentine's",
      accentVar: "var(--c-valentine)",
      icon: "♥",
      motif: "♥",
      particles: { shape: "glyph", symbols: ["♥", "✦"], colors: ["#c81d4a", "#e0b354", "#d97f97"], count: 18, spreadX: 95, spreadY: 155, spawnJitter: 220, size: 18 },
    },
    {
      key: "birthday",
      label: "Birthday",
      accentVar: "var(--c-birthday)",
      icon: "★",
      motif: "★",
      particles: { shape: "confetti", colors: ["#e0b354", "#c81d4a", "#2f7a6d", "#f3ecdd", "#2b3a55"], count: 22, spreadX: 105, spreadY: 165, spawnJitter: 260, size: 8 },
    },
    {
      key: "thankyou",
      label: "Thank You",
      accentVar: "var(--brass)",
      icon: "✦",
      motif: "✦",
      particles: { shape: "glyph", symbols: ["✦", "✧"], colors: ["#a9884f", "#cdb27c"], count: 10, spreadX: 70, spreadY: 120, spawnJitter: 230, size: 14 },
    },
    {
      key: "congrats",
      label: "Congrats",
      accentVar: "var(--ok)",
      icon: "✳",
      motif: "✳",
      particles: { shape: "glyph", symbols: ["✳", "★"], colors: ["#3f6b4a", "#6fae7d"], count: 12, spreadX: 80, spreadY: 130, spawnJitter: 230, size: 14 },
    },
  ];

  function get(key) {
    return THEMES.find((t) => t.key === key) || THEMES[0];
  }

  return { list: THEMES, get };
})();
