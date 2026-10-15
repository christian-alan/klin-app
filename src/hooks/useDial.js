import { useCallback, useEffect, useRef } from 'react'
import { useStore } from '../state/store'

const SWEEP = 270 // degrees of travel, from 7 o'clock to 5 o'clock
const DRAG_PIXELS = 180 // pixels of vertical drag for a full sweep

/**
 * Binds a rotary control to the store.
 * Drag up/down (Shift for fine), scroll, arrow keys, double-click to reset.
 */
export function useDial(id, defaultValue, { min = 0, max = 1, step = 0.005, format } = {}) {
  const { state, api } = useStore()
  const value = state.kv[id] ?? defaultValue
  const range = max - min
  const nudgeStep = Math.max(step, range / 100)

  const valueRef = useRef(value)
  useEffect(() => {
    valueRef.current = value
  }, [value])

  const clamp = useCallback(
    (v) => Math.min(max, Math.max(min, Math.round(v / step) * step)),
    [min, max, step],
  )

  const set = useCallback((v) => api.setKv(id, clamp(v)), [api, id, clamp])

  const onPointerDown = useCallback(
    (e) => {
      if (e.button !== 0) return
      e.preventDefault()
      e.currentTarget.focus()
      const startY = e.clientY
      const startValue = valueRef.current
      const move = (ev) => {
        const scale = ev.shiftKey ? 0.2 : 1
        set(startValue + ((startY - ev.clientY) / DRAG_PIXELS) * range * scale)
      }
      const up = () => {
        window.removeEventListener('pointermove', move)
        window.removeEventListener('pointerup', up)
      }
      window.addEventListener('pointermove', move)
      window.addEventListener('pointerup', up)
    },
    [range, set],
  )

  const onWheel = useCallback((e) => set(valueRef.current + (e.deltaY < 0 ? nudgeStep : -nudgeStep)), [set, nudgeStep])

  const onKeyDown = useCallback(
    (e) => {
      const keys = { ArrowUp: 1, ArrowRight: 1, ArrowDown: -1, ArrowLeft: -1, PageUp: 10, PageDown: -10 }
      if (e.key in keys) {
        e.preventDefault()
        set(valueRef.current + keys[e.key] * nudgeStep)
      } else if (e.key === 'Home') {
        e.preventDefault()
        set(min)
      } else if (e.key === 'End') {
        e.preventDefault()
        set(max)
      }
    },
    [set, nudgeStep, min, max],
  )

  const onDoubleClick = useCallback(() => api.setKv(id, defaultValue), [api, id, defaultValue])

  const fraction = (value - min) / range
  const deg = Math.round(fraction * SWEEP)
  const display = format ? format(value) : String(value)

  return {
    value,
    fraction,
    deg,
    rotation: deg - SWEEP / 2,
    display,
    bind: {
      role: 'slider',
      tabIndex: 0,
      'aria-valuemin': min,
      'aria-valuemax': max,
      'aria-valuenow': Number(value.toFixed(3)),
      'aria-valuetext': display,
      onPointerDown,
      onWheel,
      onKeyDown,
      onDoubleClick,
      style: { touchAction: 'none' },
    },
  }
}

export const fmt = {
  db24: (f) => {
    const x = (f - 0.5) * 48
    return `${x > 0 ? '+' : ''}${x.toFixed(1)} dB`
  },
  gate: (f) => `${(-96 + f * 96).toFixed(1)} dB`,
  semis: (f) => {
    const s = Math.round((f - 0.5) * 24)
    return `${s > 0 ? '+' : ''}${s} st`
  },
  ms25: (f) => `${(f * 25).toFixed(2)} ms`,
  tenth: (x) => x.toFixed(1),
  pct: (x) => `${Math.round(x * 100)}%`,
  three: (x) => x.toFixed(3),
  db12: (x) => {
    const d = (x - 0.5) * 24
    return `${d > 0 ? '+' : ''}${d.toFixed(1)} dB`
  },
  pan: (x) => {
    const p = Math.round((x - 0.5) * 200)
    return p === 0 ? 'C' : p < 0 ? `${-p} L` : `${p} R`
  },
}
