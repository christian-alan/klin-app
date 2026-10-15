/**
 * Knob faces. All of them take a `dial` from useDial() and spread its `bind`
 * props onto the focusable element, so drag / wheel / keys / double-click work everywhere.
 */

function arcGradient(deg, { bipolar = false, fill, track }) {
  if (!bipolar) {
    return `conic-gradient(from 225deg, ${fill} 0deg ${deg}deg, ${track} ${deg}deg 270deg, transparent 270deg)`
  }
  const a = Math.min(135, deg)
  const b = Math.max(135, deg, a + 2)
  return `conic-gradient(from 225deg, ${track} 0 ${a}deg, ${fill} ${a}deg ${b}deg, ${track} ${b}deg 270deg, transparent 270deg)`
}

/** The lavender knob used in the global control strip and cab mic panels. */
export function StripKnob({ dial, label, size = 60, bipolar = false }) {
  const cap = size - 12
  return (
    <div
      {...dial.bind}
      aria-label={label}
      className="grid cursor-ns-resize place-items-center rounded-full"
      style={{
        ...dial.bind.style,
        width: size,
        height: size,
        background: arcGradient(dial.deg, { bipolar, fill: bipolar ? '#2E3466' : '#5D64A8', track: '#B4B9DC' }),
      }}
    >
      <span
        className="relative block rounded-full bg-panel"
        style={{ width: cap, height: cap, boxShadow: '0 2px 6px rgba(40,44,80,0.2)', transform: `rotate(${dial.rotation}deg)` }}
      >
        <span
          className="absolute top-[5px] block h-[32%] w-[2px] -translate-x-1/2 rounded-sm bg-ink"
          style={{ left: '50%' }}
        />
      </span>
    </div>
  )
}

/**
 * Physical hardware knob: printed tick scale + a capped knob with a pointer.
 * `wedge` must match the panel colour so the gap at the bottom of the scale reads cleanly.
 */
export function HardwareKnob({
  dial,
  label,
  size = 54,
  scale = 1.3,
  cap = 'radial-gradient(circle at 36% 30%, #4A4244, #141112 70%)',
  fluted = true,
  pointer = '#F2EDE6',
  pointerDot = false,
  tick = '#5A4448',
  wedge = '#E2C4C8',
  tickEvery = 9,
}) {
  const outer = Math.round(size * scale)
  const inner = size / 2
  const capBg = fluted
    ? `repeating-conic-gradient(rgba(255,255,255,0.07) 0 7.5deg, rgba(0,0,0,0.12) 7.5deg 15deg), ${cap}`
    : cap
  return (
    <div className="relative grid place-items-center" style={{ width: outer, height: outer }}>
      <span
        aria-hidden="true"
        className="absolute inset-0 rounded-full"
        style={{
          background: `conic-gradient(from 135deg, ${wedge} 0 90deg, transparent 90deg), repeating-conic-gradient(from 225deg, ${tick} 0 1.4deg, transparent 1.4deg ${tickEvery}deg)`,
          WebkitMask: `radial-gradient(circle, transparent ${inner + 3}px, #000 ${inner + 4}px)`,
          mask: `radial-gradient(circle, transparent ${inner + 3}px, #000 ${inner + 4}px)`,
        }}
      />
      <div
        {...dial.bind}
        aria-label={label}
        className="cursor-ns-resize rounded-full"
        style={{ ...dial.bind.style, width: size, height: size, boxShadow: '0 6px 8px rgba(30,20,20,0.42)' }}
      >
        <span
          className="relative block rounded-full"
          style={{ width: size, height: size, background: capBg, transform: `rotate(${dial.rotation}deg)` }}
        >
          {pointerDot ? (
            <span
              className="absolute block rounded-full"
              style={{ left: '50%', top: 5, width: 6, height: 6, marginLeft: -3, background: pointer }}
            />
          ) : (
            <span
              className="absolute block rounded-sm"
              style={{ left: '50%', top: 4, width: 3, height: Math.round(size * 0.3), marginLeft: -1.5, background: pointer }}
            />
          )}
        </span>
      </div>
    </div>
  )
}

/** Dark-surface knob used inside the utility modals. */
export function ToolKnob({ dial, label, size = 70, bipolar = false }) {
  const background = bipolar
    ? (() => {
        const a = Math.min(135, dial.deg) - 1
        const b = Math.max(135, dial.deg) + 1
        return `conic-gradient(from 225deg, #3A3B42 0 ${a}deg, #ECEDF2 ${a}deg ${b}deg, #3A3B42 ${b}deg 270deg, transparent 270deg)`
      })()
    : `conic-gradient(from 225deg, #ECEDF2 0 ${dial.deg}deg, #3A3B42 ${dial.deg}deg 270deg, transparent 270deg)`
  return (
    <div
      {...dial.bind}
      aria-label={label}
      className="grid cursor-ns-resize place-items-center rounded-full"
      style={{ ...dial.bind.style, width: size, height: size, background }}
    >
      <span
        className="relative block rounded-full bg-[#1A1B1F]"
        style={{ width: size - 12, height: size - 12, transform: `rotate(${dial.rotation}deg)` }}
      >
        <span className="absolute left-1/2 top-1.5 block h-[18px] w-[2px] -translate-x-1/2 rounded-sm bg-tool-ink" />
      </span>
    </div>
  )
}
