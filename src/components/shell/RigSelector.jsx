import { RIG, useRig } from '../../hooks/useRig'
import { Icons } from '../icons'

function Tile({ selected, onClick, label, children, dark }) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      aria-label={label}
      onClick={onClick}
      className="flex cursor-pointer items-center justify-center gap-1 border-2 border-white p-0 shadow-[0_1px_3px_rgba(0,0,0,0.2)] transition-colors"
      style={{
        background: selected ? '#FFFFFF' : dark ? 'rgba(255,255,255,0.08)' : 'transparent',
        color: selected ? '#262838' : '#FFFFFF',
      }}
    >
      {children}
    </button>
  )
}

/** Amp/cab picker pinned to the bottom of every module view. */
export function RigSelector({ dark = false }) {
  const rig = useRig()
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        aria-label="Link cab to amp"
        aria-pressed={rig.linked}
        onClick={rig.toggleLink}
        className="grid size-[34px] cursor-pointer place-items-center rounded-full border-0 shadow-[0_2px_4px_rgba(30,30,60,0.25)]"
        style={{ background: rig.linked ? '#FFFFFF' : 'rgba(255,255,255,0.15)', color: rig.linked ? '#262838' : dark ? '#FFFFFF' : '#262838' }}
      >
        <Icons.link />
      </button>
      <div className="grid grid-cols-3 gap-x-1.5 gap-y-1">
        {RIG.map((k) => (
          <Tile key={k} label={`${k} amp`} selected={k === rig.amp} onClick={() => rig.pickAmp(k)} dark={dark}>
            <span className="grid h-6 w-[60px] place-items-center rounded-[3px] font-mono text-[9px] font-medium tracking-[0.12em]">{k.toUpperCase()}</span>
          </Tile>
        ))}
        {RIG.map((k) => (
          <Tile key={k} label={`${k} 2×12 cabinet`} selected={k === rig.cab} onClick={() => rig.pickCab(k)} dark={dark}>
            <span className="flex h-[26px] w-[60px] items-center justify-center gap-1">
              <span className="box-border size-4 rounded-full border-2 border-current" />
              <span className="box-border size-4 rounded-full border-2 border-current" />
            </span>
          </Tile>
        ))}
      </div>
    </div>
  )
}
