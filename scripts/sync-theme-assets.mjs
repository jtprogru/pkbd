// Логотип, знак и маскот живут в slidev-theme-bear — тема остаётся единственным
// источником правды. В dev Slidev отдаёт public/ темы из корня, а при build
// копирует его в dist/theme/…, поэтому '/brand/mascot.svg' в собранной презентации
// не резолвится. Синхронизируем ассеты темы в public/ перед каждым запуском.
//
// Заодно готовим перекрашенный маскот для components/Mascot.vue: тема отдаёт его
// двухтоновым файлом с зашитыми заливками светлой темы, а нам нужен тон, который
// следует за темой, как знак в футере. Ink становится currentColor, бумага — var(--bg),
// так что инлайновый SVG наследует цвет от компонента.
import { cp, mkdir, readdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const themePublic = join(root, 'node_modules', 'slidev-theme-bear', 'public')
const publicDir = join(root, 'public')
const assetsDir = join(root, 'assets')

// Оба тона зашиты генератором mishka-ds: MASCOT_INK = c-warn-text, MASCOT_PAPER = bg.
const MASCOT_INK = '#9a3f0a'
const MASCOT_PAPER = '#eff1f5'

await mkdir(publicDir, { recursive: true })

const files = await readdir(themePublic)
await Promise.all(
  files.map(file => cp(join(themePublic, file), join(publicDir, file), { recursive: true })),
)

const mascot = await readFile(join(themePublic, 'brand', 'mascot.svg'), 'utf8')
if (!mascot.includes(MASCOT_INK))
  throw new Error(`не нашёл ${MASCOT_INK} в mascot.svg — тема сменила заливки, поправь scripts/sync-theme-assets.mjs`)

const tinted = mascot
  .replaceAll(MASCOT_INK, 'currentColor')
  .replaceAll(MASCOT_PAPER, 'var(--bg)')

await mkdir(assetsDir, { recursive: true })
await writeFile(join(assetsDir, 'mascot-tinted.svg'), tinted)

console.log(`synced ${files.length} theme assets: ${files.join(', ')} (+ assets/mascot-tinted.svg)`)
