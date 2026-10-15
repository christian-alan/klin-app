import { Segmented } from '../components/controls/Switch'
import { Icons } from '../components/icons'
import { useStore } from '../state/store'
import { Modal } from './Modal'

const TRACK = 760 // px, -50¢ to +50¢

export function TunerModal() {
  const { state, api } = useStore()
  const { tuner } = state
  const cents = state.tunerCents ?? -14
  const setTuner = (p) => api.patch((s) => ({ tuner: { ...s.tuner, ...p } }))

  const inTune = Math.abs(cents) <= 3
  const color = inTune ? '#5FF0E2' : '#F2A84B'
  const g = 196 * (tuner.ref / 440)
  const hz = g * Math.pow(2, cents / 1200)
  const isHz = tuner.unit === 'hz'
  const labels = isHz ? [g * Math.pow(2, -50 / 1200), g, g * Math.pow(2, 50 / 1200)].map((v) => v.toFixed(1)) : ['-50', '0', '+50']
  const readout = isHz ? `${hz.toFixed(2)} Hz` : inTune ? 'In tune' : `${cents > 0 ? '+' : ''}${cents.toFixed(1)}¢ ${cents > 0 ? 'sharp' : 'flat'}`
  const bubbleX = 50 + TRACK / 2 + (cents / 50) * (TRACK / 2) - 60

  return (
    <Modal
      title="Tuner"
      width={860}
      headerExtra={
        <button
          type="button"
          aria-label="Mute output while tuning"
          aria-pressed={tuner.muted}
          onClick={() => setTuner({ muted: !tuner.muted })}
          className="grid size-11 cursor-pointer place-items-center rounded-lg border-0"
          style={{ background: tuner.muted ? '#E5484D' : 'transparent', color: tuner.muted ? '#FFFFFF' : '#A9ABB8' }}
        >
          <Icons.speaker muted={tuner.muted} />
        </button>
      }
    >
      <div className="relative h-[280px]">
        <div className="absolute top-7 right-[50px] left-[50px] flex justify-between font-mono text-[13px] text-tool-muted">
          <span>{labels[0]}</span>
          <span className="text-tool-ink">{labels[1]}</span>
          <span>{labels[2]}</span>
        </div>
        <div className="absolute top-[60px] right-[50px] left-[50px] h-3.5 bg-[repeating-linear-gradient(90deg,#45474F_0_1px,transparent_1px_38px)]" />
        <div className="absolute top-[136px] right-[50px] left-[50px] h-0.5 bg-tool-ink" />
        <div className="absolute top-[124px] left-[400px] h-[26px] w-[60px] rounded-full bg-[rgba(95,240,226,0.12)]" />
        <div
          className="absolute top-[77px] grid size-[120px] place-items-center rounded-full bg-[#1A1B1F] shadow-[0_0_0_3px_#ECEDF2] transition-[left] duration-150"
          style={{ left: bubbleX }}
        >
          <span className="block size-[88px] rounded-full transition-colors" style={{ background: color, boxShadow: `0 0 30px ${inTune ? 'rgba(95,240,226,0.45)' : 'rgba(242,168,75,0.35)'}` }} />
        </div>
        <div className="absolute top-[222px] right-[50px] left-[50px] grid grid-cols-3 items-end">
          <span className="text-[30px] text-[#6E707C]">F♯ / G♭</span>
          <div className="flex flex-col items-center gap-1.5">
            <span className="text-[54px] leading-none font-medium">G</span>
            <span className="font-mono text-[13px]" style={{ color }} aria-live="polite">
              {readout}
            </span>
          </div>
          <span className="text-right text-[30px] text-[#6E707C]">G♯ / A♭</span>
        </div>
      </div>

      <div className="flex h-[84px] items-center justify-between px-[26px]">
        <Segmented
          label="Display unit"
          value={tuner.unit}
          onChange={(unit) => setTuner({ unit })}
          options={[
            { value: 'cents', label: 'Cents' },
            { value: 'hz', label: 'Hz' },
          ]}
        />
        <button
          type="button"
          role="switch"
          aria-checked={tuner.footer}
          onClick={() => setTuner({ footer: !tuner.footer })}
          className="flex cursor-pointer items-center gap-3 border-0 bg-transparent p-2 text-sm"
        >
          <span className="relative block h-[30px] w-[52px] rounded-full transition-colors" style={{ background: tuner.footer ? '#5FF0E2' : '#3A3B42' }}>
            <span className="absolute top-1 block size-[22px] rounded-full transition-[left]" style={{ left: tuner.footer ? 26 : 4, background: tuner.footer ? '#1A1B1F' : '#A9ABB8' }} />
          </span>
          Show live tuner in footer
        </button>
        <div className="flex items-center gap-2.5">
          <span className="text-xs text-tool-muted">A4</span>
          <div className="flex h-12 items-center gap-2 rounded-[10px] bg-tool-deep pr-1.5 pl-3.5">
            <span className="font-mono text-[15px]">{tuner.ref.toFixed(1)} Hz</span>
            <div className="flex flex-col">
              <button type="button" aria-label="Raise reference pitch" onClick={() => setTuner({ ref: Math.min(460, tuner.ref + 1) })} className="grid h-5 w-7 cursor-pointer place-items-center border-0 bg-transparent text-tool-muted">
                <Icons.chevron width={12} height={12} style={{ transform: 'rotate(180deg)' }} />
              </button>
              <button type="button" aria-label="Lower reference pitch" onClick={() => setTuner({ ref: Math.max(420, tuner.ref - 1) })} className="grid h-5 w-7 cursor-pointer place-items-center border-0 bg-transparent text-tool-muted">
                <Icons.chevron width={12} height={12} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}
