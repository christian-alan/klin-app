/** Small pill switch used next to Gate and Doubler. */
export function MiniSwitch({ on, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={() => onChange(!on)}
      className="relative inline-block h-[13px] w-6 cursor-pointer rounded-full border-[1.5px] border-ink p-0 transition-colors"
      style={{ background: on ? '#262838' : 'transparent' }}
    >
      <span
        className="absolute top-[1.5px] block size-[7px] rounded-full transition-[left]"
        style={{ left: on ? 12.5 : 1.5, background: on ? '#F4F5FB' : '#262838' }}
      />
    </button>
  )
}

/** Segmented control for the dark tool modals. */
export function Segmented({ options, value, onChange, label, dark = true }) {
  return (
    <div role="radiogroup" aria-label={label} className={`flex rounded-[10px] p-1 ${dark ? 'bg-tool-deep' : 'bg-[#C2C6E2]'}`}>
      {options.map((opt) => {
        const selected = opt.value === value
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(opt.value)}
            className="h-10 cursor-pointer rounded-[7px] border-0 px-[18px] text-sm"
            style={{
              background: selected ? (dark ? '#3A3B42' : '#F4F5FB') : 'transparent',
              color: selected ? (dark ? '#ECEDF2' : '#262838') : dark ? '#8D8F9C' : '#4A4E6E',
            }}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}
