import { useRef } from 'react'
import { ToolKnob } from '../components/controls/Knob'
import { Icons } from '../components/icons'
import { fmt, useDial } from '../hooks/useDial'
import { parseSignature } from '../lib/metronome'
import { useStore } from '../state/store'
import { Modal } from './Modal'

const SIGS_4 = ['2/4', '3/4', '4/4', '5/4', '6/4', '7/4', '8/4', '9/4', '10/4', '11/4', '12/4', '13/4']
const SIGS_8 = ['3/8', '6/8', '9/8', '12/8', '5/8 (3+2)', '5/8 (2+3)', '7/8 (3+2+2)', '7/8 (2+3+2)', '7/8 (2+2+3)']
const SOUNDS = ['Blip', 'Wood', 'Rim', 'Bell']
const RHYTHMS = ['1/4', '1/8', '1/8 T', '1/16']
const ACCENT_CYCLE = ['normal', 'accent', 'mute']


function Field({ label, children }) {
  return (
    <div className="relative flex flex-col gap-2.5">
      <span className="text-[11px] font-semibold tracking-[0.08em] text-[#A9ABB8]">{label}</span>
      {children}
    </div>
  )
}

const selectCls = 'flex h-12 cursor-pointer items-center justify-between rounded-[10px] border-0 bg-tool-deep px-4 text-base'

export function MetronomeModal() {
  const { state, api } = useStore()
  const m = state.metronome
  const setM = (p) => api.patch((s) => ({ metronome: { ...s.metronome, ...p } }))
  const accents = m.accents ?? parseSignature(m.sig)
  const taps = useRef([])
  const vol = useDial('metro:VOLUME', 0.5, { format: fmt.db24 })
  const pan = useDial('metro:PAN', 0.5, { format: fmt.pan })

  const setBpm = (v) => setM({ bpm: Math.max(30, Math.min(300, Math.round(v * 10) / 10)) })
  const tap = () => {
    const now = performance.now()
    taps.current = taps.current.filter((t) => now - t < 2500).concat(now).slice(-5)
    const t = taps.current
    if (t.length > 1) setBpm(60000 / ((t[t.length - 1] - t[0]) / (t.length - 1)))
  }

  const ring = 'shadow-[0_0_0_10px_#2A2B30,inset_0_0_0_2px_#0E0F12]'

  return (
    <Modal title="Metronome" width={880} top={150}>
      <div className="relative z-[2] grid h-[150px] shrink-0 grid-cols-[110px_1fr_1fr_110px] gap-7 border-b border-tool-line px-[30px] pt-1.5">
        <div className="flex flex-col items-center gap-2.5">
          <span className="text-[11px] font-semibold tracking-[0.08em] text-[#A9ABB8]">VOLUME</span>
          <ToolKnob dial={vol} label="Click volume" />
          <span className="font-mono text-xs">{vol.display}</span>
        </div>

        <Field label="TIME SIGNATURE">
          <button
            type="button"
            aria-haspopup="listbox"
            aria-expanded={m.sigOpen}
            onClick={() => setM({ sigOpen: !m.sigOpen })}
            className={selectCls}
            style={{ borderRadius: m.sigOpen ? '10px 10px 0 0' : 10 }}
          >
            {m.sig}
            <Icons.chevron width={14} height={14} style={{ transform: m.sigOpen ? 'rotate(180deg)' : undefined }} />
          </button>
          {m.sigOpen && (
            <div role="listbox" aria-label="Time signature" className="absolute top-[76px] right-0 left-0 grid grid-cols-2 gap-x-1.5 rounded-b-[10px] bg-tool-deep p-1.5 shadow-[0_24px_40px_-10px_rgba(0,0,0,0.6)]">
              {[SIGS_4, SIGS_8].map((col, ci) => (
                <div key={ci} className="flex flex-col">
                  {col.map((s) => (
                    <button
                      key={s}
                      type="button"
                      role="option"
                      aria-selected={s === m.sig}
                      onClick={() => setM({ sig: s, accents: null, sigOpen: false, beat: 0 })}
                      className="h-[34px] cursor-pointer rounded-md border-0 px-3 text-left text-[15px] hover:bg-[#2A2B30]"
                      style={{ background: s === m.sig ? '#2A2B30' : undefined, color: s === m.sig ? '#5FF0E2' : '#ECEDF2' }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          )}
        </Field>

        <Field label="SOUND">
          <div className="flex gap-0.5">
            <button type="button" aria-label={`Click sound: ${SOUNDS[m.sound]}`} onClick={() => setM({ sound: (m.sound + 1) % SOUNDS.length })} className={`${selectCls} flex-1 rounded-r-none`}>
              {SOUNDS[m.sound]}
              <Icons.chevron width={14} height={14} />
            </button>
            <button type="button" aria-label="Preview sound" className="grid h-12 w-[50px] cursor-pointer place-items-center rounded-r-[10px] border-0 bg-tool-deep text-[#A9ABB8]">
              <Icons.speaker />
            </button>
          </div>
        </Field>

        <div className="flex flex-col items-center gap-2.5">
          <span className="text-[11px] font-semibold tracking-[0.08em] text-[#A9ABB8]">PAN</span>
          <ToolKnob dial={pan} label="Click pan" bipolar />
          <span className="font-mono text-xs">{pan.display}</span>
        </div>
      </div>

      <div className="flex flex-col justify-between gap-8 px-[30px] pt-[34px] pb-10">
        <div className="grid grid-cols-[280px_120px_1fr_120px] items-center gap-7">
          <div className="flex flex-col gap-1">
            <span className="text-[11px] font-semibold tracking-[0.08em] text-[#A9ABB8]">BPM</span>
            <div className="flex items-center gap-2.5">
              <div className="flex flex-col gap-1">
                <button type="button" aria-label="Increase tempo" onClick={() => setBpm(m.bpm + 1)} className="grid h-6 w-7 cursor-pointer place-items-center border-0 bg-transparent text-[#A9ABB8]">
                  <svg width="14" height="12" viewBox="0 0 14 12" fill="currentColor" aria-hidden="true">
                    <path d="M7 1l6 10H1z" />
                  </svg>
                </button>
                <button type="button" aria-label="Decrease tempo" onClick={() => setBpm(m.bpm - 1)} className="grid h-6 w-7 cursor-pointer place-items-center border-0 bg-transparent text-[#A9ABB8]">
                  <svg width="14" height="12" viewBox="0 0 14 12" fill="currentColor" aria-hidden="true">
                    <path d="M7 11L1 1h12z" />
                  </svg>
                </button>
              </div>
              <span className="text-[80px] leading-none font-medium tracking-[-0.02em] tabular-nums">{m.bpm.toFixed(1)}</span>
            </div>
          </div>
          <button type="button" aria-label="Tap tempo" onClick={tap} className={`size-[104px] cursor-pointer justify-self-center rounded-full border-0 bg-[#1A1B1F] text-lg font-semibold tracking-[0.04em] ${ring} active:bg-[#25262B]`}>
            TAP
          </button>
          <Field label="RHYTHM">
            <button type="button" aria-label={`Subdivision: ${RHYTHMS[m.rhythm]}`} onClick={() => setM({ rhythm: (m.rhythm + 1) % RHYTHMS.length })} className={selectCls}>
              {RHYTHMS[m.rhythm]}
              <Icons.chevron width={14} height={14} />
            </button>
          </Field>
          <button
            type="button"
            aria-label={m.playing ? 'Stop metronome' : 'Start metronome'}
            aria-pressed={m.playing}
            onClick={() => setM({ playing: !m.playing, beat: 0 })}
            className={`grid size-[104px] cursor-pointer place-items-center justify-self-center rounded-full border-0 ${ring}`}
            style={{ background: m.playing ? '#5FF0E2' : '#1A1B1F', color: m.playing ? '#1A1B1F' : '#ECEDF2' }}
          >
            {m.playing ? <Icons.pause width={30} height={30} /> : <Icons.play width={32} height={32} />}
          </button>
        </div>

        <div role="group" aria-label="Beats — click a beat to change its accent" className="flex h-[70px] items-center justify-evenly">
          {accents.map((kind, i) => {
            const now = i === m.beat
            const lit = m.playing && now && kind !== 'mute'
            return (
              <button
                key={i}
                type="button"
                aria-label={`Beat ${i + 1}: ${kind}`}
                onClick={() => setM({ accents: accents.map((a, j) => (j === i ? ACCENT_CYCLE[(ACCENT_CYCLE.indexOf(a) + 1) % 3] : a)) })}
                className="flex h-[70px] w-11 cursor-pointer flex-col items-center justify-between border-0 bg-transparent p-0"
              >
                <span className="block size-[7px] rounded-full" style={{ background: kind === 'accent' ? '#ECEDF2' : 'transparent' }} />
                <span
                  className="box-border block rounded-full border-2 transition-colors duration-75"
                  style={{
                    width: kind === 'accent' ? 50 : 44,
                    height: kind === 'accent' ? 50 : 44,
                    background: kind === 'mute' ? 'transparent' : lit ? '#5FF0E2' : '#ECEDF2',
                    borderColor: lit ? '#5FF0E2' : '#ECEDF2',
                    boxShadow: lit ? '0 0 18px rgba(95,240,226,0.6)' : 'none',
                  }}
                />
                <span className="block size-[7px] rounded-full" style={{ background: now ? (m.playing ? '#5FF0E2' : '#6E707C') : 'transparent' }} />
              </button>
            )
          })}
        </div>
      </div>
    </Modal>
  )
}
