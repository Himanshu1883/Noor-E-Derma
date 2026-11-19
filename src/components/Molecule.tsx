import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/cn"

export type MoleculeKind = "niacinamide" | "bha" | "glutathione" | "kojic" | "vitamin-e" | "aloe"

type Atom = { x: number; y: number; label?: string; gold?: boolean }

const hex = (cx: number, cy: number, r: number): Atom[] =>
  Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 3) * i - Math.PI / 2
    return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) }
  })

function ring(atoms: Atom[]) {
  return atoms.map((a, i) => [a, atoms[(i + 1) % atoms.length]] as const)
}

/** Simplified, stylised skeletal structures — decorative, not exact chemistry. */
function build(kind: MoleculeKind): { atoms: Atom[]; bonds: (readonly [Atom, Atom])[] } {
  switch (kind) {
    case "niacinamide": {
      const r = hex(42, 54, 18)
      r[3] = { ...r[3], label: "N" }
      const c = { x: 72, y: 36 }
      const o = { x: 72, y: 16, label: "O", gold: true }
      const n = { x: 90, y: 46, label: "NH₂", gold: true }
      return { atoms: [...r, c, o, n], bonds: [...ring(r), [r[1], c], [c, o], [c, n]] }
    }
    case "bha": {
      const r = hex(44, 56, 18)
      const c = { x: 44, y: 18 }
      const o1 = { x: 28, y: 6, label: "O", gold: true }
      const o2 = { x: 62, y: 6, label: "OH", gold: true }
      const oh = { x: 78, y: 38, label: "OH", gold: true }
      return { atoms: [...r, c, o1, o2, oh], bonds: [...ring(r), [r[0], c], [c, o1], [c, o2], [r[1], oh]] }
    }
    case "kojic": {
      const r = hex(46, 54, 18)
      r[0] = { ...r[0], label: "O" }
      const o = { x: 46, y: 92, label: "O", gold: true }
      const oh = { x: 80, y: 74, label: "OH", gold: true }
      const ch = { x: 12, y: 30, label: "CH₂OH", gold: true }
      return { atoms: [...r, o, oh, ch], bonds: [...ring(r), [r[3], o], [r[2], oh], [r[5], ch]] }
    }
    case "vitamin-e": {
      const a = hex(30, 56, 15)
      const b = hex(56, 56, 15)
      b[4] = { ...b[4], label: "O" }
      const tail = [
        { x: 78, y: 44 },
        { x: 92, y: 56 },
        { x: 106, y: 44 },
      ]
      const oh = { x: 8, y: 44, label: "OH", gold: true }
      return {
        atoms: [...a, ...b.slice(1), ...tail, oh],
        bonds: [...ring(a), [a[1], b[1]], [b[1], b[2]], [b[2], b[3]], [b[3], a[2]], [b[1], tail[0]], [tail[0], tail[1]], [tail[1], tail[2]], [a[5], oh]],
      }
    }
    case "glutathione": {
      const pts: Atom[] = [
        { x: 8, y: 60, label: "N", gold: true },
        { x: 24, y: 48 },
        { x: 40, y: 60 },
        { x: 56, y: 48, label: "N" },
        { x: 72, y: 60 },
        { x: 72, y: 82, label: "SH", gold: true },
        { x: 88, y: 48 },
        { x: 104, y: 60, label: "N" },
      ]
      const o = { x: 40, y: 80, label: "O", gold: true }
      const bonds = pts.slice(0, -1).map((p, i) => [p, pts[i + 1]] as const).filter(([a, b]) => !(a === pts[5] && b === pts[6]))
      return { atoms: [...pts, o], bonds: [...bonds, [pts[4], pts[6]], [pts[2], o]] }
    }
    case "aloe":
    default: {
      const pts: Atom[] = [
        { x: 56, y: 92 },
        { x: 36, y: 30 },
        { x: 56, y: 12, gold: true },
        { x: 76, y: 30 },
        { x: 20, y: 50, gold: true },
        { x: 92, y: 50, gold: true },
      ]
      return {
        atoms: pts,
        bonds: [[pts[0], pts[1]], [pts[1], pts[2]], [pts[2], pts[3]], [pts[3], pts[0]], [pts[0], pts[4]], [pts[0], pts[5]]],
      }
    }
  }
}

export function Molecule({ kind, className }: { kind: MoleculeKind; className?: string }) {
  const ref = useRef<SVGSVGElement>(null)
  const [on, setOn] = useState(false)
  const { atoms, bonds } = build(kind)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => entry.isIntersecting && setOn(true), { threshold: 0.4 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <svg ref={ref} viewBox="0 0 116 100" className={cn("molecule overflow-visible", on && "is-on", className)} aria-hidden>
      <g className="orbit" opacity="0.5">
        <ellipse cx="58" cy="50" rx="54" ry="20" fill="none" style={{ stroke: "var(--t-200)" }} strokeDasharray="2 5" />
      </g>
      {bonds.map(([a, b], i) => (
        <line
          key={i}
          className="bond"
          x1={a.x}
          y1={a.y}
          x2={b.x}
          y2={b.y}
          strokeWidth="2"
          strokeLinecap="round"
          style={{ stroke: "var(--t-600)", transitionDelay: `${i * 70}ms` }}
        />
      ))}
      {atoms.map((a, i) =>
        a.label ? (
          <g key={i} className="atom">
            <circle cx={a.x} cy={a.y} r={a.label.length > 2 ? 9 : 7} fill={a.gold ? "#fff7e0" : "#fff"} style={{ stroke: a.gold ? "#b8860b" : "var(--t-600)" }} strokeWidth="1.4" />
            <text x={a.x} y={a.y + 2.6} textAnchor="middle" fontSize={a.label.length > 2 ? 5.5 : 7} fontFamily="Jost, sans-serif" fontWeight="600" style={{ fill: a.gold ? "#8a6212" : "var(--t-800)" }}>
              {a.label}
            </text>
          </g>
        ) : (
          <circle key={i} className="atom" cx={a.x} cy={a.y} r={a.gold ? 4 : 3} style={{ fill: a.gold ? "#e3b341" : "var(--t-400)" }} />
        ),
      )}
    </svg>
  )
}
