/**
 * Generates an elegant gradient placeholder image as a data-URI.
 * Used so the experience looks intentional before you drop in real photos.
 *
 * To use REAL photos: put files in /public/photos and reference them as
 * "/photos/wedding.jpg" in the data files — they override these placeholders.
 */
const PALETTES = [
  ['#2a1d12', '#c9a14a'],
  ['#1c130c', '#e3b7a0'],
  ['#241a14', '#d9b870'],
  ['#191007', '#f0c8b4'],
  ['#2a1d12', '#e7d2a8'],
  ['#15100b', '#d9b870'],
]

export function placeholder(label = 'Memory', i = 0, w = 900, h = 1200) {
  const [a, b] = PALETTES[i % PALETTES.length]
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}'>
    <defs>
      <linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
        <stop offset='0' stop-color='${a}'/>
        <stop offset='1' stop-color='${b}'/>
      </linearGradient>
      <radialGradient id='v' cx='0.5' cy='0.42' r='0.75'>
        <stop offset='0' stop-color='rgba(255,255,255,0.18)'/>
        <stop offset='1' stop-color='rgba(0,0,0,0.55)'/>
      </radialGradient>
    </defs>
    <rect width='100%' height='100%' fill='url(#g)'/>
    <rect width='100%' height='100%' fill='url(#v)'/>
    <text x='50%' y='50%' font-family='Georgia, serif' font-size='${Math.round(w / 14)}'
      fill='rgba(255,250,240,0.92)' text-anchor='middle' dominant-baseline='middle'
      letter-spacing='2'>${escapeXml(label)}</text>
    <text x='50%' y='${h - h * 0.08}' font-family='Georgia, serif' font-size='${Math.round(w / 34)}'
      fill='rgba(255,250,240,0.5)' text-anchor='middle' letter-spacing='6'>❤</text>
  </svg>`
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}

function escapeXml(s) {
  return String(s).replace(/[<>&'"]/g, (c) =>
    ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' }[c])
  )
}

/** Returns a usable src: real file if provided, else a styled placeholder. */
export function img(src, label, i, w, h) {
  return src || placeholder(label, i, w, h)
}
