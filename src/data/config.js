/* ============================================================
   ✦ EDIT ME ✦  — A romantic anniversary website (for your love).
   Everything personal lives in these data files.
   ============================================================ */

export const COUPLE = {
  // Shown in the nav and around the site (her name, or a pet name).
  name: 'نور عيني',
  // How the hero greeting reads:  "Happy Anniversary <heroName>"
  heroName: 'حلوتي ♡',
  // Signed at the very end of the experience.
  signature: 'حبي الابدي',
  // The day your story became official — powers the live anniversary counter.
  // Format: YYYY, MM (1-12), DD
  weddingDate: { year: 2025, month: 7, day: 27 },
  // Which anniversary this celebrates (optional, cosmetic). null = auto.
  anniversaryNumber: null,
}

export const MEDIA = {
  // Background music. Set to null to hide the player.
  // To enable: drop an .mp3 in /public/audio and set e.g. '/audio/piano.mp3'.
  music: null,
}
