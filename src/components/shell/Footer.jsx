import { useRef } from 'react'
import { useStore } from '../../state/store'
import { Icons } from '../icons'

function FooterButton({ active, onClick, children, label }) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={active}
      onClick={onClick}
      className="flex h-7 cursor-pointer items-center gap-2 rounded-md border-0 px-3 text-[11px] font-medium tracking-[0.08em] transition-colors"
      style={{ background: active ? '#E6E8F6' : 'transparent', color: active ? '#262838' : 'inherit' }}
    >
      {children}
    </button>
  )
}

const Divider = ({ dark }) => <span className={`h-3.5 w-px ${dark ? 'bg-[#3A3C4A]' : 'bg-[#9297BD]'}`} />

function MiniTuner({ cents }) {
  const x = Math.round(31 + (cents / 50) * 31)
  const color = Math.abs(cents) <= 3 ? '#3FD6C8' : '#F2A84B'
  return (
    <span className="flex items-center gap-2">
      <span className="w-3 text-xs font-semibold">G</span>
      <span className="relative block h-2.5 w-[70px] bg-[repeating-linear-gradient(90deg,#9CA1C8_0_1px,transparent_1px_14px)] bg-[length:100%_4px] bg-[0_3px] bg-repeat-x">
        <span className="absolute left-[34px] top-0 block h-2.5 w-0.5 bg-ink" />
        <span className="absolute top-px block size-2 rounded-full transition-[left]" style={{ left: x, background: color }} />
      </span>
    </span>
  )
}

export function Footer() {
  const { state, api } = useStore()
  const { modal, metronome, tuner } = state
  const dark = modal !== null
  const taps = useRef([])

  const open = (name) => api.patch({ modal: modal === name ? null : name })
  const setMetronome = (m) => api.patch((s) => ({ metronome: { ...s.metronome, ...m } }))

  const tap = () => {
    const now = performance.now()
    taps.current = taps.current.filter((t) => now - t < 2500).concat(now).slice(-5)
    const t = taps.current
    if (t.length > 1) {
      const bpm = 60000 / ((t[t.length - 1] - t[0]) / (t.length - 1))
      setMetronome({ bpm: Math.max(30, Math.min(300, Math.round(bpm * 10) / 10)) })
    }
  }

  return (
    <footer
      className="relative z-[60] flex h-9 shrink-0 items-center px-3 text-[11px] font-medium tracking-[0.08em] transition-colors"
      style={{ background: dark ? '#1E1F26' : '#B9BEDD', color: dark ? '#6B6F8C' : '#343752' }}
    >
      <FooterButton label="Tuner" active={modal === 'tuner'} onClick={() => open('tuner')}>
        {tuner.footer ? <MiniTuner cents={state.tunerCents ?? -14} /> : 'TUNER'}
      </FooterButton>
      <Divider dark={dark} />
      <FooterButton label="MIDI" onClick={() => {}}>
        MIDI
      </FooterButton>
      <Divider dark={dark} />
      <FooterButton label="Tap tempo" onClick={tap}>
        TAP
      </FooterButton>
      <span className="px-2 font-mono">{metronome.bpm.toFixed(1)} BPM</span>
      <Divider dark={dark} />
      <FooterButton label="Metronome" active={modal === 'metronome'} onClick={() => open('metronome')}>
        METRONOME
      </FooterButton>
      <button
        type="button"
        aria-label={metronome.playing ? 'Stop metronome' : 'Start metronome'}
        aria-pressed={metronome.playing}
        onClick={() => setMetronome({ playing: !metronome.playing, beat: 0 })}
        className="grid size-[22px] cursor-pointer place-items-center rounded-full border-0"
        style={{ background: metronome.playing ? '#5FF0E2' : dark ? '#4A4D63' : '#9CA1C8', color: '#262838' }}
      >
        {metronome.playing ? <Icons.pause /> : <Icons.play />}
      </button>
      <span className="w-3" />
      <Divider dark={dark} />
      <FooterButton label="Settings" active={modal === 'settings'} onClick={() => open('settings')}>
        SETTINGS
      </FooterButton>
      <span className="flex-1" />
      <span className="font-mono tracking-[0.04em]" style={{ color: dark ? '#6B6F8C' : '#4A4E6E' }}>
        KILN AUDIO · v0.1
      </span>
    </footer>
  )
}
