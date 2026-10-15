import { StripKnob } from '../components/controls/Knob'
import { Icons } from '../components/icons'
import { fmt, useDial } from '../hooks/useDial'
import { useRig } from '../hooks/useRig'
import { useStore } from '../state/store'

const MIC_MODELS = [
  'Dynamic · Bright',
  'Dynamic · Off-axis',
  'Dynamic · Round',
  'Dynamic · Broad',
  'Condenser · Small',
  'Condenser · Large',
  'Condenser · Tube',
  'Ribbon · Classic',
  'Ribbon · Modern',
]

const CABS = {
  flint: {
    pad: 14,
    radius: 46,
    inner: 34,
    body: 'linear-gradient(180deg,#F2E0E2,#E3C6CA)',
    baffle: { background: 'radial-gradient(circle at 50% 40%,#EAD3D6,#E0C2C6)' },
    frame: 'transparent',
    plate: true,
    speaker: { ring: '#C6A465', coneInner: '#CDB5B8', cone: '#E6D1D3', surround: '#3A3236', cap: 'radial-gradient(circle at 38% 32%,#6A6266,#1E1A1C 70%)', screw: '#8D6A36' },
  },
  cinder: {
    pad: 18,
    radius: 18,
    inner: 6,
    body: 'repeating-linear-gradient(115deg,rgba(0,0,0,0.06) 0 2px,transparent 2px 7px),linear-gradient(180deg,#8A4529,#6A3220)',
    baffle: {
      backgroundColor: '#16110E',
      backgroundImage:
        'radial-gradient(circle, transparent 0 6.5px, #C29A55 7px 8.8px, transparent 9.3px), radial-gradient(circle, transparent 0 6.5px, #A5803F 7px 8.8px, transparent 9.3px)',
      backgroundSize: '20px 20px, 20px 20px',
      backgroundPosition: '0 0, 10px 10px',
    },
    frame: '#E6DBC5',
    corners: 'linear-gradient(140deg,#6E3420,#4A2112)',
    speaker: { ring: '#6E5530', coneInner: '#D8D2C6', cone: '#E8E2D6', surround: '#1A1718', cap: 'radial-gradient(circle at 38% 32%,#55504E,#0E0C0C 70%)', screw: '#C29A55' },
  },
  ember: {
    pad: 22,
    radius: 14,
    inner: 6,
    body: 'radial-gradient(circle, rgba(60,40,20,0.05) 0 1px, transparent 1.4px) 0 0 / 4px 4px, #EEEAE2',
    baffle: { background: 'radial-gradient(ellipse at 50% 30%,#DCD6CF,#C8C1B8)' },
    frame: '#2A2422',
    corners: 'linear-gradient(140deg,#E6CD94,#9E7B42)',
    speaker: { ring: '#CDAE62', coneInner: '#D2C3B4', cone: '#E2D6C8', surround: '#2A2426', cap: 'radial-gradient(circle at 38% 32%,#E8DCCD,#B8A794 75%)', screw: '#9E7B42' },
  },
}

/* ---------- Mini heads that sit on the cab ---------- */

const MiniKnob = ({ rot = 0, cap = 'radial-gradient(circle at 36% 30%, #4A4244, #141112 70%)', size = 28, ptr = '#F2EDE6' }) => (
  <span
    className="relative block rounded-full"
    style={{ width: size, height: size, background: `repeating-conic-gradient(rgba(255,255,255,0.07) 0 7.5deg, rgba(0,0,0,0.12) 7.5deg 15deg), ${cap}`, boxShadow: '0 3px 4px rgba(40,20,25,0.4)', transform: `rotate(${rot}deg)` }}
  >
    <span className="absolute top-[3px] left-1/2 block h-[8px] w-0.5 -translate-x-1/2" style={{ background: ptr }} />
  </span>
)

function MiniHead({ amp }) {
  if (amp === 'flint') {
    return (
      <div className="flex flex-col items-center">
        <svg width="300" height="34" viewBox="0 0 300 34" fill="none" aria-hidden="true" className="-mb-1">
          <path d="M24 30 C 90 2, 210 2, 276 30" stroke="#2B2638" strokeWidth="7" strokeLinecap="round" />
        </svg>
        <div className="box-border h-[180px] w-[420px] rounded-[40px] p-[9px]" style={{ background: 'linear-gradient(180deg,#F2E0E2,#E3C6CA)', boxShadow: '0 18px 20px -12px rgba(40,30,60,0.4)' }}>
          <div className="flex h-full flex-col overflow-hidden rounded-[32px] bg-[#E5C9CD] shadow-[inset_0_3px_8px_rgba(110,60,70,0.28)]">
            <div className="flex h-[70px] shrink-0 items-center justify-between px-6" style={{ background: 'linear-gradient(180deg,#EAD1D4,#DFC0C4)' }}>
              <span className="grid size-9 place-items-center rounded-lg bg-[#F4E6E8] text-[#3A2A2E]">
                <Icons.logo width={18} height={18} />
              </span>
              <span className="relative block size-3.5 rounded-full" style={{ background: 'radial-gradient(circle,#1A1410 0 3px,#D9B877 4px,#8D6A36 7px)' }}>
                <MiniCable d="M0 0 C 0 90, -10 140, -40 170 C -60 190, -100 200, -150 204" />
              </span>
              {[54, 0, 0, 0, 0].map((r, i) => (
                <MiniKnob key={i} rot={r} />
              ))}
              <span className="block size-1.5 rounded-full bg-led shadow-[0_0_6px_#5FF0E2]" />
            </div>
            <div className="grid flex-1 grid-cols-6 grid-rows-2 gap-1 px-[22px] pt-[9px] pb-3">
              {[0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0].map((f, i) => (
                <div key={i} className="rounded-md bg-[#E9D2D5] shadow-[inset_0_1px_3px_rgba(110,60,70,0.28)]" style={{ transform: f ? 'rotate(180deg)' : undefined }} />
              ))}
              <span className="flex items-end justify-end font-display text-[15px] text-[#3A2A2E]">kiln</span>
            </div>
          </div>
        </div>
        <div className="flex w-[300px] justify-between">
          <span className="block h-4 w-[60px]" style={{ background: 'linear-gradient(180deg,#2B2638,#17141E)', clipPath: 'polygon(0 0,100% 0,84% 100%,16% 100%)' }} />
          <span className="block h-4 w-[60px]" style={{ background: 'linear-gradient(180deg,#2B2638,#17141E)', clipPath: 'polygon(0 0,100% 0,84% 100%,16% 100%)' }} />
        </div>
      </div>
    )
  }
  if (amp === 'cinder') {
    return (
      <div className="flex flex-col items-center">
        <svg width="220" height="30" viewBox="0 0 220 30" fill="none" aria-hidden="true" className="-mb-[3px]">
          <path d="M42 13 C 85 1, 135 1, 178 13" stroke="#6E3420" strokeWidth="8" strokeLinecap="round" />
        </svg>
        <div className="relative box-border h-[190px] w-[440px] rounded-[14px] p-[11px]" style={{ background: 'repeating-linear-gradient(115deg, rgba(0,0,0,0.06) 0 2px, transparent 2px 6px), linear-gradient(180deg, #8A4529, #6A3220)', boxShadow: '0 18px 20px -12px rgba(40,30,60,0.45)' }}>
          <div className="relative h-full overflow-hidden rounded-[5px]" style={{ backgroundColor: '#16110E', backgroundImage: 'radial-gradient(circle, transparent 0 3.6px, #C29A55 4px 5px, transparent 5.4px)', backgroundSize: '11px 11px' }}>
            <div className="absolute inset-x-0 top-0 box-border flex h-[74px] items-center justify-between px-[18px] pb-3" style={{ borderRadius: '0 0 50% 50% / 0 0 22px 22px', background: 'linear-gradient(180deg,#F3EBDA,#E6DBC5)' }}>
              <span className="relative block size-3 rounded-full" style={{ background: 'radial-gradient(circle,#1A1410 0 3px,#D9B877 4px,#8D6A36 6px)' }}>
                <MiniCable d="M0 0 C 0 100, -6 150, -30 180 C -50 200, -70 210, -110 214" color="#4A4542" width={4} />
              </span>
              {[-40, 0, 0, 68, 0, 0, 0].map((r, i) => (
                <MiniKnob key={i} rot={r} size={26} cap="radial-gradient(circle at 36% 30%, #3F3834, #110E0C 70%)" ptr="#EDE4D1" />
              ))}
              <span className="block size-1.5 rounded-full bg-led shadow-[0_0_6px_#5FF0E2]" />
            </div>
            <div className="absolute bottom-[22px] left-1/2 grid h-11 w-[100px] -translate-x-1/2 place-items-center rounded-md font-display text-[11px] font-bold tracking-[0.22em] text-[#3A2E22]" style={{ background: 'linear-gradient(170deg,#F2EADB,#DDD1BA)' }}>
              KILN
            </div>
          </div>
        </div>
        <div className="flex w-[380px] justify-between">
          <span className="block h-3 w-12 rounded-b-[10px] bg-[#1E191C]" />
          <span className="block h-3 w-12 rounded-b-[10px] bg-[#1E191C]" />
        </div>
      </div>
    )
  }
  return (
    <div className="flex flex-col items-center">
      <svg width="220" height="30" viewBox="0 0 220 30" fill="none" aria-hidden="true" className="-mb-[3px]">
        <path d="M22 14 C 22 4, 32 4, 50 4 H 170 C 188 4, 198 4, 198 14" stroke="#2B2420" strokeWidth="7" strokeLinecap="round" />
      </svg>
      <div className="box-border flex h-[196px] w-[440px] flex-col gap-2 rounded-2xl bg-[#EEEAE2] p-3" style={{ boxShadow: '0 18px 20px -12px rgba(40,30,60,0.4)' }}>
        <div className="flex-1 rounded-md border-4 border-[#1E1916]" style={{ background: 'radial-gradient(ellipse 58% 98% at 50% 118%, #F2E6CF 0 22%, #E4AE63 22% 34%, #C9693E 34% 48%, #7A3623 48% 63%, transparent 63%), linear-gradient(180deg, #120E0C, #2B1F1A)' }} />
        <div className="flex h-12 shrink-0 items-center justify-between rounded-md px-3.5" style={{ background: 'linear-gradient(180deg,#ECD39C,#BE9655 52%,#DCBC80)' }}>
          <span className="font-display text-[10px] text-[#2E2010]">kiln</span>
          <span className="relative block size-3.5 rounded-full" style={{ background: 'radial-gradient(circle,#1A1410 0 3px,#6B5232 4px,#2E2418 7px)' }}>
            <MiniCable d="M0 0 C -10 20, -30 40, -50 56 C -70 70, -110 76, -150 78" color="#1E1C1E" />
          </span>
          {[-12, 0, 0, 0, 0, 0, 0].map((r, i) => (
            <MiniKnob key={i} rot={r} size={24} cap="radial-gradient(circle at 36% 30%, #5A3E36, #1E1311 70%)" ptr="#F0E2C2" />
          ))}
          <span className="block h-0.5 w-2 bg-led shadow-[0_0_5px_#5FF0E2]" />
        </div>
      </div>
      <div className="flex w-[380px] justify-between">
        <span className="block h-3 w-[50px] rounded-b-[10px] bg-[#1E191C]" />
        <span className="block h-3 w-[50px] rounded-b-[10px] bg-[#1E191C]" />
      </div>
    </div>
  )
}

function MiniCable({ d, color = '#2A2632', width = 5 }) {
  return (
    <svg width="1" height="1" className="pointer-events-none absolute top-1/2 left-1/2 overflow-visible" aria-hidden="true">
      <path d={d} stroke={color} strokeWidth={width} strokeLinecap="round" fill="none" />
    </svg>
  )
}

/* ---------- Cabinet ---------- */

function Speaker({ look, micX, micRot, micOn }) {
  return (
    <div
      className="relative size-[228px] rounded-full"
      style={{ background: `radial-gradient(circle, transparent 0 100px, ${look.ring} 101px 108px, transparent 109px)` }}
    >
      <span
        className="absolute inset-2.5 block rounded-full"
        style={{
          background: `radial-gradient(circle, ${look.coneInner} 0 30%, ${look.cone} 31% 70%, ${look.surround} 71% 82%, #1E1A1C 83%)`,
          boxShadow: 'inset 0 3px 8px rgba(0,0,0,0.35)',
        }}
      />
      <span className="absolute top-20 left-20 block size-[68px] rounded-full" style={{ background: look.cap, boxShadow: '0 6px 10px rgba(0,0,0,0.35)' }} />
      {[
        { left: 110, top: 2 },
        { left: 110, bottom: 2 },
        { left: 2, top: 110 },
        { right: 2, top: 110 },
      ].map((pos, i) => (
        <span key={i} className="absolute block size-2 rounded-full" style={{ ...pos, background: look.screw }} />
      ))}
      <span
        className="absolute top-[102px] block h-[22px] w-[78px] transition-[left,opacity]"
        style={{
          left: micX,
          borderRadius: '11px 5px 5px 11px',
          background: 'linear-gradient(180deg, #4A4448, #17141A 70%)',
          boxShadow: '0 6px 8px rgba(0,0,0,0.4)',
          transform: `rotate(${micRot}deg)`,
          opacity: micOn ? 1 : 0.2,
        }}
      >
        <span className="absolute top-1 left-1 block size-3.5 rounded-full bg-[repeating-linear-gradient(90deg,#2A262C_0_2px,#6A646C_2px_3px)]" />
      </span>
    </div>
  )
}

function Cabinet({ cab, positions, mics }) {
  const c = CABS[cab]
  const corner = (pos) => (
    <span className="absolute block size-[30px] rounded-md" style={{ ...pos, background: c.corners, boxShadow: '0 2px 3px rgba(0,0,0,0.35)' }} />
  )
  return (
    <div
      className="absolute top-[240px] left-1/2 box-border h-[380px] w-[600px] -translate-x-1/2"
      style={{ padding: c.pad, borderRadius: c.radius, background: c.body, boxShadow: 'inset 0 3px 0 rgba(255,255,255,0.35), inset 0 -10px 18px rgba(0,0,0,0.15), 0 -2px 10px rgba(40,30,60,0.15)' }}
    >
      {c.corners && (
        <>
          {corner({ left: -3, top: -3 })}
          {corner({ right: -3, top: -3 })}
        </>
      )}
      <div className="relative h-full" style={{ ...c.baffle, borderRadius: c.inner, boxShadow: `inset 0 4px 14px rgba(0,0,0,0.35), 0 0 0 3px ${c.frame}` }}>
        {c.plate && (
          <span className="absolute top-4 left-1/2 grid h-[22px] w-[90px] -translate-x-1/2 place-items-center rounded-[3px] font-display text-[9px] font-bold tracking-[0.3em] text-[#3A2A17]" style={{ background: 'linear-gradient(180deg,#E6CD94,#A9844A)' }}>
            KILN
          </span>
        )}
        <div className="absolute inset-x-0 top-12 flex justify-center gap-[30px]">
          <Speaker look={c.speaker} micX={Math.round(14 + positions[0] * 60)} micRot={-24} micOn={mics[0].on} />
          <Speaker look={c.speaker} micX={Math.round(176 - positions[1] * 60)} micRot={204} micOn={mics[1].on} />
        </div>
      </div>
    </div>
  )
}

/* ---------- Mic panels ---------- */

function MicPanel({ index }) {
  const { state, api } = useStore()
  const mic = state.mics[index]
  const setMic = (patch, edit = true) =>
    (edit ? api.edit : api.patch)((s) => ({ mics: s.mics.map((m, i) => (i === index ? { ...m, ...patch } : m)) }))

  const knobs = [
    { id: 'POSITION', label: 'POSITION', def: [0.309, 0.664][index], format: fmt.three },
    { id: 'DISTANCE', label: 'DISTANCE', def: [0.294, 0][index], format: fmt.three },
    { id: 'LEVEL', label: 'MIC LEVEL', def: 0.5, format: fmt.db12, bipolar: true },
    { id: 'PAN', label: 'PAN', def: [0.25, 0.75][index], format: fmt.pan, bipolar: true },
  ]

  return (
    <div className="flex w-[220px] flex-col gap-2.5">
      <div className="flex items-center gap-1.5">
        <span className="mr-auto text-[11px] font-semibold tracking-[0.08em]">MIC {index + 1}</span>
        <button type="button" aria-label="Previous mic model" onClick={() => setMic({ model: (mic.model + MIC_MODELS.length - 1) % MIC_MODELS.length })} className="grid h-[26px] w-[30px] cursor-pointer place-items-center border-0 bg-transparent">
          <Icons.arrowLeft />
        </button>
        <button type="button" aria-label="Next mic model" onClick={() => setMic({ model: (mic.model + 1) % MIC_MODELS.length })} className="grid h-[26px] w-[30px] cursor-pointer place-items-center border-0 bg-transparent">
          <Icons.arrowRight />
        </button>
      </div>

      <div className="flex gap-0.5">
        <button
          type="button"
          aria-haspopup="listbox"
          aria-expanded={mic.open}
          onClick={() => setMic({ open: !mic.open }, false)}
          className="flex h-11 min-w-0 flex-1 cursor-pointer gap-2 whitespace-nowrap items-center justify-between rounded-l-[10px] border-0 px-3.5 text-sm"
          style={{ background: mic.open ? '#1C1D22' : mic.on ? '#F4F5FB' : '#E6E8F6', color: mic.open ? '#ECEDF2' : mic.on ? '#262838' : '#8A8FB4' }}
        >
          <span className="truncate">{MIC_MODELS[mic.model]}</span>
          <Icons.chevron className="shrink-0" style={{ transform: mic.open ? 'rotate(180deg)' : undefined }} />
        </button>
        <button
          type="button"
          aria-label={`Mic ${index + 1} on/off`}
          aria-pressed={mic.on}
          onClick={() => setMic({ on: !mic.on })}
          className="grid size-11 cursor-pointer place-items-center rounded-r-[10px] border-0"
          style={{ background: mic.on ? '#262838' : '#F4F5FB', color: mic.on ? '#F4F5FB' : '#262838' }}
        >
          <Icons.power />
        </button>
      </div>

      {mic.open ? (
        <div role="listbox" aria-label={`Mic ${index + 1} model`} className="-mt-1.5 rounded-xl bg-[#1C1D22] py-2 text-tool-ink shadow-[0_20px_40px_-10px_rgba(20,22,40,0.6)]">
          <div className="px-4 pt-2 pb-1.5 text-[11px] font-medium tracking-[0.08em] text-tool-muted">INTERNAL MICS</div>
          {MIC_MODELS.map((name, i) => (
            <button
              key={name}
              type="button"
              role="option"
              aria-selected={i === mic.model}
              onClick={() => setMic({ model: i, open: false })}
              className="flex h-[38px] w-full cursor-pointer items-center justify-between border-0 bg-transparent px-4 text-left text-sm hover:bg-[#2A2B31]"
              style={{ color: i === mic.model ? '#5FF0E2' : '#ECEDF2' }}
            >
              {name}
              {i === mic.model && <Icons.check />}
            </button>
          ))}
          <div className="my-1.5 h-px bg-[#2E3036]" />
          <div className="flex items-center justify-between px-4 py-1.5">
            <span className="text-[11px] font-medium tracking-[0.08em] text-tool-muted">CUSTOM IR</span>
            <button type="button" className="h-7 cursor-pointer rounded-md border-0 bg-tool-ink px-3 text-[11px] font-semibold tracking-[0.06em] text-[#1C1D22]">
              LOAD
            </button>
          </div>
          <div className="px-4 pt-1 pb-2 text-[13px] text-[#6E707C]">No file</div>
        </div>
      ) : (
        <div className="flex flex-col gap-2.5 transition-opacity" style={{ opacity: mic.on ? 1 : 0.45 }}>
          <div className="grid grid-cols-2 gap-x-2.5 gap-y-[18px] pt-[18px]">
            {knobs.map((k) => (
              <MicKnob key={k.id} index={index} {...k} />
            ))}
          </div>
          <div className="mt-3.5 mb-1.5 h-px bg-hairline" />
          <button type="button" aria-pressed="false" className="flex h-9 cursor-pointer items-center gap-2.5 self-center rounded-lg border border-[#A9AED3] bg-transparent px-4 text-xs font-semibold tracking-[0.08em]">
            PHASE <span className="text-base font-normal">ø</span>
          </button>
        </div>
      )}
    </div>
  )
}

function MicKnob({ index, id, label, def, format, bipolar }) {
  const dial = useDial(`mic${index}:${id}`, def, { min: 0, max: 1, step: 0.001, format })
  return (
    <div className="flex flex-col items-center gap-1.5">
      <StripKnob dial={dial} label={`Mic ${index + 1} ${label}`} size={64} bipolar={bipolar} />
      <span className="font-mono text-xs">{dial.display}</span>
      <span className="text-[11px] font-semibold tracking-[0.06em]">{label}</span>
    </div>
  )
}

export function CabView() {
  const { state } = useStore()
  const rig = useRig()
  const positions = [state.kv['mic0:POSITION'] ?? 0.309, state.kv['mic1:POSITION'] ?? 0.664]
  return (
    <div className="relative h-full overflow-hidden" style={{ background: 'linear-gradient(180deg, transparent 84%, #C3C8E4 84%)' }}>
      <div className="absolute inset-0" style={{ transform: 'scale(0.82)', transformOrigin: '50% 8px' }}>
        <div className="absolute top-0.5 left-1/2 z-[2] flex w-[440px] -translate-x-1/2 flex-col items-center">
          <MiniHead amp={rig.amp} />
        </div>
        <Cabinet cab={rig.cab} positions={positions} mics={state.mics} />
      </div>
      <div className="pointer-events-none absolute inset-x-[26px] top-3.5 z-[5] flex items-start justify-between [&>*]:pointer-events-auto">
        <MicPanel index={0} />
        <MicPanel index={1} />
      </div>
    </div>
  )
}
