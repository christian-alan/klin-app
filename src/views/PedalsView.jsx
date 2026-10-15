import { HardwareKnob } from '../components/controls/Knob'
import { fmt, useDial } from '../hooks/useDial'
import { useStore } from '../state/store'

const PEDALS = [
  {
    id: 'SQUEEZE',
    kind: 'COMP',
    enamel: '#F1ECE3',
    ink: '#2E261F',
    knobs: [['Sustain', 6.5], ['Tone', 8], ['Level', 7.5], ['Blend', 8]],
    texture: { background: 'repeating-linear-gradient(90deg,#6B3A26 0 3px,#84492F 3px 5px,#5A301E 5px 7px)' },
  },
  {
    id: 'GLOW',
    kind: 'DRIVE',
    enamel: '#E2D6CF',
    ink: '#2F2520',
    knobs: [['Level', 5], ['Drive', 5], ['Tone', 5], ['Lift', 5]],
    texture: {
      background:
        'repeating-linear-gradient(60deg,#4A3023 0 5px,#5C3C2C 5px 10px),repeating-linear-gradient(-60deg,transparent 0 5px,rgba(0,0,0,0.18) 5px 10px)',
    },
  },
  {
    id: 'SCORCH',
    kind: 'FUZZ',
    enamel: '#E4C6AE',
    ink: '#33241A',
    knobs: [['Level', 5], ['Gain', 5], ['Bite', 5]],
    texture: { background: 'radial-gradient(ellipse 5px 8px,#7E5139 0 70%,transparent 75%),#4E3122', backgroundSize: '16px 18px' },
  },
  {
    id: 'DRIFT',
    kind: 'MOD',
    enamel: '#DCD3BE',
    ink: '#2F281C',
    knobs: [['Rate', 5], ['Depth', 5]],
    modes: ['Chorus', 'Trem', 'Vibe'],
    texture: { background: 'repeating-radial-gradient(circle at 50% 50%,#5E3A27 0 4px,#7A4E38 4px 7px)' },
  },
]

function PedalKnob({ pedal, label, def }) {
  const dial = useDial(`pedal:${pedal.id}:${label}`, def, { min: 0, max: 10, step: 0.1, format: fmt.tenth })
  return (
    <div className="flex w-[86px] flex-col items-center gap-0.5">
      <div className="relative">
        <HardwareKnob
          dial={dial}
          label={`${pedal.id} ${label}`}
          size={56}
          scale={1.39}
          cap="radial-gradient(circle at 36% 30%, #93A7B5, #5F7383 58%, #4B5D6B 100%)"
          pointer="#EEF2F4"
          tick={pedal.ink}
          wedge={pedal.enamel}
        />
        <span aria-hidden="true" className="absolute bottom-0.5 left-0.5 text-[7px] opacity-60" style={{ color: pedal.ink }}>
          min
        </span>
        <span aria-hidden="true" className="absolute right-0 bottom-0.5 text-[7px] opacity-60" style={{ color: pedal.ink }}>
          max
        </span>
      </div>
      <span className="text-[11px] font-semibold tracking-[0.03em]" style={{ color: pedal.ink }}>
        {label}
      </span>
    </div>
  )
}

function Chevron({ color }) {
  return (
    <svg width="10" height="14" viewBox="0 0 10 14" fill="none" stroke={color} strokeWidth="2.4" aria-hidden="true">
      <path d="M2 1.5l5.5 5.5L2 12.5" />
    </svg>
  )
}

function Pedal({ pedal }) {
  const { state, api } = useStore()
  const on = state.pedalsOn[pedal.id]
  const toggle = () => api.patch((s) => ({ pedalsOn: { ...s.pedalsOn, [pedal.id]: !on } }))

  return (
    <div
      className="relative box-border flex h-[404px] w-[214px] flex-col items-center rounded-[22px] px-4 pt-3.5 pb-4"
      style={{
        background: pedal.enamel,
        boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.6), inset 0 -5px 10px rgba(0,0,0,0.1), 0 28px 30px -16px rgba(28,30,60,0.5)',
      }}
    >
      <span className="absolute top-[236px] -left-[11px] h-[34px] w-3 rounded-[3px] bg-[linear-gradient(90deg,#8D6A36,#E1C07E_60%,#A9844A)]" />
      <span className="absolute top-[236px] -right-[11px] h-[34px] w-3 rounded-[3px] bg-[linear-gradient(90deg,#A9844A,#E1C07E_40%,#8D6A36)]" />

      <span className="pl-[0.34em] font-display text-[10px] font-bold tracking-[0.34em]" style={{ color: pedal.ink }}>
        KILN
      </span>

      <div className="flex h-[196px] w-full flex-wrap content-center justify-center gap-x-1.5 gap-y-1">
        {pedal.knobs.map(([label, def]) => (
          <PedalKnob key={label} pedal={pedal} label={label} def={def} />
        ))}
        {pedal.modes && (
          <div role="radiogroup" aria-label={`${pedal.id} mode`} className="mt-1 flex w-full justify-center gap-1">
            {pedal.modes.map((m, i) => {
              const selected = state.driftMode === i
              return (
                <button
                  key={m}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => api.edit({ driftMode: i })}
                  className="h-6 cursor-pointer rounded-xl border-[1.5px] px-2 text-[10px] font-semibold"
                  style={{
                    borderColor: pedal.ink,
                    background: selected ? pedal.ink : 'transparent',
                    color: selected ? pedal.enamel : pedal.ink,
                  }}
                >
                  {m}
                </button>
              )
            })}
          </div>
        )}
      </div>

      <div className="mt-2 mb-3 flex w-full items-center justify-center gap-2">
        <Chevron color={pedal.ink} />
        <span aria-hidden="true" className="whitespace-nowrap text-[10px] tracking-[1px] opacity-60" style={{ color: pedal.ink }}>
          ›››
        </span>
        <span className="whitespace-nowrap text-center font-display text-[17px] font-bold tracking-[0.06em]" style={{ color: pedal.ink }}>
          {pedal.id}
        </span>
        <span aria-hidden="true" className="whitespace-nowrap text-[10px] tracking-[1px] opacity-60" style={{ color: pedal.ink }}>
          ›››
        </span>
        <Chevron color={pedal.ink} />
      </div>

      <div
        className="flex w-full flex-1 flex-col items-center justify-center gap-3.5 rounded-[10px]"
        style={{ ...pedal.texture, boxShadow: 'inset 0 3px 8px rgba(0,0,0,0.5), 0 0 0 1px rgba(0,0,0,0.15)' }}
      >
        <span
          className="block size-3 rounded-full transition-[background,box-shadow]"
          style={{
            background: on ? '#5FF0E2' : '#1F3A38',
            boxShadow: on ? '0 0 6px #5FF0E2, 0 0 16px rgba(63,214,200,0.8)' : 'inset 0 1px 2px rgba(0,0,0,0.6)',
          }}
        />
        <button
          type="button"
          aria-label={`${pedal.id} ${on ? 'on' : 'off'}`}
          aria-pressed={on}
          onClick={toggle}
          className="grid size-[74px] cursor-pointer place-items-center border-0 bg-transparent p-0 active:translate-y-px"
          style={{ filter: 'drop-shadow(0 5px 5px rgba(0,0,0,0.45))' }}
        >
          <span
            className="grid size-[72px] place-items-center"
            style={{
              clipPath: 'polygon(25% 4%, 75% 4%, 100% 50%, 75% 96%, 25% 96%, 0 50%)',
              background: 'linear-gradient(160deg,#F0D9A4,#A6823F 60%,#C9A85F)',
            }}
          >
            <span className="grid size-[46px] place-items-center rounded-full" style={{ background: 'radial-gradient(circle, #3A2E1E 0 22px, #D8BA7A 23px)' }}>
              <span
                className="block size-[34px] rounded-full"
                style={{ background: 'radial-gradient(circle at 40% 32%, #A8B9C5, #63778A 75%)', boxShadow: 'inset 0 -2px 3px rgba(0,0,0,0.3)' }}
              />
            </span>
          </span>
        </button>
      </div>
    </div>
  )
}

export function PedalsView() {
  return (
    <div className="flex h-full items-center justify-center gap-[30px] pt-1.5 pb-[72px]">
      {PEDALS.map((p) => (
        <Pedal key={p.id} pedal={p} />
      ))}
    </div>
  )
}
