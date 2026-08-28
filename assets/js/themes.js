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
      icon: "📜",
      motif: "📜",
      particles: { shape: "glyph", symbols: ["✨", "✉️", "💌", "📧"], colors: ["#2b3a55", "#8c2f39"], count:67, spreadX: 450, spreadY: 480, spawnJitter: 250, size: 48 },
    },
    {
      key: "love",
      label: "Love",
      accentVar: "var(--c-valentine)",
      icon: "💘",
      motif: "💘",
      particles: { shape: "glyph", symbols: ["❤️", "💖", "💕", "✨"], colors: ["#c81d4a", "#b83b5e", "#e0b354", "#d97f97", "#8a1538"], count: 67, spreadX: 450, spreadY: 480, spawnJitter: 250, size: 48 },
    },
    {
      key: "birthday",
      label: "Birthday",
      accentVar: "var(--c-birthday)",
      icon: "🎂",
      motif: "🎂",
      particles: { shape: "glyph", symbols: ["🎂", "🎉", "🎈", "🎁", "✨"], colors: ["#e0b354", "#c81d4a", "#2f7a6d", "#6fae7d", "#f3ecdd", "#d4af37"], count: 67, spreadX: 450, spreadY: 480, spawnJitter: 250, size: 48 },
    },
    {
      key: "thankyou",
      label: "Thank You",
      accentVar: "var(--brass)",
      icon: "🙏",
      motif: "🙏",
      particles: { shape: "glyph", symbols: ["✨", "💛", "💝"], colors: ["#a9884f", "#cdb27c", "#8c2f39"], count: 67, spreadX: 450, spreadY: 480, spawnJitter: 250, size: 48 },
    },
    {
      key: "congrats",
      label: "Congrats",
      accentVar: "var(--ok)",
      icon: "🎊",
      motif: "🎊",
      particles: { shape: "glyph", symbols: ["🥳", "🎉", "🎈"], colors: ["#3f6b4a", "#6fae7d", "#2f7a6d"], count: 67, spreadX: 450, spreadY: 480, spawnJitter: 250, size: 48 },
    },
    {
      key: "wedding",
      label: "Wedding",
      accentVar: "var(--c-wedding-gold)",
      icon: "💍",
      motif: "💍",
      particles: { shape: "glyph", symbols: ["✨", "💖", "💕"], colors: ["#c9a969", "#f8f4e8", "#1e3a5f"], count: 67, spreadX: 450, spreadY: 480, spawnJitter: 250, size: 48 },
    },
    // {
    //   key: "anniversary",
    //   label: "Anniversary",
    //   accentVar: "var(--c-anniversary)",
    //   icon: "🎉",
    //   motif: "🎉",
    //   particles: { shape: "glyph", symbols: ["✨", "💖", "💕"], colors: ["#7a2530", "#b8860b", "#5d4037"], count: 67, spreadX: 450, spreadY: 480, spawnJitter: 250, size: 48 },
    // },
    // {
    //   key: "sympathy",
    //   label: "Sympathy",
    //   accentVar: "var(--c-sympathy)",
    //   icon: "🕊️",
    //   motif: "🕊️",
    //   particles: { shape: "glyph", symbols: ["✨", "💙"], colors: ["#5d6d7e", "#9cabc7", "#e9dfc7"], count: 67, spreadX: 450, spreadY: 480, spawnJitter: 250, size: 48 },
    // },
    // {
    //   key: "friendship",
    //   label: "Friendship",
    //   accentVar: "var(--c-friendship)",
    //   icon: "🤝",
    //   motif: "🤝",
    //   particles: { shape: "glyph", symbols: ["✨", "💛", "🧡"], colors: ["#c15419", "#e8a87c", "#8b4513"], count: 67, spreadX: 450, spreadY: 480, spawnJitter: 250, size: 48 },
    // },
    // {
    //   key: "holiday",
    //   label: "Holiday",
    //   accentVar: "var(--c-holiday)",
    //   icon: "🎄",
    //   motif: "🎄",
    //   particles: { shape: "glyph", symbols: ["✨", "🎁", "⭐", "🎀"], colors: ["#1e5945", "#9e2a2b", "#c9a969", "#f3ecdd"], count: 67, spreadX: 450, spreadY: 480, spawnJitter: 250, size: 48 },
    // },
    // {
    //   key: "newyear",
    //   label: "New Year",
    //   accentVar: "var(--c-newyear)",
    //   icon: "🎆",
    //   motif: "🎆",
    //   particles: { shape: "glyph", symbols: ["✨", "🎆", "🎇", "🎊"], colors: ["#0a2463", "#a8b8c8", "#f8f4e8", "#d4af37"], count: 67, spreadX: 450, spreadY: 480, spawnJitter: 250, size: 48 },
    // },
    // {
    //   key: "graduation",
    //   label: "Graduation",
    //   accentVar: "var(--c-birthday)",
    //   icon: "🎓",
    //   motif: "🎓",
    //   particles: { shape: "glyph", symbols: ["✨", "📚", "🎉", "🎈"], colors: ["#2f7a6d", "#6fae7d", "#e0b354", "#f3ecdd"], count: 67, spreadX: 450, spreadY: 480, spawnJitter: 250, size: 48 },
    // },
    {
      key: "travel",
      label: "Travel",
      accentVar: "var(--c-holiday)",
      icon: "✈️",
      motif: "✈️",
      particles: { shape: "glyph", symbols: ["✨", "🌍", "🗺️", "🧳"], colors: ["#1e5945", "#9e2a2b", "#c9a969", "#a8b8c8"], count: 67, spreadX: 450, spreadY: 480, spawnJitter: 250, size: 48 },
    },
    // {
    //   key: "music",
    //   label: "Music",
    //   accentVar: "var(--c-wedding-gold)",
    //   icon: "🎵",
    //   motif: "🎵",
    //   particles: { shape: "glyph", symbols: ["✨", "🎶", "🎹", "🎻"], colors: ["#c9a969", "#1e3a5f", "#8a1538", "#f8f4e8"], count: 67, spreadX: 450, spreadY: 480, spawnJitter: 250, size: 48 },
    // },
    // {
    //   key: "spring",
    //   label: "Spring",
    //   accentVar: "var(--c-love)",
    //   icon: "🌸",
    //   motif: "🌸",
    //   particles: { shape: "glyph", symbols: ["✨", "🌸", "🌼", "🌷"], colors: ["#b83b5e", "#d97f97", "#e0b354", "#f8f4e8"], count: 67, spreadX: 450, spreadY: 480, spawnJitter: 250, size: 48 },
    // },
    // {
    //   key: "winter",
    //   label: "Winter",
    //   accentVar: "var(--c-newyear)",
    //   icon: "❄️",
    //   motif: "❄️",
    //   particles: { shape: "glyph", symbols: ["✨", "❄️", "🎄", "🧣"], colors: ["#0a2463", "#a8b8c8", "#f8f4e8", "#d4af37"], count: 67, spreadX: 450, spreadY: 480, spawnJitter: 250, size: 48 },
    // },
  ];

  function get(key) {
    return THEMES.find((t) => t.key === key) || THEMES[0];
  }

  return { list: THEMES, get };
})();
