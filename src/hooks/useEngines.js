import { useEffect } from 'react'
import { useStore } from '../state/store'
import { parseSignature } from '../lib/metronome'

/** Metronome clock: advances the beat while playing. */
export function useMetronomeClock() {
  const { state, api } = useStore()
  const { playing, bpm, sig } = state.metronome
  const beats = parseSignature(sig).length

  useEffect(() => {
    if (!playing) return undefined
    const id = setInterval(() => {
      api.patch((s) => ({ metronome: { ...s.metronome, beat: (s.metronome.beat + 1) % beats } }))
    }, 60000 / bpm)
    return () => clearInterval(id)
  }, [playing, bpm, beats, api])
}

/**
 * Simulated pitch input so the tuner has something to show:
 * starts flat and drifts toward pitch, like a string being tuned up.
 */
export function useTunerSignal() {
  const { state, api } = useStore()
  const active = state.modal === 'tuner' || state.tuner.footer

  useEffect(() => {
    if (!active) return undefined
    const id = setInterval(() => {
      api.patch((s) => {
        const c = s.tunerCents ?? -22
        return { tunerCents: Math.max(-50, Math.min(50, c * 0.94 + (Math.random() - 0.5) * 2.4)) }
      })
    }, 140)
    return () => clearInterval(id)
  }, [active, api])
}
