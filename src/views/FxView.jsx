import { useEffect, useState } from 'react'
import { HardwareKnob } from '../components/controls/Knob'
import { Icons } from '../components/icons'
import { fmt, useDial } from '../hooks/useDial'
import { useStore } from '../state/store'

const SYNC = ['FREE', 'HOST', 'TAP']
const HEAD_PATTERNS = [
  [1, 0, 0],
  [0, 1, 0],
  [1, 1, 0],
  [1, 0, 1],
]
const VERB_MODES = ['HALL', 'PLATE', 'ROOM']
const FADERS = ['PRE-DELAY', 'DECAY', 'LOW CUT', 'HIGH CUT', 'MIX']

const fmtFader = [
  (v) => `${Math.round(v * 2)} ms`,
  (v) => `${(0.2 + v * 0.098).toFixed(2)} s`,
  (v) => `${Math.round(20 + v * 4.8)} Hz`,
  (v) => `${(1 + v * 0.19).toFixed(1)} kHz`,
  (v) => `${v} %`,
]

const screw = (pos) => <span className="absolute block size-2.5 rounded-full bg-[radial-gradient(circle,#6A6C72,#B8BABF)]" style={pos} />

function EchoKnob({ label, def, hot }) {
  const dial = useDial(`echo:${label}`, def, { min: 0, max: 10, step: 0.1, format: fmt.tenth })
  return (
    <div className="flex flex-col items-center gap-1">
      <HardwareKnob
        dial={dial}
        label={`Echo ${label} ${dial.display}`}
        size={44}
        scale={1.41}
        cap={hot ? 'radial-gradient(circle at 36% 30%, #FFC27A, #D9761F 70%)' : 'radial-gradient(circle at 36% 30%, #4A4B50, #121316 70%)'}
        fluted={false}
        pointerDot
        pointer={hot ? '#5A2E08' : '#E3872E'}
        tick="#3A3B40"
        wedge="#D6D7DB"
        tickEvery={22.5}
      />
      <span className="text-[9px] font-semibold tracking-[0.12em]">{label}</span>
    </div>
  )
}

function useVuNeedle(active) {
  const [level, setLevel] = useState(0.6)
  useEffect(() => {
    if (!active) return undefined
    const id = setInterval(() => setLevel(0.45 + Math.random() * 0.35), 180)
    return () => clearInterval(id)
  }, [active])
  return active ? level : 0
}

function PowerButton({ on, onClick, label }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <span className="block size-[7px] rounded-full transition-all" style={{ background: on ? '#FFE3B8' : '#6A5C4E', boxShadow: on ? '0 0 8px #FFD58A' : 'none' }} />
      <button
        type="button"
        aria-label={`${label} power`}
        aria-pressed={on}
        onClick={onClick}
        className="size-[50px] cursor-pointer rounded-[10px] border-0 active:translate-y-px"
        style={{ background: 'linear-gradient(180deg,#F59A3C,#D9761F)', boxShadow: '0 4px 6px rgba(0,0,0,0.3), inset 0 0 0 4px #E8862C, inset 0 -6px 10px rgba(0,0,0,0.15)' }}
      />
      <span className="text-[9px] font-semibold tracking-[0.18em]">POWER</span>
    </div>
  )
}

function EchoUnit() {
  const { state, api } = useStore()
  const on = state.echoOn
  const level = useVuNeedle(on)
  const [flash, setFlash] = useState(false)
  const time = state.kv['echo:TIME'] ?? 5
  const delay = state.sync === 0 ? `${Math.round(20 + time * 98)} ms` : state.sync === 1 ? '1/8 D' : '465 ms'
  const ticks = Array.from({ length: 13 }, (_, i) => ({ a: -50 + i * (100 / 12), major: i % 3 === 0, hot: i >= 9 }))

  return (
    <div
      className="relative flex h-[262px] rounded-lg text-[#26272B] transition-opacity"
      style={{
        background: 'linear-gradient(180deg,#E4E5E8,#CDCED2)',
        boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.8), inset 0 -3px 6px rgba(0,0,0,0.12), 0 14px 18px -8px rgba(30,30,50,0.45)',
        opacity: on ? 1 : 0.78,
      }}
    >
      {screw({ left: 10, top: 10 })}
      {screw({ right: 10, top: 10 })}
      {screw({ left: 10, bottom: 10 })}
      {screw({ right: 10, bottom: 10 })}

      <div className="box-border flex w-[286px] flex-col gap-3 border-r border-[#B4B6BB] py-[22px] pr-[22px] pl-[34px]">
        <div className="flex items-baseline justify-between">
          <span className="font-display text-xl font-bold tracking-[0.18em]">ECHO</span>
          <span className="font-mono text-[9px] tracking-[0.2em] text-[#6A6C72]">TAPE · 3 HEAD</span>
        </div>
        <div role="meter" aria-label="Echo level" aria-valuenow={Math.round(level * 100)} className="relative h-[104px] overflow-hidden rounded-lg shadow-[inset_0_2px_6px_rgba(0,0,0,0.25)]" style={{ background: 'linear-gradient(180deg,#F6F1E4,#E8E0CC)' }}>
          {ticks.map((t, i) => (
            <span key={i} className="absolute -bottom-[30px] left-[114px] block h-[116px] origin-bottom" style={{ width: t.major ? 2 : 1, transform: `rotate(${t.a}deg)` }}>
              <span className="absolute top-0 left-0 block" style={{ width: t.major ? 2 : 1, height: t.major ? 14 : 9, background: t.hot ? '#E3872E' : '#3A2E22' }} />
            </span>
          ))}
          <span className="absolute top-11 left-[92px] font-display text-[13px] font-medium text-[#3A2E22]">VU</span>
          <span className="absolute -bottom-[30px] left-[114px] block h-[118px] w-0.5 origin-bottom bg-[#1E1A16] transition-transform duration-150" style={{ transform: `rotate(${-50 + level * 100}deg)` }} />
          <span className="absolute -bottom-3.5 left-[100px] block size-[30px] rounded-full bg-[#26221E]" />
        </div>
        <div className="grid h-[50px] grid-cols-2 items-center rounded-lg bg-[#17181B] px-3.5 font-mono text-[10px] tracking-[0.12em] text-[#C9CBD1] shadow-[inset_0_2px_4px_rgba(0,0,0,0.6),0_1px_0_rgba(255,255,255,0.6)]">
          <span className="flex flex-col gap-[3px]">
            DELAY<span className="text-xs text-white">{delay}</span>
          </span>
          <span className="flex flex-col gap-[3px] text-right">
            TEMPO<span className="text-xs text-[#F0A04B]">{state.metronome.bpm.toFixed(1)} BPM</span>
          </span>
        </div>
      </div>

      <div className="flex w-[176px] flex-col items-center justify-between border-r border-[#B4B6BB] pt-5 pb-[18px]">
        <div className="flex flex-col items-center gap-1.5">
          <span className="text-[9px] font-semibold tracking-[0.18em]">ACTIVE HEADS</span>
          <div className="flex gap-[26px]">
            {HEAD_PATTERNS[state.headMode].map((lit, i) => (
              <span key={i} className="block size-2 rounded-full" style={{ background: lit && on ? '#FFFFFF' : '#9A9CA2', boxShadow: lit && on ? '0 0 6px #FFFFFF' : 'none' }} />
            ))}
          </div>
        </div>
        <button
          type="button"
          aria-label={`Head mode ${state.headMode + 1} of 4`}
          onClick={() => api.edit((s) => ({ headMode: (s.headMode + 1) % 4 }))}
          className="grid size-[104px] cursor-pointer place-items-center rounded-full border-0 p-0 transition-transform"
          style={{
            background: 'repeating-conic-gradient(#EDEDEE 0 4deg, #C9CACE 4deg 8deg)',
            boxShadow: '0 8px 10px rgba(0,0,0,0.3), inset 0 0 0 2px #B9BABE',
            transform: `rotate(${-60 + state.headMode * 40}deg)`,
          }}
        >
          <span className="relative block size-[70px] rounded-full shadow-[inset_0_-2px_4px_rgba(0,0,0,0.15)]" style={{ background: 'radial-gradient(circle at 40% 35%, #FFFFFF, #E0E1E4)' }}>
            <span className="absolute top-1 left-[33px] block h-3.5 w-1 rounded-sm bg-[#26272B]" />
          </span>
        </button>
        <div className="flex flex-col items-center gap-1">
          <div className="flex gap-3.5 text-[9px] font-semibold tracking-[0.1em]">
            {SYNC.map((s) => (
              <span key={s}>{s}</span>
            ))}
          </div>
          <button
            type="button"
            aria-label={`Sync: ${SYNC[state.sync]}`}
            onClick={() => api.edit((s) => ({ sync: (s.sync + 1) % 3 }))}
            className="relative h-[22px] w-[110px] cursor-pointer border-0 bg-transparent"
          >
            <span className="absolute top-1 left-[50px] block size-3.5 rounded-full bg-[radial-gradient(circle_at_40%_35%,#F7B566,#C46A1C)]" />
            <span className="absolute top-0 left-[55px] block h-3.5 w-[5px] origin-bottom rounded-[3px] bg-ember transition-transform" style={{ transform: `rotate(${-40 + state.sync * 40}deg)` }} />
          </button>
          <span className="text-[9px] font-semibold tracking-[0.18em]">SYNC</span>
        </div>
      </div>

      <div className="grid flex-1 grid-cols-4 content-center gap-y-2 px-4">
        {[['TIME', 5], ['FEEDBACK', 5], ['WOW', 5], ['MIX', 5], ['DRIVE', 4], ['BASS', 5, true], ['TREBLE', 5, true], ['WIDTH', 6]].map(([l, d, hot]) => (
          <EchoKnob key={l} label={l} def={d} hot={hot} />
        ))}
      </div>

      <div className="flex w-[110px] flex-col items-center justify-between border-l border-[#B4B6BB] pt-6 pb-[22px]">
        <Icons.logo width={26} height={26} className="text-[#9A9CA2]" />
        <div className="flex flex-col items-center gap-2">
          <button
            type="button"
            aria-label="Tap delay time"
            onClick={() => {
              setFlash(true)
              setTimeout(() => setFlash(false), 160)
            }}
            className="size-[50px] cursor-pointer rounded-[10px] border-0"
            style={{
              background: 'radial-gradient(circle, #FFF8E8 0 30%, #F7DFA8 70%)',
              boxShadow: `0 0 18px rgba(255,220,150,${on ? (flash ? 0.95 : 0.55) : 0}), 0 4px 6px rgba(0,0,0,0.3), inset 0 0 0 3px #E8D6AC`,
            }}
          />
          <span className="text-[9px] font-semibold tracking-[0.18em]">TAP</span>
        </div>
        <PowerButton label="Echo" on={on} onClick={() => api.patch({ echoOn: !on })} />
      </div>
    </div>
  )
}

function ReverbUnit() {
  const { state, api } = useStore()
  const on = state.verbOn
  const fv = state.reverbFaders
  const text = fv.map((v, i) => fmtFader[i](v))
  const lcd = [
    ['PRE-DELAY', fv[0], text[0]],
    ['DECAY', fv[1], text[1]],
    ['FILTER', Math.max(0, fv[3] - fv[2]), `${text[2].replace(' Hz', '')}–${text[3]}`],
    ['MIX', fv[4], text[4]],
  ]
  const setFader = (i, v) => api.edit((s) => ({ reverbFaders: s.reverbFaders.map((x, j) => (j === i ? v : x)) }))

  return (
    <div
      className="flex h-[196px] rounded-lg text-[#EDEEF0] transition-opacity"
      style={{ background: 'linear-gradient(180deg,#8F9196,#7A7C81)', boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.3), 0 14px 18px -8px rgba(30,30,50,0.45)', opacity: on ? 1 : 0.78 }}
    >
      <div className="box-border flex w-[286px] flex-col gap-3 border-r border-[#66686D] py-[18px] pr-[22px] pl-[34px]">
        <span className="font-display text-xl font-bold tracking-[0.18em]">REVERB</span>
        <div className="flex flex-1 flex-col justify-between rounded-lg bg-[#141518] px-3.5 py-3 font-mono text-[9px] tracking-[0.12em] text-[#9A9CA4] shadow-[inset_0_2px_4px_rgba(0,0,0,0.7)]">
          <div className="flex items-baseline justify-between">
            <span>MODE</span>
            <span className="text-sm tracking-[0.16em] text-white">{VERB_MODES[state.verbMode]}</span>
          </div>
          {lcd.map(([label, pct, value]) => (
            <div key={label} className="grid grid-cols-[70px_1fr_64px] items-center gap-2">
              <span>{label}</span>
              <span className="relative block h-[5px] rounded-[1px] bg-[#2E3036]">
                <span className="absolute inset-y-0 left-0 block bg-[#D8DADF]" style={{ width: `${pct}%` }} />
              </span>
              <span className="text-right text-[#ECEDF2]">{value}</span>
            </div>
          ))}
        </div>
      </div>

      <div role="radiogroup" aria-label="Reverb mode" className="flex w-[100px] flex-col items-center justify-center gap-1.5 border-r border-[#66686D]">
        {VERB_MODES.map((m, i) => (
          <button
            key={m}
            type="button"
            role="radio"
            aria-checked={i === state.verbMode}
            onClick={() => api.edit({ verbMode: i })}
            className="h-[30px] w-[74px] cursor-pointer rounded-md border-0 text-[9px] font-semibold tracking-[0.14em]"
            style={{ background: i === state.verbMode ? '#1B1C1F' : 'transparent', color: i === state.verbMode ? '#FFFFFF' : '#E3E4E7' }}
          >
            {m}
          </button>
        ))}
      </div>

      <div className="flex flex-1 items-center justify-around px-2.5">
        {FADERS.map((label, i) => (
          <div key={label} className="flex flex-col items-center gap-1.5">
            <div className="relative grid h-[150px] w-[70px] place-items-center">
              <span aria-hidden="true" className="absolute top-1.5 bottom-1.5 left-0 w-3 bg-[repeating-linear-gradient(180deg,#C9CBD0_0_1px,transparent_1px_11px)]" />
              <span aria-hidden="true" className="absolute top-1.5 right-0 bottom-1.5 w-3 bg-[repeating-linear-gradient(180deg,#C9CBD0_0_1px,transparent_1px_11px)]" />
              <input
                type="range"
                className={`fader fader--rack h-[150px] w-11 ${i === 2 || i === 3 ? 'fader--hot' : ''}`}
                min={0}
                max={100}
                value={fv[i]}
                onChange={(e) => setFader(i, parseInt(e.target.value, 10))}
                aria-label={`Reverb ${label}`}
                aria-valuetext={text[i]}
              />
            </div>
            <span className="text-[9px] font-semibold tracking-[0.12em] whitespace-nowrap">{label}</span>
          </div>
        ))}
      </div>

      <div className="flex w-[110px] flex-col items-center justify-end border-l border-[#66686D] pb-[22px]">
        <PowerButton label="Reverb" on={on} onClick={() => api.patch({ verbOn: !on })} />
      </div>
    </div>
  )
}

export function FxView() {
  return (
    <div className="relative h-full" style={{ background: 'linear-gradient(180deg, transparent 86%, #C3C8E4 86%)' }}>
      <span className="absolute top-[110px] left-[82px] block h-[440px] w-[26px] rounded bg-[repeating-linear-gradient(92deg,rgba(0,0,0,0.08)_0_2px,transparent_2px_6px),linear-gradient(90deg,#7A4A2A,#B07A4A_45%,#8A5632)] shadow-[0_10px_14px_rgba(0,0,0,0.3)]" />
      <span className="absolute top-[110px] right-[82px] block h-[440px] w-[26px] rounded bg-[repeating-linear-gradient(92deg,rgba(0,0,0,0.08)_0_2px,transparent_2px_6px),linear-gradient(90deg,#8A5632,#B07A4A_55%,#7A4A2A)] shadow-[0_10px_14px_rgba(0,0,0,0.3)]" />
      <span className="absolute top-[186px] left-[70px] block h-[42px] w-4 rounded bg-[linear-gradient(90deg,#8E9095,#F0F1F3_50%,#8E9095)]" />
      <span className="absolute top-[186px] right-[70px] block h-[42px] w-4 rounded bg-[linear-gradient(90deg,#8E9095,#F0F1F3_50%,#8E9095)]" />
      <div className="absolute top-2 right-[100px] left-[100px] flex flex-col gap-2.5">
        <EchoUnit />
        <ReverbUnit />
      </div>
    </div>
  )
}
