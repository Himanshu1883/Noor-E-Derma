// Dev-only helper: node scripts/shot.mjs [path] [width] [height]
// Captures viewport screenshots while scrolling through the page.
import { chromium } from "playwright-core"
import { mkdirSync } from "node:fs"

const path = process.argv[2] || "/"
const width = Number(process.argv[3] || 1440)
const height = Number(process.argv[4] || 900)
const out = "shots"
mkdirSync(out, { recursive: true })

const browser = await chromium.launch({
  executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"],
})
const page = await browser.newPage({ viewport: { width, height } })
const errors = []
page.on("pageerror", (e) => errors.push(String(e)))
page.on("console", (m) => m.type() === "error" && errors.push(m.text()))

await page.goto(`http://localhost:5173${path}`, { waitUntil: "networkidle" })
await page.waitForTimeout(2600)

const total = await page.evaluate(() => document.documentElement.scrollHeight)
const tag = path === "/" ? "home" : path.split("/").pop()
let i = 0
for (let y = 0; y < total; y += height) {
  await page.mouse.wheel(0, i === 0 ? 0 : height)
  await page.waitForTimeout(900)
  await page.screenshot({ path: `${out}/${tag}-${width}-${String(i).padStart(2, "0")}.png` })
  i++
  if (i > 40) break
}
console.log(JSON.stringify({ total, shots: i, errors }, null, 2))
await browser.close()
