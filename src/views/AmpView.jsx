import { HardwareKnob } from '../components/controls/Knob'
import { Icons } from '../components/icons'
import { fmt, useDial } from '../hooks/useDial'
import { useStore } from '../state/store'

function AmpKnob({ amp, label, def, look }) {
  const dial = useDial(`amp:${amp}:${label}`, def, { min: 0, max: 10, step: 0.1, format: fmt.tenth })
  return (
    <div className="flex flex-col items-center" style={{ gap: look.gap ?? 8, width: look.cell }}>
      <HardwareKnob dial={dial} label={`${label} ${dial.display}`} size={look.size} scale={look.scale} cap={look.cap} pointer={look.pointer} tick={look.tick} wedge={look.wedge} tickEvery={look.tickEvery ?? 9} />
      <span className="font-semibold" style={{ fontSize: look.labelSize ?? 9, letterSpacing: look.tracking ?? '0.16em' }}>
        {label}
      </span>
    </div>
  )
}

/** Patch cable drawn from a jack's centre. `d` is relative to the jack. */
function Cable({ d, color = '#2A2632', width = 10 }) {
  return (
    <svg width="1" height="1" className="pointer-events-none absolute top-1/2 left-1/2 overflow-visible" aria-hidden="true">
      <path d={d} stroke={color} strokeWidth={width} strokeLinecap="round" fill="none" />
      <path d={d} stroke="rgba(255,255,255,0.16)" strokeWidth="2" fill="none" transform="translate(-2 -2)" />
    </svg>
  )
}

function Jack({ size = 26, cable, ring = ['#D9B877', '#8D6A36'], cableColor, cableWidth }) {
  return (
    <span
      className="relative block rounded-full"
      style={{ width: size, height: size, background: `radial-gradient(circle, #1A1410 0 ${size * 0.2}px, ${ring[0]} ${size * 0.23}px, ${ring[1]} ${size / 2}px)`, boxShadow: '0 2px 3px rgba(0,0,0,0.35)' }}
    >
      {cable && <Cable d={cable} color={cableColor} width={cableWidth} />}
    </span>
  )
}

function Toggle({ base = '#2A211B', bat = '#D9CFBD' }) {
  return (
    <span className="relative block h-7 w-3 rounded-md" style={{ background: base }}>
      <span className="absolute top-0.5 left-0.5 block h-3 w-2 rounded" style={{ background: bat }} />
    </span>
  )
}

function Led({ on }) {
  return (
    <span
      className="block size-[11px] rounded-full transition-all"
      style={{ background: on ? '#5FF0E2' : '#1F3A38', boxShadow: on ? '0 0 6px #5FF0E2, 0 0 16px rgba(63,214,200,0.8)' : 'inset 0 1px 2px rgba(0,0,0,0.6)' }}
    />
  )
}

function Feet({ width, color = '#2B2638', trapezoid }) {
  return (
    <div className="flex justify-between" style={{ width }}>
      {[0, 1].map((i) => (
        <span
          key={i}
          className="block"
          style={
            trapezoid
              ? { width: 110, height: 30, background: `linear-gradient(180deg, ${color}, #17141E)`, clipPath: 'polygon(0 0, 100% 0, 84% 100%, 16% 100%)' }
              : { width: 90, height: 18, borderRadius: '0 0 14px 14px', background: 'linear-gradient(180deg, #2A2428, #141114)' }
          }
        />
      ))}
    </div>
  )
}

const ArchTile = ({ flip }) => (
  <div
    className="relative overflow-hidden rounded-[10px]"
    style={{
      transform: flip ? 'rotate(180deg)' : undefined,
      background:
        'repeating-linear-gradient(0deg, rgba(90,40,50,0.05) 0 1px, transparent 1px 3px), repeating-linear-gradient(90deg, rgba(90,40,50,0.05) 0 1px, transparent 1px 3px), #E9D2D5',
      boxShadow: 'inset 0 2px 4px rgba(110,60,70,0.28), 0 1px 0 rgba(255,255,255,0.6)',
    }}
  >
    {[
      ['10%', '82%'],
      ['27%', '52%'],
    ].map(([inset, h]) => (
      <span
        key={inset}
        className="absolute -bottom-[3px] block rounded-t-full border-4 border-b-0 border-[#F1E0E2]"
        style={{ left: inset, right: inset, height: h, boxShadow: '0 2px 2px rgba(110,60,70,0.25)' }}
      />
    ))}
  </div>
)

function FlintHead({ power }) {
  const look = { size: 52, scale: 1.35, cap: 'radial-gradient(circle at 36% 30%, #4A4244, #141112 70%)', pointer: '#F2EDE6', tick: '#5A4448', wedge: '#E2C4C8', labelSize: 10, tracking: '0.26em', gap: 10 }
  return (
    <div className="flex flex-col items-center">
      <svg width="560" height="52" viewBox="0 0 560 52" fill="none" aria-hidden="true" className="-mb-1.5">
        <path d="M40 46 C 140 6, 420 6, 520 46" stroke="#2B2638" strokeWidth="10" strokeLinecap="round" />
        <rect x="96" y="22" width="12" height="30" rx="5" fill="#C9A464" transform="rotate(-24 102 37)" />
        <rect x="452" y="22" width="12" height="30" rx="5" fill="#C9A464" transform="rotate(24 458 37)" />
      </svg>
      <div className="box-border h-[392px] w-[860px] rounded-[74px] p-4" style={{ background: 'linear-gradient(180deg,#F2E0E2,#E3C6CA)', boxShadow: 'inset 0 3px 0 rgba(255,255,255,0.65), inset 0 -10px 18px rgba(120,70,80,0.18), 0 32px 34px -18px rgba(40,30,60,0.45)' }}>
        <div className="flex h-full flex-col overflow-hidden rounded-[58px] bg-[#E5C9CD] shadow-[inset_0_4px_12px_rgba(110,60,70,0.28)]">
          <div className="flex h-[150px] shrink-0 items-center gap-[22px] px-[46px] text-[#3A2A2E]" style={{ background: 'linear-gradient(180deg,#EAD1D4,#DFC0C4)' }}>
            <div className="relative grid size-[66px] shrink-0 place-items-center rounded-xl shadow-[0_3px_6px_rgba(90,50,60,0.25)]" style={{ background: 'linear-gradient(160deg,#F6E9EB,#E9D2D5)' }}>
              <Icons.logo width={32} height={32} />
            </div>
            <div className="flex w-[50px] flex-col items-center gap-2.5">
              <span className="text-[9px] font-semibold tracking-[0.22em]">INPUT</span>
              <Jack cable="M0 0 C 2 120, -10 250, -330 300" />
            </div>
            <div className="flex flex-1 justify-around">
              {[['VOLUME', 7], ['TONE', 5], ['CUT', 5], ['MASTER', 5], ['LEVEL', 5]].map(([l, d]) => (
                <AmpKnob key={l} amp="flint" label={l} def={d} look={look} />
              ))}
            </div>
            <div className="flex w-14 flex-col items-center gap-2.5">
              <span className="text-[9px] font-semibold tracking-[0.22em]">POWER</span>
              <Toggle base="#B5B0A9" bat="#E5E1DA" />
              <Led on={power} />
            </div>
          </div>
          <div className="h-0.5 bg-[rgba(120,70,80,0.18)] shadow-[0_1px_0_rgba(255,255,255,0.5)]" />
          <div className="grid flex-1 grid-cols-6 grid-rows-2 gap-2 px-[46px] pt-[18px] pb-6">
            {[0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0].map((flip, i) => (
              <ArchTile key={i} flip={flip} />
            ))}
            <div className="flex items-end justify-end pr-1.5 pb-1.5 font-display text-[30px] font-medium text-[#3A2A2E]">kiln</div>
          </div>
        </div>
      </div>
      <Feet width={640} trapezoid />
    </div>
  )
}

function CinderHead({ power }) {
  const look = { size: 46, scale: 1.35, cap: 'radial-gradient(circle at 36% 30%, #3F3834, #110E0C 70%)', pointer: '#EDE4D1', tick: '#6E604E', wedge: '#EDE4D1', cell: 62, gap: 6, tracking: '0.1em' }
  const corner = (pos) => (
    <span
      className="absolute block size-[46px]"
      style={{ ...pos, borderRadius: 14, background: 'linear-gradient(140deg,#6E3420,#4A2112)', boxShadow: '0 2px 3px rgba(0,0,0,0.35)' }}
    />
  )
  return (
    <div className="flex flex-col items-center">
      <svg width="400" height="48" viewBox="0 0 400 48" fill="none" aria-hidden="true" className="-mb-1">
        <path d="M40 44 V30 a12 12 0 0 1 12 -12 H 60 C 120 4, 280 4, 340 18 H 348 a12 12 0 0 1 12 12 V44" stroke="#C9A464" strokeWidth="4" />
        <path d="M64 20 C 130 2, 270 2, 336 20" stroke="#6E3420" strokeWidth="13" strokeLinecap="round" />
      </svg>
      <div
        className="relative box-border h-[404px] w-[880px] rounded-[26px] p-[22px]"
        style={{
          background:
            'radial-gradient(circle at 18% 22%, rgba(255,255,255,0.08), transparent 38%), repeating-linear-gradient(115deg, rgba(0,0,0,0.06) 0 2px, transparent 2px 7px), linear-gradient(180deg, #8A4529, #6A3220)',
          boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.18), inset 0 -8px 16px rgba(0,0,0,0.3), 0 32px 34px -18px rgba(40,30,60,0.5)',
        }}
      >
        {corner({ left: -4, top: -4 })}
        {corner({ right: -4, top: -4 })}
        {corner({ left: -4, bottom: -4 })}
        {corner({ right: -4, bottom: -4 })}
        <div
          className="relative h-full overflow-hidden rounded-lg"
          style={{
            backgroundColor: '#16110E',
            backgroundImage:
              'radial-gradient(circle, transparent 0 6.5px, #C29A55 7px 8.8px, transparent 9.3px), radial-gradient(circle, transparent 0 6.5px, #A5803F 7px 8.8px, transparent 9.3px)',
            backgroundSize: '20px 20px, 20px 20px',
            backgroundPosition: '0 0, 10px 10px',
          }}
        >
          <div
            className="absolute inset-x-0 top-0 box-border flex h-[176px] items-center gap-3 px-[30px] pb-[26px] text-[#2E241B]"
            style={{ borderRadius: '0 0 50% 50% / 0 0 54px 54px', background: 'linear-gradient(180deg,#F3EBDA,#E6DBC5)', boxShadow: '0 8px 14px rgba(0,0,0,0.5)' }}
          >
            <div className="flex w-10 flex-col items-center gap-2.5">
              <span className="text-[8px] font-semibold tracking-[0.14em]">INPUT</span>
              <Jack size={24} cable="M0 0 C 0 160, -10 300, -150 380" cableColor="#4A4542" cableWidth={9} />
            </div>
            <div className="flex w-[74px] flex-col items-center gap-[3px] text-[7.5px] font-semibold tracking-[0.1em]">
              <span className="mb-1 text-[9px] tracking-[0.16em]">MODE</span>
              <span>HOT</span>
              <span className="flex items-center gap-1 pl-[30px]">
                <Toggle base="#9E7B42" bat="#3A2E22" />
                WARM
              </span>
              <span>NORMAL</span>
            </div>
            <div className="relative flex flex-1 justify-between">
              <span aria-hidden="true" className="absolute top-[77px] right-[30px] left-[30px] h-px bg-[#8C7C66]" />
              {[['GAIN', 3.5], ['BASS', 5], ['MID', 5], ['TREBLE', 7.5], ['PRESENCE', 5], ['MASTER', 5], ['OUTPUT', 5]].map(([l, d]) => (
                <AmpKnob key={l} amp="cinder" label={l} def={d} look={look} />
              ))}
            </div>
            <div className="flex w-12 flex-col items-center gap-2.5">
              <span className="text-[9px] font-semibold tracking-[0.14em]">POWER</span>
              <Toggle base="#9E7B42" bat="#3A2E22" />
              <Led on={power} />
            </div>
          </div>
          <div
            className="absolute bottom-11 left-1/2 flex h-24 w-[210px] -translate-x-1/2 items-center justify-center gap-3.5 rounded-xl text-[#3A2E22]"
            style={{ background: 'linear-gradient(170deg,#F2EADB,#DDD1BA)', boxShadow: '0 4px 8px rgba(0,0,0,0.55), inset 0 0 0 3px #CDBFA6' }}
          >
            <Icons.logo width={26} height={26} />
            <div className="flex flex-col gap-0.5">
              <span className="font-display text-[22px] font-bold tracking-[0.22em]">KILN</span>
              <span className="font-mono text-[9px] tracking-[0.3em]">CINDER · 30W</span>
            </div>
          </div>
        </div>
      </div>
      <Feet width={760} />
    </div>
  )
}

function PushButton({ label, lit, on, onClick }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <span className="block h-[3px] w-3 rounded-[1px] transition-all" style={{ background: lit ? '#5FF0E2' : '#2E2010', boxShadow: lit ? '0 0 6px #5FF0E2' : 'none' }} />
      <button
        type="button"
        aria-label={label}
        aria-pressed={on}
        onClick={onClick}
        className="block size-[22px] cursor-pointer rounded-full border-0 p-0 active:translate-y-px"
        style={{ background: 'radial-gradient(circle at 40% 35%, #F3E1B8, #B48C4C)', boxShadow: '0 0 0 2px #6B5232, 0 2px 3px rgba(0,0,0,0.35)' }}
      />
      <span className="text-[9px] font-semibold tracking-[0.16em]">{label}</span>
    </div>
  )
}

function EmberHead({ power }) {
  const { state, api } = useStore()
  const sw = state.ampSwitches ?? {}
  const flip = (k) => api.edit((s) => ({ ampSwitches: { ...(s.ampSwitches ?? {}), [k]: !(s.ampSwitches ?? {})[k] } }))
  const look = { size: 44, scale: 1.32, cap: 'radial-gradient(circle at 36% 30%, #5A3E36, #1E1311 70%)', pointer: '#F0E2C2', tick: '#4A3416', wedge: '#C9A462', tickEvery: 13.5, gap: 4, tracking: '0.14em' }
  return (
    <div className="flex flex-col items-center">
      <svg width="420" height="50" viewBox="0 0 420 50" fill="none" aria-hidden="true" className="-mb-1">
        <rect x="34" y="18" width="16" height="32" rx="4" fill="#2A2321" />
        <rect x="370" y="18" width="16" height="32" rx="4" fill="#2A2321" />
        <path d="M42 22 C 42 6, 60 6, 90 6 H 330 C 360 6, 378 6, 378 22" stroke="#2B2420" strokeWidth="12" strokeLinecap="round" />
        <circle cx="42" cy="24" r="5" fill="#C9A464" />
        <circle cx="378" cy="24" r="5" fill="#C9A464" />
      </svg>
      <div
        className="box-border flex h-[410px] w-[880px] flex-col gap-4 rounded-[30px] p-6"
        style={{
          backgroundColor: '#EEEAE2',
          backgroundImage: 'radial-gradient(circle, rgba(60,40,20,0.05) 0 1px, transparent 1.4px)',
          backgroundSize: '4px 4px',
          boxShadow: 'inset 0 3px 0 rgba(255,255,255,0.8), inset 0 -10px 18px rgba(80,60,40,0.16), 0 32px 34px -18px rgba(40,30,60,0.45)',
        }}
      >
        <div
          className="relative flex-1 overflow-hidden rounded-[10px] border-[6px] border-[#1E1916]"
          style={{
            background:
              'repeating-linear-gradient(90deg, rgba(255,255,255,0.025) 0 1px, transparent 1px 4px), radial-gradient(ellipse 58% 98% at 50% 118%, #F2E6CF 0 22%, #E4AE63 22% 34%, #C9693E 34% 48%, #7A3623 48% 63%, transparent 63%), linear-gradient(180deg, #120E0C, #2B1F1A)',
            boxShadow: 'inset 0 6px 16px rgba(0,0,0,0.6)',
          }}
        >
          <span className="absolute top-[18px] right-[22px] font-mono text-[10px] tracking-[0.3em] text-[rgba(242,230,207,0.55)]">EMBER · 50W</span>
        </div>
        <div
          className="relative flex h-[100px] shrink-0 items-center justify-between rounded-[10px] px-[30px] text-[#2E2010]"
          style={{ background: 'linear-gradient(180deg,#ECD39C,#BE9655 52%,#DCBC80)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.7), inset 0 -3px 5px rgba(0,0,0,0.2), 0 3px 6px rgba(0,0,0,0.25)' }}
        >
          <div className="flex items-center gap-1.5">
            <span className="font-display text-lg font-medium">kiln</span>
            <Icons.logo width={20} height={20} />
          </div>
          <div className="flex flex-col items-center gap-2.5">
            <Jack ring={['#6B5232', '#2E2418']} cable="M0 0 C -40 40, -120 90, -310 130" cableColor="#1E1C1E" />
            <span className="text-[9px] font-semibold tracking-[0.16em]">INPUT</span>
          </div>
          <PushButton label="BRIGHT" lit={sw.bright} on={!!sw.bright} onClick={() => flip('bright')} />
          {[['GAIN', 4.5], ['BASS', 5], ['MIDDLE', 5], ['TREBLE', 5]].map(([l, d]) => (
            <AmpKnob key={l} amp="ember" label={l} def={d} look={look} />
          ))}
          <PushButton label="SHIFT" lit={sw.shift} on={!!sw.shift} onClick={() => flip('shift')} />
          {[['MASTER', 5], ['PRESENCE', 5], ['OUTPUT', 5]].map(([l, d]) => (
            <AmpKnob key={l} amp="ember" label={l} def={d} look={look} />
          ))}
          <PushButton label="POWER" lit={power} on={power} />
        </div>
      </div>
      <Feet width={760} />
    </div>
  )
}

export function AmpView() {
  const { state } = useStore()
  return (
    <div className="flex h-full items-end justify-center pb-[88px]">
      {state.amp === 'flint' && <FlintHead power />}
      {state.amp === 'cinder' && <CinderHead power />}
      {state.amp === 'ember' && <EmberHead power />}
    </div>
  )
}
