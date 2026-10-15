import { HardwareKnob } from '../components/controls/Knob'
import { useDial } from '../hooks/useDial'
import { useStore } from '../state/store'

const BANDS = ['65 Hz', '125 Hz', '250 Hz', '500 Hz', '1 kHz', '2 kHz', '4 kHz', '8 kHz', '16 kHz']

/** Body finish follows the selected amp so the EQ matches the rig. */
const FINISH = {
  flint: { body: 'linear-gradient(180deg,#EED9DA,#DDBFC1)', ink: '#2E2224', tick: 'rgba(60,30,35,0.35)', wedge: '#E6CCCE' },
  cinder: {
    body: 'radial-gradient(ellipse at 30% 20%,rgba(255,255,255,0.25),transparent 50%),linear-gradient(180deg,#D3A764,#A97A3A 60%,#C99A55)',
    ink: '#2A1C0E',
    tick: 'rgba(40,25,10,0.4)',
    wedge: '#C0924F',
  },
  ember: { body: 'linear-gradient(180deg,#F1EEE8,#DEDAD2)', ink: '#2A2622', tick: 'rgba(40,35,30,0.32)', wedge: '#E8E4DD' },
}

const fmtDb = (g) => `${g > 0 ? '+' : ''}${g.toFixed(1)} dB`

function FilterKnob({ id, label, def, format, finish }) {
  const dial = useDial(id, def, { min: 0, max: 1, step: 0.005, format })
  return (
    <div className="flex w-[100px] flex-col items-center gap-3.5">
      <span className="text-xs font-semibold whitespace-nowrap">
        {label} : {dial.display}
      </span>
      <HardwareKnob
        dial={dial}
        label={label}
        size={72}
        scale={1.22}
        cap="radial-gradient(circle at 36% 30%, #5A4237, #1E1411 70%)"
        pointer="#E6C27A"
        tick={finish.tick}
        wedge={finish.wedge}
        tickEvery={13.5}
      />
    </div>
  )
}

export function EqView() {
  const { state, api } = useStore()
  const finish = FINISH[state.amp]
  const on = state.eqOn

  const setGain = (i, v) => api.edit((s) => ({ gains: s.gains.map((g, j) => (j === i ? v : g)) }))

  return (
    <div className="flex h-full flex-col items-center justify-center pb-[60px]" style={{ background: 'linear-gradient(180deg, transparent 80%, #C3C8E4 80%)' }}>
      <div
        className="box-border flex h-[300px] w-[940px] items-center gap-[18px] rounded-[26px] px-11"
        style={{
          background: finish.body,
          color: finish.ink,
          boxShadow: 'inset 0 3px 0 rgba(255,255,255,0.55), inset 0 -10px 16px rgba(0,0,0,0.12), 0 30px 30px -18px rgba(28,30,60,0.5)',
        }}
      >
        <div className="flex flex-col items-center gap-3.5">
          <FilterKnob id="eq:hpf" label="HPF" def={0} format={(x) => `${Math.round(20 * Math.pow(20, x))} Hz`} finish={finish} />
          <svg width="18" height="10" viewBox="0 0 18 10" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <path d="M1 9 C 5 9, 6 1, 10 1 H 17" />
          </svg>
          <button
            type="button"
            role="switch"
            aria-checked={on}
            aria-label="EQ on/off"
            onClick={() => api.patch({ eqOn: !on })}
            className="relative size-[34px] cursor-pointer rounded-full border-0 p-0 shadow-[0_3px_4px_rgba(0,0,0,0.35)]"
            style={{ background: 'radial-gradient(circle, #8D6A36 0 7px, #E1C07E 8px, #9E7B42 16px)' }}
          >
            <span className="absolute left-[14px] block h-5 w-1.5 rounded-sm bg-[linear-gradient(90deg,#2A2420,#5A4E46)] transition-[top]" style={{ top: on ? -10 : 24 }} />
          </button>
        </div>

        <div className="flex flex-1 justify-between transition-opacity" style={{ opacity: on ? 1 : 0.55 }}>
          {BANDS.map((band, i) => (
            <div key={band} className="flex w-[66px] flex-col items-center gap-2.5">
              <span className="text-xs font-semibold tabular-nums">{fmtDb(state.gains[i])}</span>
              <div className="relative grid h-[200px] w-[66px] place-items-center">
                <span
                  aria-hidden="true"
                  className="absolute top-2.5 right-0 bottom-2.5 w-3.5"
                  style={{ background: `repeating-linear-gradient(180deg, ${finish.tick} 0 1.5px, transparent 1.5px 15px)` }}
                />
                <span aria-hidden="true" className="absolute top-[99px] right-0 h-0.5 w-[18px]" style={{ background: finish.tick }} />
                <input
                  type="range"
                  className="fader h-[200px] w-[52px]"
                  min={-12}
                  max={12}
                  step={0.5}
                  value={state.gains[i]}
                  onChange={(e) => setGain(i, parseFloat(e.target.value))}
                  onDoubleClick={() => setGain(i, 0)}
                  aria-label={`${band} gain`}
                  aria-valuetext={fmtDb(state.gains[i])}
                />
              </div>
              <span className="text-xs font-semibold whitespace-nowrap">{band}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center gap-3.5">
          <FilterKnob id="eq:lpf" label="LPF" def={1} format={(x) => `${(2 * Math.pow(10, x)).toFixed(1)} kHz`} finish={finish} />
          <svg width="18" height="10" viewBox="0 0 18 10" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <path d="M1 1 H 8 C 12 1, 13 9, 17 9" />
          </svg>
          <span
            className="mt-2.5 block size-3.5 rounded-full transition-all"
            style={{ background: on ? '#5FF0E2' : '#1F3A38', boxShadow: on ? '0 0 6px #5FF0E2, 0 0 16px rgba(63,214,200,0.8)' : 'inset 0 1px 2px rgba(0,0,0,0.6)' }}
          />
        </div>
      </div>
      <div className="flex w-[820px] justify-between">
        <span className="block h-[22px] w-[110px] rounded-b-xl bg-[linear-gradient(180deg,#2A2428,#141114)]" />
        <span className="block h-[22px] w-[110px] rounded-b-xl bg-[linear-gradient(180deg,#2A2428,#141114)]" />
      </div>
    </div>
  )
}
