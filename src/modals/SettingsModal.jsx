import { Icons } from '../components/icons'
import { useStore } from '../state/store'
import { Modal } from './Modal'

const RATES = ['44100 Hz', '48000 Hz', '88200 Hz', '96000 Hz']
const BUFFERS = [64, 128, 256, 512]
const INPUTS = ['Input 1', 'Input 2', 'Input 3', 'Input 4', 'Loopback L', 'Loopback R']
const OUTPUTS = ['Output 1', 'Output 2', 'Output 3', 'Output 4', 'Headphones L', 'Headphones R']
const MIDI = ['Floor controller', 'Expression pedal']

function Select({ children, onClick }) {
  return (
    <button type="button" onClick={onClick} className="flex h-11 cursor-pointer items-center justify-between rounded-[10px] border-0 bg-tool-deep px-4 text-[15px]">
      {children}
      <Icons.chevron width={14} height={14} />
    </button>
  )
}

function CheckRow({ name, checked, onToggle }) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={onToggle}
      className="flex h-10 w-full cursor-pointer items-center gap-3 rounded-md border-0 bg-transparent px-2.5 text-left text-sm hover:bg-[#202126]"
      style={{ color: checked ? '#ECEDF2' : '#8D8F9C' }}
    >
      <span
        className="box-border grid size-5 shrink-0 place-items-center rounded-[5px] border-2"
        style={{ borderColor: checked ? '#5FF0E2' : '#5A5C66', background: checked ? '#5FF0E2' : 'transparent', color: '#18191C' }}
      >
        {checked && <Icons.check width={12} height={12} />}
      </span>
      {name}
    </button>
  )
}

const label = 'text-sm text-[#C4C6D0]'

export function SettingsModal() {
  const { state, api } = useStore()
  const s = state.settings
  const setS = (p) => api.patch((st) => ({ settings: { ...st.settings, ...p } }))
  const toggle = (key) => setS({ channels: { ...s.channels, [key]: !s.channels[key] } })
  const buffer = BUFFERS[s.buffer]
  const sampleRate = parseInt(RATES[s.rate], 10)
  const bufferMs = ((buffer / sampleRate) * 1000).toFixed(1)
  const roundTrip = (((buffer * 2) / sampleRate) * 1000 + 1.6).toFixed(1)

  return (
    <Modal title="Audio settings" width={820} top={62}>
      <div className="flex flex-col gap-[22px] px-[30px] pt-[22px] pb-7">
        <div className="grid grid-cols-2 gap-7">
          <div className="flex flex-col gap-2">
            <span className={label}>Driver</span>
            <Select>CoreAudio</Select>
          </div>
          <div className="flex items-end gap-2.5 pb-3 text-xs text-tool-muted">
            <span className="size-2 rounded-full bg-led shadow-[0_0_6px_#5FF0E2]" />
            Running · {RATES[s.rate].replace('00 Hz', '').replace(/(\d+)(\d)$/, '$1.$2')} kHz · {buffer} samples · {roundTrip} ms round trip
          </div>
        </div>

        <div className="h-px bg-tool-line" />

        <div className="grid grid-cols-2 gap-x-7 gap-y-[18px]">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className={label}>Input device</span>
              <span role="meter" aria-label="Input signal" aria-valuenow={-24} aria-valuemin={-60} aria-valuemax={0} className="flex gap-[3px]">
                {[1, 1, 1, 1, 1, 1, 0, 0, 0, 0].map((v, i) => (
                  <span key={i} className="block h-1 w-2.5 rounded-sm" style={{ background: v ? (i > 7 ? '#F2A84B' : '#5FF0E2') : '#3A3B42' }} />
                ))}
              </span>
            </div>
            <Select>Studio Interface 4×4</Select>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className={label}>Output device</span>
              <button type="button" className="h-[22px] cursor-pointer rounded-[5px] border border-[#45474F] bg-transparent px-2 text-[11px] font-semibold tracking-[0.08em]">
                TEST
              </button>
            </div>
            <Select>Studio Interface 4×4</Select>
          </div>
          {[
            ['Input channels', INPUTS, 'in'],
            ['Output channels', OUTPUTS, 'out'],
          ].map(([title, list, prefix]) => (
            <div key={title} role="group" aria-label={title} className="flex flex-col gap-2">
              <span className={label}>{title}</span>
              <div className="h-[140px] overflow-y-auto rounded-[10px] bg-tool-deep p-1.5">
                {list.map((n) => (
                  <CheckRow key={n} name={n} checked={!!s.channels[`${prefix}:${n}`]} onToggle={() => toggle(`${prefix}:${n}`)} />
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="h-px bg-tool-line" />

        <div className="grid grid-cols-2 gap-7">
          <div className="flex flex-col gap-3.5">
            <div className="flex flex-col gap-2">
              <span className={label}>Sample rate</span>
              <Select onClick={() => setS({ rate: (s.rate + 1) % RATES.length })}>{RATES[s.rate]}</Select>
            </div>
            <div className="flex flex-col gap-2">
              <span className={label}>Buffer size</span>
              <Select onClick={() => setS({ buffer: (s.buffer + 1) % BUFFERS.length })}>
                {buffer} samples ({bufferMs} ms)
              </Select>
            </div>
          </div>
          <div role="group" aria-label="MIDI inputs" className="flex flex-col gap-2">
            <span className={label}>MIDI inputs</span>
            <div className="flex-1 rounded-[10px] bg-tool-deep p-1.5">
              {MIDI.map((n) => (
                <CheckRow key={n} name={n} checked={!!s.channels[`midi:${n}`]} onToggle={() => toggle(`midi:${n}`)} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}
