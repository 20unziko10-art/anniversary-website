/* ============================================================
   ✦ EDIT ME ✦  — A romantic anniversary website (for your love).
   Everything personal lives in these data files.
   ============================================================ */

export const COUPLE = {
  // Shown in the nav and around the site (her name, or a pet name).
  name: 'My Love',
  // How the hero greeting reads:  "Happy Anniversary <heroName>"
  heroName: 'My Love',
  // Signed at the very end of the experience.
  signature: 'Forever Yours',
  // The day your story became official — powers the live anniversary counter.
  // Format: YYYY, MM (1-12), DD
  weddingDate: { year: 2020, month: 2, day: 14 },
  // Which anniversary this celebrates (optional, cosmetic). null = auto.
  anniversaryNumber: null,
}

export const MEDIA = {
  // Background music. Set to null to hide the player.
  // To enable: drop an .mp3 in /public/audio and set e.g. '/audio/piano.mp3'.
  music: null,
}
