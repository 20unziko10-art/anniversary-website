/**
 * Convert source photos → optimized WebP for the website.
 *
 * Usage:  node scripts/convert-photos.mjs
 *   • Reads every .jpg/.jpeg/.png from  /source-photos
 *   • Writes resized, compressed .webp to  /public/photos
 *
 * Requires sharp (already a devDependency):  npm i -D sharp
 */
import sharp from 'sharp'
import fs from 'node:fs'
import path from 'node:path'

const SRC = 'source-photos'
const DEST = 'public/photos'
fs.mkdirSync(DEST, { recursive: true })

if (!fs.existsSync(SRC)) {
  console.error(`No "${SRC}" folder found. Put your original photos there first.`)
  process.exit(1)
}

const files = fs.readdirSync(SRC).filter((f) => /\.(jpe?g|png)$/i.test(f))
const results = []

for (const f of files) {
  const inPath = path.join(SRC, f)
  const base = f.replace(/\.(jpe?g|png)$/i, '')
  const outPath = path.join(DEST, `${base}.webp`)
  const stat = fs.statSync(inPath)
  if (stat.size === 0) {
    results.push(`SKIP  ${f} (0 bytes — empty/corrupt, re-add this file)`)
    continue
  }
  try {
    const info = await sharp(inPath)
      .rotate() // honour EXIF orientation
      .resize({ width: 1400, height: 1750, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 80, effort: 5 })
      .toFile(outPath)
    const pct = (100 - (info.size / stat.size) * 100).toFixed(0)
    results.push(`OK    ${f} ${(stat.size / 1024).toFixed(0)}KB -> ${base}.webp ${(info.size / 1024).toFixed(0)}KB (-${pct}%)`)
  } catch (e) {
    results.push(`FAIL  ${f}: ${e.message}`)
  }
}

console.log(results.join('\n') || 'No images found in /source-photos')
