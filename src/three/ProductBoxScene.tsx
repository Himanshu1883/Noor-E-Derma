"use client"

import { ContactShadows, Environment, Lightformer, useTexture } from "@react-three/drei"
import { Canvas, useFrame } from "@react-three/fiber"
import { Suspense, useMemo, useRef } from "react"
import * as THREE from "three"
import { useTheme } from "@/context/ThemeContext"

/** Local pack shots for WebGL — same files stored in GridFS, served as static textures so a media-API blip cannot crash the homepage. */
const BOX_TAN = "/assets/card-tan-eraser.jpg"
const BOX_DETOX = "/assets/card-daily-detox.jpg"

/** Where the box artwork sits inside each square card image (fractions of 1024px). */
const CROPS: Record<string, { x0: number; x1: number; y0: number; y1: number }> = {
  [BOX_TAN]: { x0: 0.208, x1: 0.789, y0: 0.054, y1: 0.916 },
  [BOX_DETOX]: { x0: 0.266, x1: 0.733, y0: 0.056, y1: 0.907 },
}

export type ProgressRef = { current: number }

function Box({
  url,
  progress: source,
  visibility,
  spin,
}: {
  url: string
  progress: ProgressRef
  visibility: (p: number) => number
  spin: (p: number) => number
}) {
  const group = useRef<THREE.Group>(null)
  const progress = useRef(0)
  const tex = useTexture(url)
  const crop = CROPS[url] ?? { x0: 0, x1: 1, y0: 0, y1: 1 }
  const height = 2.2
  const width = height * ((crop.x1 - crop.x0) / (crop.y1 - crop.y0))

  const materials = useMemo(() => {
    const t = tex.clone()
    t.colorSpace = THREE.SRGBColorSpace
    t.anisotropy = 8
    t.repeat.set(crop.x1 - crop.x0, crop.y1 - crop.y0)
    t.offset.set(crop.x0, 1 - crop.y1)
    t.needsUpdate = true
    const side = new THREE.MeshPhysicalMaterial({ color: "#f2dfbd", roughness: 0.42, metalness: 0.15, clearcoat: 0.4 })
    const edge = new THREE.MeshPhysicalMaterial({ color: "#d9b56a", roughness: 0.3, metalness: 0.55, clearcoat: 0.6 })
    const front = new THREE.MeshPhysicalMaterial({ map: t, roughness: 0.38, clearcoat: 0.7, clearcoatRoughness: 0.25 })
    return [side, side, edge, edge, front, side]
  }, [tex, crop.x0, crop.x1, crop.y0, crop.y1])

  useFrame((state, dt) => {
    const g = group.current
    if (!g) return
    progress.current = THREE.MathUtils.damp(progress.current, source.current, 6, dt)
    const p = progress.current
    const v = visibility(p)
    g.visible = v > 0.01
    g.scale.setScalar(0.6 + 0.4 * v)
    g.position.y = -0.1 + (1 - v) * -0.6 + Math.sin(state.clock.elapsedTime * 1.2) * 0.04
    g.rotation.y = spin(p) + state.pointer.x * 0.12
    g.rotation.x = 0.06 - state.pointer.y * 0.06
  })

  return (
    <group ref={group}>
      <mesh material={materials} castShadow>
        <boxGeometry args={[width, height, 0.62]} />
      </mesh>
    </group>
  )
}

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}

export default function ProductBoxScene({
  progress,
  urls = [BOX_TAN, BOX_DETOX],
}: {
  progress: ProgressRef
  urls?: string[]
}) {
  const single = urls.length === 1
  const { theme } = useTheme()

  return (
    <Canvas camera={{ position: [0, 0.3, 6.4], fov: 30 }} dpr={[1, 1.75]} gl={{ alpha: true, antialias: true }} shadows>
      <ambientLight intensity={0.55} />
      <directionalLight position={[3, 5, 4]} intensity={1.6} castShadow />
      <Suspense fallback={null}>
        {single ? (
          <Box url={urls[0]} progress={progress} visibility={() => 1} spin={(p) => (p - 0.5) * Math.PI * 1.6} />
        ) : (
          <>
            <Box
              url={urls[0]}
              progress={progress}
              visibility={(p) => 1 - smooth(0.4, 0.52, p)}
              spin={(p) => -0.55 + (p / 0.5) * 1.1}
            />
            <Box
              url={urls[1]}
              progress={progress}
              visibility={(p) => smooth(0.48, 0.6, p)}
              spin={(p) => -0.55 + Math.max(0, (p - 0.5) / 0.5) * 1.1}
            />
          </>
        )}
        <Environment resolution={256}>
          <Lightformer intensity={2.2} position={[0, 4, 3]} scale={[8, 2, 1]} />
          <Lightformer intensity={1.4} position={[-5, 1, 2]} rotation-y={Math.PI / 2} scale={[4, 4, 1]} color="#fff4dc" />
          <Lightformer intensity={1.2} position={[5, 0, 1]} rotation-y={-Math.PI / 2} scale={[4, 4, 1]} color="#e8f2e2" />
        </Environment>
        <ContactShadows position={[0, -1.35, 0]} opacity={0.32} scale={7} blur={2.6} far={3} color={theme === "a" ? "#3a2a12" : "#3a5130"} />
      </Suspense>
    </Canvas>
  )
}
