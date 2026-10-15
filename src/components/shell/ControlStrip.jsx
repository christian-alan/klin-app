import { fmt, useDial } from '../../hooks/useDial'
import { useStore } from '../../state/store'
import { StripKnob } from '../controls/Knob'
import { MiniSwitch } from '../controls/Switch'
import { PresetBar } from './PresetBar'

function GlobalKnob({ id, label, def, format, bipolar, toggle }) {
  const { state, api } = useStore()
  const dial = useDial(`strip:${id}`, def, { format })
  const on = toggle ? state.toggles[id] : true
  return (
    <div className="flex w-24 flex-col items-center gap-2 transition-opacity" style={{ opacity: on ? 1 : 0.45 }}>
      <div className="flex h-[13px] items-center gap-1.5 text-[11px] font-semibold tracking-[0.08em]">
        {label}
        {toggle && (
          <MiniSwitch
            on={on}
            label={`${label} on/off`}
            onChange={(v) => api.edit((s) => ({ toggles: { ...s.toggles, [id]: v } }))}
          />
        )}
      </div>
      <StripKnob dial={dial} label={label} bipolar={bipolar} />
      <div className="font-mono text-[11px]">{dial.display}</div>
    </div>
  )
}

function Meter({ label, level }) {
  return (
    <div
      role="meter"
      aria-label={label}
      aria-valuemin={-60}
      aria-valuemax={0}
      aria-valuenow={Math.round(-60 + level * 60)}
      className="relative h-[104px] w-[5px] overflow-hidden rounded-sm bg-bar"
    >
      <span className="absolute inset-x-0 bottom-0 bg-[#2E3466] transition-[height]" style={{ height: `${level * 100}%` }} />
    </div>
  )
}

function InputMode() {
  const { state, api } = useStore()
  const stereo = state.stereo
  return (
    <div className="flex w-[92px] flex-col items-start gap-2.5 pl-1.5">
      <span className="text-[11px] font-semibold tracking-[0.08em] text-muted">INPUT MODE</span>
      <div role="radiogroup" aria-label="Input mode" className="flex items-stretch gap-2">
        <button
          type="button"
          aria-label="Switch input mode"
          onClick={() => api.patch({ stereo: !stereo })}
          className="relative block h-[50px] w-4 cursor-pointer rounded-lg border-0 bg-[#C2C6E2] p-0"
        >
          <span className="absolute left-[3px] block size-2.5 rounded-full bg-accent transition-[top]" style={{ top: stereo ? 3 : 37 }} />
        </button>
        <div className="flex flex-col justify-between">
          {[
            ['Stereo', true],
            ['Mono', false],
          ].map(([label, value]) => (
            <button
              key={label}
              type="button"
              role="radio"
              aria-checked={stereo === value}
              onClick={() => api.patch({ stereo: value })}
              className={`cursor-pointer border-0 bg-transparent p-0 text-left text-xs ${stereo === value ? 'text-ink' : 'text-muted'}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export function ControlStrip() {
  const { state } = useStore()
  return (
    <div className="flex items-stretch gap-1 px-[22px] pt-1">
      <Meter label="Input level" level={0.52} />
      <span className="w-1.5" />
      <GlobalKnob id="INPUT" label="INPUT" def={0.5} format={fmt.db24} bipolar />
      <GlobalKnob id="GATE" label="GATE" def={0.167} format={fmt.gate} toggle />
      <GlobalKnob id="TRANSPOSE" label="TRANSPOSE" def={0.5} format={fmt.semis} bipolar />
      <InputMode />
      <PresetBar />
      <GlobalKnob id="DOUBLER" label="DOUBLER" def={0.24} format={fmt.ms25} toggle />
      <GlobalKnob id="OUTPUT" label="OUTPUT" def={0.5} format={fmt.db24} bipolar />
      <span className="w-1.5" />
      <Meter label="Output level" level={state.stereo ? 0.58 : 0.64} />
    </div>
  )
}
