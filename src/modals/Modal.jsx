import { useEffect, useRef } from 'react'
import { Icons } from '../components/icons'
import { useStore } from '../state/store'

/** Dark utility dialog shown over a dimmed plugin. Escape and the scrim close it. */
export function Modal({ title, width, children, headerExtra, top }) {
  const { api } = useStore()
  const ref = useRef(null)
  const close = () => api.patch({ modal: null })

  useEffect(() => {
    const prev = document.activeElement
    ref.current?.focus()
    const onKey = (e) => e.key === 'Escape' && api.patch({ modal: null })
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      prev?.focus?.()
    }
  }, [api])

  return (
    <div className="absolute inset-x-0 top-0 bottom-9 z-50">
      <div className="absolute inset-0 bg-[rgba(36,38,60,0.58)]" onClick={close} aria-hidden="true" />
      <div
        ref={ref}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="absolute left-1/2 flex flex-col rounded-[20px] bg-tool text-tool-ink shadow-[0_30px_60px_-16px_rgba(10,12,30,0.7)] outline-none"
        style={{ width, top: top ?? '50%', transform: top ? 'translateX(-50%)' : 'translate(-50%, -50%)' }}
      >
        <div className="flex h-16 shrink-0 items-center gap-2 border-b border-tool-line pr-3.5 pl-[26px]">
          <span className="flex-1 text-lg font-medium">{title}</span>
          {headerExtra}
          <button type="button" aria-label={`Close ${title.toLowerCase()}`} onClick={close} className="grid size-11 cursor-pointer place-items-center rounded-lg border-0 bg-transparent text-[#A9ABB8] hover:bg-[#2C2D33]">
            <Icons.close />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
