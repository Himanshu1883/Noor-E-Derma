import { useEffect, useState } from "react"

export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() => typeof window !== "undefined" && window.matchMedia(query).matches)

  useEffect(() => {
    const media = window.matchMedia(query)
    const onChange = () => setMatches(media.matches)
    onChange()
    media.addEventListener("change", onChange)
    return () => media.removeEventListener("change", onChange)
  }, [query])

  return matches
}

export function usePrefersReducedMotion() {
  return useMediaQuery("(prefers-reduced-motion: reduce)")
}

function hasWebGL() {
  try {
    const canvas = document.createElement("canvas")
    return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"))
  } catch {
    return false
  }
}

/** 3D only on wider, capable devices that haven't asked for reduced motion. */
export function useShouldRender3D() {
  const reduced = usePrefersReducedMotion()
  const wide = useMediaQuery("(min-width: 768px)")
  const [capable, setCapable] = useState(false)

  useEffect(() => {
    const cores = navigator.hardwareConcurrency || 8
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
    setCapable(cores >= 4 && !conn?.saveData && hasWebGL())
  }, [])

  return wide && !reduced && capable
}
