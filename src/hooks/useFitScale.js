import { useEffect, useState } from 'react'

/** Scale a fixed-size surface to fit the viewport (never above 1). */
export function useFitScale(width, height, margin = 32) {
  const compute = () => Math.min(1, (window.innerWidth - margin) / width, (window.innerHeight - margin) / height)
  const [scale, setScale] = useState(compute)
  useEffect(() => {
    const onResize = () => setScale(compute())
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  })
  return scale
}
